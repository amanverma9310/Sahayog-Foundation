import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for guest donations
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorPhone: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    frequency: { type: String, enum: ['one-time', 'recurring'], default: 'one-time' },
    designation: { type: String, enum: ['general', 'project', 'campaign'], default: 'general' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    anonymous: { type: Boolean, default: false },
    wants80G: { type: Boolean, default: false },
    pan: { type: String },

    // Razorpay linkage
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ['created', 'successful', 'failed', 'refunded'],
      default: 'created',
    },

    receiptNumber: { type: String, unique: true, sparse: true },
    receiptUrl: { type: String },
  },
  { timestamps: true }
)

donationSchema.index({ donorEmail: 1 })
donationSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('Donation', donationSchema)
