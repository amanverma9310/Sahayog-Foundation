import mongoose from 'mongoose'
import slugify from 'slugify'

const CATEGORIES = ['Impact Stories', 'Field Reports', 'Research', 'Announcements', 'Volunteer Stories', 'Drive Reports', 'NGO Updates']

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    images: [{ type: String }],
    author: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    tags: [{ type: String }],
    publishDate: { type: Date, default: Date.now },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    seoTitle: String,
    seoDescription: String,
    ogImage: String,
  },
  { timestamps: true }
)

storySchema.index({ title: 'text', excerpt: 'text', content: 'text' })

storySchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

export const STORY_CATEGORIES = CATEGORIES
export default mongoose.model('Story', storySchema)
