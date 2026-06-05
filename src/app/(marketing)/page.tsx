"use client";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { CodeExamplesSection } from "@/components/marketing/code-examples-section";
// import { PricingSection } from "@/components/marketing/pricing-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <FeaturesSection />
            <TechStackSection />
            <CodeExamplesSection />
            {/* <PricingSection /> */}
            <CTASection />
        </div>
    );
}
