"use client";

import { useState, useEffect } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Building,
  User,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import {
  ENQUIRY_SERVICES,
  BUDGET_TIER_OPTIONS,
  PricingTier,
} from "@/lib/founder-pricing-data";
import { COMPANY } from "@/lib/constants";

interface ConsultationEnquiryFormProps {
  selectedTier: PricingTier | null;
}

export default function ConsultationEnquiryForm({
  selectedTier,
}: ConsultationEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clientType: "Individual" as "Individual" | "Business",
    service: ENQUIRY_SERVICES[0] as string,
    budget: "₹15,001–₹35,000",
    message: "",
    honeypot: "", // anti-spam bot field
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  // Update budget when user clicks "Enquire" on a specific tier
  useEffect(() => {
    if (selectedTier) {
      const matchingBudget = BUDGET_TIER_OPTIONS.find(
        (b) => b.tierId === selectedTier.id
      );
      if (matchingBudget) {
        setFormData((prev) => ({
          ...prev,
          budget: matchingBudget.value,
        }));
      }
    }
  }, [selectedTier]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientTypeChange = (type: "Individual" | "Business") => {
    setFormData((prev) => ({ ...prev, clientType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot trap
    if (formData.honeypot) {
      setStatus("success");
      return;
    }

    // Basic frontend validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email address, and mobile number.");
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus("error");
      setErrorMessage("Please provide a brief description of your requirements (at least 10 characters).");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          clientType: formData.clientType,
          service: formData.service,
          budget: formData.budget,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit consultation enquiry.");
      }

      setSubmissionId(data.id || `UNV-CNS-${Date.now().toString().slice(-6)}`);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please reach out to connect@unovia.in directly."
      );
    }
  };

  return (
    <section id="enquiry" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mt-2">
            Request a Consultation
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-3">
            Share your requirements below. Our advisory team, led by Chartered Accountant Shubham Chowdhary, will review your inquiry and schedule a consultation.
          </p>
        </div>

        {/* Selected Tier Banner if active */}
        {selectedTier && (
          <div className="mb-8 p-4 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-xs">
                T{selectedTier.tierNumber}
              </div>
              <div>
                <p className="text-xs text-gold-900 font-semibold">
                  Selected Engagement Tier:{" "}
                  <span className="font-bold">{selectedTier.name}</span>
                </p>
                <p className="text-[11px] text-gold-700">
                  Target Range: {selectedTier.rangeText} (approximate budget option auto-selected)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("pricing");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-medium text-gold-800 hover:text-navy-900 underline"
            >
              Change Tier
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xl p-6 sm:p-10">
          {status === "success" ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900">
                Consultation Request Received
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
                Thank you, <span className="font-semibold text-navy-900">{formData.name}</span>. Your enquiry for <span className="font-semibold">{formData.service}</span> has been received with budget estimate <span className="font-semibold">{formData.budget}</span>.
              </p>

              <div className="p-3 bg-gray-50 rounded-lg max-w-sm mx-auto text-xs text-gray-600 border border-gray-100">
                Inquiry Ref: <span className="font-mono font-semibold text-navy-900">{submissionId}</span>
                <br />
                Direct confirmation sent to: <span className="font-semibold">{formData.email}</span>
              </div>

              <p className="text-xs text-gray-500 pt-2">
                Our team will reach out within 24 business hours to confirm your consultation schedule.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setFormData((prev) => ({ ...prev, message: "" }));
                  }}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-navy-900 hover:bg-gray-50 transition-colors"
                >
                  Submit Another Enquiry
                </button>
                <a
                  href={`https://wa.me/917278671467?text=${encodeURIComponent(
                    `Hi Shubham, I just submitted a consultation request for ${formData.service} (Ref: ${submissionId}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Connect on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Error Message Alert */}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Submission failed: </span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Client Type Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                  I am consulting as:
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => handleClientTypeChange("Individual")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      formData.clientType === "Individual"
                        ? "bg-navy-800 text-white border-navy-800 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Individual / Professional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClientTypeChange("Business")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      formData.clientType === "Business"
                        ? "bg-navy-800 text-white border-navy-800 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    Business / Startup
                  </button>
                </div>
              </div>

              {/* Personal Details Row: Name, Email, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Service Required */}
              <div>
                <label htmlFor="service" className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                >
                  {ENQUIRY_SERVICES.map((service, idx) => (
                    <option key={idx} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Approximate Budget Radio Cards */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Approximate Budget:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {BUDGET_TIER_OPTIONS.map((item) => {
                    const isSelected = formData.budget === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, budget: item.value }))}
                        className={`p-3 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                          isSelected
                            ? "bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-gold-500/50"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <span className="font-semibold">{item.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brief Description of Requirements */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Brief Description of Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your current requirements, timeline, specific tax or financial planning queries, or current accounting situation..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Privacy Notice & Submit Button */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Your data is strictly confidential. Sent directly to{" "}
                    <strong className="text-navy-900">{COMPANY.email}</strong>.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-gold-400" />
                      <span>Request a Consultation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
