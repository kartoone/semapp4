"use client"; // 👈 Mark this file as client-side

import { createClient } from "@/lib/supabase/server";

async function handleSubmit(e:any) {
    const supabase = await createClient();
    
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const degC = formData.get("degC");
    alert(`It was '${degC}'`);

    const { error } = await supabase
  .from('sales')
  .insert({ degC: Number(degC), ice_cream_sales: 252, coffee_sales: 51 })
  }

export default async function NewSales() {

  return (
    <form action="/processsales">
      <input name="degC" />
      <input name="icecream" />
      <input name="coffee" />
      <button type="submit">Add</button>
    </form>
  );
}