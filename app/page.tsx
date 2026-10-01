import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { IceCream, Coffee } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <IceCream className="h-5 w-5" />
            Daily Sales Tracker
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-20 text-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40">
            <IceCream className="h-7 w-7 text-amber-600 dark:text-amber-300" />
          </span>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/40">
            <Coffee className="h-7 w-7 text-orange-600 dark:text-orange-300" />
          </span>
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Track your daily ice cream & hot coffee sales
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A simple dashboard for your organization to log how many ice cream
          and hot coffee sales were made each day.
        </p>
        {hasEnvVars ? (
          <Link
            href="/protected"
            className="rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Open dashboard
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your Supabase environment variables to get started.
          </p>
        )}
      </div>

      <footer className="w-full border-t py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 text-xs text-muted-foreground">
          <span>Daily Sales Tracker</span>
          <ThemeSwitcher />
        </div>
      </footer>
    </main>
  );
}
