import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const DEFAULT_SETTINGS = {
  id: "default",
  site_name: "Vorqenox",
  logo_url: "",
  neon_color: "#FFD700",
  social_links: { twitter: "", telegram: "", youtube: "", instagram: "" },
  ipqs_active: false,
}

export async function GET() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) {
    console.log("[v0] Settings GET error:", error.message, error.code)
    return NextResponse.json(DEFAULT_SETTINGS)
  }

  if (!data) {
    // Table exists but empty — return defaults
    return NextResponse.json(DEFAULT_SETTINGS)
  }

  // Normalize whatever columns exist in DB to what the frontend expects
  return NextResponse.json({
    id: data.id ?? "default",
    site_name: data.site_name ?? DEFAULT_SETTINGS.site_name,
    logo_url: data.logo_url ?? "",
    neon_color: data.neon_color ?? DEFAULT_SETTINGS.neon_color,
    social_links: data.social_links ?? DEFAULT_SETTINGS.social_links,
    ipqs_active: data.ipqs_active ?? false,
  })
}

export async function PUT(request: Request) {
  const body = await request.json()
  console.log("[v0] Settings PUT body:", JSON.stringify(body))

  const payload = {
    site_name: body.site_name ?? "Vorqenox",
    logo_url: body.logo_url ?? "",
    neon_color: body.neon_color ?? "#FFD700",
    social_links: body.social_links ?? {},
    ipqs_active: body.ipqs_active ?? false,
  }

  // First check if any row exists
  const { data: existing, error: fetchErr } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle()

  if (fetchErr) {
    console.log("[v0] Settings fetch error:", fetchErr.message, fetchErr.code)
  }

  if (existing?.id) {
    // Update existing row
    const { data, error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.log("[v0] Settings UPDATE error:", error.message, error.code, error.details)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } else {
    // No row — insert a new one
    const { data, error } = await supabase
      .from("site_settings")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.log("[v0] Settings INSERT error:", error.message, error.code, error.details)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }
}
