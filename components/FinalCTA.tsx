"use client";

import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Auto-open modal when navigated here with ?openform=1
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("openform") === "1") {
      setIsProjectFormOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("openform");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Background glow breathe ───────────────────────────────────────
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.3,
          opacity: 0.22,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ── Label fade in ─────────────────────────────────────────────────
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0, y: 12, letterSpacing: "0.55em" },
          {
            opacity: 1, y: 0, letterSpacing: "0.34em", duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: labelRef.current, start: "top 88%" }
          },
        );
      }

      // ── Heading: word-by-word clip reveal ─────────────────────────────
      if (headingRef.current) {
        const words = headingRef.current.innerText.split(" ");
        headingRef.current.innerHTML = words
          .map((w) => `<span class="cta-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">${w}</span></span>`)
          .join(" ");
        gsap.fromTo(
          headingRef.current.querySelectorAll<HTMLElement>(".cta-word > span"),
          { y: "110%", opacity: 0, skewY: 5 },
          {
            y: "0%", opacity: 1, skewY: 0, duration: 1, stagger: 0.08, ease: "power4.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 86%" }
          },
        );
      }

      // ── Body paragraph ────────────────────────────────────────────────
      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: bodyRef.current, start: "top 88%" }
          },
        );
      }

      // ── Buttons pop-in ────────────────────────────────────────────────
      if (btnsRef.current) {
        const btns = btnsRef.current.children;
        gsap.fromTo(btns,
          { opacity: 0, y: 24, scale: 0.92 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.5)",
            scrollTrigger: { trigger: btnsRef.current, start: "top 98%" }
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden px-6 py-24 md:px-12"
    >
      <div className="star-field absolute inset-0 opacity-[0.25]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-atm-blue/[0.12] via-space-black/70 to-transparent" />
      <div
        ref={glowRef}
        className="absolute -bottom-[22rem] left-1/2 h-[34rem] w-[120vw] -translate-x-1/2 rounded-[100%] bg-atm-blue/16 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p ref={labelRef} className="mb-5 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80">
          Available for focused builds
        </p>
        <h2 ref={headingRef} className="font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-7xl">
          Let the work speak first.
        </h2>
        <p ref={bodyRef} className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
          Explore the selected projects, then follow the code trail on GitHub.
          The site stays cinematic, but the goal is simple: show clear craft and
          useful mobile product thinking.
        </p>

        <div ref={btnsRef} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setIsProjectFormOpen(true)}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-soft-white px-6 py-3 text-sm font-semibold text-space-black transition duration-300 hover:bg-atm-blue"
          >
            Start Project
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <a
            href="https://www.linkedin.com/in/adam-permana-457128193"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>
      </div>

      {isProjectFormOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-space-black/80 px-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="start-project-title"
        >
          <button
            type="button"
            aria-label="Close start project form"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsProjectFormOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-space-black/95 p-6 text-left shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:p-8">
            <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-atm-blue/20 blur-[90px]" />
            <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/5 blur-[100px]" />
            <div className="relative z-10">
              <div className="mb-7 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-3 font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-atm-blue/80">Project Inquiry</p>
                  <h3 id="start-project-title" className="font-orbitron text-3xl font-black uppercase leading-none tracking-tight text-white md:text-4xl">
                    Start Project
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition duration-300 hover:border-atm-blue/40 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form action="https://formspree.io/f/mayzwdel" method="POST" className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Nama</span>
                  <input name="nama" type="text" required className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-atm-blue/60 focus:bg-white/[0.07]" placeholder="Nama kamu" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Email</span>
                  <input name="email" type="email" required className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-atm-blue/60 focus:bg-white/[0.07]" placeholder="nama@email.com" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Description</span>
                  <textarea name="description" required rows={5} className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-atm-blue/60 focus:bg-white/[0.07]" placeholder="Ceritakan project yang ingin dibuat..." />
                </label>
                <button type="submit" className="group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-soft-white px-6 py-3 text-sm font-semibold text-space-black transition duration-300 hover:bg-atm-blue">
                  Send Project Request
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
