import catchAsync from '../utils/catchAsync.js'
import Donation from '../models/Donation.js'
import Project from '../models/Project.js'
import Drive from '../models/Drive.js'
import User from '../models/User.js'
import ReceiptRequest from '../models/ReceiptRequest.js'
import ContactMessage from '../models/ContactMessage.js'
import SponsorRequest from '../models/SponsorRequest.js'
import InternshipApplication from '../models/InternshipApplication.js'
import VolunteerApplication from '../models/VolunteerApplication.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getDashboardStats = catchAsync(async (req, res) => {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    totalDonationsAgg,
    donationsThisMonthAgg,
    totalDonors,
    activeProjects,
    completedDrives,
    beneficiariesAgg,
    pending80G,
    newContacts,
    newSponsorRequests,
    newInternshipApps,
    newVolunteerApps,
    recentTransactions,
  ] = await Promise.all([
    Donation.aggregate([{ $match: { status: 'successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Donation.aggregate([
      { $match: { status: 'successful', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Donation.distinct('donorEmail', { status: 'successful' }),
    Project.countDocuments({ status: 'Ongoing', published: true }),
    Drive.countDocuments({ status: 'Completed' }),
    Project.aggregate([{ $group: { _id: null, total: { $sum: '$beneficiaries' } } }]),
    ReceiptRequest.countDocuments({ status: 'Pending' }),
    ContactMessage.countDocuments({ status: 'New' }),
    SponsorRequest.countDocuments({ status: 'New' }),
    InternshipApplication.countDocuments({ status: 'New' }),
    VolunteerApplication.countDocuments({ status: 'New' }),
    Donation.find({ status: 'successful' }).sort('-createdAt').limit(10).populate('project', 'title'),
  ])

  sendSuccess(res, 200, {
    totalDonations: totalDonationsAgg[0]?.total || 0,
    donationsThisMonth: donationsThisMonthAgg[0]?.total || 0,
    donationsThisMonthCount: donationsThisMonthAgg[0]?.count || 0,
    totalDonors: totalDonors.length,
    activeProjects,
    completedDrives,
    beneficiaries: beneficiariesAgg[0]?.total || 0,
    pending80GRequests: pending80G,
    newContactEnquiries: newContacts,
    newSponsorRequests,
    newInternshipApplications: newInternshipApps,
    newVolunteerApplications: newVolunteerApps,
    recentTransactions,
  })
})

// Monthly donation totals for the last 12 months — feeds an admin chart.
export const getDonationTrends = catchAsync(async (req, res) => {
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const trends = await Donation.aggregate([
    { $match: { status: 'successful', createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  sendSuccess(res, 200, trends)
})
