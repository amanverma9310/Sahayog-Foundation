import mongoose from 'mongoose'

// Single-document collection (findOneAndUpdate with upsert) holding
// site-wide editable content: hero text/media, featured items, legal page
// copy, org contact info, etc. Kept schemaless-ish via Mixed to stay
// flexible as homepage content requirements evolve.
const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    heroTitle: String,
    heroSubtitle: String,
    heroMediaUrl: String,
    featuredProjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    featuredStoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    activeCampaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    orgName: String,
    orgEmail: String,
    orgPhone: String,
    orgAddress: String,
    registrationNumber: String,
    pan: String,
    socialLinks: {
      instagram: String,
      facebook: String,
      linkedin: String,
      x: String,
      youtube: String,
    },
    legalPages: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
)

export default mongoose.model('SiteSetting', siteSettingSchema)
