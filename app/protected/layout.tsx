import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";
import { IceCream } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4 text-sm">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <IceCream className="h-5 w-5" />
            Daily Sales Tracker
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-5xl flex-1 p-5">{children}</div>
    </main>
  );
}
