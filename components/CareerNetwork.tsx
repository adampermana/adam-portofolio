"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

type NodeType = "education" | "entrepreneur" | "career" | "current";

interface CareerNode {
  id: string;
  type: NodeType;
  period: string;
  role: string;
  company: string;
  location: string;
  desc: string;
  /** SVG grid position [col, row] — col=time, row=track */
  pos: [number, number];
}

const nodes: CareerNode[] = [
  {
    id: "localtech",
    type: "entrepreneur",
    period: "Jan 2019 – Dec 2022",
    role: "CEO / Entrepreneur",
    company: "PT. Local Tech Indonesia",
    location: "Cakung, Jakarta Timur",
    desc: "Founded a local digital marketplace opening reseller opportunities for SMEs. Built branding strategy for credit, data packages, game top-ups, vouchers & bill payment.",
    pos: [0, 2],
  },
  {
    id: "smkn",
    type: "education",
    period: "2020 – 2024",
    role: "Student // SIJA",
    company: "SMKN 69 Jakarta",
    location: "Jakarta, Indonesia",
    desc: "Specialized in Network & Software Engineering. Graduated GPA 8.74/10. Built foundational skills in web, mobile, cybersecurity, and AWS cloud computing.",
    pos: [1, 0],
  },
  {
    id: "intern",
    type: "career",
    period: "Sep 2023 – Jul 2024",
    role: "Mobile App Developer",
    company: "PT. Solu Filantropi Teknologi",
    location: "Jagakarsa, Jakarta Selatan • Internship",
    desc: "Worked as Mobile App Developer using Flutter to develop responsive and user-friendly mobile apps.",
    pos: [2, 2],
  },
  {
    id: "contract1",
    type: "career",
    period: "Jul 2024 – Oct 2024",
    role: "Mobile App Developer",
    company: "PT. Solu Filantropi Teknologi",
    location: "Jagakarsa, Jakarta Selatan • Contract",
    desc: "Developed Flutter & Dart apps for Android/iOS. Implemented native Kotlin, Java & Swift features, optimized performance, and collaborated with cross-functional teams.",
    pos: [3, 2],
  },
  {
    id: "contract2",
    type: "current",
    period: "Oct 2024 – Oct 2026",
    role: "Mobile App Developer",
    company: "PT. Solu Filantropi Teknologi",
    location: "Jagakarsa, Jakarta Selatan • Contract",
    desc: "Developing and maintaining Flutter & Dart mobile apps for Android and iOS. Implementing native Android (Kotlin, Java) and iOS (Swift) features and collaborating with teams.",
    pos: [4, 2],
  },
];

/** Edges: [fromId, toId] */
const edges: [string, string][] = [
  ["localtech", "smkn"],
  ["localtech", "intern"],
  ["smkn", "intern"],
  ["intern", "contract1"],
  ["contract1", "contract2"],
];

// ─── SVG Layout ───────────────────────────────────────────────────────────────

const COL_W = 210;
const ROW_H = 130;
const PAD_X = 80;
const PAD_Y = 80;
const NODE_R = 22;

function nodeXY(pos: [number, number]): [number, number] {
  return [PAD_X + pos[0] * COL_W, PAD_Y + pos[1] * ROW_H];
}

const SVG_W = PAD_X * 2 + 4 * COL_W;
const SVG_H = PAD_Y * 2 + 2 * ROW_H;

// ─── Colors by type ───────────────────────────────────────────────────────────

const typeStyles: Record<
  NodeType,
  { stroke: string; fill: string; glow: string; badge: string; badgeText: string }
