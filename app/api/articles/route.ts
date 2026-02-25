import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  const slug = searchParams.get("slug")

  let query = supabase.from("articles").select("*")

  if (slug) {
    const { data, error } = await query.eq("slug", slug).single()
    if (error) return NextResponse.json(null, { status: 404 })
    return NextResponse.json(data)
  }

  if (featured === "true") {
    query = query.eq("is_featured", true)
  }
  if (category) {
    query = query.eq("category", category)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) {
    console.log("[v0] Articles GET error:", error.message, error.details, error.hint)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  console.log("[v0] Articles fetched:", data?.length, "items")
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: body.title,
      slug: body.slug,
      description: body.description || "",
      content: body.content || "",
      category: body.category || "apps",
      image_url: body.image_url || "",
      is_featured: body.is_featured || false,
      specs: body.specs || [],
      download_url: body.download_url || "",
      enable_timer: body.enable_timer ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
