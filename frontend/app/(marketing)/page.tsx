import React from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SolutionsSection } from "@/components/marketing/SolutionsSection";
import { BentoGridSection } from "@/components/marketing/BentoGridSection";
import { UseCasesSection } from "@/components/marketing/UseCasesSection";
import { IntegrationsSection } from "@/components/marketing/IntegrationsSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CtaSection } from "@/components/marketing/CtaSection";

export default function LandingPage() {
  return (
    <div className="space-y-24 sm:space-y-32 pb-32">
      {/* 1. Hero Section with Top Badge, Sizing, and 4 Corner Widgets */}
      <HeroSection />

      {/* 2. Solutions Section (Cyan console frame + 20 and Checkmark badges) */}
      <SolutionsSection />

      {/* 3. Bento Grid (4 Cards matching reference Bento design) */}
      <BentoGridSection />

      {/* 4. Live Interactive Use Cases (Precious, Shola, Michael, Auto-Responder) */}
      <UseCasesSection />

      {/* 5. Integrations Grid Matrix */}
      <IntegrationsSection />

      {/* 6. Testimonials Masonry + Video Case Study Badge */}
      <TestimonialsSection />

      {/* 7. Pricing Plans with Hero Blue Card & 3D Lightning Bolt */}
      <PricingSection />

      {/* 8. Bottom CTA Section */}
      <CtaSection />
    </div>
  );
}
