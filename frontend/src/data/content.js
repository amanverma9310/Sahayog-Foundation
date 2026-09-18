// ---------------------------------------------------------------------------
// NOTE: now that the frontend is connected to the live backend (see
// src/lib/api.js), this file is only still used for a handful of static
// UI constants and organisation boilerplate that don't need a database
// round-trip: `categories` (the fixed project-category enum, also the
// backend's Project.category enum) and `orgInfo` (footer/contact
// boilerplate — email, phone, address, map coordinates, social links).
// Everything else here (projects, stories, drives, testimonials, etc.) is
// unused dead data, left in place only for reference/diffing against what
// the backend now serves live. Safe to delete once you're confident the
// live pages fully replace it.
// ---------------------------------------------------------------------------
// Demo content only. In Phase 2, every export here is replaced by a real
// API call against the Express backend (see src/lib/api.js for the seam).

export const orgInfo = {
  name: 'Sahayog Foundation',
  shortName: 'Sahayog',
  tagline: 'Relief that reaches, reporting that holds up.',
  registrationNumber: 'Regd. under Societies Act, 1860 — Reg. No. 4471/2011',
  pan: 'AAATS1234C',
  address: '14, Church Road, Lajpat Nagar, New Delhi 110024',
  email: 'hello@sahayogfoundation.org',
  phone: '+91 98100 22334',
  mapCoords: { lat: 28.5677, lng: 77.2431 },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    x: 'https://x.com',
    youtube: 'https://youtube.com',
  },
}

export const impactStats = [
  { id: 'lives', label: 'Lives impacted', value: 184320, suffix: '+' },
  { id: 'meals', label: 'Meals distributed', value: 962400, suffix: '+' },
  { id: 'children', label: 'Children supported', value: 21870, suffix: '+' },
  { id: 'families', label: 'Families assisted', value: 39510, suffix: '+' },
  { id: 'volunteers', label: 'Active volunteers', value: 1240, suffix: '+' },
  { id: 'cities', label: 'Cities reached', value: 38, suffix: '' },
]

export const categories = [
  'Education',
  'Food Relief',
  'Healthcare',
  'Women Empowerment',
  'Winter Relief',
  'Environment',
  'Community Development',
  'Disaster Relief',
]

