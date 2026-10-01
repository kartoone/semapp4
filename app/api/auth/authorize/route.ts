import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";

const COOKIE_NAME = "oauth_state";

/**
 * Step 1 of the Authorization Code + PKCE flow.
 *
 * We generate a `code_verifier`, derive its `code_challenge`, store both in a
 * short-lived httpOnly cookie, and redirect the browser to Supabase's
 * authorize endpoint. When Supabase redirects back with a `code`, the callback
 * route exchanges it for a token using the stored verifier.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // PKCE: a random verifier and its S256 challenge.
  const codeVerifier = base64Url(randomBytes(32));
  const codeChallenge = base64Url(
    createHash("sha256").update(codeVerifier).digest(),
  );

  // State: random value to prevent CSRF; we compare it on the way back.
  const state = randomBytes(16).toString("hex");

  const authorizeUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set(
    "client_id",
    publishableKey,
  );
  authorizeUrl.searchParams.set(
    "redirect_uri",
    `${origin}/api/auth/callback`,
  );
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set(COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
  // Stash the verifier alongside state so the callback can complete the exchange.
  res.cookies.set(`${COOKIE_NAME}_verifier`, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return res;
}

function base64Url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}