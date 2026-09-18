import Razorpay from 'razorpay'

// Lazily constructed so a missing/misconfigured Razorpay key fails only
// the specific request that needed it (with a clear error), rather than
// crashing the whole process at startup and taking every unrelated route
// down with it. Also defends against the ESM import-ordering gotcha
// described in server.js: even if something someday imports this module
// before dotenv has run, the error now surfaces only when a payment is
// actually attempted, not at process boot.
let client = null

export default function getRazorpayClient() {
  if (!client) {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error(
        'Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env before accepting donations.'
      )
    }
    client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  }
  return client
}
