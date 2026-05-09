"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import InfoSection from "./InfoSection";
import FeatureCards from "./FeatureCards";
import AboutSection from "./AboutSection";
import FinalCTA from "./FinalCTA";
import GitHubContributions from "./GitHubContributions";
import CareerNetwork from "./CareerNetwork";

export default function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">

      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(59,167,255,0.14),transparent_38%),linear-gradient(180deg,#02040A,#07111F_48%,#02040A)]" />
      </motion.div>

      <div className="relative z-10">
        <InfoSection />
        <FeatureCards />
        {/* import Perjalanan karier saya dibawah sini*/}
        <CareerNetwork />
        <GitHubContributions />
        <AboutSection />
        <FinalCTA />
      </div>
    </div>
  );
}
