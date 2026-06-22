"use client";

import { LazyDither } from "@/components/codeforge/animations/lazy-dither";
import { CompanyShowcase } from "@/components/codeforge/section/company-showcase";
import { ConnectSection } from "@/components/codeforge/section/connection-section";
import { CTASection } from "@/components/codeforge/section/cta-section";
import { DemoSection } from "@/components/codeforge/section/demo-section";
import { FAQSection } from "@/components/codeforge/section/faq-section";
import { FeatureSection } from "@/components/codeforge/section/feature-section";
import { Footer } from "@/components/codeforge/section/footer";
import { HeroSection } from "@/components/codeforge/section/hero-section";
import { PricingSection } from "@/components/codeforge/section/pricing-section";
import { TestimonialSection } from "@/components/codeforge/section/testimonial-section";
import { WorkflowConnectSection } from "@/components/codeforge/section/workflow-connect-section";
import { WorkflowSection } from "@/components/codeforge/section/workflow-section";
import { StructuredData } from "@/components/seo/structured-data";
import { siteConfig } from "@/lib/codeforge/config";
import { absoluteUrl, seoConfig } from "@/lib/seo";

export function CodeforgeHome() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: seoConfig.name,
      url: seoConfig.siteUrl,
      description: seoConfig.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: seoConfig.name,
      url: seoConfig.siteUrl,
      logo: absoluteUrl("/logo.png"),
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: seoConfig.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, macOS, Windows, Linux",
      url: seoConfig.siteUrl,
      image: absoluteUrl("/logo.png"),
      description: seoConfig.description,
      offers: siteConfig.pricing.pricingItems.map((plan) => ({
        "@type": "Offer",
        price: plan.price.replace("$", ""),
        priceCurrency: "USD",
        category: "subscription",
        name: plan.name,
      })),
      featureList: [
        "Import coding sessions",
        "Search commands and diffs",
        "Recover debugging context",
        "Keep local-first project memory",
        "Ask questions against private workspace history",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: siteConfig.faqSection.faQitems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main className="flex flex-col divide-y divide-border pt-16">
        <HeroSection />
        <DemoSection />
        <CompanyShowcase />
        <WorkflowSection />
        <WorkflowConnectSection />
        <FeatureSection />
        <ConnectSection />
        <TestimonialSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
        <LazyDither />
      </main>
    </>
  );
  
}
