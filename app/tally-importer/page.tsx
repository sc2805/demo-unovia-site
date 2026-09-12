import type { Metadata } from "next";
import ImporterDashboard from "@/components/tally-importer/ImporterDashboard";
import SaaSFeaturesPricing from "@/components/tally-importer/SaaSFeaturesPricing";
import CTABanner from "@/components/sections/CTABanner";
import { Shield, Zap, CheckCircle2, Server, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tally Excel Importer SaaS — Convert Excel & CSV to Tally Prime XML",
  description:
    "Automated Tally Excel Importer tool for CA firms and accountants. Convert Sales, Purchase, Bank Statements, and Journal entries from Excel directly into Tally Prime XML envelopes.",
  keywords: [
    "Tally Excel Importer",
    "Excel to Tally Prime",
    "Import vouchers to Tally",
    "Tally XML Converter",
    "Tally Bank Statement Import",
    "GST Sales Excel to Tally",
    "Unovia Consulting Tally SaaS",
  ],
};

export default function TallyImporterPage() {
  return (
    <div className="bg-gray-50/50 pt-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-gold-400/20 text-gold-300 border border-gold-400/30">
            <Zap className="w-4 h-4 text-gold-400" />
            Enterprise Tally Automation SaaS
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Import Excel & Bank Statements to <span className="text-gold-400">Tally Prime</span> in Seconds
          </h1>

          <p className="text-base sm:text-lg text-navy-200 max-w-3xl mx-auto leading-relaxed">
            Eliminate manual voucher entry. Convert sales, purchases, bank statements, payments, and journal entries from Excel into valid Tally XML ready for 1-click import.
          </p>

          {/* Quick Features Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-navy-200 font-semibold pt-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              100% In-Browser Privacy
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tally Prime 1.0 - 4.0+ & ERP 9
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Direct Port 9000 Push API
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Workspace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        <ImporterDashboard />
      </section>

      {/* SaaS Features & Pricing */}
      <SaaSFeaturesPricing />

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-800">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900">
              Everything You Need to Know About Tally Import
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-2">
              <h4 className="font-bold text-navy-900 text-base">Is my financial data safe when uploading Excel files?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes, absolutely. Our Tally Importer operates completely on your local web browser. Your client data, ledger names, and bank statements are parsed directly inside JavaScript without being sent or stored on external servers.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-2">
              <h4 className="font-bold text-navy-900 text-base">Which versions of Tally are supported?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                The generated XML format complies with standard Tally XML schema specifications and is fully compatible with Tally Prime (all versions 1.0 through 4.0+) as well as Tally.ERP 9.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-2">
              <h4 className="font-bold text-navy-900 text-base">How does CGST, SGST, and IGST tax splitting work?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                When you specify a GST rate (e.g. 18%), the importer automatically splits the tax into 9% CGST and 9% SGST for intra-state transactions, or 18% IGST for inter-state transactions. You can also override exact tax amounts directly in the live data grid.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-2">
              <h4 className="font-bold text-navy-900 text-base">Can I push transactions directly into Tally without saving XML files?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes! Tally Prime includes a built-in XML HTTP Server on Port 9000. Our importer generates a 1-click PowerShell/cURL command that posts the XML payload straight into your open Tally instance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </div>
  );
}
