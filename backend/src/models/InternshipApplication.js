import mongoose from 'mongoose'

const internshipApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    skills: { type: String },
    motivation: { type: String, required: true },
    portfolio: { type: String },
    linkedin: { type: String },
    resumeUrl: { type: String },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'New',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('InternshipApplication', internshipApplicationSchema)
