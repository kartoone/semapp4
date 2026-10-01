"use client";

import { useState } from "react";
import { recordSale } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewSales() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    const result = await recordSale({
      sales_date: formData.get("sales_date")?.toString() ?? "",
      degC: Number(formData.get("degC")),
      ice_cream_sales: Number(formData.get("ice_cream_sales")),
      coffee_sales: Number(formData.get("coffee_sales")),
    });

    if (result.success) {
      setMessage({ type: "success", text: "Day saved to the log." });
    } else {
      setMessage({ type: "error", text: result.error ?? "Something went wrong." });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a day</CardTitle>
        <CardDescription>
          Record the number of ice cream and hot coffee sales for a day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sales_date">Date</Label>
            <Input
              id="sales_date"
              name="sales_date"
              type="datetime-local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degC">Temperature (°C)</Label>
            <Input
              id="degC"
              name="degC"
              type="number"
              min="-100"
              max="100"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ice_cream_sales">Ice cream sales</Label>
            <Input
              id="ice_cream_sales"
              name="ice_cream_sales"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coffee_sales">Hot coffee sales</Label>
            <Input
              id="coffee_sales"
              name="coffee_sales"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Save day
          </Button>

          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-sm text-green-600 dark:text-green-400"
                  : "text-sm text-red-600 dark:text-red-400"
              }
            >
              {message.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}