"use client";

import { useState, useId } from "react";
import { CheckCircle2, ShieldCheck, Send, Loader2, Sparkles, Phone, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

// Pricing rules lookup (INR)
const PRICING_MATRIX: Record<string, Record<string, Record<string, number>>> = {
  "Class 3 Individual": {
    "1 Year": { "Signing Only": 799, "Combo (Signing & Encryption)": 999 },
    "2 Years": { "Signing Only": 1199, "Combo (Signing & Encryption)": 1499 },
    "3 Years": { "Signing Only": 1699, "Combo (Signing & Encryption)": 1999 },
  },
  "Class 3 Organization": {
    "1 Year": { "Signing Only": 1499, "Combo (Signing & Encryption)": 1899 },
    "2 Years": { "Signing Only": 1999, "Combo (Signing & Encryption)": 2499 },
    "3 Years": { "Signing Only": 2799, "Combo (Signing & Encryption)": 3299 },
  },
  "DGFT (Import-Export)": {
    "1 Year": { "Signing Only": 1999, "Combo (Signing & Encryption)": 2299 },
    "2 Years": { "Signing Only": 2699, "Combo (Signing & Encryption)": 2999 },
    "3 Years": { "Signing Only": 3499, "Combo (Signing & Encryption)": 3899 },
  },
  "Foreign National / NRI": {
    "1 Year": { "Signing Only": 3499, "Combo (Signing & Encryption)": 3999 },
    "2 Years": { "Signing Only": 4499, "Combo (Signing & Encryption)": 4999 },
    "3 Years": { "Signing Only": 5999, "Combo (Signing & Encryption)": 6499 },
  },
};

const TOKEN_COST = 350; // Cryptographic FIPS USB token fee

export default function DSCRequirementForm() {
  const formId = useId();

  // State
  const [category, setCategory] = useState<string>("Class 3 Individual");
  const [validity, setValidity] = useState<string>("2 Years");
  const [certType, setCertType] = useState<string>("Combo (Signing & Encryption)");
  const [needToken, setNeedToken] = useState<boolean>(true);
  const [purpose, setPurpose] = useState<string>("MCA / ROC Compliance");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate Fee
  const baseFee = PRICING_MATRIX[category]?.[validity]?.[certType] || 1499;
  const totalFee = baseFee + (needToken ? TOKEN_COST : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/dsc-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          type: certType,
          validity,
          needToken: needToken ? "Yes (FIPS 140-2 Level 3 USB Token Included)" : "No (Existing Token)",
          organization,
          purpose,
          estimatedPrice: totalFee,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit requirement.");
      }

      setStatus("success");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden" id="requirement-form">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Instant DSC Sales & Advisory
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">Contact for Your DSC Requirement</h3>
          <p className="text-gray-300 text-sm mt-1">
            Configure your exact certificate parameters below to get instant pricing & express 15-minute video eKYC approval.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex-shrink-0">
          <ShieldCheck className="w-8 h-8 text-gold-400" />
          <div className="text-left text-xs">
            <div className="font-bold text-white">Govt CCA Approved</div>
            <div className="text-gray-300">100% Legal & Paperless</div>
          </div>
        </div>
      </div>

      {status === "success" ? (
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold text-navy-800 mb-2">Requirement Submitted Successfully!</h4>
          <p className="text-gray-600 max-w-lg mx-auto mb-6 text-sm sm:text-base leading-relaxed">
            Thank you, <strong className="text-navy-800">{name}</strong>. Our Digital Signature specialist has received your configuration for <strong className="text-navy-800">{category} ({validity})</strong>. We will contact you at <strong className="text-navy-800">{phone}</strong> within 15 minutes to initiate your video eKYC.
          </p>
          <div className="p-4 bg-navy-50 rounded-2xl max-w-md mx-auto text-left mb-8 space-y-2 text-xs text-navy-900 border border-navy-100">
            <div className="flex justify-between"><span>Certificate Category:</span> <strong>{category}</strong></div>
            <div className="flex justify-between"><span>Type:</span> <strong>{certType}</strong></div>
            <div className="flex justify-between"><span>Validity:</span> <strong>{validity}</strong></div>
            <div className="flex justify-between"><span>USB Token:</span> <strong>{needToken ? "Included (Proxkey / ePass)" : "Not Required"}</strong></div>
            <div className="flex justify-between border-t border-navy-200 pt-2 font-bold text-navy-800 text-sm">
              <span>Estimated Payable Amount:</span>
              <span className="text-gold-600">₹{totalFee}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setStatus("idle");
              setName("");
              setEmail("");
              setPhone("");
              setMessage("");
            }}
            className="px-6 py-2.5 bg-navy-800 text-white rounded-xl text-sm font-semibold hover:bg-navy-700 transition-colors"
          >
            Submit Another Requirement
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Step 1: Certificate Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-navy-900 uppercase tracking-wider">
              1. Select Certificate Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: "Class 3 Individual", desc: "For Tax, Directors, Individuals" },
                { title: "Class 3 Organization", desc: "For Companies, Firms & Signatories" },
                { title: "DGFT (Import-Export)", desc: "For Importers, Exporters & Customs" },
                { title: "Foreign National / NRI", desc: "For Overseas Directors & Investors" },
              ].map((item) => {
                const isSelected = category === item.title;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setCategory(item.title)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-navy-800 bg-navy-50/70 shadow-sm ring-2 ring-navy-800/20"
                        : "border-gray-200 hover:border-navy-300 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isSelected ? "text-navy-800" : "text-gray-800"}`}>
                        {item.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-gray-500 block leading-tight">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Options (Type, Validity, USB Token) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Validity */}
            <div className="space-y-2">
              <label htmlFor={`${formId}-validity`} className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Validity Period
              </label>
              <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50">
                {["1 Year", "2 Years", "3 Years"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setValidity(v)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      validity === v
                        ? "bg-navy-800 text-white shadow-sm"
                        : "text-gray-600 hover:text-navy-800"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label htmlFor={`${formId}-certType`} className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Certificate Type
              </label>
              <select
                id={`${formId}-certType`}
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-navy-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="Combo (Signing & Encryption)">Combo (Signing + Encryption) — Recommended</option>
                <option value="Signing Only">Signing Only</option>
              </select>
            </div>

            {/* USB Token */}
            <div className="space-y-2">
              <label htmlFor={`${formId}-needToken`} className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Cryptographic USB Token
              </label>
              <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setNeedToken(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    needToken
                      ? "bg-navy-800 text-white shadow-sm"
                      : "text-gray-600 hover:text-navy-800"
                  }`}
                >
                  Yes (+₹350 FIPS Level 3 Token)
                </button>
                <button
                  type="button"
                  onClick={() => setNeedToken(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    !needToken
                      ? "bg-navy-800 text-white shadow-sm"
                      : "text-gray-600 hover:text-navy-800"
                  }`}
                >
                  No Token (Soft)
                </button>
              </div>
            </div>
          </div>

          {/* Purpose & Pricing Summary Widget */}
          <div className="p-5 bg-gradient-to-r from-navy-50 to-gold-50/40 rounded-2xl border border-navy-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-navy-600 font-semibold mb-1">Configured Package:</div>
              <div className="text-base font-bold text-navy-900">
                {category} • {validity} • {certType}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Includes 100% paperless video eKYC, instant approval & free installation assistance.
              </div>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-navy-100 text-right w-full sm:w-auto shadow-sm">
              <div className="text-xs text-gray-500 font-medium">Estimated Fee:</div>
              <div className="text-2xl font-black text-navy-900 flex items-center justify-end gap-1">
                <span className="text-xs font-bold text-gold-600">₹</span>
                <span>{totalFee}</span>
                <span className="text-xs font-normal text-gray-400">all incl.</span>
              </div>
            </div>
          </div>

          {/* Step 3: Contact & Requirement Details */}
          <div className="space-y-4 pt-2">
            <label className="block text-sm font-bold text-navy-900 uppercase tracking-wider">
              2. Enter Your Requirement Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-name`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id={`${formId}-name`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-phone`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id={`${formId}-phone`}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-email`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id={`${formId}-email`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label htmlFor={`${formId}-purpose`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Usage / Purpose
                </label>
                <select
                  id={`${formId}-purpose`}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  <option value="MCA / ROC Compliance">MCA / ROC (DIR-3, DIN, Annual Filing)</option>
                  <option value="Income Tax & GST">Income Tax Return & GST Filing</option>
                  <option value="e-Tendering & GeM">e-Tendering / Govt Bidding (GeM, CPPP)</option>
                  <option value="ICEGATE & Customs">ICEGATE & Customs Export-Import</option>
                  <option value="Trademarks & Patents">Trademarks & IP Registration</option>
                  <option value="Bulk Corporate Orders">Bulk / Team Requirement (CAs & Corporate)</option>
                  <option value="Other Requirement">Other Requirement</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${formId}-org`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Organization / Company Name (Optional for Org DSC)
                </label>
                <input
                  type="text"
                  id={`${formId}-org`}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${formId}-message`} className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional Notes or Specific Instructions
                </label>
                <textarea
                  id={`${formId}-message`}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify any urgent timeline, bulk quantity, or specific questions..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 resize-none"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone className="w-4 h-4 text-gold-500" />
              Need quick help? Call our DSC helpline: <strong>+91 72786 71467</strong>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={status === "loading"}
              className="w-full sm:w-auto justify-center bg-navy-800 hover:bg-navy-900 text-white min-w-[220px]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting Requirement...
                </>
              ) : (
                <>
                  Submit Requirement
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
