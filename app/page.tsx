"use client";

import { useEffect, useState } from "react";
import { projects as fallbackProjects } from "./data/projects";
import { createClient } from "@/lib/supabase/client";

const services = [
  {
    number: "01",
    title: "AI Automation",
    description:
      "I turn repetitive operations into reliable workflows that run automatically across the tools your team already uses.",
  },
  {
    number: "02",
    title: "API & System Integrations",
    description:
      "I connect CRMs, databases, Google Workspace, messaging platforms, and other business tools through APIs and webhooks.",
  },
  {
    number: "03",
    title: "AI Lead Qualification",
    description:
      "I build systems that capture, score, qualify, prioritize, and route leads so teams can focus on high-intent opportunities.",
  },
  {
    number: "04",
    title: "Operations Automation",
    description:
      "I automate reminders, scheduling, reporting, follow-ups, and other internal processes that consume valuable team time.",
  },
];

const process = [
  {
    number: "01",
    title: "Map the Process",
    description:
      "Understand how the work happens today, where time is lost, and what the automation needs to achieve.",
  },
  {
    number: "02",
    title: "Design the System",
    description:
      "Define the triggers, data flow, APIs, business rules, AI steps, and failure paths before building.",
  },
  {
    number: "03",
    title: "Build and Test",
    description:
      "Connect the services, implement the workflow, and test the real cases that could break the system.",
  },
  {
    number: "04",
    title: "Deploy and Improve",
    description:
      "Refine the workflow, handle edge cases, and keep the system reliable as the business evolves.",
  },
];

