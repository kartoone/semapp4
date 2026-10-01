import { NextResponse } from "next/server";

const TOKEN_COOKIE = "access_token";

/**
 * Clears the stored access token, ending the OAuth session.
 */
export async function POST() {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = NextResponse.redirect(`${origin}/`);
  res.cookies.set(TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}