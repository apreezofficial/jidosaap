import React from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SubdomainClaimer } from "@/components/marketing/SubdomainClaimer";
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

      {/* 2. Subdomain Claimer (*.jidosaap.xyz) */}
      <SubdomainClaimer />

      {/* 3. Solutions Section (Cyan console frame + 20% badge) */}
      <SolutionsSection />

      {/* 4. Bento Grid (4 Cards matching ChronoTask Bento design) */}
      <BentoGridSection />

      {/* 5. Live Interactive Use Cases (Precious, Shola, Michael, Auto-Responder) */}
      <UseCasesSection />

      {/* 6. Integrations Grid Matrix */}
      <IntegrationsSection />

      {/* 7. Testimonials Masonry + Video Case Study Badge */}
      <TestimonialsSection />

      {/* 8. Pricing Plans with Hero Blue Card & 3D Lightning Bolt */}
      <PricingSection />

      {/* 9. Bottom CTA Section */}
      <CtaSection />
    </div>
  );
}
