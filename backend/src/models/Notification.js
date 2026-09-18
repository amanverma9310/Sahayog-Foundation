import mongoose from 'mongoose'

// Internal admin-facing notifications (e.g. "new CSR enquiry", "new 80G
// request") shown in the admin dashboard bell/inbox.
const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    relatedModel: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)
