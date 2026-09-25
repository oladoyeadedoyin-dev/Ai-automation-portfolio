import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

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
            Edit project
          </h1>

          <p className="mt-3 text-sm text-white/40">{project.title}</p>
        </div>

        <div className="py-10">
          <ProjectForm project={project} />
        </div>
      </div>
    </main>
  );
}