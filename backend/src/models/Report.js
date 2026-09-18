import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Annual Report', 'Financial Report', 'Audit Report', 'Impact Report', 'CSR Document', 'Legal Registration'],
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileSizeLabel: { type: String },
    publishedYear: { type: Number },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Report', reportSchema)
