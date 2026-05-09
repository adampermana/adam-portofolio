"use client";

import {
  ExternalLink,
  Smartphone,
  Layers,
  Activity,
  GitBranch,
  MapPin,
  Code2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GitHubProfile, NormalizedContributionYear } from "@/app/api/github/route";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Static data that doesn't come from GitHub ────────────────────────────────

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getVisibleMonths(year: number): string[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  
  if (year === currentYear) {
    return months.slice(0, currentMonth);
  }
  
  return months;
}

const levelClasses = [
  "bg-[#0d1117] border-white/[0.04]",
  "bg-emerald-950/80 border-emerald-400/10",
  "bg-emerald-800/70 border-emerald-300/15",
  "bg-emerald-600/90 border-emerald-200/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
  "bg-emerald-400 border-emerald-100/30 shadow-[0_0_14px_rgba(52,211,153,0.35)]",
];

interface TechItem { name: string; slug: string; color: string; bg: string }
interface TechGroup { group: string; items: TechItem[] }

const techGroups: TechGroup[] = [
  {
    group: "Mobile",
    items: [
      { name: "Flutter", slug: "flutter", color: "#54C5F8", bg: "rgba(84,197,248,0.12)" },
      { name: "Dart", slug: "dart", color: "#0553B1", bg: "rgba(5,83,177,0.12)" },
      { name: "Swift", slug: "swift", color: "#F05138", bg: "rgba(240,81,56,0.12)" },
      { name: "Kotlin", slug: "kotlin", color: "#7F52FF", bg: "rgba(127,82,255,0.12)" },
      { name: "Java", slug: "openjdk", color: "#E76F00", bg: "rgba(231,111,0,0.12)" },
      { name: "React Native", slug: "react", color: "#61DAFB", bg: "rgba(97,218,251,0.12)" },
    ],
  },
  {
    group: "Web & Frontend",
    items: [
      { name: "TypeScript", slug: "typescript", color: "#3178C6", bg: "rgba(49,120,198,0.12)" },
      { name: "JavaScript", slug: "javascript", color: "#F7DF1E", bg: "rgba(247,223,30,0.12)" },
      { name: "React", slug: "react", color: "#61DAFB", bg: "rgba(97,218,251,0.12)" },
      { name: "TailwindCSS", slug: "tailwindcss", color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
      { name: "Vite.js", slug: "vite", color: "#646CFF", bg: "rgba(100,108,255,0.12)" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Hono JS", slug: "hono", color: "#E36002", bg: "rgba(227,96,2,0.12)" },
      { name: "Adonis JS", slug: "adonisjs", color: "#5A45FF", bg: "rgba(90,69,255,0.12)" },
      // { name: "Elysia JS", slug: "elysia", color: "#9B4FE8", bg: "rgba(155,79,232,0.12)" },
    ],
  },
  {
    group: "Database & Cloud",
    items: [
      { name: "PostgreSQL", slug: "postgresql", color: "#4169E1", bg: "rgba(65,105,225,0.12)" },
      { name: "MySQL", slug: "mysql", color: "#4479A1", bg: "rgba(68,121,161,0.12)" },
      { name: "Firebase", slug: "firebase", color: "#FFCA28", bg: "rgba(255,202,40,0.12)" },
      { name: "Docker", slug: "docker", color: "#2496ED", bg: "rgba(36,150,237,0.12)" },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git", slug: "git", color: "#F05032", bg: "rgba(240,80,50,0.12)" },
      { name: "Figma", slug: "figma", color: "#F24E1E", bg: "rgba(242,78,30,0.12)" },
      { name: "Linux", slug: "linux", color: "#FCC624", bg: "rgba(252,198,36,0.12)" },
    ],
  },
];

const projects = [
  {
    name: "MOBSEN",
    desc: "Comprehensive HR management app for attendance, leave, and payroll",
    tag: "FLUTTER",
    wrapperCls: "border-emerald-400/10 bg-emerald-400/5 hover:border-emerald-400/25 hover:bg-emerald-400/10",
    iconCls: "bg-emerald-400/15 border-emerald-400/20 text-emerald-400",
    nameCls: "text-emerald-300",
    tagCls: "border-emerald-400/20 text-emerald-400 bg-emerald-400/5",
  },
  {
    name: "GRACIA",
    desc: "Field reporting & safety operations platform for G4S Indonesia",
    tag: "FLUTTER",
    wrapperCls: "border-sky-400/10 bg-sky-400/5 hover:border-sky-400/25 hover:bg-sky-400/10",
    iconCls: "bg-sky-400/15 border-sky-400/20 text-sky-400",
    nameCls: "text-sky-300",
    tagCls: "border-sky-400/20 text-sky-400 bg-sky-400/5",
  },
  {
    name: "SERELO",
    desc: "Smart office management with visitor check-in and real-time dashboards",
    tag: "FIREBASE",
    wrapperCls: "border-purple-400/10 bg-purple-400/5 hover:border-purple-400/25 hover:bg-purple-400/10",
    iconCls: "bg-purple-400/15 border-purple-400/20 text-purple-400",
    nameCls: "text-purple-300",
    tagCls: "border-purple-400/20 text-purple-400 bg-purple-400/5",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubApiResponse {
  profile: GitHubProfile;
  contributions: NormalizedContributionYear[];
  totalContributions: number;
}

type ContributionCell = {
  key: string;
  date: string;
  count: number;
  level: number | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildContributionCells(year: number, days: { date: string; count: number; level: number }[]): ContributionCell[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  
  // Filter days if current year
  let filteredDays = days;
  if (year === currentYear) {
    filteredDays = days.filter((day) => day.date <= today);
  }
  
  const firstDay = new Date(Date.UTC(year, 0, 1)).getUTCDay();
  const cells: ContributionCell[] = Array.from({ length: firstDay }, (_, index) => ({
    key: `${year}-blank-start-${index}`,
    date: "",
    count: 0,
    level: null,
  }));

  filteredDays.forEach((day, index) => {
    cells.push({
      key: `${year}-day-${index}`,
      date: day.date,
      count: day.count,
      level: day.level,
    });
  });

  const remainder = cells.length % 7;
  if (remainder > 0) {
    const trailing = 7 - remainder;
    for (let index = 0; index < trailing; index += 1) {
      cells.push({
        key: `${year}-blank-end-${index}`,
        date: "",
        count: 0,
        level: null,
      });
    }
  }

  return cells;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18A10.98 10.98 0 0 1 12 6.06c.98.01 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.38-5.25 5.67.42.36.78 1.07.78 2.15v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/[0.06] ${className ?? ""}`}
    />
  );
}

function ProfileSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <SkeletonPulse className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-28" />
            <SkeletonPulse className="h-7 w-44" />
            <SkeletonPulse className="h-3 w-36" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-36 rounded-full" />
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <SkeletonPulse key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function ContributionsSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-6 w-48" />
        </div>
        <SkeletonPulse className="h-8 w-36 rounded-full" />
      </div>
      <div className="mb-6 flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonPulse key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <SkeletonPulse className="h-[120px] w-full rounded-xl" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GitHubContributions() {
  const [data, setData] = useState<GitHubApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const sectionRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: GitHubApiResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // GSAP section reveal
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll<HTMLElement>(".gh-card"),
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        },
      );
      // Tech icon badges stagger in
      gsap.fromTo(
        sectionRef.current!.querySelectorAll<HTMLElement>(".tech-badge"),
        { opacity: 0, scale: 0.8, y: 10 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "back.out(1.5)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  const contributions = data?.contributions ?? [];

  const contributionFilters = useMemo(
    () => ["all", ...contributions.map(({ year }) => String(year))],
    [contributions],
  );

  const displayedYears = useMemo(
    () =>
      selectedFilter === "all"
        ? contributions
        : contributions.filter(({ year }) => String(year) === selectedFilter),
    [selectedFilter, contributions],
  );

  const totalContributions = data?.totalContributions ?? 0;

  const stats = [
    { label: "Experience", value: "10+", sub: "Projects", icon: Activity },
    { label: "Apps Live", value: "08+", sub: "Shipped", icon: Smartphone },
    { label: "Stacks", value: "12+", sub: "Tools", icon: Layers },
  ];

  const profile = data?.profile;

  return (
    <section id="github" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
      <div
        ref={sectionRef}
        className="mx-auto max-w-6xl space-y-5"
      >

        {/* ── Profile Card ─────────────────────────────────────────────────── */}
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="overflow-hidden rounded-[28px] border border-red-400/20 bg-red-400/5 p-8 text-center">
            <p className="text-sm text-red-400">Failed to load GitHub data: {error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2 text-xs text-red-400 transition hover:bg-red-400/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        ) : (
          <div className="gh-card overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  {/* Avatar from GitHub */}
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={profile.name ?? profile.login}
                      className="h-14 w-14 rounded-full border border-atm-blue/30 shadow-[0_0_28px_rgba(59,167,255,0.22)] object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full border border-atm-blue/30 bg-gradient-to-br from-atm-blue/20 to-emerald-400/10 flex items-center justify-center shadow-[0_0_28px_rgba(59,167,255,0.22)]">
                      <GitHubMark className="h-7 w-7 text-white" />
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-space-black bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                </div>
                <div>
                  <p className="mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.36em] text-atm-blue/80">
                    Developer Profile
                  </p>
                  <h2 className="font-orbitron text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                    {profile?.name ?? "Adam Permana"}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    {profile?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-atm-blue/60" />
                        {profile.location}
                      </span>
                    )}
                    {profile?.location && <span className="text-gray-700">/</span>}
                    <span className="flex items-center gap-1">
                      <Code2 className="h-3 w-3 text-atm-blue/60" />
                      Fullstack Developer
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start rounded-full border border-emerald-400/20 bg-emerald-400/5 px-5 py-2.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Open to Work
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map(({ label, value, sub, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.025] py-5 px-3 text-center"
                >
                  <Icon className="mb-2 h-4 w-4 text-atm-blue/60" />
                  <p className="font-orbitron text-2xl font-black text-white md:text-3xl">{value}</p>
                  <p className="mt-1 font-orbitron text-[9px] font-bold uppercase tracking-widest text-gray-600">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Contribution Graph ────────────────────────────────────────────── */}
        {loading ? (
          <ContributionsSkeleton />
        ) : !error && (
          <div className="gh-card overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.36em] text-atm-blue/80">
                  GitHub Activity
                </p>
                <h3 className="text-xl font-bold text-white">GitHub Contributions</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-gray-400">
                <GitBranch className="h-3.5 w-3.5" />
                <span>
                  {selectedFilter === "all"
                    ? `${totalContributions} total / all years`
                    : `${displayedYears[0]?.total ?? 0} in ${selectedFilter}`}
                </span>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {contributionFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-full border px-4 py-2 font-orbitron text-[10px] font-bold uppercase tracking-widest transition duration-300 ${selectedFilter === filter
                    ? "border-atm-blue/50 bg-atm-blue/15 text-atm-blue"
                    : "border-white/[0.08] bg-white/[0.025] text-gray-500 hover:border-white/15 hover:text-gray-300"
                    }`}
                >
                  {filter === "all" ? "All years" : filter}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto pb-2 no-scrollbar">
              <div className="min-w-[860px] space-y-8">
                {displayedYears.map(({ year, total, days }) => (
                  <div key={year}>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-orbitron text-sm font-black text-white">{year}</p>
                        <p className="mt-1 text-xs text-gray-600">{total} public contributions</p>
                      </div>
                      <div className="grid grid-cols-12 gap-3 text-xs text-gray-600" style={{ width: `${getVisibleMonths(year).length * 60}px` }}>
                        {getVisibleMonths(year).map((m) => (
                          <span key={`${year}-${m}`}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                      {buildContributionCells(year, days).map((cell) => (
                        <span
                          key={cell.key}
                          title={
                            cell.level !== null && cell.date
                              ? `${cell.count} contribution${cell.count !== 1 ? "s" : ""} on ${cell.date}`
                              : undefined
                          }
                          className={
                            cell.level === null
                              ? "h-[13px] w-[13px]"
                              : `h-[13px] w-[13px] cursor-default rounded-[3px] border transition-all duration-200 hover:scale-125 hover:brightness-110 ${levelClasses[cell.level]}`
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Live GitHub contribution data · @adampermana</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <span key={l} className={`h-[11px] w-[11px] rounded-[2px] border ${levelClasses[l]}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tech Stack + Projects ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          <div className="gh-card rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <p className="mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.36em] text-atm-blue/80">
              Technical Focus
            </p>
            <h3 className="mb-7 text-xl font-bold text-white">Tech Stack</h3>

            <div className="space-y-5">
              {techGroups.map(({ group, items }) => (
                <div key={group}>
                  <p className="mb-2.5 font-orbitron text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600">
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(({ name, slug, color, bg }) => (
                      <div
                        key={name}
                        className="tech-badge group flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 hover:scale-105"
                        style={{
                          borderColor: `${color}25`,
                          background: bg,
                          opacity: 0,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`}
                          alt={name}
                          width={14}
                          height={14}
                          className="shrink-0"
                          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
                        />
                        <span
                          className="font-orbitron text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color }}
                        >
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gh-card rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <p className="mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.36em] text-atm-blue/80">
              Project Notes
            </p>
            <h3 className="mb-7 text-xl font-bold text-white">Featured Projects</h3>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.name}
                  className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300 ${p.wrapperCls}`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${p.iconCls}`}>
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-orbitron text-sm font-bold ${p.nameCls}`}>{p.name}</p>
                      <span className={`rounded-full border px-2 py-0.5 font-orbitron text-[9px] font-bold uppercase tracking-wider ${p.tagCls}`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── GitHub link ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center pt-2">
          <a
            href={profile?.html_url ?? "https://github.com/adampermana"}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm text-gray-300 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <GitHubMark className="h-4 w-4" />
            <span>@{profile?.login ?? "adampermana"}</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
