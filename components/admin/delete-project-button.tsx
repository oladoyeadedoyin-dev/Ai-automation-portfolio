"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type GalleryImage = {
  src?: string;
  alt?: string;
};

function getStoragePath(url: string | null | undefined) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/project-images/";

  if (!url.includes(marker)) {
    return null;
  }

  return decodeURIComponent(url.split(marker)[1]);
}

export default function DeleteProjectButton({
  projectId,
  coverImage,
  galleryImages,
  title,
}: {
  projectId: string;
  coverImage?: string | null;
  galleryImages?: GalleryImage[] | null;
  title: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}" permanently?\n\nThis will remove the project record and uploaded project images.`
    );

    if (!confirmed) return;

    setDeleting(true);

    const supabase = createClient();

    const paths = [
      getStoragePath(coverImage),
      ...(Array.isArray(galleryImages)
        ? galleryImages.map((image) => getStoragePath(image.src))
        : []),
    ].filter((path): path is string => Boolean(path));

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("project-images")
        .remove(paths);

      if (storageError) {
        alert(`Could not delete project images: ${storageError.message}`);
        setDeleting(false);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      alert(`Could not delete project: ${deleteError.message}`);
      setDeleting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-300/70 transition-colors hover:text-red-300 disabled:opacity-40"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
