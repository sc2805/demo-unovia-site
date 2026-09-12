"use client";

// =============================================================================
// DSC Product Detail Client Component
// =============================================================================

import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  FileText,
  Usb,
  Users,
} from "lucide-react";
import type { DSCProduct } from "@/lib/dsc/products";
import { TOKEN_CONFIG } from "@/lib/dsc/config";
import { useCart } from "@/lib/dsc/cart-context";

interface ProductDetailClientProps {
  product: DSCProduct;
  related: DSCProduct[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { addToCart, getItem, cartCount } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = !!getItem(product.id);

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-tight px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-navy-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dsc" className="hover:text-navy-800 transition-colors">
              DSC Store
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy-800 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="section-padding bg-white pt-10">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Product Info */}
            <div className="lg:col-span-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full">
                  {product.certificateType}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full">
                  {product.validityYears} {product.validityYears === 1 ? "Year" : "Years"} Validity
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  CCA Approved
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {/* Who Should Use */}
              <div className="p-5 bg-navy-50/60 rounded-2xl mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-2">
                  <Users className="w-4 h-4 text-gold-500" />
                  Who Should Use This DSC
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{product.whoShouldUse}</p>
              </div>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-navy-900 mb-3">Common Use Cases</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.useCases.map((uc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-navy-900 mb-3">What&apos;s Included</h3>
                <div className="space-y-2">
                  {product.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-3">
                  <FileText className="w-4 h-4 text-gold-500" />
                  Documents Required
                </h3>
                <div className="space-y-2">
                  {product.documentsRequired.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              {product.faq.length > 0 && (
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-3">
                    <HelpCircle className="w-4 h-4 text-gold-500" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {product.faq.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group p-4 rounded-xl bg-gray-50 border border-gray-200 transition-all [&[open]]:bg-navy-50/50 [&[open]]:border-navy-200"
                      >
                        <summary className="flex items-center justify-between font-semibold text-sm text-navy-900 cursor-pointer list-none">
                          <span className="pr-4">{faq.q}</span>
                          <span className="ml-2 transition-transform group-open:rotate-180 text-navy-600 flex-shrink-0">
                            ↓
                          </span>
                        </summary>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Price + Purchase Card (sticky) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 mb-6">
                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-3xl font-black text-navy-900">
                        ₹{product.grossAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Inclusive of 18% GST</span>

                    {/* Price breakdown */}
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Base Amount</span>
                        <span>₹{product.basicAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>GST (18%)</span>
                        <span>₹{product.gstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-navy-900 pt-1 border-t border-gray-100">
                        <span>Total</span>
                        <span>₹{product.grossAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Token info */}
                  {TOKEN_CONFIG.enabled && (
                    <div className="mb-5 p-3 bg-gold-50/50 rounded-xl border border-gold-100">
                      <div className="flex items-start gap-2">
                        <Usb className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-navy-900">USB Crypto Token</span>
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            Optional add-on (₹{TOKEN_CONFIG.price}) — can be added during checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2.5">
                    <button
                      onClick={handleAdd}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        added
                          ? "bg-emerald-500 text-white"
                          : "bg-navy-800 text-white hover:bg-navy-700 shadow-lg"
                      }`}
                    >
                      {added ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? "Add Another" : "Add to Cart"}
                        </>
                      )}
                    </button>

                    {cartCount > 0 && (
                      <Link
                        href="/dsc/cart"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border border-navy-800 text-navy-800 hover:bg-navy-50 transition-all"
                      >
                        View Cart ({cartCount})
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}

                    <Link
                      href="/contact"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:text-navy-800 hover:bg-gray-50 transition-all"
                    >
                      Need help choosing? Contact us
                    </Link>
                  </div>

                  {/* Trust */}
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                    {[
                      "CCA Approved & IT Act 2000 Valid",
                      "Secure 15-Min Aadhaar eKYC",
                      "Expert Phone & Remote Support",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-500">
                        <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* How it works */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                  <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
                    How It Works
                  </h4>
                  <div className="space-y-3">
                    {[
                      { step: "1", label: "Place your order online" },
                      { step: "2", label: "Our team contacts you for video eKYC" },
                      { step: "3", label: "Complete payment (offline UPI / Bank Transfer)" },
                      { step: "4", label: "DSC approved & issued in 15-30 minutes" },
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-navy-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {s.step}
                        </span>
                        <span className="text-xs text-gray-700">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section-padding bg-gray-50/70">
          <div className="container-tight">
            <h2 className="text-xl font-bold text-navy-900 mb-6">Related DSC Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/dsc/${rp.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-gold-300 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">
                      {rp.certificateType}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {rp.validityYears}Y
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                    {rp.name}
                  </h3>
                  <span className="text-lg font-black text-navy-900">
                    ₹{rp.grossAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[10px] text-gray-400">Incl. 18% GST</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
