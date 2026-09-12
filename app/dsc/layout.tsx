import type { Metadata } from "next";

// =============================================================================
// DSC Store Layout — Metadata & Shell
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "Buy Class 3 Digital Signature Certificate (DSC) Online | Unovia",
    template: "%s | DSC Store — Unovia Consulting",
  },
  description:
    "Buy Govt & CCA-approved Class 3 Digital Signature Certificates (DSC) online with 15-minute paperless Aadhaar eKYC. Signing, combo, DGFT & Foreign National DSCs with optional USB crypto token.",
  keywords: [
    "Class 3 DSC",
    "Digital Signature Certificate",
    "Buy DSC online",
    "CCA approved DSC",
    "DSC for MCA ROC",
    "DSC for GST Income Tax",
    "Class 3 Signing Encryption Combo",
    "DGFT Digital Signature",
    "Foreign National DSC",
    "DSC with USB token",
    "ProxKey token",
    "ePass 2003",
    "Unovia DSC",
  ],
  openGraph: {
    title: "Buy Class 3 Digital Signature Certificate (DSC) Online | Unovia",
    description:
      "Govt & CCA approved Class 3 DSC with paperless Aadhaar eKYC. Lowest rates in India with door-step token delivery.",
    url: "https://unovia.in/dsc",
    siteName: "Unovia Consulting",
    type: "website",
  },
  alternates: {
    canonical: "https://unovia.in/dsc",
  },
};

export default function DSCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
