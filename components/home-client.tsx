"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCards } from "@/components/hero-cards"
import { SwiperSection } from "@/components/swiper-section"
import { CategoryTabs } from "@/components/category-tabs"
import { SocialProofToast } from "@/components/social-proof-toast"
import { GhostRefresh } from "@/components/ghost-refresh"
import type { Article } from "@/lib/data"

export function HomeClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Debug: discover actual schema
    fetch("/api/debug-schema")
      .then((r) => r.json())
      .then((d) => console.log("[v0] DB Schema Discovery:", JSON.stringify(d, null, 2)))
      .catch((e) => console.log("[v0] Schema probe error:", e))

    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => {
        console.log("[v0] Articles API response:", JSON.stringify(data).slice(0, 500))
        setArticles(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />
      <main className="flex-1">
        <HeroCards articles={articles} />
        <SwiperSection articles={articles} />
        <CategoryTabs articles={articles} />
      </main>
      <Footer />
      <SocialProofToast />
      <GhostRefresh />
    </div>
  )
}