export const projects = [
  {
    id: 'p1',
    slug: 'first-bench-learning-centres',
    title: 'First Bench Learning Centres',
    category: 'Education',
    location: 'Govindpuri, New Delhi',
    status: 'Ongoing',
    startDate: '2021-06-01',
    shortDescription:
      'After-school learning centres for children in resettlement colonies who are enrolled in school but reading below grade level.',
    fullDescription:
      "First Bench runs six afternoon learning centres inside resettlement colonies where government schools are overcrowded and foundational literacy has slipped. Each centre is staffed by a trained local coordinator and runs in two-hour blocks after school hours, focused on reading, basic arithmetic, and confidence-building through peer learning groups of eight to ten children.",
    problem:
      'Independent assessments across our partner colonies found that 61% of children in grades 3–5 could not read a grade 2-level paragraph, despite regular school attendance.',
    solution:
      'Small-group, level-appropriate instruction delivered close to home, with quarterly reading assessments shared openly with parents and referring schools.',
    whatWeProvide: [
      'Trained learning coordinators (1 per 15 children)',
      'Reading and numeracy workbooks, refreshed termly',
      'Take-home reading kits for the lowest-performing 20%',
      'Termly assessment and report card shared with families',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 1840,
    fundingTarget: 3200000,
    amountRaised: 2244000,
    donorCount: 612,
    objectives: [
      'Bring 70% of enrolled children to grade-level reading within 18 months',
      'Keep dropout among enrolled children under 5% annually',
      'Train 2 new local coordinators per centre per year',
    ],
    impactStats: [
      { label: 'Reading improvement (avg.)', value: '1.8 grade levels' },
      { label: 'Attendance rate', value: '89%' },
      { label: 'Centres running', value: '6' },
    ],
    timeline: [
      { year: '2021', title: 'First centre opened in Govindpuri', description: 'Started with 45 children across two batches.' },
      { year: '2022', title: 'Crossed 500 children', description: 'Expanded to three colonies with community demand.' },
      { year: '2023', title: 'Independent assessment partnership', description: 'Began termly external reading assessments for accountability.' },
      { year: '2024', title: 'Sixth centre opened', description: 'Extended into Sangam Vihar with two new coordinators.' },
      { year: '2025', title: '1,800+ children reached', description: 'Cumulative enrolment crossed 1,800 since inception.' },
    ],
    relatedDriveIds: ['d1', 'd4'],
    testimonialIds: ['t1'],
    seo: {
      title: 'First Bench Learning Centres — Sahayog Foundation',
      description:
        'After-school reading and numeracy support for children in resettlement colonies across Delhi.',
    },
  },
  {
    id: 'p2',
    slug: 'winter-shelter-and-survival-kits',
    title: 'Winter Shelter & Survival Kits',
    category: 'Winter Relief',
    location: 'Delhi NCR footpaths & night shelters',
    status: 'Seasonal — active Nov–Feb',
    startDate: '2019-11-01',
    shortDescription:
      'Blankets, tarpaulin, and hot meals distributed at night to people sleeping without shelter through Delhi\'s coldest months.',
    fullDescription:
      'Between November and February, night temperatures in Delhi regularly fall below 5°C. Our winter relief teams run structured night rounds — not one-off blanket drops — visiting the same 40 locations on a rotating schedule so repeat rough-sleepers are tracked, referred to municipal shelters where possible, and checked on through the season.',
    problem:
      'Delhi records preventable cold-related deaths among homeless residents every winter, concentrated among people who avoid municipal shelters due to overcrowding or documentation requirements.',
    solution:
      'A repeat-visit model rather than one-time distribution, paired with referrals into the municipal shelter network and basic health screening on-site.',
    whatWeProvide: [
      'Insulated blankets and tarpaulin sheeting',
      'Hot meals during night rounds',
      'Basic health screening and referral',
      'Coordination with municipal night shelters',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547156035-9c7a15a0a4e6?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 6400,
    fundingTarget: 4800000,
    amountRaised: 3360000,
    donorCount: 1180,
    objectives: [
      'Cover 40 known rough-sleeping locations weekly through winter',
      'Refer 500+ individuals into municipal shelters',
      'Zero cold-related fatalities at covered locations',
    ],
    impactStats: [
      { label: 'Locations covered', value: '40' },
      { label: 'Blankets distributed (last season)', value: '8,200' },
      { label: 'Shelter referrals', value: '540' },
    ],
    timeline: [
      { year: '2019', title: 'First night rounds', description: 'Started with 8 volunteers covering 6 locations.' },
      { year: '2021', title: 'Municipal shelter partnership', description: 'Formal referral pathway agreed with district administration.' },
      { year: '2023', title: 'Health screening added', description: 'On-site basic health checks introduced during rounds.' },
      { year: '2025', title: '40 locations, weekly coverage', description: 'Reached full weekly rotation across all known sites.' },
    ],
    relatedDriveIds: ['d2'],
    testimonialIds: ['t2'],
    seo: {
      title: 'Winter Shelter & Survival Kits — Sahayog Foundation',
      description: 'Structured night relief for people sleeping without shelter through Delhi\'s winter.',
    },
  },
  {
    id: 'p3',
    slug: 'sahayog-mobile-health-clinics',
    title: 'Mobile Health Clinics',
    category: 'Healthcare',
    location: 'Unauthorised colonies, South & East Delhi',
    status: 'Ongoing',
    startDate: '2020-02-14',
    shortDescription:
      'Weekly mobile clinics bringing basic diagnostics, maternal care, and medicine to colonies without a functioning primary health centre nearby.',
    fullDescription:
      'Our mobile clinics run on a fixed weekly schedule across 11 colonies, staffed by a rotating panel of general physicians, one gynaecologist, and community health workers. The focus is on continuity — the same colonies, the same day each week — so chronic conditions like hypertension and diabetes can actually be tracked over time rather than treated as one-off consultations.',
    problem:
      'The nearest government primary health centre for several of our partner colonies is over 6km away, which in practice means many residents, especially pregnant women and the elderly, go without routine care.',
    solution:
      'A fixed weekly circuit of mobile units with consistent staffing, basic diagnostics on board, and a referral pathway to partner hospitals for anything beyond primary care.',
    whatWeProvide: [
      'General consultation and basic diagnostics',
      'Antenatal check-ups',
      'Free essential medicines',
      'Referral to partner hospitals for specialist care',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 28900,
    fundingTarget: 9500000,
    amountRaised: 5130000,
    donorCount: 890,
    objectives: [
      'Maintain weekly visit consistency above 95%',
      'Enrol 3,000 chronic-condition patients in follow-up tracking',
      'Reduce average distance to primary care to under 1km for covered colonies',
    ],
    impactStats: [
      { label: 'Colonies covered', value: '11' },
      { label: 'Consultations (2025)', value: '31,400' },
      { label: 'Antenatal check-ups', value: '2,180' },
    ],
    timeline: [
      { year: '2020', title: 'First mobile unit launched', description: 'Began with a single van covering 3 colonies.' },
      { year: '2021', title: 'Second unit added', description: 'Expanded coverage to 7 colonies.' },
      { year: '2023', title: 'Chronic care tracking introduced', description: 'Began longitudinal tracking for hypertension and diabetes patients.' },
      { year: '2025', title: '11 colonies, 2 units', description: 'Reached current weekly coverage.' },
    ],
    relatedDriveIds: ['d3'],
    testimonialIds: ['t3'],
    seo: {
      title: 'Mobile Health Clinics — Sahayog Foundation',
      description: 'Weekly primary healthcare delivered directly into underserved Delhi colonies.',
    },
  },
  {
    id: 'p4',
    slug: 'stitch-self-help-collectives',
    title: 'Stitch — Women\'s Self-Help Collectives',
    category: 'Women Empowerment',
    location: 'Seelampur & Welcome, North East Delhi',
    status: 'Ongoing',
    startDate: '2022-03-08',
    shortDescription:
      'Tailoring and small-enterprise training that helps women build independent income through collectively-run production units.',
    fullDescription:
      'Stitch organises women into collectives of 10–15, provides six months of tailoring and small-business training, then supports the group in registering as an informal production unit that takes on garment and household-linen orders. Roughly 40% of graduates go on to independent tailoring work; the rest continue within collective units.',
    problem:
      'Many women in these neighbourhoods have tailoring skill from home but no access to machines, market linkages, or the basic bookkeeping needed to turn it into steady income.',
    solution:
      'Shared workspace and machines, structured training, and direct handling of the first 12 months of order sourcing so collectives can build a client base.',
    whatWeProvide: [
      'Six-month tailoring and enterprise training',
      'Shared machines and workspace',
      'Order sourcing support for the first year',
      'Basic bookkeeping and savings-group training',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 640,
    fundingTarget: 2100000,
    amountRaised: 1449000,
    donorCount: 340,
    objectives: [
      'Train 200 women per year across 4 collectives',
      'Reach ₹6,000 average monthly income per graduate within a year',
      '80% of collectives self-sustaining after 18 months',
    ],
    impactStats: [
      { label: 'Women trained to date', value: '640' },
      { label: 'Active collectives', value: '9' },
      { label: 'Avg. monthly income (graduates)', value: '₹5,400' },
    ],
    timeline: [
      { year: '2022', title: 'First collective formed', description: '12 women, one shared workspace in Seelampur.' },
      { year: '2023', title: 'First outside order fulfilled', description: 'Collective completed its first bulk linen order.' },
      { year: '2024', title: 'Expanded to Welcome colony', description: 'Second neighbourhood, 3 new collectives.' },
      { year: '2025', title: '9 collectives running', description: '640 women trained cumulatively.' },
    ],
    relatedDriveIds: [],
    testimonialIds: ['t4'],
    seo: {
      title: 'Stitch — Women\'s Self-Help Collectives — Sahayog Foundation',
      description: 'Tailoring training and enterprise support helping women build independent income.',
    },
  },
  {
    id: 'p5',
    slug: 'flood-response-bihar',
    title: 'Flood Response — North Bihar',
    category: 'Disaster Relief',
    location: 'Darbhanga & Madhubani districts, Bihar',
    status: 'Completed',
    startDate: '2024-08-02',
    shortDescription:
      'Emergency food, clean water, and temporary shelter response following the 2024 Kosi floods, plus a longer rebuilding phase.',
    fullDescription:
      'Following the August 2024 Kosi floods, our team ran a three-phase response: emergency relief in the first two weeks (food, water purification, temporary shelter), a stabilisation phase over the following two months (health camps, school-in-a-box kits), and a rebuilding phase supporting 210 families to repair flood-damaged homes.',
    problem:
      'The August 2024 floods displaced an estimated 340,000 people across Darbhanga and Madhubani, destroying homes, contaminating drinking water sources, and disrupting the school term for tens of thousands of children.',
    solution:
      'A phased response moving from emergency relief to rebuilding, coordinated with district disaster management authorities to avoid duplication with government relief.',
    whatWeProvide: [
      'Dry ration kits and clean drinking water',
      'Temporary tarpaulin shelter',
      'Health camps and water-borne disease screening',
      'Home-repair material grants for the rebuilding phase',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541644396762-4b100b0d6117?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 18400,
    fundingTarget: 12000000,
    amountRaised: 12000000,
    donorCount: 2760,
    objectives: [
      'Reach 15,000 people within the first month',
      'Repair 200+ flood-damaged homes',
      'Zero water-borne disease outbreaks in covered villages',
    ],
    impactStats: [
      { label: 'People reached', value: '18,400' },
      { label: 'Homes repaired', value: '210' },
      { label: 'Villages covered', value: '46' },
    ],
    timeline: [
      { year: '2024', title: 'Emergency phase begins', description: 'First relief teams on ground within 48 hours of flooding.' },
      { year: '2024', title: 'Stabilisation phase', description: 'Health camps and school-in-a-box kits distributed.' },
      { year: '2025', title: 'Rebuilding phase completed', description: '210 homes repaired, response formally closed.' },
    ],
    relatedDriveIds: ['d5'],
    testimonialIds: [],
    seo: {
      title: 'Flood Response — North Bihar — Sahayog Foundation',
      description: 'Emergency and rebuilding response following the 2024 Kosi floods in North Bihar.',
    },
  },
  {
    id: 'p6',
    slug: 'greenline-urban-afforestation',
    title: 'Greenline Urban Afforestation',
    category: 'Environment',
    location: 'Yamuna floodplain & municipal wastelands, Delhi',
    status: 'Ongoing',
    startDate: '2023-07-05',
    shortDescription:
      'Community-maintained native-species plantation drives on degraded urban land, with a three-year survival commitment.',
    fullDescription:
      'Greenline plants native, climate-appropriate species on degraded municipal land and floodplain sites, and — critically — commits to three years of maintenance and survival tracking rather than a one-time planting event. Local residents are paid as maintenance staff, which both creates income and builds long-term stewardship.',
    problem:
      'Plantation drives in Delhi report survival rates as low as 10–20% because sites are abandoned after the planting photo-op. Land is available; maintained land is not.',
    solution:
      'A funded three-year maintenance commitment per site, with paid local maintenance staff and quarterly public survival-rate reporting.',
    whatWeProvide: [
      'Native, climate-appropriate saplings',
      'Three years of funded maintenance',
      'Paid local maintenance roles',
      'Quarterly public survival tracking',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    ],
    beneficiaries: 0,
    fundingTarget: 5600000,
    amountRaised: 2016000,
    donorCount: 470,
    objectives: [
      'Maintain survival rate above 75% at 3 years',
      'Plant 40,000 native saplings across 12 sites',
      'Create 60 paid local maintenance roles',
    ],
    impactStats: [
      { label: 'Saplings planted', value: '24,600' },
      { label: '3-year survival rate', value: '78%' },
      { label: 'Sites active', value: '9' },
    ],
    timeline: [
      { year: '2023', title: 'First site planted', description: 'Yamuna floodplain pilot site, 3,000 saplings.' },
      { year: '2024', title: 'Survival tracking published', description: 'First public quarterly survival report released.' },
      { year: '2025', title: '9 sites, 24,600 saplings', description: 'Expanded to municipal wasteland sites.' },
    ],
    relatedDriveIds: [],
    testimonialIds: [],
    seo: {
      title: 'Greenline Urban Afforestation — Sahayog Foundation',
      description: 'Community-maintained native afforestation with a three-year survival commitment.',
    },
  },
]

export const drives = [
  {
    id: 'd1',
    name: 'Winter Reading Kit Distribution',
    projectId: 'p1',
    date: '2025-12-14',
    location: 'Govindpuri, New Delhi',
    description: 'Distributed take-home reading kits to 340 children ahead of the winter break to prevent learning loss.',
    beneficiaries: 340,
    volunteers: 22,
    status: 'Completed',
    published: true,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd2',
    name: 'Night Round — Nizamuddin & ITO',
    projectId: 'p2',
    date: '2026-01-08',
    location: 'Nizamuddin & ITO, New Delhi',
    description: 'Blanket and hot meal distribution covering 14 locations in a single night round.',
    beneficiaries: 260,
    volunteers: 18,
    status: 'Completed',
    published: true,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd3',
    name: 'Mobile Clinic — Sangam Vihar Circuit',
    projectId: 'p3',
    date: '2026-02-02',
    location: 'Sangam Vihar, New Delhi',
    description: 'Weekly clinic day serving four blocks; included a free eye-screening camp.',
    beneficiaries: 410,
    volunteers: 9,
    status: 'Completed',
    published: true,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd4',
    name: 'Termly Assessment Day',
    projectId: 'p1',
    date: '2026-03-20',
    location: 'All 6 centres, New Delhi',
    description: 'Independent reading assessments conducted across all six First Bench centres.',
    beneficiaries: 1840,
    volunteers: 14,
    status: 'Scheduled',
    published: true,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd5',
    name: 'Home Repair Grant Disbursal — Phase 3',
    projectId: 'p5',
    date: '2025-05-11',
    location: 'Madhubani district, Bihar',
    description: 'Final phase of home-repair grants disbursed to 70 remaining flood-affected families.',
    beneficiaries: 70,
    volunteers: 11,
    status: 'Completed',
    published: true,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1200&auto=format&fit=crop',
  },
]

export const stories = [
  {
    id: 's1',
    slug: 'meena-first-reading',
    title: 'The first book Meena finished on her own',
    category: 'Impact Stories',
    excerpt:
      'Meena joined the Govindpuri learning centre reading three words a minute. Eight months on, she finished her first full storybook.',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
    author: 'Priya Nair',
    publishDate: '2026-01-22',
    relatedProjectId: 'p1',
    featured: true,
    tags: ['Education', 'Delhi'],
    content:
      'When Meena first sat down at the First Bench centre in Govindpuri, reading felt like a wall. Eight months of small-group sessions later, she finished her first full storybook aloud to her mother — a moment the family had stopped expecting from a government-school report card alone.',
  },
  {
    id: 's2',
    slug: 'inside-a-winter-night-round',
    title: 'What a winter night round actually looks like',
    category: 'Field Reports',
    excerpt:
      'A field report from one night with the winter relief team, covering four locations between 9pm and 1am.',
    coverImage: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop',
    author: 'Arjun Mehta',
    publishDate: '2026-01-10',
    relatedProjectId: 'p2',
    featured: true,
    tags: ['Winter Relief', 'Field Report'],
    content:
      'The team meets at 8:30pm at the Nizamuddin depot. By 9pm the van is loaded with 80 blankets, two urns of hot khichdi, and a first-aid kit. Over the next four hours we will visit four locations, some of them the same faces from the week before.',
  },
  {
    id: 's3',
    slug: 'from-collective-to-contract',
    title: 'How the Seelampur collective landed its first hotel contract',
    category: 'Impact Stories',
    excerpt: 'Eighteen months after forming, the Seelampur tailoring collective signed its first recurring commercial contract.',
    coverImage: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1200&auto=format&fit=crop',
    author: 'Priya Nair',
    publishDate: '2025-11-30',
    relatedProjectId: 'p4',
    featured: false,
    tags: ['Women Empowerment'],
    content:
      'Eighteen months ago, the Seelampur collective was eleven women sharing four sewing machines. Today they hold a recurring linen contract with a mid-size hotel chain — their first commercial client sourced without our direct involvement.',
  },
  {
    id: 's4',
    slug: 'kosi-floods-one-year-on',
    title: 'One year after the Kosi floods: what rebuilding actually took',
    category: 'Research',
    excerpt: 'A look back at the three-phase flood response in North Bihar, and what the rebuilding phase revealed about relief spending.',
    coverImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1200&auto=format&fit=crop',
    author: 'Dr. Kavita Rao',
    publishDate: '2025-08-14',
    relatedProjectId: 'p5',
    featured: false,
    tags: ['Disaster Relief', 'Research'],
    content:
      'Emergency relief is the visible part of disaster response; rebuilding is the expensive, unglamorous part that determines whether displacement becomes permanent. One year on, we look at what the numbers from our Bihar response actually showed.',
  },
  {
    id: 's5',
    slug: 'volunteer-diary-first-clinic-day',
    title: 'A volunteer\'s diary: my first clinic day',
    category: 'Volunteer Stories',
    excerpt: 'A first-time volunteer\'s account of a Saturday spent with the mobile health clinic team in Sangam Vihar.',
    coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
    author: 'Rohan Bakshi',
    publishDate: '2025-10-02',
    relatedProjectId: 'p3',
    featured: false,
    tags: ['Volunteering', 'Healthcare'],
    content:
      'I signed up expecting to hand out tokens and point people to queues. By 11am I was helping the community health worker record blood pressure readings, and by the end of the day I understood why the same-day-each-week model matters so much.',
  },
]

export const testimonials = [
  {
    id: 't1',
    type: 'Beneficiary',
    name: 'Sunita Devi',
    role: 'Parent, Govindpuri',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    quote:
      'My daughter used to dread the school reading test. This year her teacher asked what changed. It was the after-school centre.',
    relatedProjectId: 'p1',
    featured: true,
  },
  {
    id: 't2',
    type: 'Volunteer',
    name: 'Rohan Bakshi',
    role: 'Night-round volunteer, 2 years',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    quote:
      'What surprised me most was how much of the work is just showing up at the same place, the same night, every week. That consistency is the whole point.',
    relatedProjectId: 'p2',
    featured: true,
  },
  {
    id: 't3',
    type: 'Beneficiary',
    name: 'Iqbal Ahmed',
    role: 'Patient, Sangam Vihar',
    photo: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=400&auto=format&fit=crop',
    quote:
      'Before the mobile clinic, checking my blood pressure meant a half-day trip. Now it takes twenty minutes on a Tuesday.',
    relatedProjectId: 'p3',
    featured: false,
  },
  {
    id: 't4',
    type: 'Beneficiary',
    name: 'Fatima Sheikh',
    role: 'Graduate, Stitch Collective',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
    quote:
      'I knew how to stitch before. What I didn\'t know was how to price a job, or keep accounts. That\'s what actually let me go independent.',
    relatedProjectId: 'p4',
    featured: true,
  },
  {
    id: 't5',
    type: 'Corporate partner',
    name: 'Ananya Kapoor',
    role: 'CSR Lead, Northbridge Textiles',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    quote:
      'What made this an easy renewal was the quarterly reporting. We could see exactly where the funding went, down to the site level.',
    relatedProjectId: null,
    featured: true,
  },
]

export const team = [
  {
    id: 'tm1',
    name: 'Dr. Kavita Rao',
    position: 'Founder & Executive Director',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop',
    bio: 'Founded Sahayog in 2011 after a decade in public health research. Leads programme strategy and partnerships.',
    linkedin: 'https://linkedin.com',
    order: 1,
  },
  {
    id: 'tm2',
    name: 'Arjun Mehta',
    position: 'Director of Programmes',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
    bio: 'Oversees field operations across all programme areas, with a background in disaster response coordination.',
    linkedin: 'https://linkedin.com',
    order: 2,
  },
  {
    id: 'tm3',
    name: 'Priya Nair',
    position: 'Head of Communications',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop',
    bio: 'Leads storytelling, reporting, and donor communications. Previously a field journalist covering development.',
    linkedin: 'https://linkedin.com',
    order: 3,
  },
  {
    id: 'tm4',
    name: 'Iqbal Ahmed',
    position: 'Finance & Compliance Lead',
    photo: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=500&auto=format&fit=crop',
    bio: 'Manages financial reporting, audits, and 80G compliance to keep every rupee traceable.',
    linkedin: 'https://linkedin.com',
    order: 4,
  },
]

export const awards = [
  { id: 'aw1', name: 'Delhi CSR Excellence Award', organization: 'Delhi CSR Forum', year: 2025, description: 'Recognised for the Mobile Health Clinics programme.' },
  { id: 'aw2', name: 'Transparency in Giving Award', organization: 'GiveIndia Alliance', year: 2024, description: 'Awarded for public quarterly financial reporting.' },
  { id: 'aw3', name: 'Best Grassroots Education Initiative', organization: 'EdIndia Foundation', year: 2023, description: 'For the First Bench Learning Centres model.' },
]

export const press = [
  { id: 'pr1', publication: 'The Hindu', headline: 'Inside the after-school centres closing Delhi\'s reading gap', date: '2025-09-12', link: 'https://example.com', coverImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop' },
  { id: 'pr2', publication: 'Hindustan Times', headline: 'How one NGO tracks sapling survival, not just plantation counts', date: '2025-06-03', link: 'https://example.com', coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop' },
  { id: 'pr3', publication: 'Mint', headline: 'The economics of Delhi\'s winter night rounds', date: '2025-01-18', link: 'https://example.com', coverImage: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800&auto=format&fit=crop' },
]

export const partners = [
  { id: 'pt1', name: 'Northbridge Textiles', logo: null, website: 'https://example.com', partnershipType: 'CSR Partner', startYear: 2022 },
  { id: 'pt2', name: 'Delta Health Systems', logo: null, website: 'https://example.com', partnershipType: 'Healthcare Partner', startYear: 2020 },
  { id: 'pt3', name: 'Kiran Foundation', logo: null, website: 'https://example.com', partnershipType: 'Grant Partner', startYear: 2019 },
  { id: 'pt4', name: 'Greenfield Logistics', logo: null, website: 'https://example.com', partnershipType: 'In-kind Partner', startYear: 2023 },
]

export const faqs = [
  { id: 'f1', category: 'Donations', question: 'Is my donation tax-deductible?', answer: 'Yes. Sahayog Foundation is registered under Section 80G, so Indian taxpayers can claim a deduction. You\'ll receive a receipt immediately and can request an 80G certificate from your donor dashboard.' },
  { id: 'f2', category: 'Donations', question: 'Can I donate to a specific project instead of the general fund?', answer: 'Yes — on the donation page you can choose to direct your donation to a specific project, a specific campaign, or the general fund.' },
  { id: 'f3', category: '80G', question: 'How long does the 80G certificate take to arrive?', answer: 'Typically 5–7 working days after your request is verified. You can track the status from My Donations in your dashboard.' },
  { id: 'f4', category: 'Volunteering', question: 'Do I need prior experience to volunteer?', answer: 'No. Most roles need no prior experience — we provide a short orientation before your first shift. Some roles like the mobile health clinic do prefer relevant background.' },
  { id: 'f5', category: 'CSR', question: 'What size of CSR budget do you typically work with?', answer: 'We\'ve structured partnerships from ₹5 lakh pilot programmes to multi-year commitments above ₹1 crore. Reach out through the CSR enquiry form and we\'ll propose a scope that fits your budget.' },
  { id: 'f6', category: 'Payments', question: 'Which payment methods are supported?', answer: 'UPI, credit/debit cards, net banking, and popular wallets, all processed securely through Razorpay.' },
  { id: 'f7', category: 'Refunds', question: 'Can I get a refund on a donation made by mistake?', answer: 'Yes, within 7 days of the transaction. Contact us with your transaction ID and we\'ll process a refund to the original payment method.' },
  { id: 'f8', category: 'Projects', question: 'How do you decide which projects to fund?', answer: 'Every project goes through a needs assessment, a 90-day pilot, and an external review before it becomes a funded programme. We publish this criteria in our annual report.' },
]

export const galleryItems = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop', caption: 'Reading hour at the Govindpuri centre', projectId: 'p1', category: 'Education', year: 2025 },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800&auto=format&fit=crop', caption: 'Night round distribution, ITO', projectId: 'p2', category: 'Winter Relief', year: 2026 },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop', caption: 'Antenatal check-up, mobile clinic', projectId: 'p3', category: 'Healthcare', year: 2026 },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=800&auto=format&fit=crop', caption: 'Stitch collective, Seelampur workspace', projectId: 'p4', category: 'Women Empowerment', year: 2025 },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=800&auto=format&fit=crop', caption: 'Relief distribution, Madhubani', projectId: 'p5', category: 'Disaster Relief', year: 2024 },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop', caption: 'Sapling planting, Yamuna floodplain', projectId: 'p6', category: 'Environment', year: 2025 },
  { id: 'g7', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop', caption: 'Peer reading group', projectId: 'p1', category: 'Education', year: 2025 },
  { id: 'g8', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop', caption: 'Finishing an order, Welcome colony', projectId: 'p4', category: 'Women Empowerment', year: 2026 },
]

export const campaigns = [
  {
    id: 'c1',
    title: 'Winter Relief Emergency Fund 2026',
    slug: 'winter-relief-2026',
    description: 'Cold waves are arriving earlier this year. Help us reach 8,000 people sleeping without shelter before temperatures drop further.',
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1200&auto=format&fit=crop',
    fundingTarget: 6000000,
    amountRaised: 3960000,
    donorCount: 1420,
    active: true,
    endDate: '2026-02-28',
  },
]
