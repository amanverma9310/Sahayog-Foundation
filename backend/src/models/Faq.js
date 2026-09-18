import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Donations', '80G', 'Projects', 'Volunteering', 'Internships', 'CSR', 'Payments', 'Refunds'],
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Faq', faqSchema)
