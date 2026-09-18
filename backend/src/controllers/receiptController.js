import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ReceiptRequest from '../models/ReceiptRequest.js'
import { generate80GCertificatePDF } from '../services/pdf.service.js'
import { send80GConfirmationEmail, send80GCertificateEmail } from '../services/email.service.js'
import { notifyAdmin } from '../services/notification.service.js'
import cloudinary from '../config/cloudinary.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const createReceiptRequest = catchAsync(async (req, res) => {
  const request = await ReceiptRequest.create(req.body)

  try {
    await send80GConfirmationEmail(request)
  } catch (err) {
    console.error('Failed to send 80G confirmation email:', err.message)
  }

  await notifyAdmin({
    type: '80g-request',
    title: 'New 80G certificate request',
    message: `${request.fullName} requested an 80G certificate for donation ${request.donationId}.`,
    relatedId: request._id,
    relatedModel: 'ReceiptRequest',
  })

  sendSuccess(res, 201, request)
})

export const getMyReceiptRequests = catchAsync(async (req, res) => {
  const requests = await ReceiptRequest.find({ email: req.user.email }).sort('-createdAt')
  sendSuccess(res, 200, requests)
})

// ---- Admin ----

export const getAllReceiptRequestsAdmin = catchAsync(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  const requests = await ReceiptRequest.find(filter).sort('-createdAt')
  sendSuccess(res, 200, requests)
})

export const updateReceiptRequestStatus = catchAsync(async (req, res, next) => {
  const { status, adminNotes } = req.body
  const request = await ReceiptRequest.findByIdAndUpdate(
    req.params.id,
    { status, adminNotes },
    { new: true, runValidators: true }
  )
  if (!request) return next(new AppError('Request not found.', 404))
  sendSuccess(res, 200, request)
})

// Generates the certificate PDF, uploads it, updates status, and emails it
// to the donor — a single admin action covering the whole "approve and
// issue" step.
export const generateCertificate = catchAsync(async (req, res, next) => {
  const request = await ReceiptRequest.findById(req.params.id)
  if (!request) return next(new AppError('Request not found.', 404))

  const pdfBuffer = await generate80GCertificatePDF(request)

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'sahayog/certificates', resource_type: 'raw', public_id: `80g-${request._id}` },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    stream.end(pdfBuffer)
  })

  request.certificateUrl = uploadResult.secure_url
  request.status = 'Certificate Generated'
  await request.save()

  try {
    await send80GCertificateEmail(request, pdfBuffer)
    request.status = 'Sent'
    await request.save()
  } catch (err) {
    console.error('Failed to email 80G certificate:', err.message)
  }

  sendSuccess(res, 200, request)
})
