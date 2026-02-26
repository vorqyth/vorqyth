import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const FALLBACK_PROOF = [
  { id: "1", name: "Mohammed", gift_card_type: "ChatGPT Pro", price: "Free Access", time_ago: "2 minutes ago" },
  { id: "2", name: "Fatima", gift_card_type: "Netflix Premium", price: "Free Access", time_ago: "5 minutes ago" },
  { id: "3", name: "Ahmed", gift_card_type: "Spotify Premium", price: "Free Access", time_ago: "8 minutes ago" },
  { id: "4", name: "Youssef", gift_card_type: "YouTube Premium", price: "Free Access", time_ago: "12 minutes ago" },
  { id: "5", name: "Khalid", gift_card_type: "Adobe Creative", price: "Free Access", time_ago: "15 minutes ago" },
  { id: "6", name: "Sara", gift_card_type: "Canva Pro", price: "Free Access", time_ago: "18 minutes ago" },
  { id: "7", name: "Omar", gift_card_type: "Microsoft 365", price: "Free Access", time_ago: "22 minutes ago" },
  { id: "8", name: "Layla", gift_card_type: "Midjourney Pro", price: "Free Access", time_ago: "25 minutes ago" },
]

export async function GET() {
  try {
    const { data, error } = await supabase.from("social_proof").select("*")
    if (!error && data && data.length > 0) {
      return NextResponse.json(data)
    }
  } catch {
    // table may not exist - use fallback
  }
  return NextResponse.json(FALLBACK_PROOF)
}

export async function PUT(request: Request) {
  const body = await request.json()

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
