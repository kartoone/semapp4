"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordSales(formData: FormData) {
  const supabase = await createClient();
  const sales_date = formData.get("sales_date")?.toString().trim();
  const degC = Number(formData.get("degC")?.toString().trim());
  const ice_cream_sales = Number(formData.get("ice_cream_sales")?.toString().trim());
  const coffee_sales = Number(formData.get("coffee_sales")?.toString().trim());

  if (!sales_date || !degC || !ice_cream_sales || !coffee_sales) {
    return {
      success: false,
      error: "All fields are required."
    };
  }

  const { error } = await supabase
    .from("sales")
    .insert({
      sales_date: sales_date,
      degC: degC,
      ice_cream_sales: ice_cream_sales,
      coffee_sales: coffee_sales
    });

  if (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to save submission."
    };
  }

  return {
    success: true
  };
}