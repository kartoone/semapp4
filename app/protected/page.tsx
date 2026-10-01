import NewSales from "@/components/new-sales";
import Sales from "@/components/sales";

export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">Daily Sales</h1>
        <p className="text-sm text-muted-foreground">
          Log and review how many ice cream and hot coffee sales were made each
          day.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Sales />
        <NewSales />
      </div>
    </div>
  );
}
