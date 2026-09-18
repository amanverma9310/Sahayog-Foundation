import mongoose from 'mongoose'

const volunteerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, min: 16 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    areasOfInterest: [{ type: String }],
    availability: { type: String, required: true },
    skills: { type: String },
    preferredProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    message: { type: String },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Approved', 'Onboarded', 'Inactive', 'Rejected'],
      default: 'New',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('VolunteerApplication', volunteerApplicationSchema)
