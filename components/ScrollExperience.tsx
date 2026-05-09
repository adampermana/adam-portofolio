"use client";

import { useRef } from "react";
import ProjectsSection from "./ProjectsSection";
import FeatureCards from "./FeatureCards";
import AboutSection from "./AboutSection";
import FinalCTA from "./FinalCTA";
import GitHubContributions from "./GitHubContributions";
import CareerNetwork from "./CareerNetwork";

export default function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    /**
     * overflow-hidden is CRITICAL — it clips the absolute overlay divs
     * so they don't bleed outside the container and inflate page scroll height.
     * background-attachment:fixed keeps astronaut image pinned to viewport.
     */
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: "url('/astronot-static.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark tint over the background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-space-black/80" />
      {/* Subtle radial blue glow accent */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(59,167,255,0.10),transparent_70%)]" />

      {/* Sections scroll over the background */}
      <div className="relative z-10">
        <ProjectsSection />
        <FeatureCards />
        {/* Perjalanan karier */}
        <CareerNetwork />
        <GitHubContributions />
        <AboutSection />
        <FinalCTA />
      </div>
    </div>
  );
}
