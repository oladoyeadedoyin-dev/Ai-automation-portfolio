import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type GalleryImage = {
  src: string;
  alt: string;
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: record, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !record) {
    notFound();
  }

  const rawGalleryImages: unknown[] = Array.isArray(record.gallery_images)
    ? record.gallery_images
    : [];

  const galleryImages: GalleryImage[] = rawGalleryImages.filter(
    (item: unknown): item is GalleryImage =>
      typeof item === "object" &&
      item !== null &&
      "src" in item &&
      typeof item.src === "string"
  );

  const rawCaseStudySections: unknown[] = Array.isArray(record.case_study_sections)
    ? record.case_study_sections
    : [];

  const caseStudySections: { heading: string; body: string }[] =
    rawCaseStudySections.filter(
      (section: unknown): section is { heading: string; body: string } =>
        typeof section === "object" &&
        section !== null &&
        "heading" in section &&
        "body" in section &&
        typeof section.heading === "string" &&
        typeof section.body === "string"
    );
  const project = {
    title: record.title,
    category: record.category,
    description: record.description,
    image:
      record.cover_image ||
      galleryImages[0]?.src ||
      "/screenshots/project-01-real-estate/workflow.png",
    alt: record.title,
    problem: record.problem ?? "",
    system: record.system ?? "",
    outcome: record.outcome ?? "",
    screenshots: galleryImages,
      caseStudySections,
    flow: (record.flow ?? []) as string[],
    technologies: (record.technologies ?? []) as string[],
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="text-sm font-semibold tracking-[0.2em]"
          >
            ADEDOYIN
          </a>

          <a
            href="/#work"
            className="text-sm text-white/50 transition hover:text-white"
          >
            &larr; Back to Work
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <header className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6f9cff]">
            {project.category}
          </p>

          <h1 className="mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-8xl">
            {project.title}
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-white/55 md:text-2xl">
            {project.description}
          </p>
        </header>

        <section className="mt-20 overflow-hidden border border-white/10 bg-[#090909]">
          <img
            src={project.image}
            alt={project.alt}
            className="block h-auto w-full object-cover object-left-top"
          />
        </section>

        <section className="mt-20 grid gap-14 border-t border-white/10 pt-14 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              The Problem
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
              {project.problem}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              What I Built
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
              {project.system}
            </p>
          </div>
        </section>

        <section className="mt-20 border-t border-white/10 pt-14">
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">
            Project Screenshots
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {project.screenshots.map((screenshot) => (
              <figure
                key={screenshot.src}
                className="overflow-hidden border border-white/10 bg-[#090909]"
              >
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="block h-auto w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>

        {project.caseStudySections.length > 0 ? (
          <section className="mt-20 border-t border-white/10 pt-14">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Case Study
              </p>
            </div>

            <div className="mt-10 space-y-14">
              {project.caseStudySections.map((section, index) => (
                <article
                  key={`${section.heading}-${index}`}
                  className="grid gap-8 border-b border-white/10 pb-14 last:border-b-0 last:pb-0 md:grid-cols-[0.35fr_0.65fr]"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f9cff]">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
                      {section.heading}
                    </h2>
                  </div>

                  <p className="max-w-2xl text-lg leading-relaxed text-white/55">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-20 grid gap-14 border-t border-white/10 pt-14 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Key Outcome
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
              {project.outcome}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              System Flow
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {project.flow.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/55">
                    {step}
                  </span>

                  {index < project.flow.length - 1 && (
                    <span className="text-white/20">-&gt;</span>
                  )}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-white/10 pt-14">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Next Step
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
                Have a process like this?
              </h2>
            </div>

            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold !text-black transition hover:bg-white/85"
            >
              Tell me what you want to automate
            </a>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/30 md:flex-row md:items-center md:justify-between md:px-10">
          <span>2026 Adedoyin</span>
          <span>AI Automation / APIs / Systems</span>
        </div>
      </footer>
    </main>
  );
}