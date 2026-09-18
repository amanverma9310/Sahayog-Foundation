import mongoose from 'mongoose'

const pressCoverageSchema = new mongoose.Schema(
  {
    publication: { type: String, required: true },
    headline: { type: String, required: true },
    date: { type: Date, required: true },
    logo: { type: String },
    articleLink: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('PressCoverage', pressCoverageSchema)