export default function Home() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const supabase = createClient();

    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load projects from Supabase:", error);
        return;
      }

      const cmsProjects = (data ?? []).map((project) => ({
        id: project.slug,
        number: project.display_order ?? 0,
        title: project.title,
        category: project.category,
        description: project.description,
        image: project.cover_image ?? "",
        alt: project.title,
        screenshots: Array.isArray(project.gallery_images)
          ? project.gallery_images
          : [],
        flow: project.flow ?? [],
        technologies: project.technologies ?? [],
        problem: project.problem ?? "",
        system: project.system ?? "",
        outcome: project.outcome ?? "",
      }));

      setProjects(cmsProjects);
    }

    loadProjects();
  }, []);
  useEffect(() => {
    const cards = document.querySelectorAll(".work-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 120}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <main className="min-h-screen bg-[#050505] text-white [font-family:var(--font-body),sans-serif]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="#top"
            className="text-sm font-semibold tracking-[0.2em]"
          >
            ADEDOYIN
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#services" className="transition hover:text-white">
              Services
            </a>
            <a href="#work" className="transition hover:text-white">
              Work
            </a>
            <a href="#process" className="transition hover:text-white">
              Process
            </a>
            <a href="#letter" className="transition hover:text-white">
              Letter
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>

          <a
            href="#contact"
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/5"
          >
            Let&apos;s talk
          </a>
        </div>
      </nav>

      <section
        id="top"
        className="mx-auto max-w-7xl px-6 pb-28 pt-40 md:px-10 md:pb-40 md:pt-52"
      >
        <div className="mb-10 flex items-center gap-3 text-sm text-white/40">
          <span className="h-2 w-2 rounded-full bg-[#6f9cff]" />
          AI Automation &amp; Systems
        </div>

        <h1 className="max-w-6xl text-[clamp(3.5rem,9vw,9rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
          I build
          <br />
          <span className="hero-word">AI systems</span>
          <br />
          that run the work.
        </h1>

        <div className="mt-14 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_2fr]">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-white/35">
            n8n / AI / APIs / Automation
          </p>

            <div className="mt-8 max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#090909]">
            </div>

          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-white/65 md:text-2xl">
              I build practical automation systems that connect your tools,
              eliminate repetitive work, and help growing teams operate with
              less friction.
            </p>

            <a
              href="#work"
              className="mt-8 inline-flex items-center gap-3 text-sm font-medium"
            >
              Explore selected work <span className="text-[#6f9cff]">-&gt;</span>
            </a>
          </div>
        </div>
      </section>

            
      <section
        id="about"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6f9cff]">
                The Builder
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#090909]">
                <img
                  src="/1002809660.jpg"
                  alt="Oladoye Elisha Adedoyin"
                  className="block aspect-[4/5] w-full object-cover"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                <span>Oladoye Elisha Adedoyin</span>
                <span>AI Automation</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="max-w-4xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                I build the systems behind the systems.
              </h2>

              <div className="mt-10 max-w-3xl space-y-6 text-base leading-7 text-white/50 sm:text-lg">
                <p>
                  I&apos;m an AI automation builder focused on turning
                  repetitive business processes into systems that are easier to
                  run, easier to trust, and easier to scale.
                </p>

                <p>
                  I work across n8n, APIs, webhooks, AI, Google Workspace,
                  messaging platforms, and structured data. I use AI where
                  interpretation adds value, and deterministic logic where
                  reliability matters.
                </p>

                <p>
                  I&apos;m interested in the space where business problems meet
                  technologyand where a well-designed system can give a team
                  its time back.
                </p>
              </div>

              <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Building with
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    n8n  Gemini  APIs  Webhooks  Google Workspace
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Focus
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Lead Operations  Internal Tools  AI Workflows  Business Automation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="services"
        className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mb-14 flex items-end justify-between gap-8">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/35">
              Services
            </p>

            <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
              Systems that
              <br />
              do the work.
            </h2>
          </div>

          <span className="hidden text-sm text-white/30 md:block">
            04 capabilities
          </span>
        </div>

        <div className="grid border-t border-white/10 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.number}
              className="border-b border-white/10 p-7 md:p-9"
            >
              <div className="mb-16 flex justify-between text-sm text-white/30">
                <span>{service.number}</span>
                <span>-&gt;</span>
              </div>

              <h3 className="text-2xl font-medium">{service.title}</h3>

              <p className="mt-4 max-w-md leading-relaxed text-white/45">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="work"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-[0.8fr_2fr]">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/35">
                Selected Work
              </p>

              <p className="max-w-xs text-sm leading-relaxed text-white/35">
                Real systems built around real business problems, decisions,
                and operational bottlenecks.
              </p>

              <p className="mt-6 text-sm text-white/25">
                {String(projects.length).padStart(2, "0")} project
                {projects.length === 1 ? "" : "s"}
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
                Automation built for real operations.
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {projects.map((project) => (
              <article
                key={project.id}
                className="grid gap-8 py-8 md:grid-cols-[0.8fr_1.2fr] md:py-10"
              >
                <div className="overflow-hidden border border-white/10 bg-[#090909]">
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="block aspect-[16/10] h-full w-full object-cover object-left-top"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6f9cff]">
                      {project.category}
                    </p>

                    <h3 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">
                      {project.title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-10">
                    <a
                      href={`/work/${project.id}`}
                      className="inline-flex items-center gap-3 text-sm font-medium text-white transition hover:text-white/70"
                    >
                      Read More
                      <span className="text-[#6f9cff]">-&gt;</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

<section
        id="process"
        className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
      >
        <div className="grid gap-14 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/35">
              Process
            </p>

            <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
              From problem
              <br />
              to production.
            </h2>
          </div>

          <div className="border-t border-white/10">
            {process.map((step) => (
              <div
                key={step.number}
                className="grid gap-5 border-b border-white/10 py-8 md:grid-cols-[80px_1fr]"
              >
                <span className="text-sm text-white/30">{step.number}</span>

                <div>
                  <h3 className="text-xl font-medium">{step.title}</h3>

                  <p className="mt-3 max-w-xl leading-relaxed text-white/45">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
          </div>
      </section>
      <section
        id="letter"
        className="border-t border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 md:grid-cols-[0.8fr_2fr]">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-white/35">
                Letter
              </p>

              <p className="mt-6 text-sm text-white/30">
                To my next team
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
                Letter to My Next Team
              </h2>

              <div className="mt-10 space-y-6 text-lg leading-relaxed text-white/55">
                <p>
                  I don&apos;t want to automate people out of their work. I want
                  to give good people more time to do the work only they can do.
                </p>

                <p>
                  That belief is at the heart of why I build. I&apos;m drawn to
                  the repetitive work that slows teams downmoving data between
                  tools, checking the same information repeatedly, following up
                  manually, and holding together processes that should already
                  be connected.
                </p>

                <p>
                  I enjoy taking those messy processes apart, understanding how
                  they really work, and turning them into systems that are
                  simpler, reliable, and easier to run.
                </p>

                <p>
                  Sometimes that means an API or workflow. Sometimes it means
                  AI. Sometimes it means a simple rule. I don&apos;t believe
                  every problem needs AI; I believe the right problem needs the
                  right system.
                </p>

                <p>
                  I also think beyond the demo. I care about missing data,
                  failed APIs, duplicate records, unexpected inputs, and what
                  happens when the system meets the real world.
                </p>

                <p>
                  I&apos;m still early in my journey, and I&apos;m excited
                  about that. I want to learn from strong teams, take ownership
                  of what I build, and leave every process better than I found
                  it.
                </p>

                <p>
                  I&apos;m looking for a team where I can contribute, grow,
                  solve meaningful problems, and build systems that genuinely
                  make the work better.
                </p>

                <p>
                  <strong className="font-medium text-white">
                    Maybe that team is yours.
                  </strong>
                </p>

                <p>
                  Let&apos;s build something useful.
                </p>
              </div>

              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="text-sm text-white/35">
                  Sincerely,
                </p>

                <p className="mt-2 text-lg font-medium">
                  Oladoye Elisha Adedoyin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      
      <section
        id="contact"
        className="border-t border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <p className="mb-5 text-sm uppercase tracking-[0.18em] text-white/35">
            Contact
          </p>

          <h2 className="max-w-5xl font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-8xl">
            Have a process
            <br />
            that should run itself?
          </h2>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:ayotoms28@gmail.com"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold !text-black transition hover:bg-white/85"
            >
              Tell me what you want to automate
            </a>

            <a
              href="https://wa.me/2348146207837"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-white/40"
            >
              WhatsApp -&gt;
            </a>
            <a
              href="https://www.linkedin.com/in/adedoyin-oladoye-86b856250/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-white/40"
            >
              LinkedIn -&gt;
            </a>

            <a
              href="https://github.com/oladoyeadedoyin-dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-white/40"
            >
              GitHub -&gt;
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/30 md:flex-row md:items-center md:justify-between md:px-10">
          <span>2026 Adedoyin</span>
          <span>AI Automation / APIs / Systems</span>
        </div>
      </footer>
    </main>
  );
}
