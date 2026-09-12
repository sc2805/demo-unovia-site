"use client";

// =============================================================================
// DSC Checkout Page — /dsc/checkout
// =============================================================================

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Building2,
  MapPin,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Package,
  Usb,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/dsc/cart-context";
import { TOKEN_CONFIG } from "@/lib/dsc/config";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman & Nicobar Islands", "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

export default function CheckoutPage() {
  const { items, tokenSelected, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    pan: "",
    applicantType: "individual" as "individual" | "organization",
    organizationName: "",
    gstin: "",
    billingAddress: "",
    city: "",
    state: "West Bengal",
    pinCode: "",
    agreeTerms: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const totalGst = items.reduce((sum, i) => sum + i.product.gstAmount * i.quantity, 0);
  const totalBasic = items.reduce((sum, i) => sum + i.product.basicAmount * i.quantity, 0);

  // Empty cart guard
  if (!showSuccess && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4">
        <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-navy-900 mb-2">No Items to Checkout</h1>
        <p className="text-gray-500 mb-6">Add DSC products to your cart first.</p>
        <Link
          href="/dsc"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700"
        >
          Browse DSC Products
        </Link>
      </div>
    );
  }

  // Success state
  if (showSuccess && orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-center max-w-md mb-2">
          Your DSC order has been placed. Our team will contact you shortly for verification and payment processing.
        </p>
        <div className="px-4 py-2 bg-navy-50 rounded-xl mb-6">
          <span className="text-xs text-gray-500">Order ID:</span>
          <span className="ml-2 text-sm font-bold text-navy-900">{orderId}</span>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 max-w-md w-full mb-6">
          <h3 className="text-sm font-bold text-navy-900 mb-3">What Happens Next?</h3>
          <div className="space-y-2.5">
            {[
              "Our team will reach out to you via phone/WhatsApp",
              "We'll guide you through the DSC verification process",
              "Payment can be made offline via UPI/bank transfer/cash",
              "Your DSC will be issued after successful verification",
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                <span className="w-5 h-5 bg-navy-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dsc"
            className="px-5 py-2.5 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 border border-gray-200 text-navy-800 text-sm font-bold rounded-xl hover:bg-gray-50"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!form.fullName.trim()) return setError("Full name is required.");
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, "").length < 10)
      return setError("Please provide a valid 10-digit mobile number.");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("Please provide a valid email address.");
    if (!form.pan.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.toUpperCase()))
      return setError("Please provide a valid PAN (e.g. ABCDE1234F).");
    if (form.applicantType === "organization" && !form.organizationName.trim())
      return setError("Organization name is required for organization applicants.");
    if (!form.billingAddress.trim()) return setError("Billing address is required.");
    if (!form.city.trim()) return setError("City is required.");
    if (!form.pinCode.trim() || form.pinCode.replace(/\D/g, "").length !== 6)
      return setError("Please provide a valid 6-digit PIN code.");
    if (!form.agreeTerms)
      return setError("Please agree to the terms and conditions to proceed.");

    setIsSubmitting(true);

    try {
      const idempotencyKey = `${form.email}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

      const res = await fetch("/api/dsc/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          tokenSelected,
          applicant: {
            fullName: form.fullName.trim(),
            mobile: form.mobile.replace(/\D/g, ""),
            email: form.email.trim().toLowerCase(),
            pan: form.pan.toUpperCase().trim(),
            applicantType: form.applicantType,
            organizationName: form.applicantType === "organization" ? form.organizationName.trim() : undefined,
            gstin: form.gstin.trim() || undefined,
            billingAddress: form.billingAddress.trim(),
            city: form.city.trim(),
            state: form.state,
            pinCode: form.pinCode.replace(/\D/g, ""),
          },
          idempotencyKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      setOrderId(data.orderId);
      setShowSuccess(true);
      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-6 md:pt-36 md:pb-8 bg-gray-50/50 border-b border-gray-200">
        <div className="container-tight px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dsc/cart" className="text-gray-400 hover:text-navy-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900">Checkout</h1>
              <p className="text-sm text-gray-500 mt-0.5">Complete your DSC order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Applicant Details */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                  <h2 className="text-base font-bold text-navy-900 mb-5 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" />
                    Applicant Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="As per Aadhaar / Passport"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        <Phone className="w-3 h-3 inline mr-1" />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => updateField("mobile", e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        <CreditCard className="w-3 h-3 inline mr-1" />
                        PAN *
                      </label>
                      <input
                        type="text"
                        value={form.pan}
                        onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 uppercase focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        <User className="w-3 h-3 inline mr-1" />
                        Applicant Type *
                      </label>
                      <select
                        value={form.applicantType}
                        onChange={(e) => updateField("applicantType", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
                      >
                        <option value="individual">Individual</option>
                        <option value="organization">Organization</option>
                      </select>
                    </div>

                    {form.applicantType === "organization" && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            <Building2 className="w-3 h-3 inline mr-1" />
                            Organization Name *
                          </label>
                          <input
                            type="text"
                            value={form.organizationName}
                            onChange={(e) => updateField("organizationName", e.target.value)}
                            placeholder="Registered organization name"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            GSTIN (Optional)
                          </label>
                          <input
                            type="text"
                            value={form.gstin}
                            onChange={(e) => updateField("gstin", e.target.value.toUpperCase())}
                            placeholder="22ABCDE1234F1Z5"
                            maxLength={15}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 uppercase focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Billing Address */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                  <h2 className="text-base font-bold text-navy-900 mb-5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    Billing Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
                      <textarea
                        value={form.billingAddress}
                        onChange={(e) => updateField("billingAddress", e.target.value)}
                        placeholder="Street address, building, floor"
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                      <select
                        value={form.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={form.pinCode}
                        onChange={(e) => updateField("pinCode", e.target.value)}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-navy-800 focus:ring-navy-800"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the terms and conditions, privacy policy, and authorize Unovia Consulting to process my DSC application with the information provided above. I understand that payment will be collected offline and the DSC will be issued after successful verification and payment.
                    </span>
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-navy-900 mb-5">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-navy-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-navy-900 truncate block">
                            {item.product.name}
                          </span>
                          <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                        </div>
                        <span className="text-xs font-bold text-navy-900 flex-shrink-0">
                          ₹{(item.product.grossAmount * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}

                    {tokenSelected && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Usb className="w-4 h-4 text-gold-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-navy-900">USB Crypto Token</span>
                        </div>
                        <span className="text-xs font-bold text-navy-900 flex-shrink-0">
                          ₹{TOKEN_CONFIG.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing breakdown */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{totalBasic.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>GST (18%)</span>
                      <span>₹{totalGst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                    </div>
                    {tokenSelected && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Token</span>
                        <span>₹{TOKEN_CONFIG.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline mb-5">
                    <span className="text-sm font-bold text-navy-900">Total</span>
                    <span className="text-2xl font-black text-navy-900">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Payment info */}
                  <div className="mb-5 p-3 bg-gold-50/50 rounded-xl border border-gold-100">
                    <span className="text-xs font-bold text-navy-900">Payment: Offline</span>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Our team will contact you for payment via UPI, bank transfer, or cash after order placement.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 mt-3 text-center">
                    All prices in INR. Prices include 18% GST.
                  </p>

                  {/* Trust */}
                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5">
                    {["Secure Processing", "CCA Approved Certificates", "Expert Support"].map(
                      (item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-500">
                          <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
