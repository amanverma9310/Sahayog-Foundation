import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    photo: { type: String, required: true },
    bio: { type: String, required: true },
    linkedin: { type: String },
    email: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('TeamMember', teamMemberSchema)
