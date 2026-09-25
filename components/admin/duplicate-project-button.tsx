"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DuplicateProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function duplicateProject() {
    setLoading(true);

    const { error } = await supabase.rpc("duplicate_project", {
      p_project_id: projectId,
    });

    if (error) {
      alert(`Could not duplicate project: ${error.message}`);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={duplicateProject}
      disabled={loading}
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white disabled:opacity-40"
    >
      {loading ? "Duplicating..." : "Duplicate"}
    </button>
  );
}
