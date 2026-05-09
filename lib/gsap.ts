/**
 * Register GSAP plugins ONCE at the app level.
 * Import this in layout.tsx or any component that mounts early.
 * Multiple calls to gsap.registerPlugin are harmless but calling
 * ScrollTrigger.refresh() at the wrong time causes body height inflation.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Prevent GSAP from inflating body scroll height
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger };
