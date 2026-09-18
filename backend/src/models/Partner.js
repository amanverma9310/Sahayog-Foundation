import mongoose from 'mongoose'

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    website: { type: String },
    partnershipType: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    description: { type: String },
    startYear: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Partner', partnerSchema)
