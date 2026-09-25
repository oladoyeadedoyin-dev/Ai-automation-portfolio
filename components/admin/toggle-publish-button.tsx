"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TogglePublishButton({
  projectId,
  status,
}: {
  projectId: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    setLoading(true);

    const nextStatus =
      status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("projects")
      .update({ status: nextStatus })
      .eq("id", projectId);

    if (error) {
      alert(`Could not change project status: ${error.message}`);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={loading}
      className={
        status === "published"
          ? "font-mono text-[10px] uppercase tracking-[0.12em] text-amber-300/70 transition-colors hover:text-amber-300 disabled:opacity-40"
          : "font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300/70 transition-colors hover:text-emerald-300 disabled:opacity-40"
      }
    >
      {loading
        ? "Saving..."
        : status === "published"
          ? "Unpublish"
          : "Publish"}
    </button>
  );
}