> = {
  education: {
    stroke: "#a78bfa",
    fill: "rgba(167,139,250,0.18)",
    glow: "rgba(167,139,250,0.45)",
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    badgeText: "EDUCATION",
  },
  entrepreneur: {
    stroke: "#fb923c",
    fill: "rgba(251,146,60,0.18)",
    glow: "rgba(251,146,60,0.45)",
    badge: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    badgeText: "ENTREPRENEUR",
  },
  career: {
    stroke: "#3BA7FF",
    fill: "rgba(59,167,255,0.18)",
    glow: "rgba(59,167,255,0.45)",
    badge: "border-atm-blue/30 bg-atm-blue/10 text-atm-blue",
    badgeText: "CAREER",
  },
  current: {
    stroke: "#34d399",
    fill: "rgba(52,211,153,0.18)",
    glow: "rgba(52,211,153,0.55)",
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    badgeText: "CURRENT",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CareerNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!svgRef.current) return;

      // ── Label ────────────────────────────────────────────────────────
      gsap.fromTo(".cn-label",
        { opacity: 0, y: 16, letterSpacing: "0.6em" },
        {
          opacity: 1, y: 0, letterSpacing: "0.34em", duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        },
      );
      gsap.fromTo(".cn-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        },
      );

      // ── Edges: draw-on using strokeDashoffset ────────────────────────
      const paths = svgRef.current.querySelectorAll<SVGPathElement>(".cn-edge");
      paths.forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          delay: 0.3 + i * 0.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
        });
      });

      // ── Nodes: pop-in with scale ─────────────────────────────────────
      const nodeGroups = svgRef.current.querySelectorAll<SVGGElement>(".cn-node");
      gsap.fromTo(nodeGroups,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1, opacity: 1, duration: 0.6, stagger: 0.14, ease: "back.out(2)",
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
        },
      );

      // ── Continuous pulse on "current" node ───────────────────────────
      const currentRing = svgRef.current.querySelector<SVGCircleElement>(".cn-pulse-ring");
      if (currentRing) {
        gsap.to(currentRing, {
          attr: { r: NODE_R + 14, opacity: 0 },
          duration: 1.4,
          repeat: -1,
          ease: "power1.out",
        });
      }

      // ── Scroll-linked wrapper fade ────────────────────────────────────
      gsap.fromTo(".cn-wrapper",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" }
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const active = nodes.find((n) => n.id === activeNode) ?? null;

  return (
    <section
      ref={sectionRef}
      id="career"
      className="relative z-10 overflow-hidden px-6 py-24 md:px-12 md:py-32"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-atm-blue/[0.07] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="cn-label mb-4 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80" style={{ opacity: 0 }}>
            Career Journey
          </p>
          <h2 className="cn-heading font-orbitron text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl" style={{ opacity: 0 }}>
            Experience Network
          </h2>
        </div>

        {/* ── Graph wrapper ───────────────────────────────────────────── */}
        <div className="cn-wrapper overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">

          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-3">
            {(["education", "entrepreneur", "career", "current"] as NodeType[]).map((t) => (
              <span key={t} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-orbitron text-[9px] font-bold uppercase tracking-widest ${typeStyles[t].badge}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: typeStyles[t].stroke }} />
                {typeStyles[t].badgeText}
              </span>
            ))}
          </div>

          {/* ── SVG Network ──────────────────────────────────────────── */}
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width={SVG_W}
              height={SVG_H}
              className="min-w-[820px]"
              style={{ display: "block" }}
            >
              <defs>
                {nodes.map((n) => {
                  const s = typeStyles[n.type];
                  return (
                    <filter key={`glow-${n.id}`} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  );
                })}
                <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ── Edges ──────────────────────────────────────────── */}
              {edges.map(([fromId, toId]) => {
                const from = nodes.find((n) => n.id === fromId)!;
                const to = nodes.find((n) => n.id === toId)!;
                const [x1, y1] = nodeXY(from.pos);
                const [x2, y2] = nodeXY(to.pos);
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2 - 30;
                const isActive = activeNode === fromId || activeNode === toId;
                const strokeColor =
                  activeNode === fromId
                    ? typeStyles[from.type].stroke
                    : activeNode === toId
                      ? typeStyles[to.type].stroke
                      : "rgba(255,255,255,0.12)";

                return (
                  <path
                    key={`${fromId}-${toId}`}
                    className="cn-edge"
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2 : 1.5}
                    strokeLinecap="round"
                    filter="url(#edge-glow)"
                    style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                  />
                );
              })}

              {/* ── Nodes ──────────────────────────────────────────── */}
              {nodes.map((node) => {
                const [cx, cy] = nodeXY(node.pos);
                const s = typeStyles[node.type];
                const isActive = activeNode === node.id;

                return (
                  <g
                    key={node.id}
                    className="cn-node"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    {/* Pulse ring for current */}
                    {node.type === "current" && (
                      <circle
                        className="cn-pulse-ring"
                        cx={cx}
                        cy={cy}
                        r={NODE_R}
                        fill="none"
                        stroke={s.stroke}
                        strokeWidth={1.5}
                        opacity={0.6}
                      />
                    )}

                    {/* Outer glow ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isActive ? NODE_R + 8 : NODE_R + 4}
                      fill="none"
                      stroke={s.stroke}
                      strokeWidth={1}
                      opacity={isActive ? 0.5 : 0.2}
                      style={{ transition: "all 0.3s" }}
                    />

                    {/* Node circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={NODE_R}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      filter={`url(#glow-${node.id})`}
                      style={{ transition: "all 0.3s" }}
                    />

                    {/* Year label above node */}
                    <text
                      x={cx}
                      y={cy - NODE_R - 10}
                      textAnchor="middle"
                      fontSize={9}
                      fontFamily="var(--font-orbitron), monospace"
                      fill={s.stroke}
                      opacity={0.8}
                      letterSpacing={1}
                    >
                      {node.period.split("–")[0].trim().split(" ").pop()}
                    </text>

                    {/* Node index dot */}
                    <circle cx={cx} cy={cy} r={4} fill={s.stroke} />

                    {/* Company label below */}
                    <text
                      x={cx}
                      y={cy + NODE_R + 16}
                      textAnchor="middle"
                      fontSize={9}
                      fontFamily="var(--font-orbitron), monospace"
                      fill="rgba(255,255,255,0.55)"
                      letterSpacing={0.5}
                    >
                      {node.id === "smkn" ? "SMKN 69" : node.id === "localtech" ? "LOCAL TECH" : "SOLU FT"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Detail Card ─────────────────────────────────────────── */}
          <div
            className="mt-4 overflow-hidden rounded-2xl border transition-all duration-300"
            style={{
              borderColor: active ? `${typeStyles[active.type].stroke}33` : "rgba(255,255,255,0.06)",
              background: active ? typeStyles[active.type].fill : "rgba(255,255,255,0.02)",
              minHeight: "120px",
            }}
          >
            {active ? (
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-orbitron text-[9px] font-bold uppercase tracking-widest ${typeStyles[active.type].badge}`}
                      >
                        {typeStyles[active.type].badgeText}
                      </span>
                      <span className="font-orbitron text-[10px] text-gray-500 tracking-widest">
                        {active.period}
                      </span>
                    </div>
                    <h3 className="font-orbitron text-lg font-black uppercase tracking-tight text-white md:text-xl">
                      {active.role}
                    </h3>
                    <p
                      className="mt-1 font-orbitron text-xs font-semibold uppercase tracking-wider"
                      style={{ color: typeStyles[active.type].stroke }}
                    >
                      {active.company}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{active.location}</p>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-gray-300 sm:text-right">
                    {active.desc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-[120px] items-center justify-center">
                <p className="font-orbitron text-[10px] uppercase tracking-widest text-gray-600">
                  Hover or tap a node to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
