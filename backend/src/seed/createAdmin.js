// Run with: npm run seed:admin
// Creates (or updates) the initial Super Admin account from .env values so
// there's always a way into the admin panel on a fresh database.
import 'dotenv/config'

import { connectDB } from '../config/db.js'
import Admin from '../models/Admin.js'
import mongoose from 'mongoose'

async function run() {
  await connectDB()

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin'

  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env')
    process.exit(1)
  }

  let admin = await Admin.findOne({ email })
  if (admin) {
    console.log(`Admin with email ${email} already exists. No changes made.`)
  } else {
    admin = await Admin.create({ name, email, password, role: 'Super Admin' })
    console.log(`Super Admin created: ${admin.email}`)
    console.log('IMPORTANT: log in and change this password immediately.')
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
