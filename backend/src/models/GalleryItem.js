import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
    category: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('GalleryItem', galleryItemSchema)
