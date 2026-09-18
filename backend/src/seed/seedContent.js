// Run with: node src/seed/seedContent.js
// Populates every collection with realistic demo content matching what the
// Phase 1 frontend mock data used, so the two can be visually compared
// once connected. Safe to re-run — it clears these collections first.
import 'dotenv/config'

import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Project from '../models/Project.js'
import Drive from '../models/Drive.js'
import Story from '../models/Story.js'
import Testimonial from '../models/Testimonial.js'
import TeamMember from '../models/TeamMember.js'
import Award from '../models/Award.js'
import PressCoverage from '../models/PressCoverage.js'
import Partner from '../models/Partner.js'
import Faq from '../models/Faq.js'
import GalleryItem from '../models/GalleryItem.js'
import ImpactStat from '../models/ImpactStat.js'
import Campaign from '../models/Campaign.js'
import SiteSetting from '../models/SiteSetting.js'

async function run() {
  await connectDB()
  console.log('Clearing existing content...')

  await Promise.all([
    Project.deleteMany(),
    Drive.deleteMany(),
    Story.deleteMany(),
    Testimonial.deleteMany(),
    TeamMember.deleteMany(),
    Award.deleteMany(),
    PressCoverage.deleteMany(),
    Partner.deleteMany(),
    Faq.deleteMany(),
    GalleryItem.deleteMany(),
    ImpactStat.deleteMany(),
    Campaign.deleteMany(),
  ])

  console.log('Seeding projects...')
  const project1 = await Project.create({
    title: 'First Bench Learning Centres',
    category: 'Education',
    location: 'Govindpuri, New Delhi',
    status: 'Ongoing',
    startDate: new Date('2021-06-01'),
    shortDescription: 'After-school learning centres for children reading below grade level.',
    fullDescription:
      'First Bench runs six afternoon learning centres inside resettlement colonies, focused on reading, basic arithmetic, and confidence-building through peer learning groups of eight to ten children.',
    problem: '61% of children in grades 3–5 could not read a grade 2-level paragraph despite regular school attendance.',
    solution: 'Small-group, level-appropriate instruction with quarterly reading assessments shared with parents.',
    whatWeProvide: ['Trained learning coordinators', 'Reading and numeracy workbooks', 'Take-home reading kits', 'Termly assessments'],
    heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'],
    beneficiaries: 1840,
    fundingTarget: 3200000,
    amountRaised: 2244000,
    donorCount: 612,
    objectives: ['Bring 70% of children to grade-level reading within 18 months', 'Keep dropout under 5% annually'],
    impactStats: [
      { label: 'Reading improvement (avg.)', value: '1.8 grade levels' },
      { label: 'Attendance rate', value: '89%' },
    ],
    timeline: [
      { year: '2021', title: 'First centre opened', description: 'Started with 45 children in Govindpuri.', order: 1 },
      { year: '2023', title: 'Independent assessment partnership', description: 'Began termly external reading assessments.', order: 2 },
      { year: '2025', title: '1,800+ children reached', description: 'Cumulative enrolment crossed 1,800.', order: 3 },
    ],
    seoTitle: 'First Bench Learning Centres — Sahayog Foundation',
    seoDescription: 'After-school reading and numeracy support in resettlement colonies.',
  })

  const project2 = await Project.create({
    title: 'Winter Shelter & Survival Kits',
    category: 'Winter Relief',
    location: 'Delhi NCR footpaths & night shelters',
    status: 'Seasonal',
    startDate: new Date('2019-11-01'),
    shortDescription: 'Blankets, tarpaulin, and hot meals distributed at night through Delhi\'s coldest months.',
    fullDescription: 'Structured night rounds visiting the same 40 locations on a rotating schedule so repeat rough-sleepers are tracked and referred to municipal shelters.',
    problem: 'Delhi records preventable cold-related deaths every winter among people who avoid municipal shelters.',
    solution: 'Repeat-visit model with referrals into the municipal shelter network.',
    whatWeProvide: ['Insulated blankets and tarpaulin', 'Hot meals during night rounds', 'Basic health screening'],
    heroImage: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1600&auto=format&fit=crop',
    gallery: [],
    beneficiaries: 6400,
    fundingTarget: 4800000,
    amountRaised: 3360000,
    donorCount: 1180,
    objectives: ['Cover 40 rough-sleeping locations weekly', 'Refer 500+ individuals into shelters'],
    impactStats: [{ label: 'Locations covered', value: '40' }, { label: 'Blankets distributed', value: '8,200' }],
    timeline: [{ year: '2019', title: 'First night rounds', description: '8 volunteers, 6 locations.', order: 1 }],
    seoTitle: 'Winter Shelter & Survival Kits — Sahayog Foundation',
    seoDescription: 'Structured night relief through Delhi\'s winter.',
  })

  console.log('Seeding drives...')
  await Drive.create([
    {
      name: 'Winter Reading Kit Distribution', project: project1._id, date: new Date('2025-12-14'),
      location: 'Govindpuri, New Delhi', description: 'Distributed reading kits to 340 children.',
      beneficiaries: 340, volunteers: 22, status: 'Completed', published: true,
      images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'],
    },
    {
      name: 'Night Round — Nizamuddin & ITO', project: project2._id, date: new Date('2026-01-08'),
      location: 'Nizamuddin & ITO, New Delhi', description: 'Blanket distribution across 14 locations.',
      beneficiaries: 260, volunteers: 18, status: 'Completed', published: true,
      images: ['https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop'],
    },
  ])

  console.log('Seeding stories...')
  const story1 = await Story.create({
    title: 'The first book Meena finished on her own',
    category: 'Impact Stories',
    excerpt: 'Meena joined the Govindpuri learning centre reading three words a minute. Eight months on, she finished her first storybook.',
    content: 'When Meena first sat down at the First Bench centre in Govindpuri, reading felt like a wall. Eight months of small-group sessions later, she finished her first full storybook aloud to her mother.',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
    author: 'Priya Nair',
    publishDate: new Date('2026-01-22'),
    relatedProject: project1._id,
    featured: true,
    tags: ['Education', 'Delhi'],
    status: 'published',
  })

  console.log('Seeding testimonials...')
  await Testimonial.create([
    {
      type: 'Beneficiary', name: 'Sunita Devi', role: 'Parent, Govindpuri',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      quote: 'My daughter used to dread the school reading test. This year her teacher asked what changed.',
      relatedProject: project1._id, featured: true,
    },
    {
      type: 'Volunteer', name: 'Rohan Bakshi', role: 'Night-round volunteer',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      quote: 'What surprised me most was how much of the work is just showing up at the same place, every week.',
      relatedProject: project2._id, featured: true,
    },
  ])

  console.log('Seeding team...')
  await TeamMember.create([
    { name: 'Dr. Kavita Rao', position: 'Founder & Executive Director', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop', bio: 'Founded Sahayog in 2011 after a decade in public health research.', order: 1 },
    { name: 'Arjun Mehta', position: 'Director of Programmes', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop', bio: 'Oversees field operations across all programme areas.', order: 2 },
  ])

  console.log('Seeding awards, press, partners...')
  await Award.create([
    { name: 'Delhi CSR Excellence Award', organization: 'Delhi CSR Forum', year: 2025, description: 'Recognised for the Mobile Health Clinics programme.' },
  ])
  await PressCoverage.create([
    { publication: 'The Hindu', headline: 'Inside the after-school centres closing Delhi\'s reading gap', date: new Date('2025-09-12'), articleLink: 'https://example.com' },
  ])
  await Partner.create([
    { name: 'Northbridge Textiles', partnershipType: 'CSR Partner', startYear: 2022 },
    { name: 'Delta Health Systems', partnershipType: 'Healthcare Partner', startYear: 2020 },
  ])

  console.log('Seeding FAQs...')
  await Faq.create([
    { category: 'Donations', question: 'Is my donation tax-deductible?', answer: 'Yes. Sahayog Foundation is registered under Section 80G.', order: 1 },
    { category: '80G', question: 'How long does the 80G certificate take?', answer: 'Typically 5–7 working days after verification.', order: 2 },
    { category: 'Volunteering', question: 'Do I need prior experience to volunteer?', answer: 'No, most roles need no prior experience.', order: 3 },
  ])

  console.log('Seeding gallery...')
  await GalleryItem.create([
    { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop', caption: 'Reading hour at the Govindpuri centre', project: project1._id, category: 'Education', year: 2025 },
    { image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800&auto=format&fit=crop', caption: 'Night round distribution, ITO', project: project2._id, category: 'Winter Relief', year: 2026 },
  ])

  console.log('Seeding impact stats...')
  await ImpactStat.create([
    { key: 'lives', label: 'Lives impacted', value: 184320, suffix: '+', order: 1 },
    { key: 'meals', label: 'Meals distributed', value: 962400, suffix: '+', order: 2 },
    { key: 'children', label: 'Children supported', value: 21870, suffix: '+', order: 3 },
    { key: 'volunteers', label: 'Active volunteers', value: 1240, suffix: '+', order: 4 },
    { key: 'cities', label: 'Cities reached', value: 38, suffix: '', order: 5 },
  ])

  console.log('Seeding active campaign...')
  await Campaign.create({
    title: 'Winter Relief Emergency Fund 2026',
    description: 'Help us reach 8,000 people sleeping without shelter before temperatures drop further.',
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop',
    fundingTarget: 6000000,
    amountRaised: 3960000,
    donorCount: 1420,
    active: true,
    endDate: new Date('2026-02-28'),
  })

  console.log('Seeding site settings...')
  await SiteSetting.findOneAndUpdate(
    { key: 'global' },
    {
      key: 'global',
      orgName: 'Sahayog Foundation',
      orgEmail: 'hello@sahayogfoundation.org',
      orgPhone: '+91 98100 22334',
      orgAddress: '14, Church Road, Lajpat Nagar, New Delhi 110024',
      registrationNumber: 'Regd. under Societies Act, 1860 — Reg. No. 4471/2011',
      pan: 'AAATS1234C',
    },
    { upsert: true }
  )

  console.log('Seed complete.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
