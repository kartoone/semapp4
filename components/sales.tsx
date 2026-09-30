import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RefreshButton } from "@/components/refresh-button";

async function fetchSales() {
  const supabase = await createClient();
  const { data: sales, error } = await supabase.from("sales").select();
  if (error || !sales) {
    redirect("/auth/login");
  }
  return sales;
}

export default async function Sales() {
  const sales = await fetchSales();

  return (
    <div>
      <div>Needs refreshing: {false ? "Yes" : "No"}</div>
      <RefreshButton />
      <ul>
        {sales?.map((sale) => (
          <li key={sale.id}>{sale.sales_date}</li>
        ))}
      </ul>
    </div>
  );
}
