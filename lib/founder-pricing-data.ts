// =============================================================================
// Founder & Consulting Pricing Data Configuration
// Edit this file to update founder credentials, bio, expertise, or pricing tiers
// without touching page layout code.
// =============================================================================

export interface AreaOfExpertise {
  id: string;
  title: string;
  description: string;
  iconName: "Receipt" | "ShieldCheck" | "TrendingUp" | "BarChart3" | "Coins" | "FileSpreadsheet" | "Rocket";
}

export interface PricingTier {
  id: string;
  tierNumber: number;
  name: string;
  rangeText: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  summary: string;
  potentialServices: string[];
  isPopular?: boolean;
  badge?: string;
  recommendedFor: string;
}

export const FOUNDER_DATA = {
  name: "Shubham Chowdhary",
  credentials: "ACA, B.Com (Hons)",
  designation: "Chartered Accountant & Founder",
  organization: "Unovia Consulting",
  location: "Kolkata, West Bengal, India",
  headline: "Financial Clarity. Smarter Decisions. Better Outcomes.",
  introduction: [
    "Shubham Chowdhary is a Chartered Accountant and the founder of Unovia Consulting. He works across finance, taxation, wealth management and business financial operations, helping individuals and businesses make informed financial decisions.",
    "His professional focus includes tax compliance, financial planning, investment-related analysis, treasury management, business finance and financial reporting.",
    "Through Unovia Consulting, he aims to make structured financial guidance and practical consulting accessible to individuals, professionals, entrepreneurs and growing businesses.",
  ],
  verifiedNote:
    "Verified professional profile. Advisory engagements are personally managed or supervised by qualified Chartered Accountants with strict adherence to confidentiality and professional integrity.",
  areasOfExpertise: [
    {
      id: "income-tax",
      title: "Income Tax Planning and Compliance",
      description:
        "Proactive tax structuring, annual return filings, advisory on deductions, capital gains, and direct tax compliance for salaried professionals, HNIs, and corporations.",
      iconName: "Receipt",
    },
    {
      id: "gst-advisory",
      title: "GST Advisory and Compliance",
      description:
        "End-to-end GST registrations, periodic return filings, input tax credit (ITC) reconciliation, compliance health-checks, and notice handling.",
      iconName: "ShieldCheck",
    },
    {
      id: "financial-planning",
      title: "Financial Planning and Investment Analysis",
      description:
        "Disciplined financial roadmaps, asset allocation strategies, cash runway assessments, and objective investment portfolio analysis tailored to personal or business goals.",
      iconName: "TrendingUp",
    },
    {
      id: "business-finance",
      title: "Business Finance and Financial Modelling",
      description:
        "Robust 3-statement financial models, dynamic revenue projections, unit economics breakdown, pricing strategies, and sensitivity analyses for decision-makers.",
      iconName: "BarChart3",
    },
    {
      id: "treasury-management",
      title: "Treasury Management and Fund Planning",
      description:
        "Working capital cycle enhancement, surplus liquidity deployment strategies, banking facility evaluations, and structured cash-flow governance.",
      iconName: "Coins",
    },
    {
      id: "accounting-mis",
      title: "Accounting, MIS and Financial Reporting",
      description:
        "Design and review of management information systems (MIS), executive KPI dashboards, accounting clean-ups, and structured financial reporting frameworks.",
      iconName: "FileSpreadsheet",
    },
    {
      id: "startup-advisory",
      title: "Startup Finance and Business Advisory",
      description:
        "Early-stage capital structure planning, burn-rate monitoring, pitch-deck financial readiness, cap-table sanity checks, and scalable financial operations.",
      iconName: "Rocket",
    },
  ] as AreaOfExpertise[],
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "tier-1",
    tierNumber: 1,
    name: "Tier 1: Essential Services",
    rangeText: "₹1,000 to ₹5,000",
    minPrice: 1000,
    maxPrice: 5000,
    currency: "INR",
    summary:
      "Targeted advisory sessions and preliminary document evaluations for individuals and early-stage entrepreneurs.",
    potentialServices: [
      "Basic tax consultation & query resolution",
      "Initial GST consultation & applicability review",
      "Basic financial statement review",
      "Personal financial documentation assistance",
      "Preliminary business finance consultation",
    ],
    recommendedFor: "Individuals & small business owners seeking quick, expert clarity on specific queries.",
  },
  {
    id: "tier-2",
    tierNumber: 2,
    name: "Tier 2: Professional Services",
    rangeText: "₹5,001 to ₹15,000",
    minPrice: 5001,
    maxPrice: 15000,
    currency: "INR",
    summary:
      "Comprehensive compliance review, formal return filing support, and structured personal financial planning.",
    potentialServices: [
      "Income tax planning and return-related assistance",
      "GST compliance review & input credit audit",
      "Accounting and bookkeeping review",
      "Financial reporting and MIS assistance",
      "Personal financial planning consultation",
    ],
    recommendedFor: "Professionals, consultants, and growing proprietary firms requiring structured compliance.",
  },
  {
    id: "tier-3",
    tierNumber: 3,
    name: "Tier 3: Advanced Consulting",
    rangeText: "₹15,001 to ₹35,000",
    minPrice: 15001,
    maxPrice: 35000,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    summary:
      "In-depth financial modelling, cash-flow diagnostics, working capital optimization, and startup planning.",
    potentialServices: [
      "Financial modelling and operational budgeting",
      "Cash flow and working capital analysis",
      "Business performance and profitability review",
      "Treasury and fund allocation analysis",
      "Startup financial planning & unit economics",
    ],
    recommendedFor: "Funded startups, growing SMEs, and enterprises optimizing profitability and cash flow.",
  },
  {
    id: "tier-4",
    tierNumber: 4,
    name: "Tier 4: Business Advisory",
    rangeText: "₹35,001 to ₹60,000",
    minPrice: 35001,
    maxPrice: 60000,
    currency: "INR",
    summary:
      "Deep financial architecture, management reporting frameworks, projections, and funding preparation.",
    potentialServices: [
      "Detailed financial analysis & diagnostics",
      "Business financial process review & internal controls",
      "Management reporting framework (MIS overhaul)",
      "Financial projections and multi-scenario analysis",
      "Business finance and funding preparation support",
    ],
    recommendedFor: "Scale-ups and established companies seeking institutional-grade financial readiness.",
  },
  {
    id: "tier-5",
    tierNumber: 5,
    name: "Tier 5: Strategic Consulting",
    rangeText: "₹60,001 to ₹1,00,000",
    minPrice: 60001,
    maxPrice: 100000,
    currency: "INR",
    summary:
      "High-impact financial transformation, advanced enterprise modelling, liquidity strategy, and systems implementation.",
    potentialServices: [
      "Comprehensive financial planning projects",
      "Advanced business financial modelling & valuation models",
      "Treasury and liquidity strategy",
      "Financial systems and MIS implementation planning",
      "Customised finance transformation and advisory engagements",
    ],
    recommendedFor: "Corporates, family offices, and complex organizations requiring executive financial leadership.",
  },
];

