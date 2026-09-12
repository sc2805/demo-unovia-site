"use client";

// =============================================================================
// SaaS Features & Pricing Section
// Highlighting capabilities, ROI calculator, and CA firm pricing tiers
// =============================================================================

import { Check, Zap, ShieldCheck, FileSpreadsheet, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SaaSFeaturesPricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Starter / Trial",
      tagline: "Ideal for individual accountants & small traders",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "Up to 100 Transactions / Month",
        "Sales & Purchase XML Generator",
        "100% Client-Side Privacy",
        "Downloadable Excel Templates",
        "Basic Error Validation",
        "Community Support",
      ],
      ctaText: "Start Free Now",
      highlight: false,
    },
    {
      name: "Pro CA / Business",
      tagline: "Designed for CA Firms, Tax Consultants & Growing SMBs",
      priceMonthly: 799,
      priceYearly: 599, // Per month billed annually
      features: [
        "Unlimited Transactions / Month",
        "All Voucher Types (Sales, Purchase, Bank, JV)",
        "Automated GST Split (CGST/SGST/IGST)",
        "Smart Auto Column & Ledger Mapper",
        "Bulk Multi-Sheet Batch Importer",
        "Direct HTTP Push API (Port 9000)",
        "Priority CA Desk Support",
      ],
      ctaText: "Upgrade to Pro",
      highlight: true,
    },
    {
      name: "Enterprise TDL",
      tagline: "For Corporates, Multi-Branch & ERP Integrations",
      priceMonthly: 1999,
      priceYearly: 1499,
      features: [
        "Everything in Pro CA Plan",
        "Custom TDL (Tally Definition Language) Module",
        "Custom Excel Header Mapping Engine",
        "API Integration with ERP / CRM / SAP",
        "Dedicated Account Manager & SLA",
        "On-Premises Deployment Option",
      ],
      ctaText: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-navy-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Features Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-800 border border-navy-200">
            <Zap className="w-3.5 h-3.5 text-gold-500" />
            Built for Tally Prime & ERP 9
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Why Modern CA Firms Choose Our Tally Importer
          </h2>
          <p className="text-base text-gray-600">
            Stop spending hours manually entering vouchers. Convert 10,000+ Excel entries into Tally in under 3 minutes with zero errors.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">100% Data Security</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your sensitive financial ledger data never touches any external cloud server. All Excel parsing & XML rendering is processed locally inside your web browser.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Automated Tax Calculation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Auto-calculates CGST, SGST, and IGST splits based on customer GSTIN and state codes. Handles exempt and multi-rate GST invoices seamlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Bank Statement Auto-Sync</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Supports statements from HDFC, ICICI, SBI, Axis, Kotak, and PNB. Converts raw bank CSV entries into Payment & Receipt vouchers in one click.
            </p>
          </div>
        </div>

        {/* Pricing Toggle */}
        <div className="text-center space-y-6 pt-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-navy-900">Transparent Plans for Every Firm</h3>
            <p className="text-sm text-gray-600">Start with our free trial tier. Upgrade when your volume grows.</p>
          </div>

          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                billingCycle === "monthly" ? "bg-white text-navy-900 shadow-sm" : "text-gray-600 hover:text-navy-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-navy-900 text-white shadow-sm" : "text-gray-600 hover:text-navy-900"
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 text-[10px] font-bold bg-gold-400 text-navy-950 rounded-full">Save 25%</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
                  plan.highlight
                    ? "bg-navy-900 text-white shadow-2xl ring-2 ring-gold-400 transform md:-translate-y-2"
                    : "bg-white text-gray-900 border border-gray-200 shadow-md hover:shadow-xl"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-gold-400 text-navy-950 uppercase tracking-wider shadow-sm">
                    Most Popular for CAs
                  </span>
                )}

                <div>
                  <div className="space-y-1 mb-6 text-left">
                    <h4 className={`text-xl font-bold ${plan.highlight ? "text-white" : "text-navy-900"}`}>{plan.name}</h4>
                    <p className={`text-xs ${plan.highlight ? "text-navy-200" : "text-gray-500"}`}>{plan.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6 text-left">
                    <span className="text-3xl font-extrabold">
                      ₹{billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className={`text-xs ${plan.highlight ? "text-navy-300" : "text-gray-500"}`}>
                      / month {billingCycle === "yearly" && plan.priceYearly > 0 ? "(billed annually)" : ""}
                    </span>
                  </div>

                  <div className="space-y-3 text-left mb-8">
                    <p className={`text-xs font-bold uppercase tracking-wider ${plan.highlight ? "text-gold-400" : "text-gray-400"}`}>
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-xs">
                          <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-gold-400" : "text-emerald-600"}`} />
                          <span className={plan.highlight ? "text-navy-100" : "text-gray-700"}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <a
                    href="#importer-workspace"
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-gold-400 text-navy-950 hover:bg-gold-300 shadow-lg shadow-gold-400/20"
                        : "bg-navy-900 text-white hover:bg-navy-800"
                    }`}
                  >
                    {plan.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
