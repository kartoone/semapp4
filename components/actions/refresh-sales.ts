"use server";

import { revalidatePath } from "next/cache";

export async function refreshSales() {
  // Re-rendering the page re-runs the async fetch in the Sales server component.
  revalidatePath("/protected");
}