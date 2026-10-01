import { NextResponse } from "next/server";

const STATE_COOKIE = "oauth_state";
const VERIFIER_COOKIE = "oauth_state_verifier";
const TOKEN_COOKIE = "access_token";

/**
 * Step 2 of the Authorization Code + PKCE flow.
 *
 * Supabase redirects the browser here with `?code=...&state=...`. We:
 *   1. Verify `state` matches what we stored (CSRF protection).
 *   2. Exchange the `code` + stored `code_verifier` for a token at Supabase.
 *   3. Store the access token in an httpOnly cookie the API routes can read.
 *   4. Redirect the browser back to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const cookies = request.headers.get("cookie") ?? "";
  const state = parseCookie(cookies, STATE_COOKIE);
  const codeVerifier = parseCookie(cookies, VERIFIER_COOKIE);

  const res = NextResponse.redirect(`${origin}/protected`);
  // Clear the one-time PKCE cookies regardless of outcome.
  res.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(VERIFIER_COOKIE, "", { path: "/", maxAge: 0 });

  if (error || !code) {
    return res;
  }

  // CSRF check: the state Supabase returned must match what we issued.
  if (!state || state !== returnedState) {
    return res;
  }

  // Exchange the authorization code for tokens (PKCE).
  const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      code_verifier: codeVerifier,
      redirect_uri: `${origin}/api/auth/callback`,
    }),
  });

  if (!tokenResponse.ok) {
    return res;
  }

  const tokens = await tokenResponse.json();
  const accessToken: string | undefined = tokens.access_token;
  if (!accessToken) {
    return res;
  }

  // Store the token so the protected API routes can read it.
  res.cookies.set(TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Match the token's lifetime (Supabase default ~1h).
    maxAge: tokens.expires_in ?? 3600,
  });

  return res;
}

function parseCookie(header: string, name: string): string | undefined {
  return header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}