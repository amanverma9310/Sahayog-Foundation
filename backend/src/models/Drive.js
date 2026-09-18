import mongoose from 'mongoose'

const driveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    beneficiaries: { type: Number, default: 0 },
    volunteers: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    itemsDistributed: [{ item: String, quantity: Number }],
    images: [{ type: String }],
    videos: [{ type: String }],
    beforeAfter: { before: String, after: String },
    partners: [{ type: String }],
    reportUrl: { type: String },
    status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], default: 'Scheduled' },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
)

driveSchema.index({ date: -1 })

export default mongoose.model('Drive', driveSchema)
