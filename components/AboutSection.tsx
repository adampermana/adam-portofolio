"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  "Flutter / Dart for production mobile apps",
  "React and Next.js for polished web interfaces",
  "Firebase-backed product workflows",
  "Operational apps for HR, field reporting, and smart office teams",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const highlightWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Astronaut image: clip-path reveal + float ─────────────────────
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 40 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        // Continuous float animation
        gsap.to(imageWrapRef.current, {
          y: -14,
          rotate: 1.5,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2,
        });
      }

      // ── Glow pulse ────────────────────────────────────────────────────
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.25,
          opacity: 0.28,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ── Label eyebrow ─────────────────────────────────────────────────
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, x: -20, letterSpacing: "0.6em" },
          {
            opacity: 1,
            x: 0,
            letterSpacing: "0.34em",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: labelRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // ── Heading: char-by-char reveal ──────────────────────────────────
      if (headingRef.current) {
        const text = headingRef.current.innerText;
        headingRef.current.innerHTML = text
          .split("")
          .map((ch) =>
            ch === " "
              ? " "
              : `<span class="about-char" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">${ch}</span></span>`,
          )
          .join("");

        gsap.fromTo(
          headingRef.current.querySelectorAll<HTMLElement>(".about-char > span"),
          { y: "110%", opacity: 0, rotate: 4 },
          {
            y: "0%",
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            stagger: 0.018,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // ── Body paragraph ────────────────────────────────────────────────
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // ── Highlight cards: stagger + slide-up ──────────────────────────
      if (highlightWrapRef.current) {
        const cards = highlightWrapRef.current.querySelectorAll<HTMLDivElement>(".hl-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: highlightWrapRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );

        // Hover shimmer on each card
        cards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              borderColor: "rgba(59,167,255,0.35)",
              backgroundColor: "rgba(59,167,255,0.07)",
              y: -3,
              duration: 0.3,
              ease: "power2.out",
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              borderColor: "rgba(255,255,255,0.10)",
              backgroundColor: "rgba(255,255,255,0.035)",
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32"
    >
      <div className="absolute right-0 top-0 h-[560px] w-[560px] translate-x-1/3 rounded-full bg-atm-blue/10 blur-[130px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

        {/* ── Astronaut image ───────────────────────────────────────────── */}
        <div
          ref={imageWrapRef}
          className="relative mx-auto h-[390px] w-full max-w-[430px] lg:mx-0 lg:h-[520px]"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          <div
            ref={glowRef}
            className="absolute inset-[14%] rounded-full bg-atm-blue/16 blur-[72px]"
          />
          <div className="relative h-full w-full">
            <Image
              src="/images/astronaut-space.png"
              alt="Astronaut accent for the portfolio"
              fill
              sizes="(min-width: 1024px) 430px, 90vw"
              className="object-contain opacity-90 drop-shadow-[0_24px_54px_rgba(59,167,255,0.22)]"
            />
          </div>
        </div>

        {/* ── Text content ──────────────────────────────────────────────── */}
        <div>
          <p
            ref={labelRef}
            className="mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80"
            style={{ opacity: 0 }}
          >
            About / Experience
          </p>
          <h2
            ref={headingRef}
            className="font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Calm interfaces for busy products.
          </h2>
          <p
            ref={bodyRef}
            className="mt-7 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg"
            style={{ opacity: 0 }}
          >
            Adam builds mobile experiences with a practical eye: clear screens,
            reliable flows, and enough visual polish to make a product feel
            intentional without slowing people down.
          </p>

          <div
            ref={highlightWrapRef}
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            {highlights.map((item) => (
              <div
                key={item}
                className="hl-card rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm leading-relaxed text-gray-300"
                style={{ opacity: 0 }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
