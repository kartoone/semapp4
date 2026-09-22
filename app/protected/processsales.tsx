"use server"; // 👈 Mark this file as client-side

import { createClient } from "@/lib/supabase/server";

export default async function processsales() {
    const supabase = await createClient();
  
    // Read the form data from the 
    const form = e.target;
    const formData = new FormData(form);
    const degC = formData.get("degC");
    alert(`It was '${degC}'`);

    const { error } = await supabase
  .from('sales')
  .insert({ degC: Number(degC), ice_cream_sales: 252, coffee_sales: 51 })
  }

