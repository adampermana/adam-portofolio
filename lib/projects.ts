import {
  BadgeCheck,
  Compass,
  Handshake,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const projects = [
  {
    slug: "mobsen",
    name: "Mobsen",
    category: "Employee Operations",
    role: "Mobile App Development",
    year: "2024",
    url: "https://play.google.com/store/search?q=mobsen&c=apps",
    cover: "/images/projects/mobsen-play.png",
    description:
      "A mobile workforce product focused on attendance, employee activity, and practical operational flows for daily teams.",
    summary:
      "Mobsen brings core employee operations into a lightweight mobile experience, helping teams handle work presence, requests, and daily activity from one clear interface.",
    stack: ["Flutter", "Dart", "Mobile UX", "Operational Flow"],
    accent: "from-sky-400/30 via-cyan-300/10 to-white/5",
    icon: BadgeCheck,
  },
  {
    slug: "jamaah-guide",
    name: "Jamaah Guide",
    category: "Travel Companion",
    role: "Mobile App Development",
    year: "2024",
    url: "https://play.google.com/store/apps/details?id=com.guide.jamaah",
    cover: "/images/projects/jamaah-guide-play.png",
    description:
      "A guidance app for jamaah with mobile-first information flow, focused navigation, and accessible trip assistance.",
    summary:
      "Jamaah Guide is designed as a calm travel companion, giving users easier access to trip guidance, important information, and structured support while moving through their journey.",
    stack: ["Flutter", "Dart", "Travel UX", "Guided Content"],
    accent: "from-emerald-300/25 via-sky-300/10 to-white/5",
    icon: Compass,
  },
  {
    slug: "muthawif-guide",
    name: "Muthawif Guide",
    category: "Guide Operations",
    role: "Mobile App Development",
    year: "2024",
    url: "https://play.google.com/store/apps/details?id=com.guide.muthawif",
    cover: "/images/projects/muthawif-guide-play.png",
    description:
      "A companion app for muthawif workflows, built to support coordination, guidance, and field activity.",
    summary:
      "Muthawif Guide supports guide-side operations with a mobile interface shaped for coordination, visibility, and smoother assistance across active travel moments.",
    stack: ["Flutter", "Dart", "Field Tools", "Coordination"],
    accent: "from-blue-400/30 via-indigo-300/10 to-white/5",
    icon: MapPinned,
  },
  {
    slug: "gracia",
    name: "Gracia",
    category: "Enterprise Operations",
    role: "Mobile App Development",
    year: "2023",
    url: "https://play.google.com/store/apps/details?id=com.g4sindonesia.gracia",
    cover: "/images/projects/gracia-play.png",
    description:
      "An enterprise mobile app for operational reporting and team activity, built for clarity in field environments.",
    summary:
      "Gracia focuses on dependable enterprise workflows, giving field teams a polished mobile surface for reporting, coordination, and operational visibility.",
    stack: ["Flutter", "Enterprise App", "Reporting", "Mobile Workflow"],
    accent: "from-violet-300/25 via-sky-300/10 to-white/5",
    icon: Sparkles,
  },
  {
    slug: "serv-d",
    name: "Serv.D",
    category: "Service Platform",
    role: "Mobile App Development",
    year: "2023",
    url: "https://play.google.com/store/apps/details?id=com.solu.servd",
    cover: "/images/projects/serv-d-play.jpg",
    description:
      "A service-oriented mobile experience with direct action paths and clear task-focused interaction patterns.",
    summary:
      "Serv.D is built around service execution, using focused mobile screens to help users move from request to action with fewer distractions.",
    stack: ["Flutter", "Service UX", "Task Flow", "Product Delivery"],
    accent: "from-cyan-300/25 via-blue-400/10 to-white/5",
    icon: Handshake,
  },
  {
    slug: "smart-patrol",
    name: "Smart Patrol",
    category: "Security Patrol",
    role: "Mobile App Development",
    year: "2023",
    url: "https://play.google.com/store/apps/details?id=com.g4sindonesia.smartpatrol",
    cover: "/images/projects/smart-patrol-play.png",
    description:
      "A patrol and monitoring app for security teams, shaped around route activity, reporting, and field accountability.",
    summary:
      "Smart Patrol supports security operations with route-driven mobile workflows, clearer reporting, and a practical interface for teams working across real locations.",
    stack: ["Flutter", "Security Ops", "Patrol Flow", "Field Reporting"],
    accent: "from-slate-100/20 via-sky-400/10 to-white/5",
    icon: ShieldCheck,
  },
];

export type Project = (typeof projects)[number];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
