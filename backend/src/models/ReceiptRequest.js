import mongoose from 'mongoose'

const receiptRequestSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pan: { type: String, required: true, uppercase: true },
    address: { type: String, required: true },
    donationId: { type: String, required: true },
    donationAmount: { type: Number, required: true },
    proofUrl: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Certificate Generated', 'Sent'],
      default: 'Pending',
    },
    certificateUrl: { type: String },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('ReceiptRequest', receiptRequestSchema)
