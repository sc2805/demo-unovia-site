"use client";

import { useState } from "react";
import FounderSection from "./FounderSection";
import PricingSection from "./PricingSection";
import ConsultationEnquiryForm from "./ConsultationEnquiryForm";
import { PricingTier } from "@/lib/founder-pricing-data";

export default function FounderPricingClient() {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleScrollToEnquiry = () => {
    const el = document.getElementById("enquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectTier = (tier: PricingTier) => {
    setSelectedTier(tier);
    handleScrollToEnquiry();
  };

  return (
    <>
      {/* Section A: Meet the Founder */}
      <FounderSection
        onScrollToEnquiry={handleScrollToEnquiry}
        onScrollToPricing={handleScrollToPricing}
      />

      {/* Section B: Consulting Services & Pricing */}
      <PricingSection onSelectTier={handleSelectTier} />

      {/* Section C: Consultation Enquiry & Lead Generation Form */}
      <ConsultationEnquiryForm selectedTier={selectedTier} />
    </>
  );
}
