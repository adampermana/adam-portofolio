"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import ScrollStack, { ScrollStackItem } from "./ui/ScrollStack";

const FEATURED_PROJECTS = projects.slice(0, 3);

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 md:px-12 md:pb-24 md:pt-24"
    >
      <div className="pointer-events-none absolute left-0 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-atm-blue/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <p className="mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80">
            Selected Work
          </p>
          <h2 className="font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
            Mobile apps with real product weight.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            The work focuses on operational mobile products: clear flows,
            reliable interaction, and interfaces that help teams move faster
            without making the experience feel heavy.
          </p>
        </div>

        {/* Stacking cards with ScrollStack */}
        <ScrollStack
          useWindowScroll={true}
          itemScale={0.06}
          itemStackDistance={30}
          itemDistance={100}
          baseScale={0.88}
          stackPosition="15%"
          scaleEndPosition="8%"
          startPaddingClassName="pt-4 md:pt-6"
          endPaddingClassName="pb-40 md:pb-56"
          className="w-full"
        >
          {FEATURED_PROJECTS.map((project, index) => (
            <ScrollStackItem
              key={project.slug}
              itemClassName="!h-auto overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] !p-4 backdrop-blur-xl sm:!p-6 md:!p-8"
            >
              {/* Accent gradient overlay */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br ${project.accent} opacity-30`}
              />

              {/* Top row */}
              <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-orbitron text-[clamp(2rem,7vw,5rem)] font-black leading-none text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-orbitron text-[10px] font-semibold uppercase tracking-[0.3em] text-atm-blue/80 sm:text-xs">
                      {project.category}
                    </p>
                    <h3 className="font-orbitron text-lg font-black uppercase leading-none tracking-tight text-white sm:text-2xl md:text-3xl">
                      {project.name}
                    </h3>
                  </div>
                </div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 font-orbitron text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-md transition duration-300 hover:border-atm-blue/50 hover:bg-atm-blue/10 hover:text-white sm:px-6 sm:py-2.5 sm:text-xs"
                >
                  View Project
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
                </Link>
              </div>

              {/* Two-column image layout */}
              <div className="relative z-10 grid gap-3 sm:gap-4 md:grid-cols-[0.9fr_1.35fr]">
                {/* Left — two stacked images */}
                <div className="grid gap-3 sm:gap-4">
                  <div
                    className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] backdrop-blur-xl sm:rounded-[28px]"
                    style={{ height: "clamp(120px, 14vw, 190px)" }}
                  >
                    <Image
                      src={project.cover}
                      alt={`${project.name} preview 1`}
                      fill
                      sizes="(min-width: 768px) 20vw, 40vw"
                      className="scale-125 object-cover opacity-30 blur-xl"
                    />
                    <Image
                      src={project.cover}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(min-width: 768px) 20vw, 40vw"
                      className="object-contain p-3 drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  <div
                    className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] backdrop-blur-xl sm:rounded-[28px]"
                    style={{ height: "clamp(170px, 20vw, 240px)" }}
                  >
                    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
                      <div>
                        <p className="font-orbitron text-[9px] font-semibold uppercase tracking-[0.28em] text-atm-blue/80 sm:text-[10px]">
                          {project.year} - {project.role}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-gray-300 sm:text-sm">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 font-orbitron text-[8px] font-medium uppercase tracking-[0.14em] text-gray-400 backdrop-blur-xl sm:px-3 sm:text-[9px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — tall main image */}
                <div
                  className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] backdrop-blur-xl sm:rounded-[28px]"
                  style={{ height: "clamp(300px, 42vw, 430px)" }}
                >
                  <div
                    className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${project.accent} opacity-60 sm:rounded-[28px]`}
                  />
                  <Image
                    src={project.cover}
                    alt={`${project.name} main preview`}
                    fill
                    sizes="(min-width: 768px) 36vw, 60vw"
                    className="object-contain p-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>

        {/* CTA */}
        <div className="flex justify-center pb-4 pt-2">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 font-orbitron text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md transition duration-300 hover:border-atm-blue/50 hover:bg-atm-blue/10 hover:text-white"
          >
            Open Project Archive
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
