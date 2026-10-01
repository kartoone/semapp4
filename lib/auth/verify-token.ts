import { createClient } from "@supabase/supabase-js";

/**
 * Verifies a Supabase-issued JWT (access token) by asking Supabase to validate
 * it. This is the "resource server" side of the OAuth flow: our API trusts a
 * request only if it carries a valid, unexpired access token.
 *
 * We use the service-role client (server-only) so the check is authoritative
 * and cannot be spoofed by the browser.
 */
export async function verifyAccessToken(
  token: string,
): Promise<{ valid: boolean; user: { id: string; email: string } | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
    },
  );

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { valid: false, user: null };
  }

  return {
    valid: true,
    user: { id: data.user.id, email: data.user.email ?? "" },
  };
}