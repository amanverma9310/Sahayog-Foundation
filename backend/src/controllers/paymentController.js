import crypto from 'crypto'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import getRazorpayClient from '../config/razorpay.js'
import Donation from '../models/Donation.js'
import Project from '../models/Project.js'
import Campaign from '../models/Campaign.js'
import { generateDonationReceiptPDF } from '../services/pdf.service.js'
import { sendDonationConfirmationEmail } from '../services/email.service.js'
import { notifyAdmin } from '../services/notification.service.js'
import cloudinary from '../config/cloudinary.js'

function generateReceiptNumber() {
  const date = new Date()
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SAHAYOG-${stamp}-${random}`
}

// Step 1 — create a Razorpay order and a matching "created" Donation
// record. No money has moved yet; nothing here is treated as a completed
// donation until verifyPayment succeeds.
export const createOrder = catchAsync(async (req, res, next) => {
  const {
    amount, frequency, designation, projectId, campaignId,
    donorName, donorEmail, donorPhone, anonymous, wants80G, pan,
  } = req.body

  if (designation === 'project' && projectId) {
    const project = await Project.findById(projectId)
    if (!project) return next(new AppError('Selected project not found.', 400))
  }
  if (designation === 'campaign' && campaignId) {
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) return next(new AppError('Selected campaign not found.', 400))
  }

  const order = await getRazorpayClient().orders.create({
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: { donorEmail, designation },
  })

  const donation = await Donation.create({
    donorName,
    donorEmail,
    donorPhone,
    amount,
    frequency,
    designation,
    project: designation === 'project' ? projectId : undefined,
    campaign: designation === 'campaign' ? campaignId : undefined,
    anonymous,
    wants80G,
    pan: wants80G ? pan : undefined,
    razorpayOrderId: order.id,
    status: 'created',
  })

  res.status(200).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      donationId: donation._id,
    },
  })
})

// Step 2 — verify the payment SERVER-SIDE using HMAC-SHA256 against the
// Razorpay key secret. This is the only source of truth for whether a
// donation succeeded — the frontend's "payment succeeded" callback is never
// trusted on its own.
export const verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    await Donation.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' })
    return next(new AppError('Payment verification failed. If money was deducted, it will be auto-refunded.', 400))
  }

  const donation = await Donation.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'successful',
      receiptNumber: generateReceiptNumber(),
    },
    { new: true }
  )

  if (!donation) return next(new AppError('Donation record not found for this order.', 404))

  // Update aggregate funding figures on the related project/campaign.
  if (donation.designation === 'project' && donation.project) {
    await Project.findByIdAndUpdate(donation.project, {
      $inc: { amountRaised: donation.amount, donorCount: 1 },
    })
  }
  if (donation.designation === 'campaign' && donation.campaign) {
    await Campaign.findByIdAndUpdate(donation.campaign, {
      $inc: { amountRaised: donation.amount, donorCount: 1 },
    })
  }

  // Generate + upload receipt PDF, then email it. Failures here must not
  // fail the donation itself — the payment already succeeded.
  try {
    const pdfBuffer = await generateDonationReceiptPDF(donation)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'sahayog/receipts', resource_type: 'raw', public_id: donation.receiptNumber },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      stream.end(pdfBuffer)
    })
    donation.receiptUrl = uploadResult.secure_url
    await donation.save()
    await sendDonationConfirmationEmail(donation)
  } catch (err) {
    console.error('Post-payment receipt/email step failed (non-blocking):', err.message)
  }

  await notifyAdmin({
    type: 'donation',
    title: 'New donation received',
    message: `${donation.anonymous ? 'An anonymous donor' : donation.donorName} donated ₹${donation.amount.toLocaleString('en-IN')}.`,
    relatedId: donation._id,
    relatedModel: 'Donation',
  })

  res.status(200).json({ success: true, data: donation })
})

// Razorpay server-to-server webhook — a second, independent confirmation
// path in case the client-side verify call never happens (browser closed
// mid-flow, network drop, etc.). Verifies the webhook signature against
// the raw request body.
export const razorpayWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex')

  if (signature !== expected) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature.' })
  }

  const event = req.body.event
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity
    const donation = await Donation.findOne({ razorpayOrderId: payment.order_id })
    if (donation && donation.status !== 'successful') {
      donation.status = 'successful'
      donation.razorpayPaymentId = payment.id
      donation.receiptNumber = donation.receiptNumber || generateReceiptNumber()
      await donation.save()
    }
  }

  res.status(200).json({ received: true })
})

// ---- Donor: my donation history ----
export const getMyDonations = catchAsync(async (req, res) => {
  const donations = await Donation.find({ donorEmail: req.user.email, status: 'successful' })
    .populate('project', 'title slug')
    .sort('-createdAt')
  res.status(200).json({ success: true, data: donations })
})

// ---- Admin: all donations ----
export const getAllDonationsAdmin = catchAsync(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  const donations = await Donation.find(filter).populate('project', 'title').sort('-createdAt')
  res.status(200).json({ success: true, data: donations })
})
