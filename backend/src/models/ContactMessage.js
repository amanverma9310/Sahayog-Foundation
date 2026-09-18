import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    category: {
      type: String,
      enum: ['General enquiry', 'Donation enquiry', 'CSR enquiry', 'Volunteer enquiry', 'Media enquiry'],
      required: true,
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Read', 'Replied', 'Resolved'], default: 'New' },
  },
  { timestamps: true }
)

export default mongoose.model('ContactMessage', contactMessageSchema)
