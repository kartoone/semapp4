"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSales, type Sale } from "@/lib/api";
import { RefreshButton } from "@/components/refresh-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IceCream, Coffee } from "lucide-react";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSales(await fetchSales());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalIceCream = sales.reduce((sum, s) => sum + (s.ice_cream_sales ?? 0), 0);
  const totalCoffee = sales.reduce((sum, s) => sum + (s.coffee_sales ?? 0), 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Sales log</CardTitle>
          <CardDescription>
            {sales.length} day{sales.length === 1 ? "" : "s"} recorded
          </CardDescription>
        </div>
        <RefreshButton onRefresh={load} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IceCream className="h-4 w-4" /> Ice cream
            </div>
            <div className="text-2xl font-semibold">{totalIceCream}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" /> Hot coffee
            </div>
            <div className="text-2xl font-semibold">{totalCoffee}</div>
          </div>
        </div>

        {error ? (
          <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading…
          </p>
        ) : sales.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No sales recorded yet. Add your first day on the right.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 text-right font-medium">Temperature (°C)</th>
                  <th className="pb-2 text-right font-medium">Ice cream</th>
                  <th className="pb-2 text-right font-medium">Hot coffee</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b last:border-0">
                    <td className="py-2">{formatDate(sale.sales_date)}</td>
                    <td className="py-2 text-right">{sale.degC}</td>
                    <td className="py-2 text-right">{sale.ice_cream_sales}</td>
                    <td className="py-2 text-right">{sale.coffee_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
