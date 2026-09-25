"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProjectData = {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  problem?: string;
  system?: string;
  outcome?: string;
  content?: string;
  case_study_sections?: { heading: string; body: string }[] | null;
  technologies?: string[];
  tags?: string[];
  client?: string | null;
  year?: number | null;
  cover_image?: string | null;
  gallery_images?: { src: string; alt: string }[] | null;
  demo_url?: string | null;
  github_url?: string | null;
  project_url?: string | null;
  status?: "draft" | "published";
  display_order?: number;
  featured?: boolean;
  flow?: string[];
};

type Props = {
  project?: ProjectData;
};

export default function ProjectForm({ project }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [problem, setProblem] = useState(project?.problem ?? "");
  const [system, setSystem] = useState(project?.system ?? "");
  const [outcome, setOutcome] = useState(project?.outcome ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [caseStudySections, setCaseStudySections] = useState<
    { heading: string; body: string }[]
  >(() => {
    if (!Array.isArray(project?.case_study_sections)) return [];
    return project.case_study_sections.filter(
      (section): section is { heading: string; body: string } =>
        typeof section === "object" &&
        section !== null &&
        typeof section.heading === "string" &&
        typeof section.body === "string"
    );
  });
  const [technologies, setTechnologies] = useState(
    project?.technologies?.join(", ") ?? ""
  );
  const [tags, setTags] = useState(project?.tags?.join(", ") ?? "");
  const [flow, setFlow] = useState(project?.flow?.join("\n") ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [year, setYear] = useState(
    project?.year ? String(project.year) : String(new Date().getFullYear())
  );
  const [coverImage, setCoverImage] = useState(project?.cover_image ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [galleryImages, setGalleryImages] = useState<
    { src: string; alt: string }[]
  >(() => {
    if (!Array.isArray(project?.gallery_images)) return [];

    return project.gallery_images.filter(
      (item): item is { src: string; alt: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof item.src === "string"
    );
  });

  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.project_url ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    project?.status ?? "draft"
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(project?.display_order ?? 1)
  );
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addCaseStudySection() {
    setCaseStudySections((current) => [
      ...current,
      {
        heading: "",
        body: "",
      },
    ]);
  }

  function updateCaseStudySection(
    index: number,
    field: "heading" | "body",
    value: string
  ) {
    setCaseStudySections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  }

  function removeCaseStudySection(index: number) {
    setCaseStudySections((current) =>
      current.filter((_, sectionIndex) => sectionIndex !== index)
    );
  }
  async function handleCoverUpload(file: File) {
    setError("");
    setUploadingCover(true);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-");

    const filePath = `covers/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingCover(false);
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    setCoverImage(data.publicUrl);
    setUploadingCover(false);
  }

  async function handleGalleryUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Please choose an image smaller than 6 MB.");
      return;
    }

    setError("");
    setUploadingGallery(true);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-");

    const filePath = `gallery/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingGallery(false);
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    setGalleryImages((current) => [
      ...current,
      {
        src: data.publicUrl,
        alt: file.name.replace(/\.[^/.]+$/, ""),
      },
    ]);

    setUploadingGallery(false);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category: category.trim(),
      description: description.trim(),
      problem: problem.trim() || null,
      system: system.trim() || null,
      outcome: outcome.trim() || null,
      content: content.trim() || null,
      technologies: technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      flow: flow
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      client: client.trim() || null,
      year: year ? Number(year) : null,
      cover_image: coverImage.trim() || null,
      case_study_sections: caseStudySections,
      gallery_images: galleryImages,
      demo_url: demoUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      project_url: projectUrl.trim() || null,
      status,
      display_order: Number(displayOrder) || 1,
      featured,
    };

    if (!payload.title || !payload.slug || !payload.category || !payload.description) {
      setError("Title, slug, category, and description are required.");
      setLoading(false);
      return;
    }

    const query = project?.id
      ? supabase.from("projects").update(payload).eq("id", project.id)
      : supabase.from("projects").insert(payload);

    const { error: saveError } = await query;

    if (saveError) {
      setError(saveError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" value={title} onChange={setTitle} required />
        <Field label="URL slug" value={slug} onChange={setSlug} required />
        <Field label="Category" value={category} onChange={setCategory} required />
        <Field label="Client" value={client} onChange={setClient} />
        <Field label="Year" value={year} onChange={setYear} type="number" />
        <Field
          label="Display order"
          value={displayOrder}
          onChange={setDisplayOrder}
          type="number"
        />
      </div>

      <Field
        label="Short description"
        value={description}
        onChange={setDescription}
        textarea
        required
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Problem" value={problem} onChange={setProblem} textarea />
        <Field label="System" value={system} onChange={setSystem} textarea />
        <Field label="Outcome" value={outcome} onChange={setOutcome} textarea />
      </div>

      <Field
        label="Case study content"
        value={content}
        onChange={setContent}
        textarea
        rows={14}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Technologies"
          value={technologies}
          onChange={setTechnologies}
          placeholder="n8n, Gemini, Google Sheets"
        />

        <Field
          label="Tags"
          value={tags}
          onChange={setTags}
          placeholder="automation, ai, crm"
        />
      </div>

      <Field
        label="Workflow steps"
        value={flow}
        onChange={setFlow}
        textarea
        placeholder={"Website lead\nWebhook\nCRM\nQualification\nAlert"}
      />


      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Demo URL" value={demoUrl} onChange={setDemoUrl} />
        <Field label="GitHub URL" value={githubUrl} onChange={setGithubUrl} />
        <Field
          label="Project URL"
          value={projectUrl}
          onChange={setProjectUrl}
        />
      </div>

      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-sm text-white/60">
            Cover image
          </span>

          <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-[#6f9cff]/60 hover:bg-white/[0.04]">
            <span className="text-sm font-medium text-white">
              {uploadingCover ? "Uploading image..." : "Upload cover image"}
            </span>

            <span className="mt-2 text-xs text-white/35">
              PNG, JPG, JPEG or WebP  Max 6 MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              disabled={uploadingCover}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleCoverUpload(file);
                }

                event.target.value = "";
              }}
            />
          </label>
        </div>

        <Field
          label="Or use an image URL"
          value={coverImage}
          onChange={setCoverImage}
          placeholder="/screenshots/project-01-real-estate/workflow.png"
        />

        {coverImage ? (
          <div className="overflow-hidden border border-white/10 bg-[#090909]">
            <img
              src={coverImage}
              alt={title || "Project cover preview"}
              className="aspect-[16/8] w-full object-cover object-left-top"
            />
          </div>
        ) : null}
      </div>      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-sm text-white/60">
            Gallery images
          </span>

          <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-[#6f9cff]/60 hover:bg-white/[0.04]">
            <span className="text-sm font-medium text-white">
              {uploadingGallery
                ? "Uploading image..."
                : "Add gallery image"}
            </span>

            <span className="mt-2 text-xs text-white/35">
              Upload one screenshot at a time  PNG, JPG, JPEG or WebP  Max 6 MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              disabled={uploadingGallery}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleGalleryUpload(file);
                }

                event.target.value = "";
              }}
            />
          </label>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="overflow-hidden border border-white/10 bg-[#090909]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[16/10] w-full object-cover"
                />

                <div className="flex items-center justify-between border-t border-white/10 px-3 py-3">
                  <span className="text-xs text-white/35">
                    Image {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-300/70 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

            <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="block text-sm text-white/60">
              Case study sections
            </span>

            <p className="mt-1 text-xs leading-5 text-white/30">
              Add structured sections such as Architecture, Automation Logic,
              Results, or Lessons Learned.
            </p>
          </div>

          <button
            type="button"
            onClick={addCaseStudySection}
            className="border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-white/25 hover:text-white"
          >
            Add section
          </button>
        </div>

        {caseStudySections.length > 0 ? (
          <div className="space-y-4">
            {caseStudySections.map((section, index) => (
              <div
                key={index}
                className="space-y-4 border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                    Section {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeCaseStudySection(index)}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-300/70 transition-colors hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <input
                  value={section.heading}
                  onChange={(event) =>
                    updateCaseStudySection(
                      index,
                      "heading",
                      event.target.value
                    )
                  }
                  placeholder="Heading e.g. Architecture"
                  className="w-full border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#6f9cff]"
                />

                <textarea
                  value={section.body}
                  onChange={(event) =>
                    updateCaseStudySection(
                      index,
                      "body",
                      event.target.value
                    )
                  }
                  placeholder="Describe this part of the project..."
                  rows={6}
                  className="w-full resize-y border border-white/10 bg-[#090909] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#6f9cff]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/30">
            No structured sections yet.
          </div>
        )}
      </div>
<div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Status</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "draft" | "published")
            }
            className="w-full border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none focus:border-[#6f9cff]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label className="flex items-center gap-3 pt-8 text-sm text-white/60">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 accent-[#6f9cff]"
          />
          Featured project
        </label>
      </div>

      {coverImage ? (
        <div className="overflow-hidden border border-white/10 bg-[#090909]">
          <img
            src={coverImage}
            alt={title || "Project cover preview"}
            className="aspect-[16/8] w-full object-cover object-left-top"
          />
        </div>
      ) : null}

      {error ? (
        <div className="border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm leading-6 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : project?.id
              ? "Save project"
              : "Create project"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="border border-white/10 px-6 py-3 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  required = false,
  rows = 5,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  required?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className="w-full resize-y border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#6f9cff]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#6f9cff]"
        />
      )}
    </label>
  );
}
