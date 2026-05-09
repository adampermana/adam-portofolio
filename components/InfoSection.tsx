"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function InfoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Heading lines split animation ─────────────────────────────────
      const label = headingRef.current?.querySelector(".anim-label") as HTMLElement | null;
      const heading = headingRef.current?.querySelector(".anim-heading") as HTMLElement | null;

      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, y: 14, letterSpacing: "0.6em" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.34em",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: label,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (heading) {
        // Split heading into individual words for stagger
        const words = heading.innerText.split(" ");
        heading.innerHTML = words
          .map((w) => `<span class="anim-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">${w}</span></span>`)
          .join(" ");

        const innerSpans = heading.querySelectorAll<HTMLElement>(".anim-word > span");

        gsap.fromTo(
          innerSpans,
          { y: "105%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.85,
            stagger: 0.06,
            ease: "power4.out",
            scrollTrigger: {
              trigger: heading,
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
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // ── Project cards ─────────────────────────────────────────────────
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>(".project-card");

        gsap.fromTo(
          cards,
          { opacity: 0, y: 56, scale: 0.94, rotateX: 4 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.13,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );

        // Subtle hover tilt on mouse move per card
        cards.forEach((card) => {
          const handleMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
            gsap.to(card, {
              rotateY: x,
              rotateX: y,
              transformPerspective: 900,
              duration: 0.4,
              ease: "power2.out",
            });
          };
          const handleLeave = () => {
            gsap.to(card, {
              rotateY: 0,
              rotateX: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.7)",
            });
          };
          card.addEventListener("mousemove", handleMove);
          card.addEventListener("mouseleave", handleLeave);
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32"
    >
      <div className="absolute left-0 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-atm-blue/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div
          ref={headingRef}
          className="mb-14 grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end"
        >
          <div>
            <p className="anim-label mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80">
              Selected Work
            </p>
            <h2 className="anim-heading font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
              Mobile apps with real product weight.
            </h2>
          </div>
          <p
            ref={bodyRef}
            className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg"
          >
            The work focuses on operational mobile products: clear flows,
            reliable interaction, and interfaces that help teams move faster
            without making the experience feel heavy.
          </p>
        </div>

        {/* ── Cards ────────────────────────────────────────────────────── */}
        <div
          ref={cardsRef}
          className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3"
          style={{ perspective: "1000px" }}
        >
          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <div key={project.name} className="project-card" style={{ transformStyle: "preserve-3d" }}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative flex h-full min-h-[430px] overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] outline-none backdrop-blur-xl transition-[border-color,background-color] duration-500 hover:border-atm-blue/40 hover:bg-white/[0.06] focus-visible:border-atm-blue/70 focus-visible:ring-2 focus-visible:ring-atm-blue/30"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-70 transition duration-500 group-hover:opacity-100`}
                  />
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-atm-blue/10 blur-[70px] transition duration-500 group-hover:bg-atm-blue/20" />
                  <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-space-black/70 to-transparent" />

                  <div className="relative z-10 flex w-full flex-col">
                    <div className="relative h-56 overflow-hidden border-b border-white/10 bg-space-black/70">
                      <Image
                        src={project.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="scale-125 object-cover opacity-25 blur-xl transition duration-700 group-hover:scale-[1.32]"
                      />
                      <Image
                        src={project.cover}
                        alt={`${project.name} project preview`}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-contain p-4 drop-shadow-[0_18px_42px_rgba(0,0,0,0.45)] transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-space-black/45 via-transparent to-white/[0.03]" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-8 flex items-center justify-between">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-space-black/35 text-atm-blue shadow-[0_0_30px_rgba(59,167,255,0.12)] backdrop-blur-md transition duration-500 group-hover:scale-105 group-hover:border-atm-blue/35 group-hover:text-white">
                            <Icon className="h-5 w-5" strokeWidth={1.6} />
                          </span>
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-500 transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-atm-blue/40 group-hover:text-atm-blue">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gray-500">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <span className="h-px flex-1 bg-white/10" />
                          <span>{project.year}</span>
                        </div>
                        <p className="mb-3 text-sm text-atm-blue/80">
                          {project.category}
                        </p>
                        <h3 className="font-orbitron text-2xl font-bold uppercase leading-none tracking-tight text-white md:text-3xl">
                          {project.name}
                        </h3>
                        <p className="mt-5 text-sm leading-relaxed text-gray-300">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2 border-t border-white/[0.08] pt-5">
                        {project.stack.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-space-black/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
