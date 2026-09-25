import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 hover:text-white"
        >
           Back to projects
        </Link>

        <div className="mt-8 border-b border-white/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6f9cff]">
            Adedoyin CMS
          </p>

          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
            New project
          </h1>
        </div>

        <div className="py-10">
          <ProjectForm />
        </div>
      </div>
    </main>
  );
}
