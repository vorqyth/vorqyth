import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({
      id: "",
      site_name: "Vorqenox",
      logo_url: "",
      neon_color: "#FFD700",
      social_links: { twitter: "", telegram: "", youtube: "", instagram: "" },
      ipqs_active: false,
    })
  }
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Try to get existing settings first
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from("site_settings")
      .update({
        site_name: body.site_name,
        logo_url: body.logo_url,
        neon_color: body.neon_color,
        social_links: body.social_links,
        ipqs_active: body.ipqs_active,
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } else {
    const { data, error } = await supabase
      .from("site_settings")
      .insert({
        site_name: body.site_name,
        logo_url: body.logo_url,
        neon_color: body.neon_color,
        social_links: body.social_links,
        ipqs_active: body.ipqs_active,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
}
