"use client";

import { useTransition } from "react";
import { refreshSales } from "@/components/actions/refresh-sales";

export function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => refreshSales())}
      disabled={isPending}
    >
      {isPending ? "Refreshing..." : "Refresh"}
    </button>
  );
}