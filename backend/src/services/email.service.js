import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
})

const BRAND = {
  pine: '#1B3A34',
  marigold: '#E08A3E',
  paper: '#FAF7F2',
}

function baseTemplate({ title, bodyHtml, ctaLabel, ctaUrl }) {
  return `
  <div style="background:${BRAND.paper};padding:32px 16px;font-family:Georgia,serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #eee;">
      <div style="background:${BRAND.pine};padding:24px 32px;">
        <span style="color:#ffffff;font-size:20px;font-weight:600;">Sahayog Foundation</span>
      </div>
      <div style="padding:32px;">
        <h1 style="font-size:20px;color:${BRAND.pine};margin:0 0 16px;">${title}</h1>
        <div style="font-size:15px;line-height:1.6;color:#333;font-family:Arial,sans-serif;">
          ${bodyHtml}
        </div>
        ${
          ctaLabel && ctaUrl
            ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:24px;background:${BRAND.marigold};color:${BRAND.pine};padding:12px 24px;border-radius:3px;text-decoration:none;font-weight:600;font-family:Arial,sans-serif;">${ctaLabel}</a>`
            : ''
        }
      </div>
      <div style="padding:20px 32px;background:#f5f2ec;font-size:12px;color:#888;font-family:Arial,sans-serif;">
        Sahayog Foundation · Regd. under Societies Act, 1860 · Reg. No. 4471/2011
      </div>
    </div>
  </div>`
}

async function sendMail({ to, subject, html, attachments }) {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
    attachments,
  })
}

export async function sendDonationConfirmationEmail(donation) {
  const html = baseTemplate({
    title: 'Thank you for your donation',
    bodyHtml: `
      <p>Dear ${donation.anonymous ? 'Donor' : donation.donorName},</p>
      <p>Your donation of <strong>₹${donation.amount.toLocaleString('en-IN')}</strong> has been received successfully.</p>
      <p>Transaction reference: <strong>${donation.razorpayPaymentId}</strong></p>
      <p>A receipt is attached to this email. ${donation.wants80G ? 'Your 80G certificate will be issued within 5–7 working days.' : ''}</p>
    `,
  })
  await sendMail({ to: donation.donorEmail, subject: 'Your donation receipt — Sahayog Foundation', html })
}

export async function send80GConfirmationEmail(request) {
  const html = baseTemplate({
    title: '80G certificate request received',
    bodyHtml: `<p>Dear ${request.fullName},</p><p>We've received your 80G certificate request for donation ID <strong>${request.donationId}</strong>. Our finance team will verify and issue your certificate within 5–7 working days.</p>`,
  })
  await sendMail({ to: request.email, subject: '80G request received — Sahayog Foundation', html })
}

export async function send80GCertificateEmail(request, certificateBuffer) {
  const html = baseTemplate({
    title: 'Your 80G certificate is ready',
    bodyHtml: `<p>Dear ${request.fullName},</p><p>Please find your 80G tax deduction certificate attached.</p>`,
  })
  await sendMail({
    to: request.email,
    subject: 'Your 80G certificate — Sahayog Foundation',
    html,
    attachments: [{ filename: '80G-certificate.pdf', content: certificateBuffer }],
  })
}

export async function sendGenericAcknowledgementEmail({ to, name, formType }) {
  const labels = {
    volunteer: 'volunteer application',
    internship: 'internship application',
    csr: 'CSR partnership enquiry',
    sponsor: 'drive sponsorship request',
    contact: 'message',
  }
  const html = baseTemplate({
    title: `We've received your ${labels[formType] || 'submission'}`,
    bodyHtml: `<p>Dear ${name},</p><p>Thank you for reaching out to Sahayog Foundation. Our team will review your ${labels[formType] || 'submission'} and get back to you soon.</p>`,
  })
  await sendMail({ to, subject: `We've received your ${labels[formType] || 'submission'}`, html })
}

export async function sendAdminNotificationEmail({ subject, summary }) {
  const html = baseTemplate({ title: subject, bodyHtml: `<p>${summary}</p>` })
  await sendMail({ to: process.env.ADMIN_NOTIFICATION_EMAIL, subject: `[Sahayog] ${subject}`, html })
}

export async function sendPasswordResetEmail(user, resetUrl) {
  const html = baseTemplate({
    title: 'Reset your password',
    bodyHtml: `<p>Hi ${user.name},</p><p>Click the button below to reset your password. This link expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>`,
    ctaLabel: 'Reset Password',
    ctaUrl: resetUrl,
  })
  await sendMail({ to: user.email, subject: 'Reset your password — Sahayog Foundation', html })
}

export async function sendVerificationEmail(user, verifyUrl) {
  const html = baseTemplate({
    title: 'Verify your email',
    bodyHtml: `<p>Hi ${user.name},</p><p>Please verify your email address to activate your donor account.</p>`,
    ctaLabel: 'Verify Email',
    ctaUrl: verifyUrl,
  })
  await sendMail({ to: user.email, subject: 'Verify your email — Sahayog Foundation', html })
}

export default transporter
