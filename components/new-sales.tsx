"use client";

import { useState } from "react";
import { recordSales } from "./actions/record-sales";

export default function NewSales() {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setMessage("");

    const result = await recordSales(formData);

    if (result.success) {
      setMessage("Thanks! Your information was submitted.");
    } else {
      setMessage(result.error ?? "Something went wrong.");
    }
  }

  return (
    <main>
      <h1>Submit Information</h1>

      <form action={handleSubmit}>
        <div>
          <label htmlFor="degC">Temperature (°C)</label>
          <input
            id="degC"
            name="degC"
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="ice_cream_sales">Ice Cream Sales</label>
          <input
            id="ice_cream_sales"
            name="ice_cream_sales"
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="coffee_sales">Coffee Sales</label>
          <input
            id="coffee_sales"
            name="coffee_sales"
            type="text"
            required
          />
        </div>

        <button type="submit">
          Submit
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}