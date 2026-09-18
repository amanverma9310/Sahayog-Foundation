import Notification from '../models/Notification.js'
import { sendAdminNotificationEmail } from './email.service.js'

// Creates an in-app admin notification and (best-effort) emails the admin
// inbox. Email failures are logged but never block the request that
// triggered them — a donor's form submission should still succeed even if
// SMTP is temporarily down.
export async function notifyAdmin({ type, title, message, relatedId, relatedModel }) {
  try {
    await Notification.create({ type, title, message, relatedId, relatedModel })
  } catch (err) {
    console.error('Failed to create admin notification:', err.message)
  }

  try {
    await sendAdminNotificationEmail({ subject: title, summary: message })
  } catch (err) {
    console.error('Failed to send admin notification email:', err.message)
  }
}
