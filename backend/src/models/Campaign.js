import mongoose from 'mongoose'
import slugify from 'slugify'

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    fundingTarget: { type: Number, required: true },
    amountRaised: { type: Number, default: 0 },
    donorCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
)

campaignSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

export default mongoose.model('Campaign', campaignSchema)
