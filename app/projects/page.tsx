import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "All Projects | Adam Permana",
  description:
    "Explore all of my mobile app projects, from operational tools to enterprise solutions.",
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space-black px-6 pb-20 pt-32 md:px-12 md:pb-28">
      <div className="star-field absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(59,167,255,0.18),transparent_34%),linear-gradient(180deg,#02040A_0%,#07111F_44%,#02040A_100%)]" />
      <div className="absolute -left-32 top-44 h-[520px] w-[520px] rounded-full bg-atm-blue/10 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[440px] w-[440px] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <Link
            href="/#work"
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-gray-300 backdrop-blur-xl transition duration-300 hover:border-atm-blue/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <p className="mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80">
            All Work
          </p>
          <h1 className="font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
            Complete Project Portfolio
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            A collection of mobile applications and operational products built
            with focus on user experience, clear interaction patterns, and
            reliable performance.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-space-black/50 backdrop-blur-xl transition duration-300 hover:border-atm-blue/50 hover:bg-space-black/70"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-30 transition duration-300 group-hover:opacity-40`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col p-5 md:p-6">
                {/* Project Number & Title */}
                <div className="mb-4">
                  <p className="font-orbitron text-[10px] font-semibold uppercase tracking-[0.3em] text-atm-blue/80">
                    {project.category}
                  </p>
                  <h3 className="font-orbitron text-xl font-black uppercase leading-tight tracking-tight text-white md:text-2xl">
                    {project.name}
                  </h3>
                </div>

                {/* Year and Role */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-orbitron text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-300">
                    {project.year}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                    {project.role}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-5 text-sm leading-relaxed text-gray-300">
                  {project.description}
                </p>

                {/* Stack Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-orbitron text-[8px] font-semibold uppercase tracking-[0.16em] text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Image Preview */}
                <div className="relative mb-5 h-40 overflow-hidden rounded-[16px] border border-white/10 bg-space-black/70">
                  <Image
                    src={project.cover}
                    alt={`${project.name} preview`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-contain p-3 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] opacity-30 blur-sm"
                  />
                  <Image
                    src={project.cover}
                    alt={`${project.name} preview`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-contain p-3 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                  />
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 font-orbitron text-[10px] font-semibold uppercase tracking-widest text-white/80 transition duration-300 group-hover:border-atm-blue/50 group-hover:bg-atm-blue/10 group-hover:text-white">
                    View Details
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
