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

function normalizeRow(row: Record<string, unknown>) {
  return {
    id: row.id ?? "default",
    site_name: row.site_name ?? DEFAULT_SETTINGS.site_name,
    logo_url: row.logo_url ?? "",
    neon_color: row.neon_color ?? DEFAULT_SETTINGS.neon_color,
    social_links: row.social_links ?? DEFAULT_SETTINGS.social_links,
    ipqs_active: row.ipqs_active ?? false,
  }
}

// Build a payload containing only columns that actually exist in the DB row
function buildSafePayload(
  body: Record<string, unknown>,
  knownColumns: string[]
) {
  const payload: Record<string, unknown> = {}
  const columnMap: Record<string, string> = {
    site_name: "site_name",
    logo_url: "logo_url",
    neon_color: "neon_color",
    social_links: "social_links",
    ipqs_active: "ipqs_active",
  }
  for (const [bodyKey, dbCol] of Object.entries(columnMap)) {
    if (knownColumns.includes(dbCol)) {
      payload[dbCol] = body[bodyKey]
    }
  }
  return payload
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
  if (!data) return NextResponse.json(DEFAULT_SETTINGS)

  console.log("[v0] Settings GET columns:", Object.keys(data))
  return NextResponse.json(normalizeRow(data))
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Step 1: Discover which columns exist by reading the first row (or an empty result)
  const { data: probe, error: probeErr } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle()

  if (probeErr && probeErr.code !== "PGRST116") {
    console.log("[v0] Settings probe error:", probeErr.message, probeErr.code)
  }

  // If we got a row, we know the exact columns
  let knownColumns: string[] = []
  if (probe) {
    knownColumns = Object.keys(probe)
    console.log("[v0] Settings known columns:", knownColumns)
  } else {
    // Table is empty — try inserting with just site_name which is most likely to exist
    knownColumns = ["site_name"]
  }

  const safePayload = buildSafePayload(body, knownColumns)
  console.log("[v0] Settings safe payload:", JSON.stringify(safePayload))

  if (probe?.id) {
    // Update existing row
    const { data, error } = await supabase
      .from("site_settings")
      .update(safePayload)
      .eq("id", probe.id)
      .select()
      .single()

    if (error) {
      console.log("[v0] Settings UPDATE error:", error.message, error.code)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(normalizeRow(data))
  } else {
    // No row — insert
    const { data, error } = await supabase
      .from("site_settings")
      .insert({ site_name: body.site_name ?? "Vorqenox", ...safePayload })
      .select()
      .single()

    if (error) {
      console.log("[v0] Settings INSERT error:", error.message, error.code)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(normalizeRow(data))
  }
}
