import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllSlugs,
} from "@/lib/dsc/products";
import ProductDetailClient from "@/components/dsc/ProductDetailClient";

// =============================================================================
// DSC Product Detail Page — /dsc/[slug] (Server Component with Dynamic SEO)
// =============================================================================

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | DSC Store",
    };
  }

  const title = `${product.name} | Buy Online at ₹${product.grossAmount}`;
  const description = `${product.shortDescription} Legally valid under IT Act 2000 & CCA approved. Instant paperless Aadhaar eKYC approval with optional USB token.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.certificateType,
      `Class 3 DSC ${product.validityYears} year`,
      "Buy DSC Online India",
      "CCA Approved DSC",
      "MCA ROC DSC",
      "GST Income Tax DSC",
    ],
    openGraph: {
      title,
      description,
      url: `https://unovia.in/dsc/${product.slug}`,
      siteName: "Unovia Consulting",
      type: "website",
    },
    alternates: {
      canonical: `https://unovia.in/dsc/${product.slug}`,
    },
  };
}

export default async function DSCProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 4);

  // Schema.org Structured Data
  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.grossAmount,
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "UNoviA Consulting",
        url: "https://unovia.in",
      },
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://unovia.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "DSC Store",
        item: "https://unovia.in/dsc",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://unovia.in/dsc/${product.slug}`,
      },
    ],
  };

  const jsonLdFaq =
    product.faq && product.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <ProductDetailClient product={product} related={related} />
    </>
  );
}
