"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

async function fetchSales() {
  const supabase = await createClient();
  const {data:sales, error} = await supabase.from('sales').select();
  if (error || !sales) {
    redirect("/auth/login") 
  }
  return sales;
}

export default async function Sales() {
  const sales = await fetchSales();

  return (
    <div>
      <div>Needs refreshing: {false ? "Yes" : "No"}</div>
      <button onClick={fetchSales}>Refresh</button>
    <ul>
      {sales?.map((sale) => (
        <li key={sale.id}>{sale.sales_date}</li>
      ))}
    </ul>
    </div>
  )
}
