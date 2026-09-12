// =============================================================================
// DSC Store — Product Catalog (Source: Attached DSC Price List PDF)
// =============================================================================
// All prices are the published Gross Rates from the PDF.
// basicAmount + gstAmount = grossAmount
// GST rate: 18%
// =============================================================================

export interface DSCProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  certificateType: string;
  validityYears: number;
  basicAmount: number;
  gstRate: number;
  gstAmount: number;
  grossAmount: number;
  shortDescription: string;
  description: string;
  features: string[];
  useCases: string[];
  documentsRequired: string[];
  whoShouldUse: string;
  faq: { q: string; a: string }[];
  active: boolean;
  displayOrder: number;
  filterType: string; // for UI filtering: signing | encryption | combo | dgft | foreign | document-signer
}

// Helper: round to 2 decimals
const r = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Common data fragments
// ---------------------------------------------------------------------------

const CLASS3_FEATURES = [
  "CCA (Controller of Certifying Authorities) approved",
  "Legally valid under Information Technology Act, 2000",
  "Paperless Aadhaar-based video verification (eKYC)",
  "Compatible with MCA, Income Tax, GST & e-Tendering portals",
  "Free installation assistance via remote support",
];

const FOREIGN_FEATURES = [
  "CCA approved for foreign nationals & NRIs",
  "Passport and Apostille verification supported",
  "Compatible with Indian MCA/ROC filings (Form V3, DIR-3)",
  "Remote issuance — no India visit required",
  "Free installation and setup assistance",
];

const DOC_SIGNER_FEATURES = [
  "CCA approved Document Signer certificate",
  "Used for bulk/automated document signing by organizations",
  "Compatible with custom document signing systems",
  "Server-based signing capability",
  "Free installation and integration support",
];

const INDIVIDUAL_DOCS = [
  "PAN Card",
  "Aadhaar Card (for eKYC verification)",
  "Mobile number linked to Aadhaar",
  "Email address",
  "Passport-size photograph (for video verification)",
];

const ORG_DOCS = [
  "PAN Card of the organization",
  "Certificate of Incorporation / GST Certificate",
  "Board Resolution or Authorization Letter",
  "PAN & Aadhaar of the Authorized Signatory",
  "Email address",
];

const FOREIGN_DOCS = [
  "Valid Passport",
  "Apostille or Notarized documents",
  "Foreign address proof",
  "Email address",
  "Video verification via webcam",
];

const GENERAL_FAQ: { q: string; a: string }[] = [
  {
    q: "Is GST included in the price?",
    a: "Yes, all prices displayed are inclusive of 18% GST.",
  },
  {
    q: "Is the USB crypto token included?",
    a: "No, the USB crypto token is an optional add-on available for ₹500. You can add it during checkout if you need a new token.",
  },
  {
    q: "How long does DSC issuance take?",
    a: "After successful verification and payment, the DSC is typically issued within 1-2 business days.",
  },
  {
    q: "Can I renew my existing DSC?",
    a: "Yes, you can purchase a new DSC of the same type and validity to replace your expiring certificate.",
  },
];

// ---------------------------------------------------------------------------
// Product catalog — 27 products from the PDF
// ---------------------------------------------------------------------------

