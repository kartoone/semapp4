"use client";

import { Button } from "@/components/ui/button";

export function MyButton() {

  return (<Button size="sm" variant={"outline"} onClick={() => (window.location.href = "/api/auth/authorize")}>
        Sign in
      </Button>);
}
