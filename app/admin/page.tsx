import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteProjectButton from "@/components/admin/delete-project-button";
import TogglePublishButton from "@/components/admin/toggle-publish-button";
import MoveProjectButton from "@/components/admin/move-project-button";
import DuplicateProjectButton from "@/components/admin/duplicate-project-button";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, category, status, display_order, featured, updated_at, cover_image, gallery_images"
    )
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6f9cff]">
              Adedoyin CMS
            </p>

            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
              Projects
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage the projects displayed across your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/projects/new"
              className="!bg-white !text-black px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
            >
              New project
            </a>

            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="border border-white/10 px-5 py-3 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="mt-10">
          {error ? (
            <div className="border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
              Failed to load projects.
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
              <p className="font-display text-2xl">No projects yet.</p>
              <p className="mt-2 text-sm text-white/40">
                Your first CMS project will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-white/10">
              <div className="hidden grid-cols-[1.4fr_0.9fr_0.6fr_0.4fr_0.6fr_0.8fr] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 md:grid">
                <span>Project</span>
                <span>Category</span>
                <span>Status</span>
                <span>Order</span>
                <span>Featured</span>
                <span>Actions</span>
              </div>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid gap-5 border-b border-white/10 px-5 py-5 last:border-b-0 md:grid-cols-[1.4fr_0.9fr_0.6fr_0.4fr_0.6fr_0.8fr] md:items-center"
                >
                  <div>
                    <p className="font-medium text-white">
                      {project.title}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      /work/{project.slug}
                    </p>
                  </div>

                  <p className="text-sm text-white/50">
                    {project.category}
                  </p>

                  <span
                    className={
                      project.status === "published"
                        ? "inline-flex w-fit border border-emerald-400/20 bg-emerald-400/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300"
                        : "inline-flex w-fit border border-amber-400/20 bg-amber-400/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-300"
                    }
                  >
                    {project.status}
                  </span>

                  <p className="text-sm text-white/50">
                    {project.display_order}
                  </p>

                  <p className="text-sm text-white/50">
                    {project.featured ? "Yes" : "No"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`/admin/projects/${project.id}`}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6f9cff] transition-colors hover:text-white"
                    >
                      Edit
                    </a>

                    <TogglePublishButton
                      projectId={project.id}
                      status={project.status}
                    />

                    <MoveProjectButton
                      projectId={project.id}
                      direction="up"
                    />

                    <MoveProjectButton
                      projectId={project.id}
                      direction="down"
                    />

                    <DuplicateProjectButton
                      projectId={project.id}
                    />

                    <DeleteProjectButton
                      projectId={project.id}
                      title={project.title}
                      coverImage={project.cover_image}
                      galleryImages={project.gallery_images}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