export const DSC_PRODUCTS: DSCProduct[] = [
  // ===================== CLASS 3 SIGNING =====================
  {
    id: "c3s-1y",
    slug: "class-3-signing-1-year",
    name: "Class 3 Signing – 1 Year",
    category: "class3-signing",
    certificateType: "Signing",
    validityYears: 1,
    basicAmount: r(850 / 1.18),
    gstRate: 0.18,
    gstAmount: r(850 - 850 / 1.18),
    grossAmount: 850,
    shortDescription: "Class 3 Digital Signature Certificate for document signing, valid for 1 year.",
    description:
      "A Class 3 Signing DSC is used to digitally sign documents, forms and filings on government portals such as MCA, Income Tax, GST and e-Tendering platforms. This certificate establishes the identity of the signer and provides legal validity to electronically signed documents under the IT Act, 2000.",
    features: CLASS3_FEATURES,
    useCases: [
      "MCA/ROC filings (DIR-3, DIN, Spice+, Annual Returns)",
      "Income Tax Return (ITR) e-filing",
      "GST Registration & Return Filing",
      "e-Tendering and Government procurement portals (GeM, CPPP)",
      "Trademark and Patent e-filing",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Individuals, Directors, Chartered Accountants, Company Secretaries, Tax Professionals, and anyone required to digitally sign documents on Indian government portals.",
    faq: [
      { q: "What is a Class 3 Signing DSC?", a: "A Class 3 Signing DSC is the highest level of digital certificate used solely for signing documents. It verifies the identity of the holder and provides legal validity to digitally signed documents." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 1,
    filterType: "signing",
  },
  {
    id: "c3s-2y",
    slug: "class-3-signing-2-year",
    name: "Class 3 Signing – 2 Years",
    category: "class3-signing",
    certificateType: "Signing",
    validityYears: 2,
    basicAmount: r(990 / 1.18),
    gstRate: 0.18,
    gstAmount: r(990 - 990 / 1.18),
    grossAmount: 990,
    shortDescription: "Class 3 Digital Signature Certificate for document signing, valid for 2 years.",
    description:
      "A Class 3 Signing DSC valid for 2 years, providing longer validity for professionals and businesses who need uninterrupted digital signing capability. Ideal for directors, CAs, and consultants who file regularly on government portals.",
    features: CLASS3_FEATURES,
    useCases: [
      "MCA/ROC filings (DIR-3, DIN, Spice+, Annual Returns)",
      "Income Tax Return (ITR) e-filing",
      "GST Registration & Return Filing",
      "e-Tendering and Government procurement portals (GeM, CPPP)",
      "Trademark and Patent e-filing",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Individuals, Directors, Chartered Accountants, Company Secretaries, Tax Professionals, and anyone requiring digital signing for 2 years.",
    faq: [
      { q: "Why choose a 2-year validity?", a: "A 2-year DSC saves you the hassle and cost of annual renewal. It is ideal for professionals who file regularly and want uninterrupted access." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 2,
    filterType: "signing",
  },
  {
    id: "c3s-3y",
    slug: "class-3-signing-3-year",
    name: "Class 3 Signing – 3 Years",
    category: "class3-signing",
    certificateType: "Signing",
    validityYears: 3,
    basicAmount: r(1500 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1500 - 1500 / 1.18),
    grossAmount: 1500,
    shortDescription: "Class 3 Digital Signature Certificate for document signing, valid for 3 years.",
    description:
      "A Class 3 Signing DSC with 3-year validity — the best value option for long-term use. Eliminates the need for frequent renewals and ensures continuous compliance for businesses and professionals.",
    features: CLASS3_FEATURES,
    useCases: [
      "MCA/ROC filings (DIR-3, DIN, Spice+, Annual Returns)",
      "Income Tax Return (ITR) e-filing",
      "GST Registration & Return Filing",
      "e-Tendering and Government procurement portals (GeM, CPPP)",
      "Trademark and Patent e-filing",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Professionals and businesses seeking long-term digital signing capability without annual renewal hassle.",
    faq: [
      { q: "Is a 3-year DSC the best value?", a: "Yes, a 3-year DSC offers the lowest per-year cost and eliminates the need for annual renewals, making it the most cost-effective option for regular users." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 3,
    filterType: "signing",
  },

  // ===================== CLASS 3 ENCRYPTION =====================
  {
    id: "c3e-1y",
    slug: "class-3-encryption-1-year",
    name: "Class 3 Encryption – 1 Year",
    category: "class3-encryption",
    certificateType: "Encryption",
    validityYears: 1,
    basicAmount: r(850 / 1.18),
    gstRate: 0.18,
    gstAmount: r(850 - 850 / 1.18),
    grossAmount: 850,
    shortDescription: "Class 3 Encryption certificate for encrypting sensitive documents, valid for 1 year.",
    description:
      "A Class 3 Encryption DSC is used to encrypt documents and data to ensure confidentiality during electronic transmission. Required on certain e-Tendering portals (GeM, CPPP) where bid documents must be submitted in encrypted format.",
    features: CLASS3_FEATURES,
    useCases: [
      "e-Tendering bid submission (encrypted bids on GeM, CPPP, Railways)",
      "Secure document transmission",
      "Encrypted email communication",
      "Government portal submissions requiring encryption",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Businesses and individuals who participate in e-Tendering or need to encrypt sensitive documents for government submissions.",
    faq: [
      { q: "What is the difference between Signing and Encryption DSC?", a: "A Signing DSC is used to digitally sign documents (proving identity), while an Encryption DSC is used to encrypt documents (ensuring confidentiality). Some portals require both." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 4,
    filterType: "encryption",
  },
  {
    id: "c3e-2y",
    slug: "class-3-encryption-2-year",
    name: "Class 3 Encryption – 2 Years",
    category: "class3-encryption",
    certificateType: "Encryption",
    validityYears: 2,
    basicAmount: r(990 / 1.18),
    gstRate: 0.18,
    gstAmount: r(990 - 990 / 1.18),
    grossAmount: 990,
    shortDescription: "Class 3 Encryption certificate for encrypting sensitive documents, valid for 2 years.",
    description:
      "A Class 3 Encryption DSC with 2-year validity for businesses that regularly participate in e-Tendering and need sustained encryption capability for bid submissions and secure communications.",
    features: CLASS3_FEATURES,
    useCases: [
      "e-Tendering bid submission (encrypted bids on GeM, CPPP, Railways)",
      "Secure document transmission",
      "Encrypted email communication",
      "Government portal submissions requiring encryption",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Regular e-Tendering participants and businesses needing ongoing encryption for 2 years.",
    faq: [
      { q: "Do I need an Encryption DSC for e-Tendering?", a: "Many e-Tendering portals like GeM and CPPP require both Signing and Encryption certificates. If you participate in tenders, consider a Combo DSC which includes both." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 5,
    filterType: "encryption",
  },
  {
    id: "c3e-3y",
    slug: "class-3-encryption-3-year",
    name: "Class 3 Encryption – 3 Years",
    category: "class3-encryption",
    certificateType: "Encryption",
    validityYears: 3,
    basicAmount: r(1500 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1500 - 1500 / 1.18),
    grossAmount: 1500,
    shortDescription: "Class 3 Encryption certificate for encrypting sensitive documents, valid for 3 years.",
    description:
      "A Class 3 Encryption DSC with 3-year validity — best value for organizations with long-term e-Tendering and document security requirements.",
    features: CLASS3_FEATURES,
    useCases: [
      "e-Tendering bid submission (encrypted bids on GeM, CPPP, Railways)",
      "Secure document transmission",
      "Encrypted email communication",
      "Government portal submissions requiring encryption",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Organizations with sustained e-Tendering requirements seeking long-term encryption capability.",
    faq: [
      { q: "Can I use an Encryption DSC for signing documents?", a: "No, an Encryption DSC can only encrypt documents. For signing, you need a Signing DSC or a Combo DSC which includes both capabilities." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 6,
    filterType: "encryption",
  },

  // ===================== CLASS 3 COMBO =====================
  {
    id: "c3c-1y",
    slug: "class-3-combo-1-year",
    name: "Class 3 Combo – 1 Year",
    category: "class3-combo",
    certificateType: "Combo",
    validityYears: 1,
    basicAmount: r(1700 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1700 - 1700 / 1.18),
    grossAmount: 1700,
    shortDescription: "Class 3 Combo (Signing + Encryption) certificate, valid for 1 year.",
    description:
      "A Class 3 Combo DSC combines both Signing and Encryption certificates into a single package. This is the recommended option for users who need complete digital signature capability — covering document signing on MCA, Tax, GST portals as well as encrypted bid submissions on e-Tendering platforms.",
    features: [
      ...CLASS3_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "MCA/ROC filings requiring both signing and encryption",
      "e-Tendering with encrypted bid submission (GeM, CPPP)",
      "Income Tax and GST filing",
      "Complete compliance for Directors and Company Secretaries",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Directors, professionals and businesses that need both signing and encryption capability. Recommended for e-Tendering participants and those seeking complete DSC compliance.",
    faq: [
      { q: "What is a Combo DSC?", a: "A Combo DSC includes both a Signing certificate and an Encryption certificate on a single USB token. It provides complete digital signature capability for all government portals." },
      { q: "Is a Combo DSC cheaper than buying Signing and Encryption separately?", a: "Yes, a Combo DSC is typically the same price as buying Signing and Encryption separately, but more convenient as both certificates are on one token." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 7,
    filterType: "combo",
  },
  {
    id: "c3c-2y",
    slug: "class-3-combo-2-year",
    name: "Class 3 Combo – 2 Years",
    category: "class3-combo",
    certificateType: "Combo",
    validityYears: 2,
    basicAmount: r(1980 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1980 - 1980 / 1.18),
    grossAmount: 1980,
    shortDescription: "Class 3 Combo (Signing + Encryption) certificate, valid for 2 years.",
    description:
      "A Class 3 Combo DSC with 2-year validity — the most popular choice for professionals and businesses. Provides uninterrupted signing and encryption capability for two full years.",
    features: [
      ...CLASS3_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "MCA/ROC filings requiring both signing and encryption",
      "e-Tendering with encrypted bid submission (GeM, CPPP)",
      "Income Tax and GST filing",
      "Complete compliance for Directors and Company Secretaries",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "The most popular option for Directors, CAs, and businesses that need complete DSC capability for 2 years.",
    faq: [
      { q: "Why is the 2-year Combo DSC the most popular?", a: "The 2-year Combo offers the best balance of convenience, coverage and value. It includes both Signing and Encryption with enough validity to avoid frequent renewals." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 8,
    filterType: "combo",
  },
  {
    id: "c3c-3y",
    slug: "class-3-combo-3-year",
    name: "Class 3 Combo – 3 Years",
    category: "class3-combo",
    certificateType: "Combo",
    validityYears: 3,
    basicAmount: r(3000 / 1.18),
    gstRate: 0.18,
    gstAmount: r(3000 - 3000 / 1.18),
    grossAmount: 3000,
    shortDescription: "Class 3 Combo (Signing + Encryption) certificate, valid for 3 years.",
    description:
      "A Class 3 Combo DSC with 3-year validity — the best long-term value. Ideal for established businesses, firms and professionals who want hassle-free, uninterrupted digital signature and encryption capability.",
    features: [
      ...CLASS3_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "MCA/ROC filings requiring both signing and encryption",
      "e-Tendering with encrypted bid submission (GeM, CPPP)",
      "Income Tax and GST filing",
      "Long-term compliance for Directors and Company Secretaries",
    ],
    documentsRequired: INDIVIDUAL_DOCS,
    whoShouldUse: "Businesses and professionals seeking the best long-term value with complete DSC capability for 3 years.",
    faq: [
      { q: "Can I upgrade from a Signing DSC to a Combo DSC later?", a: "You would need to purchase a new Combo DSC. It is generally more cost-effective to purchase a Combo DSC upfront if you anticipate needing encryption." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 9,
    filterType: "combo",
  },

  // ===================== DGFT =====================
  {
    id: "dgft-1y",
    slug: "dgft-1-year",
    name: "DGFT – 1 Year",
    category: "dgft",
    certificateType: "DGFT",
    validityYears: 1,
    basicAmount: r(1700 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1700 - 1700 / 1.18),
    grossAmount: 1700,
    shortDescription: "DGFT Digital Signature Certificate for import-export operations, valid for 1 year.",
    description:
      "A DGFT DSC is specifically designed for importers, exporters and customs brokers who operate on the DGFT (Directorate General of Foreign Trade) portal and ICEGATE. It enables electronic filing of import-export documentation, IEC applications, license renewals and customs declarations.",
    features: [
      "CCA approved for DGFT/ICEGATE portal use",
      "Legally valid under IT Act, 2000",
      "Compatible with DGFT portal, ICEGATE and Customs",
      "IEC (Import Export Code) linking supported",
      "Paperless Aadhaar-based video verification",
      "Free installation and setup assistance",
    ],
    useCases: [
      "DGFT portal operations and license applications",
      "ICEGATE customs declarations (Bill of Entry, Shipping Bill)",
      "Import Export Code (IEC) applications and modifications",
      "Foreign Trade Policy scheme applications (MEIS, SEIS, RoDTEP)",
      "Customs duty refund claims",
    ],
    documentsRequired: [...INDIVIDUAL_DOCS, "IEC (Import Export Code) certificate"],
    whoShouldUse: "Importers, Exporters, Customs Brokers, Customs House Agents (CHAs), and businesses engaged in international trade.",
    faq: [
      { q: "What is a DGFT DSC?", a: "A DGFT DSC is a Digital Signature Certificate configured for use on the DGFT (Directorate General of Foreign Trade) portal and ICEGATE for import-export related filings and declarations." },
      { q: "Can I use a regular Class 3 DSC for DGFT?", a: "DGFT operations may require a DSC that is specifically registered/linked with the DGFT portal. It is recommended to use a DGFT-specific DSC for seamless compatibility." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 10,
    filterType: "dgft",
  },
  {
    id: "dgft-2y",
    slug: "dgft-2-year",
    name: "DGFT – 2 Years",
    category: "dgft",
    certificateType: "DGFT",
    validityYears: 2,
    basicAmount: r(1980 / 1.18),
    gstRate: 0.18,
    gstAmount: r(1980 - 1980 / 1.18),
    grossAmount: 1980,
    shortDescription: "DGFT Digital Signature Certificate for import-export operations, valid for 2 years.",
    description:
      "A DGFT DSC with 2-year validity for regular importers and exporters who need sustained access to DGFT and ICEGATE portals for customs and trade operations.",
    features: [
      "CCA approved for DGFT/ICEGATE portal use",
      "Legally valid under IT Act, 2000",
      "Compatible with DGFT portal, ICEGATE and Customs",
      "IEC (Import Export Code) linking supported",
      "Paperless Aadhaar-based video verification",
      "Free installation and setup assistance",
    ],
    useCases: [
      "DGFT portal operations and license applications",
      "ICEGATE customs declarations",
      "IEC applications and modifications",
      "Foreign Trade Policy scheme applications",
      "Customs duty refund claims",
    ],
    documentsRequired: [...INDIVIDUAL_DOCS, "IEC (Import Export Code) certificate"],
    whoShouldUse: "Regular importers, exporters and customs professionals seeking 2-year DGFT portal access.",
    faq: [
      { q: "Why choose a 2-year DGFT DSC?", a: "A 2-year DGFT DSC provides uninterrupted access to DGFT and ICEGATE portals without annual renewal, making it ideal for businesses with regular import-export operations." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 11,
    filterType: "dgft",
  },
  {
    id: "dgft-3y",
    slug: "dgft-3-year",
    name: "DGFT – 3 Years",
    category: "dgft",
    certificateType: "DGFT",
    validityYears: 3,
    basicAmount: r(3000 / 1.18),
    gstRate: 0.18,
    gstAmount: r(3000 - 3000 / 1.18),
    grossAmount: 3000,
    shortDescription: "DGFT Digital Signature Certificate for import-export operations, valid for 3 years.",
    description:
      "A DGFT DSC with 3-year validity — the best long-term value for established importers, exporters and customs brokers with ongoing DGFT and ICEGATE operations.",
    features: [
      "CCA approved for DGFT/ICEGATE portal use",
      "Legally valid under IT Act, 2000",
      "Compatible with DGFT portal, ICEGATE and Customs",
      "IEC (Import Export Code) linking supported",
      "Paperless Aadhaar-based video verification",
      "Free installation and setup assistance",
    ],
    useCases: [
      "DGFT portal operations and license applications",
      "ICEGATE customs declarations",
      "IEC applications and modifications",
      "Foreign Trade Policy scheme applications",
      "Customs duty refund claims",
    ],
    documentsRequired: [...INDIVIDUAL_DOCS, "IEC (Import Export Code) certificate"],
    whoShouldUse: "Established trade businesses seeking maximum value with 3-year DGFT portal access.",
    faq: [
      { q: "Is a 3-year DGFT DSC the best value?", a: "Yes, for businesses with regular import-export operations, the 3-year DGFT DSC offers the lowest per-year cost and eliminates renewal hassle." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 12,
    filterType: "dgft",
  },

  // ===================== FOREIGN CLASS 3 SIGNING =====================
  {
    id: "fc3s-1y",
    slug: "foreign-class-3-signing-1-year",
    name: "Foreign Class 3 Signing – 1 Year",
    category: "foreign-signing",
    certificateType: "Foreign Signing",
    validityYears: 1,
    basicAmount: r(3540 / 1.18),
    gstRate: 0.18,
    gstAmount: r(3540 - 3540 / 1.18),
    grossAmount: 3540,
    shortDescription: "Class 3 Signing DSC for foreign nationals and NRIs, valid for 1 year.",
    description:
      "A Class 3 Signing DSC issued to foreign nationals, NRIs and overseas directors who need to digitally sign documents for Indian company filings. Supports passport-based identity verification without requiring an Indian Aadhaar card.",
    features: FOREIGN_FEATURES,
    useCases: [
      "MCA/ROC filings as a foreign director (Form V3, DIR-3)",
      "DIN (Director Identification Number) application",
      "Company incorporation as a foreign stakeholder",
      "Income Tax and compliance filings in India",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals, NRIs, and overseas directors of Indian companies who need to sign documents for Indian regulatory compliance.",
    faq: [
      { q: "Can a foreign national get a DSC in India?", a: "Yes, foreign nationals and NRIs can obtain a Class 3 DSC using passport-based verification. No Indian Aadhaar card is required." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 13,
    filterType: "foreign",
  },
  {
    id: "fc3s-2y",
    slug: "foreign-class-3-signing-2-year",
    name: "Foreign Class 3 Signing – 2 Years",
    category: "foreign-signing",
    certificateType: "Foreign Signing",
    validityYears: 2,
    basicAmount: r(4130 / 1.18),
    gstRate: 0.18,
    gstAmount: r(4130 - 4130 / 1.18),
    grossAmount: 4130,
    shortDescription: "Class 3 Signing DSC for foreign nationals and NRIs, valid for 2 years.",
    description:
      "A 2-year Class 3 Signing DSC for foreign nationals, NRIs and overseas directors requiring sustained digital signing capability for Indian company operations.",
    features: FOREIGN_FEATURES,
    useCases: [
      "MCA/ROC filings as a foreign director",
      "DIN application and annual compliance",
      "Company incorporation and management",
      "Indian regulatory filings",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs with ongoing Indian company directorship requiring 2-year signing capability.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 14,
    filterType: "foreign",
  },
  {
    id: "fc3s-3y",
    slug: "foreign-class-3-signing-3-year",
    name: "Foreign Class 3 Signing – 3 Years",
    category: "foreign-signing",
    certificateType: "Foreign Signing",
    validityYears: 3,
    basicAmount: r(6195 / 1.18),
    gstRate: 0.18,
    gstAmount: r(6195 - 6195 / 1.18),
    grossAmount: 6195,
    shortDescription: "Class 3 Signing DSC for foreign nationals and NRIs, valid for 3 years.",
    description:
      "A 3-year Class 3 Signing DSC for foreign nationals and NRIs — the best long-term value for overseas directors with sustained Indian company compliance requirements.",
    features: FOREIGN_FEATURES,
    useCases: [
      "MCA/ROC filings as a foreign director",
      "Long-term DIN compliance",
      "Company management and annual filings",
      "Indian regulatory compliance",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs seeking the best value for long-term Indian company directorship.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 15,
    filterType: "foreign",
  },

  // ===================== FOREIGN CLASS 3 ENCRYPTION =====================
  {
    id: "fc3e-1y",
    slug: "foreign-class-3-encryption-1-year",
    name: "Foreign Class 3 Encryption – 1 Year",
    category: "foreign-encryption",
    certificateType: "Foreign Encryption",
    validityYears: 1,
    basicAmount: r(3540 / 1.18),
    gstRate: 0.18,
    gstAmount: r(3540 - 3540 / 1.18),
    grossAmount: 3540,
    shortDescription: "Class 3 Encryption DSC for foreign nationals and NRIs, valid for 1 year.",
    description:
      "A Class 3 Encryption DSC for foreign nationals and NRIs who need to encrypt documents for Indian government portal submissions, particularly e-Tendering.",
    features: FOREIGN_FEATURES,
    useCases: [
      "Encrypted document submission on Indian portals",
      "e-Tendering participation as a foreign entity",
      "Secure communication with Indian government bodies",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs needing encryption capability for Indian portal submissions.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 16,
    filterType: "foreign",
  },
  {
    id: "fc3e-2y",
    slug: "foreign-class-3-encryption-2-year",
    name: "Foreign Class 3 Encryption – 2 Years",
    category: "foreign-encryption",
    certificateType: "Foreign Encryption",
    validityYears: 2,
    basicAmount: r(4130 / 1.18),
    gstRate: 0.18,
    gstAmount: r(4130 - 4130 / 1.18),
    grossAmount: 4130,
    shortDescription: "Class 3 Encryption DSC for foreign nationals and NRIs, valid for 2 years.",
    description:
      "A 2-year Class 3 Encryption DSC for foreign nationals and NRIs with ongoing encryption requirements for Indian portal submissions.",
    features: FOREIGN_FEATURES,
    useCases: [
      "Encrypted document submission on Indian portals",
      "e-Tendering participation as a foreign entity",
      "Secure communication with Indian government bodies",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs with ongoing encryption needs for Indian operations.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 17,
    filterType: "foreign",
  },
  {
    id: "fc3e-3y",
    slug: "foreign-class-3-encryption-3-year",
    name: "Foreign Class 3 Encryption – 3 Years",
    category: "foreign-encryption",
    certificateType: "Foreign Encryption",
    validityYears: 3,
    basicAmount: r(6195 / 1.18),
    gstRate: 0.18,
    gstAmount: r(6195 - 6195 / 1.18),
    grossAmount: 6195,
    shortDescription: "Class 3 Encryption DSC for foreign nationals and NRIs, valid for 3 years.",
    description:
      "A 3-year Class 3 Encryption DSC for foreign nationals and NRIs — best long-term value for overseas entities with sustained Indian encryption requirements.",
    features: FOREIGN_FEATURES,
    useCases: [
      "Encrypted document submission on Indian portals",
      "Long-term e-Tendering participation",
      "Secure communication with Indian government bodies",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs seeking long-term encryption capability for Indian operations.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 18,
    filterType: "foreign",
  },

  // ===================== FOREIGN CLASS 3 COMBO =====================
  {
    id: "fc3c-1y",
    slug: "foreign-class-3-combo-1-year",
    name: "Foreign Class 3 Combo – 1 Year",
    category: "foreign-combo",
    certificateType: "Foreign Combo",
    validityYears: 1,
    basicAmount: r(7080 / 1.18),
    gstRate: 0.18,
    gstAmount: r(7080 - 7080 / 1.18),
    grossAmount: 7080,
    shortDescription: "Class 3 Combo (Signing + Encryption) DSC for foreign nationals and NRIs, valid for 1 year.",
    description:
      "A Foreign Class 3 Combo DSC includes both Signing and Encryption certificates for foreign nationals and NRIs. Provides complete digital signature capability for all Indian government portal operations.",
    features: [
      ...FOREIGN_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "Complete MCA/ROC compliance as a foreign director",
      "e-Tendering with encrypted bid submission",
      "All Indian regulatory filings",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs needing complete signing and encryption capability for Indian operations.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 19,
    filterType: "foreign",
  },
  {
    id: "fc3c-2y",
    slug: "foreign-class-3-combo-2-year",
    name: "Foreign Class 3 Combo – 2 Years",
    category: "foreign-combo",
    certificateType: "Foreign Combo",
    validityYears: 2,
    basicAmount: r(8260 / 1.18),
    gstRate: 0.18,
    gstAmount: r(8260 - 8260 / 1.18),
    grossAmount: 8260,
    shortDescription: "Class 3 Combo (Signing + Encryption) DSC for foreign nationals and NRIs, valid for 2 years.",
    description:
      "A 2-year Foreign Class 3 Combo DSC for foreign nationals and NRIs with ongoing Indian company directorship and compliance needs.",
    features: [
      ...FOREIGN_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "Complete MCA/ROC compliance as a foreign director",
      "e-Tendering with encrypted bid submission",
      "All Indian regulatory filings",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs with sustained Indian compliance requirements for 2 years.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 20,
    filterType: "foreign",
  },
  {
    id: "fc3c-3y",
    slug: "foreign-class-3-combo-3-year",
    name: "Foreign Class 3 Combo – 3 Years",
    category: "foreign-combo",
    certificateType: "Foreign Combo",
    validityYears: 3,
    basicAmount: r(12390 / 1.18),
    gstRate: 0.18,
    gstAmount: r(12390 - 12390 / 1.18),
    grossAmount: 12390,
    shortDescription: "Class 3 Combo (Signing + Encryption) DSC for foreign nationals and NRIs, valid for 3 years.",
    description:
      "A 3-year Foreign Class 3 Combo DSC — the best long-term value for foreign directors and NRIs with sustained Indian operations and compliance needs.",
    features: [
      ...FOREIGN_FEATURES,
      "Includes both Signing and Encryption certificates",
      "Single token stores both certificates",
    ],
    useCases: [
      "Long-term MCA/ROC compliance as a foreign director",
      "e-Tendering with encrypted bid submission",
      "All Indian regulatory filings",
    ],
    documentsRequired: FOREIGN_DOCS,
    whoShouldUse: "Foreign nationals and NRIs seeking maximum long-term value for Indian operations.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 21,
    filterType: "foreign",
  },

  // ===================== DOCUMENT SIGNER CLASS 2 =====================
  {
    id: "ds2-1y",
    slug: "document-signer-class-2-1-year",
    name: "Document Signer Class 2 – 1 Year",
    category: "doc-signer-class2",
    certificateType: "Document Signer",
    validityYears: 1,
    basicAmount: r(8260 / 1.18),
    gstRate: 0.18,
    gstAmount: r(8260 - 8260 / 1.18),
    grossAmount: 8260,
    shortDescription: "Document Signer Class 2 certificate for automated/bulk document signing, valid for 1 year.",
    description:
      "A Document Signer Class 2 certificate is designed for organizations that need automated or bulk document signing capability. Unlike individual DSCs, Document Signer certificates are used by systems and servers to automatically sign large volumes of documents.",
    features: DOC_SIGNER_FEATURES,
    useCases: [
      "Automated bulk document signing",
      "Server-based digital signing systems",
      "Organizational document authentication",
      "Bulk invoice and certificate generation",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Organizations, institutions and enterprises that need automated or bulk document signing capability.",
    faq: [
      { q: "What is a Document Signer certificate?", a: "A Document Signer certificate is used by organizations for automated, server-based bulk document signing. Unlike individual DSCs, it is installed on a server and can sign documents programmatically." },
      { q: "Who needs a Document Signer certificate?", a: "Organizations that generate large volumes of signed documents (invoices, certificates, reports) or need server-based automated signing use Document Signer certificates." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 22,
    filterType: "document-signer",
  },
  {
    id: "ds2-2y",
    slug: "document-signer-class-2-2-year",
    name: "Document Signer Class 2 – 2 Years",
    category: "doc-signer-class2",
    certificateType: "Document Signer",
    validityYears: 2,
    basicAmount: r(9440 / 1.18),
    gstRate: 0.18,
    gstAmount: r(9440 - 9440 / 1.18),
    grossAmount: 9440,
    shortDescription: "Document Signer Class 2 certificate for automated/bulk document signing, valid for 2 years.",
    description:
      "A 2-year Document Signer Class 2 certificate for organizations with ongoing automated document signing requirements.",
    features: DOC_SIGNER_FEATURES,
    useCases: [
      "Automated bulk document signing",
      "Server-based digital signing systems",
      "Organizational document authentication",
      "Bulk invoice and certificate generation",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Organizations needing sustained automated document signing for 2 years.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 23,
    filterType: "document-signer",
  },
  {
    id: "ds2-3y",
    slug: "document-signer-class-2-3-year",
    name: "Document Signer Class 2 – 3 Years",
    category: "doc-signer-class2",
    certificateType: "Document Signer",
    validityYears: 3,
    basicAmount: r(14160 / 1.18),
    gstRate: 0.18,
    gstAmount: r(14160 - 14160 / 1.18),
    grossAmount: 14160,
    shortDescription: "Document Signer Class 2 certificate for automated/bulk document signing, valid for 3 years.",
    description:
      "A 3-year Document Signer Class 2 certificate — best long-term value for organizations with sustained automated document signing needs.",
    features: DOC_SIGNER_FEATURES,
    useCases: [
      "Automated bulk document signing",
      "Server-based digital signing systems",
      "Organizational document authentication",
      "Bulk invoice and certificate generation",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Large organizations seeking long-term automated document signing capability.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 24,
    filterType: "document-signer",
  },

  // ===================== DOCUMENT SIGNER CLASS 3 =====================
  {
    id: "ds3-1y",
    slug: "document-signer-class-3-1-year",
    name: "Document Signer Class 3 – 1 Year",
    category: "doc-signer-class3",
    certificateType: "Document Signer",
    validityYears: 1,
    basicAmount: r(12980 / 1.18),
    gstRate: 0.18,
    gstAmount: r(12980 - 12980 / 1.18),
    grossAmount: 12980,
    shortDescription: "Document Signer Class 3 certificate for high-security automated signing, valid for 1 year.",
    description:
      "A Document Signer Class 3 certificate provides the highest level of identity assurance for automated, server-based document signing. Designed for organizations with stringent security requirements for bulk signing operations.",
    features: [
      ...DOC_SIGNER_FEATURES,
      "Highest level of identity assurance (Class 3)",
      "Suitable for high-security document signing requirements",
    ],
    useCases: [
      "High-security automated document signing",
      "Government and regulatory document generation",
      "Enterprise-grade bulk signing operations",
      "Secure server-based signing systems",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Enterprises, government bodies and organizations requiring the highest level of automated document signing security.",
    faq: [
      { q: "What is the difference between Document Signer Class 2 and Class 3?", a: "Document Signer Class 3 provides a higher level of identity assurance and security than Class 2. It is designed for organizations with stringent security requirements for automated document signing." },
      ...GENERAL_FAQ,
    ],
    active: true,
    displayOrder: 25,
    filterType: "document-signer",
  },
  {
    id: "ds3-2y",
    slug: "document-signer-class-3-2-year",
    name: "Document Signer Class 3 – 2 Years",
    category: "doc-signer-class3",
    certificateType: "Document Signer",
    validityYears: 2,
    basicAmount: r(14160 / 1.18),
    gstRate: 0.18,
    gstAmount: r(14160 - 14160 / 1.18),
    grossAmount: 14160,
    shortDescription: "Document Signer Class 3 certificate for high-security automated signing, valid for 2 years.",
    description:
      "A 2-year Document Signer Class 3 certificate for organizations with ongoing high-security automated document signing requirements.",
    features: [
      ...DOC_SIGNER_FEATURES,
      "Highest level of identity assurance (Class 3)",
      "Suitable for high-security document signing requirements",
    ],
    useCases: [
      "High-security automated document signing",
      "Government and regulatory document generation",
      "Enterprise-grade bulk signing operations",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Enterprises needing sustained high-security automated signing for 2 years.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 26,
    filterType: "document-signer",
  },
  {
    id: "ds3-3y",
    slug: "document-signer-class-3-3-year",
    name: "Document Signer Class 3 – 3 Years",
    category: "doc-signer-class3",
    certificateType: "Document Signer",
    validityYears: 3,
    basicAmount: r(21240 / 1.18),
    gstRate: 0.18,
    gstAmount: r(21240 - 21240 / 1.18),
    grossAmount: 21240,
    shortDescription: "Document Signer Class 3 certificate for high-security automated signing, valid for 3 years.",
    description:
      "A 3-year Document Signer Class 3 certificate — the best long-term value for organizations with the highest security requirements for automated document signing.",
    features: [
      ...DOC_SIGNER_FEATURES,
      "Highest level of identity assurance (Class 3)",
      "Suitable for high-security document signing requirements",
    ],
    useCases: [
      "High-security automated document signing",
      "Government and regulatory document generation",
      "Enterprise-grade bulk signing operations",
    ],
    documentsRequired: ORG_DOCS,
    whoShouldUse: "Large enterprises and government bodies seeking the best long-term value for high-security automated signing.",
    faq: GENERAL_FAQ,
    active: true,
    displayOrder: 27,
    filterType: "document-signer",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getProductBySlug(slug: string): DSCProduct | undefined {
  return DSC_PRODUCTS.find((p) => p.slug === slug && p.active);
}

export function getProductById(id: string): DSCProduct | undefined {
  return DSC_PRODUCTS.find((p) => p.id === id && p.active);
}

export function getActiveProducts(): DSCProduct[] {
  return DSC_PRODUCTS.filter((p) => p.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProductsByCategory(category: string): DSCProduct[] {
  return getActiveProducts().filter((p) => p.category === category);
}

export function getRelatedProducts(product: DSCProduct, limit = 4): DSCProduct[] {
  return getActiveProducts()
    .filter((p) => p.id !== product.id && (p.category === product.category || p.filterType === product.filterType))
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getActiveProducts().map((p) => p.slug);
}
