"use client";

/**
 * Client-side helper for talking to the OAuth-protected API.
 *
 * The access token lives in an httpOnly cookie (set by the OAuth callback), so
 * these fetch calls send it automatically via `credentials: "include"`. The API
 * verifies the token before returning any data.
 */

export type Sale = {
  id: number;
  sales_date: string;
  degC: number;
  ice_cream_sales: number;
  coffee_sales: number;
};

export async function fetchSales(): Promise<Sale[]> {
  const res = await fetch("/api/sales", { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to load sales");
  }
  return res.json();
}

export async function recordSale(input: {
  sales_date: string;
  degC: number;
  ice_cream_sales: number;
  coffee_sales: number;
}): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/sales", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { success: false, error: data.error ?? "Something went wrong." };
  }
  return { success: true };
}