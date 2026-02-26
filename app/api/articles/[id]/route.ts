import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  // Discover which columns actually exist in the table
  const { data: sample } = await supabase.from("articles").select("*").eq("id", id).single()
  const knownCols = sample ? Object.keys(sample) : []

  const allFields: Record<string, unknown> = {
    title: body.title,
    slug: body.slug,
    description: body.description,
    content: body.content,
    category: body.category,
    image_url: body.image_url,
    is_featured: body.is_featured,
    specs: body.specs,
    download_url: body.download_url,
    enable_timer: body.enable_timer,
    updated_at: new Date().toISOString(),
  }

  // Only include fields that exist as columns AND were provided in the body
  const updateData: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(allFields)) {
    if (val !== undefined && knownCols.includes(key)) {
      updateData[key] = val
    }
  }

  // Always try updated_at if column exists
  if (knownCols.includes("updated_at")) {
    updateData.updated_at = new Date().toISOString()
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
