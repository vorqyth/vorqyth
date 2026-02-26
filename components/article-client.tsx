"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  HardDrive,
  Tag,
  Box,
  Calendar,
  Download,
  Star,
  Shield,
  Clock,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialProofToast } from "@/components/social-proof-toast"
import { GhostRefresh } from "@/components/ghost-refresh"
import type { Article } from "@/lib/data"

const specIconMap: Record<string, React.ReactNode> = {
  Version: <Tag className="h-4 w-4" />,
  Platform: <Monitor className="h-4 w-4" />,
  Size: <HardDrive className="h-4 w-4" />,
  License: <Box className="h-4 w-4" />,
  Quality: <Monitor className="h-4 w-4" />,
  Screens: <Monitor className="h-4 w-4" />,
  Downloads: <HardDrive className="h-4 w-4" />,
  Value: <Tag className="h-4 w-4" />,
  Delivery: <Box className="h-4 w-4" />,
  Validity: <Calendar className="h-4 w-4" />,
}

export function ArticleClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/articles?slug=${slug}`)
        const data = await res.json()
        if (data && data.id) {
          setArticle(data)
          const relRes = await fetch(`/api/articles?category=${data.category}`)
          const relData = await relRes.json()
          setRelatedArticles(
            (relData || []).filter((a: Article) => a.id !== data.id).slice(0, 3)
          )
        }
      } catch {
        // silent
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
            <p className="text-sm text-zinc-500">Loading article...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-100">Article Not Found</h1>
          <Link href="/" className="text-sm text-[#FFD700] hover:underline">
            Back to Home
          </Link>
        </main>
      </div>
    )
  }

  const specs = Array.isArray(article.specs) ? article.specs : []

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />

      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.03) 0%, transparent 60%)" }} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-[#FFD700]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="capitalize text-[#FFD700]">{article.category.replace("-", " ")}</span>
            </div>

            {/* Editorial Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 px-3 py-1 text-xs font-medium text-[#FFD700]">
                  <Star className="h-3 w-3" />
                  {article.category.replace("-", " ")}
                </span>
                {article.is_featured && (
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] px-3 py-1 text-xs font-bold text-zinc-950">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-zinc-100 md:text-4xl text-balance">
                {article.title}
              </h1>
              <p className="text-base leading-relaxed text-zinc-400 text-pretty">
                {article.description}
              </p>
            </div>

            {/* Premium CTA - Golden Gradient */}
            <div className="mb-8">
              <a
                href={article.download_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] py-4 text-base font-bold text-zinc-950 transition-all hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                style={{ boxShadow: "0 0 30px rgba(255,215,0,0.25), 0 0 60px rgba(255,215,0,0.08)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <Download className="relative h-5 w-5" />
                <span className="relative">Get Access Now</span>
              </a>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-[#FFD700]" />
                  Verified Link
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#FFD700]" />
                  Instant Access
                </span>
              </div>
            </div>

            {/* Specs grid */}
            {specs.length > 0 && (
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {specs.map((spec: { label: string; value: string }) => (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:border-[#FFD700]/20 hover:shadow-[0_0_15px_rgba(255,215,0,0.06)]"
                  >
                    <div className="flex items-center gap-2 text-[#FFD700]">
                      {specIconMap[spec.label] || <Tag className="h-4 w-4" />}
                      <span className="text-xs text-zinc-500">{spec.label}</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-100">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Content - Editorial Style */}
            {article.content && (
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl" style={{ boxShadow: "0 0 20px rgba(255,215,0,0.04)" }}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Overview
                </h2>
                <div className="space-y-2">
                  {article.content.split("\n").map((line: string, i: number) => {
                    const key = `line-${i}`
                    if (line.startsWith("- ")) {
                      return (
                        <div key={key} className="flex items-start gap-2.5 py-0.5">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FFD700]" />
                          <span className="text-sm leading-relaxed text-zinc-400">{line.slice(2)}</span>
                        </div>
                      )
                    }
                    if (line.trim() === "") return <div key={key} className="h-3" />
                    return <p key={key} className="text-sm leading-relaxed text-zinc-400">{line}</p>
                  })}
                </div>
              </div>
            )}

            {/* Second CTA */}
            <div className="mb-12">
              <a
                href={article.download_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 py-3.5 text-sm font-bold text-[#FFD700] transition-all hover:bg-[#FFD700]/20 hover:shadow-[0_0_20px_rgba(255,215,0,0.12)]"
              >
                <Download className="h-4 w-4" />
                Download - Direct Link
              </a>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 text-lg font-bold text-zinc-100">
                  Related{" "}
                  <span className="text-[#FFD700]" style={{ textShadow: "0 0 8px rgba(255,215,0,0.25)" }}>
                    Articles
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.id}
                      href={`/article/${ra.slug}`}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.08)]"
                    >
                      <h3 className="mb-1 text-sm font-bold text-zinc-100 transition-colors group-hover:text-[#FFD700] line-clamp-1">
                        {ra.title}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-xs text-zinc-500">{ra.description}</p>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#FFD700]">
                        Read More
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
      <SocialProofToast />
      <GhostRefresh />
    </div>
  )
}
