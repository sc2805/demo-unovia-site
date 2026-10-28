"use client";

import { Check, ArrowRight, Info, Sparkles, ShieldAlert } from "lucide-react";
import { PRICING_TIERS, PRICING_DISCLAIMERS, PricingTier } from "@/lib/founder-pricing-data";

interface PricingSectionProps {
  onSelectTier: (tier: PricingTier) => void;
}

export default function PricingSection({ onSelectTier }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Transparent Engagement Tiers
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
            Professional Financial Services for Every Stage
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
            Choose a service based on your financial needs, from individual tax assistance to customised business finance and strategic consulting.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Structured advisory engagements covering values from <span className="font-semibold text-navy-900">₹1,000</span> to <span className="font-semibold text-navy-900">₹1,00,000</span>.
          </div>
        </div>

        {/* 5-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? "bg-white border-2 border-gold-500 shadow-xl shadow-gold-500/10 lg:-translate-y-2"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300"
                } p-6 sm:p-8`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-navy-950" />
                    {tier.badge || "Most Popular"}
                  </div>
                )}

                <div>
                  {/* Tier Title & Price Range */}
                  <div className="border-b border-gray-100 pb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
                      Tier {tier.tierNumber}
                    </span>
                    <h3 className="text-xl font-bold text-navy-900 mt-1">
                      {tier.name.replace(`Tier ${tier.tierNumber}: `, "")}
                    </h3>

                    {/* Price Range */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        {tier.rangeText}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Indicative starting estimate (excl. GST)
                    </span>

                    <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                      {tier.summary}
                    </p>
                  </div>

                  {/* Potential Services Included */}
                  <div className="py-6">
                    <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-3">
                      Potential Services Covered:
                    </span>
                    <ul className="space-y-2.5">
                      {tier.potentialServices.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  {/* Target Audience Note */}
                  <div className="p-3 rounded-lg bg-gray-50 text-[11px] text-gray-500 mb-5 leading-normal border border-gray-100">
                    <span className="font-semibold text-gray-700">Best for: </span>
                    {tier.recommendedFor}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onSelectTier(tier)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-navy-800 hover:bg-navy-700 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-100 hover:bg-navy-800 hover:text-white text-navy-900"
                    }`}
                  >
                    <span>Enquire for {tier.name.split(":")[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clarification & Pricing Policies Card */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <Info className="w-5 h-5 text-gold-600 flex-shrink-0" />
            <h4 className="text-base sm:text-lg font-bold text-navy-900">
              Pricing Clarity, Transparency & Professional Standards
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_DISCLAIMERS.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {item.title}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-amber-700 bg-amber-50/70 p-3 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Regulatory Integrity:</strong> Unovia Consulting does not promise or market guaranteed investment returns or guaranteed tax savings. All advice strictly adheres to applicable Indian regulatory acts and professional guidelines.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
