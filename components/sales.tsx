"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function Sales() {
  const supabase = await createClient();

  const {data:sales, error} = await supabase.from('sales').select();

  if (error || !sales) {
    redirect("/auth/login") 
  }

  return (
    <div>
      <div>Needs refreshing: {false ? "Yes" : "No"}</div>
    <ul>
      {sales?.map((sale) => (
        <li key={sale.id}>{sale.sales_date}</li>
      ))}
    </ul>
    </div>
  )
}
