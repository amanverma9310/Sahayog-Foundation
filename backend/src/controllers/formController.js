import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import ContactMessage from '../models/ContactMessage.js'
import VolunteerApplication from '../models/VolunteerApplication.js'
import InternshipApplication from '../models/InternshipApplication.js'
import CsrRequest from '../models/CsrRequest.js'
import SponsorRequest from '../models/SponsorRequest.js'
import NewsletterSubscriber from '../models/NewsletterSubscriber.js'
import { sendGenericAcknowledgementEmail } from '../services/email.service.js'
import { notifyAdmin } from '../services/notification.service.js'
import { sendSuccess } from '../utils/sendResponse.js'

// Shared pattern for every public form: create the record, best-effort
// acknowledgement email to the submitter, best-effort admin notification.
// Neither email failing should fail the submission — the record is what
// matters and it's already saved.
async function handleFormSubmission({ Model, data, formType, notifyTitle, notifyMessage }) {
  const doc = await Model.create(data)

  try {
    await sendGenericAcknowledgementEmail({ to: data.email, name: data.name || data.fullName || data.contactPerson, formType })
  } catch (err) {
    console.error(`Failed to send ${formType} acknowledgement email:`, err.message)
  }

  await notifyAdmin({
    type: formType,
    title: notifyTitle,
    message: notifyMessage,
    relatedId: doc._id,
    relatedModel: Model.modelName,
  })

  return doc
}

// ---- Contact ----
export const submitContactForm = catchAsync(async (req, res) => {
  const doc = await handleFormSubmission({
    Model: ContactMessage,
    data: req.body,
    formType: 'contact',
    notifyTitle: 'New contact message',
    notifyMessage: `${req.body.name} sent a message: "${req.body.subject}"`,
  })
  sendSuccess(res, 201, doc)
})

export const getAllContactMessagesAdmin = catchAsync(async (req, res) => {
  const baseQuery = ContactMessage.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate()
  const items = await features.query
  sendSuccess(res, 200, items)
})

export const updateContactMessageStatus = catchAsync(async (req, res, next) => {
  const doc = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!doc) return next(new AppError('Message not found.', 404))
  sendSuccess(res, 200, doc)
})

// ---- Volunteer ----
export const submitVolunteerApplication = catchAsync(async (req, res) => {
  const doc = await handleFormSubmission({
    Model: VolunteerApplication,
    data: req.body,
    formType: 'volunteer',
    notifyTitle: 'New volunteer application',
    notifyMessage: `${req.body.name} applied to volunteer (${req.body.city}).`,
  })
  sendSuccess(res, 201, doc)
})

export const getAllVolunteersAdmin = catchAsync(async (req, res) => {
  const baseQuery = VolunteerApplication.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate()
  sendSuccess(res, 200, await features.query)
})

export const updateVolunteerStatus = catchAsync(async (req, res, next) => {
  const doc = await VolunteerApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminNotes: req.body.adminNotes },
    { new: true }
  )
  if (!doc) return next(new AppError('Application not found.', 404))
  sendSuccess(res, 200, doc)
})

// ---- Internship ----
export const submitInternshipApplication = catchAsync(async (req, res) => {
  const data = { ...req.body }
  if (req.file) data.resumeUrl = req.file.path

  const doc = await handleFormSubmission({
    Model: InternshipApplication,
    data,
    formType: 'internship',
    notifyTitle: 'New internship application',
    notifyMessage: `${req.body.name} applied for an internship (${req.body.course}, ${req.body.college}).`,
  })
  sendSuccess(res, 201, doc)
})

export const getAllInternshipsAdmin = catchAsync(async (req, res) => {
  const baseQuery = InternshipApplication.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate()
  sendSuccess(res, 200, await features.query)
})

export const updateInternshipStatus = catchAsync(async (req, res, next) => {
  const doc = await InternshipApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminNotes: req.body.adminNotes },
    { new: true }
  )
  if (!doc) return next(new AppError('Application not found.', 404))
  sendSuccess(res, 200, doc)
})

// ---- CSR ----
export const submitCsrEnquiry = catchAsync(async (req, res) => {
  const doc = await handleFormSubmission({
    Model: CsrRequest,
    data: req.body,
    formType: 'csr',
    notifyTitle: 'New CSR enquiry',
    notifyMessage: `${req.body.companyName} enquired about a CSR partnership.`,
  })
  sendSuccess(res, 201, doc)
})

export const getAllCsrEnquiriesAdmin = catchAsync(async (req, res) => {
  const baseQuery = CsrRequest.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate()
  sendSuccess(res, 200, await features.query)
})

export const updateCsrStatus = catchAsync(async (req, res, next) => {
  const doc = await CsrRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminNotes: req.body.adminNotes },
    { new: true }
  )
  if (!doc) return next(new AppError('Enquiry not found.', 404))
  sendSuccess(res, 200, doc)
})

// ---- Sponsor a Drive ----
export const submitSponsorRequest = catchAsync(async (req, res) => {
  const doc = await handleFormSubmission({
    Model: SponsorRequest,
    data: req.body,
    formType: 'sponsor',
    notifyTitle: 'New drive sponsorship request',
    notifyMessage: `${req.body.name} wants to sponsor: ${req.body.preferredDrive}.`,
  })
  sendSuccess(res, 201, doc)
})

export const getAllSponsorRequestsAdmin = catchAsync(async (req, res) => {
  const baseQuery = SponsorRequest.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate()
  sendSuccess(res, 200, await features.query)
})

export const updateSponsorStatus = catchAsync(async (req, res, next) => {
  const doc = await SponsorRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminNotes: req.body.adminNotes },
    { new: true }
  )
  if (!doc) return next(new AppError('Request not found.', 404))
  sendSuccess(res, 200, doc)
})

// ---- Newsletter ----
export const subscribeNewsletter = catchAsync(async (req, res) => {
  const { email, name } = req.body
  const doc = await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { email, name, subscribed: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  sendSuccess(res, 201, doc)
})

export const unsubscribeNewsletter = catchAsync(async (req, res, next) => {
  const doc = await NewsletterSubscriber.findOneAndUpdate({ email: req.body.email }, { subscribed: false }, { new: true })
  if (!doc) return next(new AppError('Subscriber not found.', 404))
  sendSuccess(res, 200, doc)
})

export const getAllSubscribersAdmin = catchAsync(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ subscribed: true }).sort('-createdAt')
  sendSuccess(res, 200, subscribers)
})

// CSV export for admin — subscriber list download.
export const exportSubscribersCSV = catchAsync(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ subscribed: true }).sort('-createdAt')
  const header = 'email,name,subscribedAt\n'
  const rows = subscribers
    .map((s) => `${s.email},${s.name || ''},${s.createdAt.toISOString()}`)
    .join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"')
  res.send(header + rows)
})
