"use client";

// =============================================================================
// DSC Order Tracking Page — /dsc/track
// =============================================================================

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Usb,
  MessageCircle,
  Phone,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { DSCOrder } from "@/lib/dsc/orders";
import { COMPANY } from "@/lib/constants";

const STATUS_STEPS = [
  { key: "pending", label: "Order Received", desc: "Awaiting verification initiation" },
  { key: "processing", label: "Verification in Progress", desc: "Document / video eKYC review" },
  { key: "verified", label: "Approved & Ready", desc: "Verification complete, awaiting issuance" },
  { key: "issued", label: "DSC Issued", desc: "Certificate ready / token dispatched" },
  { key: "delivered", label: "Completed", desc: "DSC active and delivered" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<DSCOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/dsc/orders/${cleanId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found. Please verify your Order ID.");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load order.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const getStepIndex = (state: string) => {
    switch (state) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "verified":
        return 2;
      case "issued":
        return 3;
      case "delivered":
        return 4;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-wider mb-2 block">
            Self-Service Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 mb-3 tracking-tight">
            Track Your DSC Application
          </h1>
          <p className="text-sm text-gray-600">
            Enter your DSC Order ID (format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-navy-800 font-mono font-semibold">UNV-DSC-XXXXXX</code>) to view live verification & issuance status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. UNV-DSC-A9B2C4"
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm font-semibold uppercase tracking-wider text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="px-6 py-3 bg-navy-800 text-white rounded-2xl text-sm font-bold hover:bg-navy-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Track Status
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details View */}
        {order && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Card 1: Status & Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-0.5">
                    Order Reference
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-navy-900 font-mono">
                    {order.id}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      order.orderState === "issued" || order.orderState === "delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.orderState === "cancelled"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {order.orderState}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              {order.orderState !== "cancelled" ? (
                <div className="pt-8 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(order.orderState);
                      const isComplete = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                              isComplete
                                ? "bg-emerald-500 text-white"
                                : isCurrent
                                ? "bg-navy-800 text-gold-400 ring-4 ring-navy-100"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isCurrent ? (
                              <Clock className="w-5 h-5 animate-pulse" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold block ${
                                isCurrent
                                  ? "text-navy-900"
                                  : isComplete
                                  ? "text-emerald-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-gray-500 hidden sm:block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pt-6 pb-2 text-center text-red-600 font-semibold text-sm">
                  This order has been cancelled. Please contact our support team if you require assistance.
                </div>
              )}
            </div>

            {/* Card 2: Items & Pricing */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-gold-500" />
                Certificate & Add-ons
              </h3>

              <div className="divide-y divide-gray-100 mb-6">
                {order.pricing.lineItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.unitGrossAmount} (incl. 18% GST)
                      </p>
                    </div>
                    <span className="text-sm font-bold text-navy-900">
                      ₹{item.lineGrossAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

                {order.pricing.tokenSelected && (
                  <div className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Usb className="w-4 h-4 text-gold-600" />
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">FIPS 140-2 Level 3 USB Crypto Token</h4>
                        <p className="text-xs text-gray-500">Physical token delivery</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy-900">
                      ₹{order.pricing.tokenAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Base Amount</span>
                  <span>₹{order.pricing.subtotalBasicAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{order.pricing.subtotalGstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-navy-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{order.pricing.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Applicant & Delivery Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-bold text-navy-900 mb-4">Applicant & Billing Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Applicant Name</span>
                  <span className="font-bold text-navy-900">{order.applicant.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Applicant Type</span>
                  <span className="font-bold text-navy-900 capitalize">{order.applicant.applicantType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Mobile Number</span>
                  <span className="font-bold text-navy-900">+91 {order.applicant.mobile}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Email</span>
                  <span className="font-bold text-navy-900">{order.applicant.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">PAN</span>
                  <span className="font-bold text-navy-900">{order.applicant.pan}</span>
                </div>
                {order.applicant.organizationName && (
                  <div>
                    <span className="text-gray-400 block mb-0.5">Organization</span>
                    <span className="font-bold text-navy-900">{order.applicant.organizationName}</span>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block mb-0.5">Address</span>
                  <span className="text-navy-900">
                    {order.applicant.billingAddress}, {order.applicant.city}, {order.applicant.state} - {order.applicant.pinCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Need Help / Action */}
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold mb-1">Need Immediate Assistance?</h4>
                <p className="text-xs text-gray-300 max-w-md">
                  Our verification executives are available to guide you through Aadhaar OTP and Video verification.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/917278671467?text=${encodeURIComponent(
                    `Hi Unovia team, I am checking my DSC order: ${order.id}. Need assistance.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${COMPANY.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-28">
          <Loader2 className="w-8 h-8 animate-spin text-navy-800" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