export const PRICING_DISCLAIMERS = [
  {
    title: "Indicative Pricing",
    text: "All displayed prices are in Indian Rupees (₹) and serve as indicative starting estimates. They do not imply that every service within a tier is included at the displayed minimum price.",
  },
  {
    title: "Scope & Complexity",
    text: "The final commercial quote depends entirely on engagement scope, volume of records, assignment complexity, specific deliverables, and duration.",
  },
  {
    title: "Statutory Taxes",
    text: "Applicable Goods and Services Tax (GST) will be charged additionally as per prevailing Government of India rates.",
  },
  {
    title: "Professional Standards",
    text: "In accordance with professional ICAI ethics, Unovia Consulting does not promise speculative investment returns or guaranteed tax savings.",
  },
];

export const ENQUIRY_SERVICES = [
  "Income Tax Planning & Compliance",
  "GST Advisory & Compliance",
  "Financial Planning & Investment Analysis",
  "Business Finance & Financial Modelling",
  "Treasury Management & Fund Planning",
  "Accounting, MIS & Financial Reporting",
  "Startup Finance & Business Advisory",
  "Custom Financial Advisory Project",
] as const;

export const BUDGET_TIER_OPTIONS = [
  { label: "₹1,000 – ₹5,000 (Tier 1: Essential)", value: "₹1,000–₹5,000", tierId: "tier-1" },
  { label: "₹5,001 – ₹15,000 (Tier 2: Professional)", value: "₹5,001–₹15,000", tierId: "tier-2" },
  { label: "₹15,001 – ₹35,000 (Tier 3: Advanced)", value: "₹15,001–₹35,000", tierId: "tier-3" },
  { label: "₹35,001 – ₹60,000 (Tier 4: Business Advisory)", value: "₹35,001–₹60,000", tierId: "tier-4" },
  { label: "₹60,001 – ₹1,00,000 (Tier 5: Strategic)", value: "₹60,001–₹1,00,000", tierId: "tier-5" },
  { label: "Custom / Discuss Scope", value: "Custom", tierId: "custom" },
] as const;
