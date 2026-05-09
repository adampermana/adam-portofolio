import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Adam Permana",
    };
  }

  return {
    title: `${project.name} | Adam Permana`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const Icon = project.icon;

  return (
    <main className="relative min-h-screen overflow-hidden bg-space-black px-6 pb-20 pt-32 md:px-12 md:pb-28">
      <div className="star-field absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(59,167,255,0.18),transparent_34%),linear-gradient(180deg,#02040A_0%,#07111F_44%,#02040A_100%)]" />
      <div className="absolute -left-32 top-44 h-[520px] w-[520px] rounded-full bg-atm-blue/10 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[440px] w-[440px] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/#work"
          className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-gray-300 backdrop-blur-xl transition duration-300 hover:border-atm-blue/40 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 font-orbitron text-xs font-semibold uppercase tracking-[0.34em] text-atm-blue/80">
              Project Detail / {project.year}
            </p>
            <h1 className="font-orbitron text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl md:text-8xl">
              {project.name}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              {project.summary}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-soft-white px-6 py-3 text-sm font-semibold text-space-black transition duration-300 hover:bg-atm-blue"
              >
                Open Play Store
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                href="/?openform=1#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:border-white/[0.25] hover:bg-white/[0.07]"
              >
                Discuss Similar Project
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl md:p-8">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-atm-blue/20 blur-[90px]" />
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-between">
              <div className="relative mb-8 h-72 overflow-hidden rounded-[22px] border border-white/10 bg-space-black/70 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="scale-125 object-cover opacity-25 blur-xl"
                />
                <Image
                  src={project.cover}
                  alt={`${project.name} project preview`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-5 drop-shadow-[0_22px_54px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/35 via-transparent to-transparent" />
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-space-black/35 text-atm-blue shadow-[0_0_50px_rgba(59,167,255,0.18)] backdrop-blur-md">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                    Category
                  </p>
                  <p className="mt-2 font-orbitron text-lg font-bold uppercase text-white">
                    {project.category}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm uppercase tracking-[0.24em] text-atm-blue/80">
                  {project.role}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.stack.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-space-black/30 px-4 py-3 text-sm text-gray-200"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-atm-blue" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            ["Focus", project.category],
            ["Role", project.role],
            ["Release", "Available on Google Play"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[22px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                {label}
              </p>
              <p className="mt-4 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
