"use client";

import {
  Receipt,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Coins,
  FileSpreadsheet,
  Rocket,
  ArrowRight,
  CheckCircle2,
  User,
  Shield,
  MapPin,
  Calendar,
} from "lucide-react";
import { FOUNDER_DATA, AreaOfExpertise } from "@/lib/founder-pricing-data";

interface FounderSectionProps {
  onScrollToEnquiry: () => void;
  onScrollToPricing: () => void;
}

const iconMap: Record<AreaOfExpertise["iconName"], React.ElementType> = {
  Receipt,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Coins,
  FileSpreadsheet,
  Rocket,
};

export default function FounderSection({
  onScrollToEnquiry,
  onScrollToPricing,
}: FounderSectionProps) {
  return (
    <section id="founder" className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-navy-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-gold-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Section Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50 text-navy-800 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            Chartered Accountant • Founder Profile
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onScrollToPricing}
              className="text-xs font-medium text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Skip to Services & Pricing
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Grid: Founder Bio & Photo Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column: Photo Placeholder & Quick Facts (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="w-full max-w-md bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-navy-700/50">
              {/* Background decorative ring */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold-500/10 blur-2xl" />

              {/* Photo Placeholder Frame */}
              <div className="relative mx-auto sm:mx-0 w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-navy-950/80 border-2 border-gold-500/30 flex flex-col items-center justify-center p-4 text-center shadow-inner group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-bold text-2xl shadow-lg mb-3">
                  SC
                </div>
                <div className="flex items-center gap-1.5 text-gold-400 text-xs font-medium">
                  <User className="w-3.5 h-3.5" />
                  <span>Founder Portrait</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight max-w-[150px]">
                  Professional photo placeholder (ready to be updated)
                </p>
              </div>

              {/* Founder Header Credentials */}
              <div className="mt-6 text-center sm:text-left">
                <div className="inline-block px-2.5 py-0.5 rounded bg-gold-500/20 text-gold-300 text-xs font-semibold mb-2">
                  Verified Chartered Accountant
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {FOUNDER_DATA.name}
                </h2>
                <p className="text-gold-400 font-medium text-sm mt-0.5">
                  {FOUNDER_DATA.designation}
                </p>

                <div className="mt-5 pt-4 border-t border-navy-700/60 space-y-2.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Chartered Accountant (ACA), B.Com (Hons)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Based in {FOUNDER_DATA.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Active Advisory Practice for Individuals & Businesses</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onScrollToEnquiry}
                    className="w-full py-2.5 px-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                  >
                    Discuss Your Requirements
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Headline, Bio, and Mission (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                MEET THE FOUNDER
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-900 tracking-tight leading-tight mt-2">
                {FOUNDER_DATA.headline}
              </h1>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              {FOUNDER_DATA.introduction.map((paragraph, index) => (
                <p key={index} className="text-justify sm:text-left">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Quick Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-900">
                    CA-Led Precision
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rigorous statutory adherence with direct Chartered Accountant oversight.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-900">
                    End-to-End Growth
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    From early-stage filing to multi-tier corporate finance and models.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onScrollToEnquiry}
                className="px-6 py-3.5 bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                Discuss Your Requirements
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToPricing}
                className="px-6 py-3.5 border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5"
              >
                View Services & Pricing Tiers
              </button>
            </div>
          </div>
        </div>

        {/* Areas of Expertise Grid */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
              PROFESSIONAL FOCUS
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 tracking-tight mt-2">
              Areas of Professional Expertise
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Verified domains of practice across taxation, wealth structuring, financial modelling, and corporate advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOUNDER_DATA.areasOfExpertise.map((item) => {
              const IconComponent = iconMap[item.iconName] || Receipt;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white border border-gray-200/80 hover:border-gold-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-gold-500 text-navy-800 group-hover:text-navy-950 flex items-center justify-center transition-colors duration-300 mb-5">
                      <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>
                    <h4 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-navy-700">
                    <span>Advisory & Execution</span>
                    <button
                      onClick={onScrollToEnquiry}
                      className="text-gold-600 hover:text-gold-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Enquire
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verified Credentials Notice */}
          <div className="mt-12 p-4 rounded-xl bg-navy-50/70 border border-navy-100/80 flex items-start sm:items-center gap-3">
            <Shield className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm text-navy-900 font-medium">
              <span className="font-bold">Verified Professional Standards: </span>
              {FOUNDER_DATA.verifiedNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
