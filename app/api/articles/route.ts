import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function normalizeArticle(row: Record<string, unknown>) {
  return {
    id: row.id ?? crypto.randomUUID(),
    title: row.title ?? "Untitled",
    slug: row.slug ?? "",
    description: row.description ?? "",
    content: row.content ?? "",
    category: row.category ?? "apps",
    image_url: row.image_url ?? row.imageUrl ?? "",
    is_featured: row.is_featured ?? row.isFeatured ?? false,
    specs: row.specs ?? [],
    download_url: row.download_url ?? row.downloadUrl ?? "#",
    enable_timer: row.enable_timer ?? row.enableTimer ?? true,
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
  }
}

// Only include fields that actually exist as columns
function buildSafeInsert(body: Record<string, unknown>, knownCols: string[]) {
  const mapping: Record<string, unknown> = {
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
  }
  const safe: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(mapping)) {
    if (knownCols.includes(key)) safe[key] = val
  }
  return safe
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  const slug = searchParams.get("slug")

  let query = supabase.from("articles").select("*")

  if (slug) {
    const { data, error } = await query.eq("slug", slug).maybeSingle()
    if (error || !data) return NextResponse.json(null, { status: 404 })
    return NextResponse.json(normalizeArticle(data as Record<string, unknown>))
  }

  if (featured === "true") {
    // Try is_featured first — if column doesn't exist, query returns error
    query = query.eq("is_featured", true)
  }
  if (category) {
    query = query.eq("category", category)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    // If is_featured column doesn't exist, retry without the filter
    if (featured === "true" && error.message.includes("is_featured")) {
      const retryQuery = category
        ? supabase.from("articles").select("*").eq("category", category).order("created_at", { ascending: false })
        : supabase.from("articles").select("*").order("created_at", { ascending: false })
      const { data: retryData } = await retryQuery
      return NextResponse.json(
        (retryData ?? []).map((r) => normalizeArticle(r as Record<string, unknown>))
      )
    }
    return NextResponse.json([], { status: 200 })
  }

  return NextResponse.json(
    (data ?? []).map((row) => normalizeArticle(row as Record<string, unknown>))
  )
}

export async function POST(request: Request) {
  const body = await request.json()

  // Discover columns from an existing row
  const { data: sample } = await supabase.from("articles").select("*").limit(1).maybeSingle()
  const knownCols = sample ? Object.keys(sample) : ["title", "slug", "description", "content", "category"]
  const payload = buildSafeInsert(body, knownCols)

  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeArticle(data as Record<string, unknown>), { status: 201 })
}
