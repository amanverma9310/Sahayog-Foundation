import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Beneficiary', 'Volunteer', 'Donor', 'Corporate partner', 'Intern'], required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String },
    quote: { type: String, required: true },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', testimonialSchema)
