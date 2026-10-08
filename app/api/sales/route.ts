import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAccessToken } from "@/lib/auth/verify-token";

const TOKEN_COOKIE = "access_token";

/**
 * The resource server. Every request must carry a valid Supabase access token
 * (in the httpOnly cookie set by the OAuth callback). We verify the token, then
 * use a Supabase client bound to that user to read/write the `sales` table.
 */
function getAccessToken(request: Request): string | undefined {
  // Prefer an explicit Authorization header (classic OAuth), fall back to the
  // httpOnly cookie set by the OAuth callback.
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  const cookie = request.headers.get("cookie") ?? "";
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

async function requireAuth(request: Request) {
  const token = getAccessToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Missing access token" }, { status: 401 }) };
  }
  const { valid, user } = await verifyAccessToken(token);
  if (!valid || !user) {
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }
  return { user };
}

function userClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
}

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  
  if (auth.error) return auth.error;

  const token = getAccessToken(request)!;
  const supabase = userClient(token);

  const { data, error } = await supabase
    .from("sales")
    .select("id, sales_date, degC, ice_cream_sales, coffee_sales")
    .order("sales_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const token = getAccessToken(request)!;
  const supabase = userClient(token);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sales_date = body.sales_date;
  const degC = Number(body.degC);
  const ice_cream_sales = Number(body.ice_cream_sales);
  const coffee_sales = Number(body.coffee_sales);

  if (
    !sales_date ||
    Number.isNaN(degC) ||
    Number.isNaN(ice_cream_sales) ||
    Number.isNaN(coffee_sales)
  ) {
    return NextResponse.json(
      { error: "Please provide date, temperature, and both sales counts." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("sales")
    .insert({
      sales_date,
      degC,
      ice_cream_sales,
      coffee_sales,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}