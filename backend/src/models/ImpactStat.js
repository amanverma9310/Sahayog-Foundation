import mongoose from 'mongoose'

const impactStatSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. 'lives', 'meals'
    label: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    suffix: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('ImpactStat', impactStatSchema)
