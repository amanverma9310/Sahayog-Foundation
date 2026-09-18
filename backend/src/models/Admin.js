import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const ADMIN_ROLES = ['Super Admin', 'Content Manager', 'Donation Manager', 'Project Manager']

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: 'Content Manager' },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
)

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export const ADMIN_ROLE_VALUES = ADMIN_ROLES
export default mongoose.model('Admin', adminSchema)
