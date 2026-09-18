import mongoose from 'mongoose'

const csrRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    csrInterests: { type: String, required: true },
    estimatedBudget: { type: String, required: true },
    preferredProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    message: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Discussion', 'Approved', 'Active', 'Completed', 'Rejected'],
      default: 'New',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('CsrRequest', csrRequestSchema)
