import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("social_proof")
    .select("*")

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data ?? [])
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Clear existing items and insert new ones
  await supabase.from("social_proof").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  if (body.length > 0) {
    const items = body.map((item: { name: string; gift_card_type: string; price: string; time_ago: string }) => ({
      name: item.name,
      gift_card_type: item.gift_card_type,
      price: item.price,
      time_ago: item.time_ago,
    }))

    const { data, error } = await supabase
      .from("social_proof")
      .insert(items)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  return NextResponse.json([])
}
