import mongoose from 'mongoose'

const sponsorRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDrive: { type: String, required: true },
    budgetRange: { type: String, required: true },
    preferredLocation: { type: String },
    expectedDate: { type: Date },
    message: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Discussion', 'Approved', 'Scheduled', 'Completed', 'Rejected'],
      default: 'New',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('SponsorRequest', sponsorRequestSchema)
