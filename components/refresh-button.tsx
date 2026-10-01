"use client";

import { useState } from "react";

export function RefreshButton({ onRefresh }: { onRefresh?: () => void }) {
  const [isPending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await onRefresh?.();
    } finally {
      setPending(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Refreshing..." : "Refresh"}
    </button>
  );
}