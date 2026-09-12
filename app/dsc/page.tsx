"use client";

// =============================================================================
// DSC Store Landing Page — /dsc
// =============================================================================

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  HelpCircle,
  FileText,
  Key,
  Lock,
  Zap,
  Award,
} from "lucide-react";
import { getActiveProducts, type DSCProduct } from "@/lib/dsc/products";
import { CERTIFICATE_TYPE_FILTERS, VALIDITY_OPTIONS, SORT_OPTIONS } from "@/lib/dsc/config";
import { useCart } from "@/lib/dsc/cart-context";
import Button from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Product Card
// ---------------------------------------------------------------------------

function ProductCard({ product }: { product: DSCProduct }) {
  const { addToCart, getItem } = useCart();
  const inCart = !!getItem(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-gold-300 transition-all duration-300 group">
      <div>
        {/* Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">
            {product.certificateType}
          </span>
          <span className="text-[10px] font-semibold text-gray-400">
            {product.validityYears} {product.validityYears === 1 ? "Year" : "Years"}
          </span>
        </div>

        {/* Name */}
        <Link href={`/dsc/${product.slug}`} className="block group-hover:text-gold-600 transition-colors">
          <h3 className="text-base font-bold text-navy-900 mb-1 leading-snug">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{product.shortDescription}</p>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-navy-900">
              ₹{product.grossAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Inclusive of 18% GST</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
            added
              ? "bg-emerald-500 text-white"
              : inCart
              ? "bg-navy-100 text-navy-800 hover:bg-navy-200"
              : "bg-navy-800 text-white hover:bg-navy-700"
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              {inCart ? "Add Another" : "Add to Cart"}
            </>
          )}
        </button>
        <Link
          href={`/dsc/${product.slug}`}
          className="px-3 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-navy-800 hover:bg-navy-50 hover:border-navy-300 transition-all"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ Accordion
// ---------------------------------------------------------------------------

const LANDING_FAQS = [
  {
    q: "What is a Digital Signature Certificate (DSC)?",
    a: "A Digital Signature Certificate (DSC) is an electronic form of a signature that can be used to authenticate the identity of the sender of a message or the signer of a document. In India, DSCs are issued by licensed Certifying Authorities (CAs) under the Controller of Certifying Authorities (CCA) and are legally valid under the Information Technology Act, 2000.",
  },
  {
    q: "Which DSC should I choose — Signing, Encryption, or Combo?",
    a: "Signing DSC is for digitally signing documents (MCA, ITR, GST filings). Encryption DSC is for encrypting sensitive data (e-Tendering bid submissions). Combo DSC includes both signing and encryption — recommended if you need both capabilities or participate in e-Tendering.",
  },
  {
    q: "What is a DGFT DSC?",
    a: "A DGFT DSC is specifically configured for use on the DGFT (Directorate General of Foreign Trade) portal and ICEGATE for import-export related filings, customs declarations, and IEC applications.",
  },
  {
    q: "What is a Document Signer DSC?",
    a: "A Document Signer DSC is used by organizations for automated, server-based bulk document signing. Unlike individual DSCs, it is installed on a server to programmatically sign large volumes of documents such as invoices, certificates, and reports.",
  },
  {
    q: "Do I need a USB crypto token?",
    a: "A USB crypto token is a secure hardware device used to store your DSC. If you already have a compatible token from a previous DSC, you may not need a new one. If this is your first DSC or your existing token is incompatible, you should add a USB token to your order for ₹500.",
  },
  {
    q: "Is the USB token included in the DSC price?",
    a: "No, the USB crypto token is an optional add-on available for ₹500. It is not included in the DSC certificate price. You can choose to add or skip it during checkout.",
  },
  {
    q: "Is GST included in the displayed price?",
    a: "Yes, all prices shown on this page are inclusive of 18% GST. You can view the detailed price breakdown (basic amount + GST) on individual product pages.",
  },
  {
    q: "How do I apply for a DSC online?",
    a: "Select the DSC you need, add it to your cart, proceed to checkout, fill in your applicant details, and place your order. Our team will contact you with the next steps for verification and certificate issuance.",
  },
  {
    q: "Can foreign nationals apply for a DSC?",
    a: "Yes, foreign nationals and NRIs can obtain a DSC using passport-based verification. We offer Foreign Class 3 Signing, Encryption, and Combo DSCs specifically for overseas applicants.",
  },
  {
    q: "How does DSC renewal work?",
    a: "DSC renewal involves purchasing a new DSC certificate of the desired type and validity before your current certificate expires. The process is the same as a new application.",
  },
];

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DSCStorePage() {
  const allProducts = useMemo(() => getActiveProducts(), []);
  const { cartCount } = useCart();

  const [typeFilter, setTypeFilter] = useState("all");
  const [validityFilter, setValidityFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let products = [...allProducts];

    // Filter by type
    if (typeFilter !== "all") {
      products = products.filter((p) => p.filterType === typeFilter);
    }

    // Filter by validity
    if (validityFilter !== null) {
      products = products.filter((p) => p.validityYears === validityFilter);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.grossAmount - b.grossAmount);
        break;
      case "price-high":
        products.sort((a, b) => b.grossAmount - a.grossAmount);
        break;
      default:
        products.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return products;
  }, [allProducts, typeFilter, validityFilter, sortBy]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50/60 to-white" />
        <div className="relative container-tight px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              CCA Approved • Legally Valid
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 leading-tight tracking-tight mb-4">
              Digital Signature Certificate (DSC) Online –{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
                Class 3 DSC, DGFT & More
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed mb-8">
              Apply for Digital Signature Certificates online with simple ordering, secure
              processing and support from Unovia. All prices inclusive of 18% GST.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[
                { icon: ShieldCheck, label: "CCA Approved" },
                { icon: FileText, label: "IT Act 2000 Valid" },
                { icon: Key, label: "USB Token Available" },
                { icon: Zap, label: "Simple Online Process" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700"
                >
                  <item.icon className="w-3.5 h-3.5 text-gold-500" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700 transition-all shadow-lg"
              >
                Browse DSC Certificates
                <ArrowRight className="w-4 h-4" />
              </a>
              {cartCount > 0 && (
                <Link
                  href="/dsc/cart"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-navy-800 text-navy-800 text-sm font-bold rounded-xl hover:bg-navy-50 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart ({cartCount})
                </Link>
              )}
              <Link
                href="/dsc/track"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                Track Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Product Grid */}
      <section className="section-padding bg-white pt-0" id="products">
        <div className="container-tight">
          {/* Filter Bar */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-8">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-between w-full text-sm font-semibold text-navy-800 mb-3"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters & Sort
              </span>
              <span className="text-xs text-gray-400">{filtered.length} products</span>
            </button>

            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Type Filter */}
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Certificate Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CERTIFICATE_TYPE_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setTypeFilter(f.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          typeFilter === f.value
                            ? "bg-navy-800 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-navy-300"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Validity Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Validity
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setValidityFilter(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        validityFilter === null
                          ? "bg-navy-800 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-navy-300"
                      }`}
                    >
                      All
                    </button>
                    {VALIDITY_OPTIONS.map((v) => (
                      <button
                        key={v.value}
                        onClick={() => setValidityFilter(v.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          validityFilter === v.value
                            ? "bg-navy-800 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-navy-300"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Result count (desktop) */}
            <div className="hidden md:block mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-400">
                Showing {filtered.length} of {allProducts.length} products
              </span>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-navy-800 mb-2">No products found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setValidityFilter(null);
                }}
                className="mt-4 px-4 py-2 bg-navy-800 text-white text-xs font-bold rounded-lg hover:bg-navy-700 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Educational Content */}
      <section className="section-padding bg-gray-50/70">
        <div className="container-tight">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8 text-center">
              Everything You Need to Know About DSC
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "What is a Digital Signature Certificate?",
                  content:
                    "A Digital Signature Certificate (DSC) is an electronic equivalent of a physical signature. Issued by licensed Certifying Authorities under the CCA (Controller of Certifying Authorities), it provides a legally valid way to sign documents electronically under the Information Technology Act, 2000.",
                },
                {
                  title: "Class 3 Signing vs Encryption vs Combo",
                  content:
                    "Signing DSC is used to digitally sign documents on portals like MCA, ITR, and GST. Encryption DSC encrypts sensitive data for e-Tendering submissions. Combo DSC includes both capabilities — recommended for complete compliance.",
                },
                {
                  title: "What is a DGFT DSC?",
                  content:
                    "A DGFT DSC is configured for the Directorate General of Foreign Trade portal and ICEGATE. Required by importers, exporters and customs brokers for filing import-export declarations, IEC applications and customs documentation.",
                },
                {
                  title: "What is a Document Signer DSC?",
                  content:
                    "Document Signer DSCs are organizational certificates used for automated, server-based bulk document signing. Unlike individual DSCs, they enable systems to programmatically sign large volumes of invoices, certificates and reports.",
                },
                {
                  title: "Do I need a USB token?",
                  content:
                    "A USB crypto token is a secure hardware device that stores your DSC. If you already have a compatible token from a previous certificate, you can reuse it. Otherwise, you can add a new token for ₹500 during checkout.",
                },
                {
                  title: "How to apply for a DSC online",
                  content:
                    "Select your DSC type and validity, add to cart, complete checkout with your applicant details, and place your order. Our team will guide you through the verification process for certificate issuance.",
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-200">
                  <h3 className="text-base font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white" id="faq">
        <div className="container-tight max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500">
              Common questions about Digital Signature Certificates and our ordering process.
            </p>
          </div>

          <div className="space-y-3">
            {LANDING_FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-xl bg-gray-50 border border-gray-200 transition-all [&[open]]:bg-navy-50/50 [&[open]]:border-navy-200"
              >
                <summary className="flex items-center justify-between font-semibold text-sm text-navy-900 cursor-pointer list-none">
                  <span className="flex items-center gap-2.5 pr-4">
                    <HelpCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <span className="ml-2 transition-transform group-open:rotate-180 text-navy-600 flex-shrink-0">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-[26px]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Help Choosing the Right DSC?
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto mb-8">
            Our team of experts can help you select the right Digital Signature Certificate for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/contact" variant="secondary" size="lg">
              Talk to an Expert
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              href="tel:+917278671467"
              variant="ghost"
              size="lg"
              className="text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Call +91 72786 71467
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
