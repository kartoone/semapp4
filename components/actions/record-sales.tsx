"use server";

import { createClient } from "@/lib/supabase/server";
import { refreshSales } from "@/components/actions/refresh-sales";

export async function recordSales(formData: FormData) {
  const supabase = await createClient();
  const degC = Number(formData.get("degC")?.toString().trim());
  const sales_date = formData.get("sales_date")?.toString().trim();
  const ice_cream_sales = Number(formData.get("ice_cream_sales")?.toString().trim());
  const coffee_sales = Number(formData.get("coffee_sales")?.toString().trim());

  if (!sales_date || Number.isNaN(degC) || Number.isNaN(ice_cream_sales) || Number.isNaN(coffee_sales)) {
    return {
      success: false,
      error: "Please fill in the date, temperature, and both sales counts."
    };
  }

  const { error } = await supabase
    .from("sales")
    .insert({
      degC: degC,
      sales_date: sales_date,
      ice_cream_sales: ice_cream_sales,
      coffee_sales: coffee_sales
    });

  if (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to save this day."
    };
  }

  refreshSales();
  
  return {
    success: true
  };

}