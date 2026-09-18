import PDFDocument from 'pdfkit'

function streamToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.end()
  })
}

export async function generateDonationReceiptPDF(donation) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  doc.fillColor('#1B3A34').fontSize(20).text('Sahayog Foundation', { align: 'left' })
  doc.fontSize(10).fillColor('#666').text('Regd. under Societies Act, 1860 · Reg. No. 4471/2011', { align: 'left' })
  doc.moveDown(1.5)

  doc.fillColor('#000').fontSize(16).text('Donation Receipt', { align: 'left' })
  doc.moveDown(0.5)
  doc.fontSize(10).fillColor('#333')

  const rows = [
    ['Receipt Number', donation.receiptNumber || 'N/A'],
    ['Date', new Date(donation.createdAt).toLocaleDateString('en-IN')],
    ['Donor Name', donation.anonymous ? 'Anonymous Donor' : donation.donorName],
    ['Email', donation.donorEmail],
    ['Amount', `Rs. ${donation.amount.toLocaleString('en-IN')}`],
    ['Payment Reference', donation.razorpayPaymentId || 'N/A'],
    ['Designation', donation.designation === 'general' ? 'General Fund' : donation.designation],
  ]

  rows.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
    doc.font('Helvetica').text(String(value))
  })

  doc.moveDown(1.5)
  doc.fontSize(9).fillColor('#666').text(
    'This receipt is generated electronically and does not require a signature. For an 80G tax deduction certificate, please submit a request from your donor dashboard.',
    { width: 480 }
  )

  return streamToBuffer(doc)
}

export async function generate80GCertificatePDF(request) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  doc.fillColor('#1B3A34').fontSize(20).text('Sahayog Foundation', { align: 'center' })
  doc.fontSize(10).fillColor('#666').text('80G Registration — Income Tax Act, 1961', { align: 'center' })
  doc.moveDown(2)

  doc.fillColor('#000').fontSize(18).text('Certificate of Donation', { align: 'center' })
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor('#333')
  doc.text(
    `This is to certify that ${request.fullName} (PAN: ${request.pan}) has donated a sum of Rs. ${request.donationAmount.toLocaleString(
      'en-IN'
    )} to Sahayog Foundation on account of donation reference ${request.donationId}. This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961, subject to the applicable limits.`,
    { align: 'left', width: 480 }
  )

  doc.moveDown(2)
  doc.text(`Issued on: ${new Date().toLocaleDateString('en-IN')}`)
  doc.moveDown(3)
  doc.text('_____________________________')
  doc.text('Authorized Signatory, Sahayog Foundation')

  return streamToBuffer(doc)
}
