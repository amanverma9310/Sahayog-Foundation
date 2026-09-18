import mongoose from 'mongoose'

const awardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    externalLink: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Award', awardSchema)
