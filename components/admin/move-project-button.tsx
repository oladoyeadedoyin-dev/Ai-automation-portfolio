"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MoveProjectButton({
  projectId,
  direction,
}: {
  projectId: string;
  direction: "up" | "down";
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function moveProject() {
    setLoading(true);

    const { error } = await supabase.rpc("move_project", {
      p_project_id: projectId,
      p_direction: direction,
    });

    if (error) {
      alert(`Could not move project: ${error.message}`);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={moveProject}
      disabled={loading}
      title={direction === "up" ? "Move up" : "Move down"}
      className="border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 transition-colors hover:border-white/25 hover:text-white disabled:opacity-30"
    >
      {loading ? "Saving..." : direction === "up" ? "Move up" : "Move down"}
    </button>
  );
}
