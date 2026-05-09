"use client";

import { Gauge, Layers, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const capabilities: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Mobile Interfaces",
    description: "Flutter screens, navigation systems, and interaction patterns shaped for everyday use.",
    icon: Layers,
  },
  {
    title: "Product Delivery",
    description: "Practical builds that balance visual detail, performance, maintainability, and release needs.",
    icon: ShieldCheck,
  },
  {
    title: "Frontend Systems",
    description: "Next.js and React interfaces with clean component structure and smooth motion where it helps.",
    icon: Gauge,
  },
];

export default function FeatureCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0, x: -16, letterSpacing: "0.6em" },
          {
            opacity: 1, x: 0, letterSpacing: "0.34em", duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: labelRef.current, start: "top 88%" }
          },
        );
      }

      if (headingRef.current) {
        const words = headingRef.current.innerText.split(" ");
        headingRef.current.innerHTML = words
          .map((w) => `<span class="fc-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">${w}</span></span>`)
          .join(" ");
        gsap.fromTo(
          headingRef.current.querySelectorAll<HTMLElement>(".fc-word > span"),
          { y: "105%", opacity: 0 },
          {
            y: "0%", opacity: 1, duration: 0.8, stagger: 0.07, ease: "power4.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 86%" }
          },
        );
      }

      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: bodyRef.current, start: "top 88%" }
          },
        );
      }

      if (cardsWrapRef.current) {
        const cards = cardsWrapRef.current.querySelectorAll<HTMLElement>(".fc-card");
        gsap.fromTo(cards,
          { opacity: 0, y: 60, rotateX: 14, scale: 0.9, transformOrigin: "top center" },
          {
            opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: cardsWrapRef.current, start: "top 82%" }
          },
        );

        const icons = cardsWrapRef.current.querySelectorAll<HTMLElement>(".fc-icon");
        gsap.fromTo(icons,
          { scale: 0, rotate: -20, opacity: 0 },
          {
            scale: 1, rotate: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(2)",
            scrollTrigger: { trigger: cardsWrapRef.current, start: "top 80%" }
          },
        );

        cards.forEach((card) => {
          const tl = gsap.timeline({ paused: true });
          tl.to(card, { y: -8, borderColor: "rgba(59,167,255,0.45)", backgroundColor: "rgba(255,255,255,0.07)", boxShadow: "0 0 40px rgba(59,167,255,0.18)", duration: 0.3, ease: "power2.out" });
          card.addEventListener("mouseenter", () => tl.play());
          card.addEventListener("mouseleave", () => tl.reverse());
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="relative z-10 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p ref={labelRef} className="mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80" style={{ opacity: 0 }}>
            Stack / Capabilities
          </p>
          <h2 ref={headingRef} className="font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
            Built around mobile-first execution.
          </h2>
          <p ref={bodyRef} className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg" style={{ opacity: 0 }}>
            The visual style stays cinematic, but the work stays grounded: clean app flows, sensible architecture, and interfaces that are easy to keep improving.
          </p>
        </div>

        <div ref={cardsWrapRef} className="grid gap-5 md:grid-cols-3" style={{ perspective: "800px" }}>
          {capabilities.map(({ title, description, icon: Icon }) => (
            <div key={title} className="fc-card rounded-[18px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl" style={{ opacity: 0, transformStyle: "preserve-3d" }}>
              <div className="fc-icon mb-7" style={{ opacity: 0 }}>
                <Icon className="h-6 w-6 text-atm-blue" strokeWidth={1.6} />
              </div>
              <h3 className="font-orbitron text-lg font-bold uppercase tracking-tight text-white">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
