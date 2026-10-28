import type { Metadata } from "next";
import FounderPricingClient from "@/components/founder-pricing/FounderPricingClient";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { COMPANY } from "@/lib/constants";
import { FOUNDER_DATA, PRICING_TIERS } from "@/lib/founder-pricing-data";

// =============================================================================
// SEO Metadata — Founder & Pricing Page
// =============================================================================

export const metadata: Metadata = {
  title: "Founder & Pricing | Shubham Chowdhary (CA) | Unovia Consulting",
  description:
    "Meet Shubham Chowdhary, Chartered Accountant and Founder of Unovia Consulting. Explore structured financial advisory, tax planning, GST, and business finance consulting with transparent pricing from ₹1,000 to ₹1,00,000.",
  keywords: [
    "Chartered Accountant in Kolkata",
    "Shubham Chowdhary Chartered Accountant",
    "Tax Consulting Services",
    "GST Consulting",
    "Business Finance Consulting",
    "Financial Planning Services",
    "Financial Modelling and MIS Consulting",
    "Startup Finance Advisory",
    "Unovia Consulting pricing",
    "CA Shubham Chowdhary",
    "Kolkata CA advisory",
  ],
  alternates: {
    canonical: "https://unovia.in/founder-pricing",
  },
  openGraph: {
    type: "profile",
    title: "Founder & Pricing | Shubham Chowdhary, CA — Unovia Consulting",
    description:
      "Meet Shubham Chowdhary, Chartered Accountant and Founder of Unovia Consulting. Discover our 5-tier financial consulting services starting from ₹1,000 to ₹1,00,000.",
    url: "https://unovia.in/founder-pricing",
    siteName: "Unovia Consulting",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Unovia Consulting — Founder & Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder & Pricing | Shubham Chowdhary, CA — Unovia Consulting",
    description:
      "Structured advisory across taxation, wealth management, and corporate finance with transparent pricing from ₹1,000 to ₹1,00,000.",
  },
};

export default function FounderPricingPage() {
  // Schema.org structured data for SEO (Person + ProfessionalService)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://unovia.in/founder-pricing#founder",
        name: FOUNDER_DATA.name,
        jobTitle: FOUNDER_DATA.designation,
        worksFor: {
          "@type": "Organization",
          name: COMPANY.name,
          url: "https://unovia.in",
        },
        description: FOUNDER_DATA.introduction[0],
        knowsAbout: FOUNDER_DATA.areasOfExpertise.map((item) => item.title),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          addressCountry: "IN",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://unovia.in/founder-pricing#service",
        name: `${COMPANY.name} — Financial Consulting & Advisory`,
        url: "https://unovia.in/founder-pricing",
        telephone: COMPANY.phone,
        email: COMPANY.email,
        priceRange: "₹1,000 - ₹1,00,000",
        address: {
          "@type": "PostalAddress",
          streetAddress: COMPANY.address,
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          postalCode: "700061",
          addressCountry: "IN",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Consulting Engagement Tiers",
          itemListElement: PRICING_TIERS.map((tier, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: tier.name,
              description: tier.summary,
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: tier.minPrice,
              maxPrice: tier.maxPrice,
              priceCurrency: "INR",
            },
            position: index + 1,
          })),
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Header / Top Spacing */}
      <div className="pt-24 sm:pt-28 pb-4 bg-navy-900 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Founder & Pricing", href: "/founder-pricing" },
            ]}
          />
        </div>
      </div>

      {/* Main Interactive Sections (Founder Profile + Pricing Tiers + Lead Form) */}
      <main>
        <FounderPricingClient />
      </main>
    </>
  );
}
