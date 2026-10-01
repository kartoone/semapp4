"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    // Clear the OAuth access token cookie via the API, then return home.
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return <Button onClick={logout}>Logout</Button>;
}
