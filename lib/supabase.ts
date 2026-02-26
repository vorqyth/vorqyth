import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DbArticle {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: "apps" | "games" | "ai-tools" | "gift-cards"
  image_url: string
  is_featured: boolean
  specs: { label: string; value: string }[]
  download_url: string
  enable_timer: boolean
  created_at: string
  updated_at: string
}

export interface DbSiteSettings {
  id: string
  site_name: string
  logo_url: string
  neon_color: string
  social_links: {
    twitter: string
    telegram: string
    youtube: string
    instagram: string
  }
  ipqs_active: boolean
}

export interface DbSocialProof {
  id: string
  name: string
  gift_card_type: string
  price: string
  time_ago: string
}
