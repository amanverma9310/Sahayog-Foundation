import mongoose from 'mongoose'
import slugify from 'slugify'

const CATEGORIES = [
  'Education', 'Food Relief', 'Healthcare', 'Women Empowerment',
  'Winter Relief', 'Environment', 'Community Development', 'Disaster Relief',
]

const timelineEventSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
)

const impactStatSchema = new mongoose.Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true },
    shortDescription: { type: String, required: true, maxlength: 280 },
    fullDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['Ongoing', 'Completed', 'Upcoming', 'Seasonal'], default: 'Ongoing' },
    beneficiaries: { type: Number, default: 0, min: 0 },
    fundingTarget: { type: Number, required: true, min: 0 },
    amountRaised: { type: Number, default: 0, min: 0 },
    donorCount: { type: Number, default: 0, min: 0 },
    objectives: [{ type: String }],
    problem: { type: String },
    solution: { type: String },
    whatWeProvide: [{ type: String }],
    impactStats: [impactStatSchema],
    timeline: [timelineEventSchema],
    testimonialIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial' }],
    published: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
)

projectSchema.index({ title: 'text', shortDescription: 'text' })

projectSchema.pre('validate', function generateSlug(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

projectSchema.virtual('percentFunded').get(function percentFunded() {
  if (!this.fundingTarget) return 0
  return Math.round((this.amountRaised / this.fundingTarget) * 100)
})
projectSchema.set('toJSON', { virtuals: true })

export const PROJECT_CATEGORIES = CATEGORIES
export default mongoose.model('Project', projectSchema)
