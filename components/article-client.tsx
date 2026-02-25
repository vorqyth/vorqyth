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
        if (data) {
          setArticle(data)
          // Fetch related articles
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="capitalize text-primary">
                {article.category.replace("-", " ")}
              </span>
            </div>

            {/* Editorial Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <Star className="h-3 w-3" />
                  {article.category.replace("-", " ")}
                </span>
                {article.is_featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-xs font-medium text-amber-400">
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

            {/* Premium CTA - Direct Download */}
            <div className="mb-8">
              <a
                href={article.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-base font-bold text-zinc-950 transition-all hover:opacity-90"
                style={{
                  boxShadow: "0 0 30px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.1)",
                  animation: "gold-pulse 3s ease-in-out infinite",
                }}
              >
                <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Get Access Now
              </a>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-primary" />
                  Verified Link
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  Instant Access
                </span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {article.specs.map((spec: { label: string; value: string }) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-2 rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md transition-all hover:border-primary/20"
                  style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
                >
                  <div className="flex items-center gap-2 text-primary">
                    {specIconMap[spec.label] || <Tag className="h-4 w-4" />}
                    <span className="text-xs text-zinc-500">
                      {spec.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Content - Editorial Style */}
            <div
              className="mb-8 rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-md"
              style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
                Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                {article.content.split("\n").map((line: string, i: number) => {
                  const key = `line-${i}`
                  if (line.startsWith("- ")) {
                    return (
                      <div key={key} className="flex items-start gap-2 py-1">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span className="text-sm leading-relaxed text-zinc-400">
                          {line.slice(2)}
                        </span>
                      </div>
                    )
                  }
                  if (line.trim() === "") {
                    return <div key={key} className="h-3" />
                  }
                  return (
                    <p key={key} className="text-sm leading-relaxed text-zinc-400">
                      {line}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Second CTA */}
            <div className="mb-12">
              <a
                href={article.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary/20"
                style={{ boxShadow: "0 0 15px rgba(255,215,0,0.1)" }}
              >
                <Download className="h-4 w-4" />
                Download - Direct Link
              </a>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 text-lg font-bold text-zinc-100">
                  Related <span className="gold-text">Articles</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.id}
                      href={`/article/${ra.slug}`}
                      className="group rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md transition-all hover:border-primary/20"
                      style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
                    >
                      <h3 className="mb-1 text-sm font-bold text-zinc-100 transition-colors group-hover:text-primary line-clamp-1">
                        {ra.title}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-xs text-zinc-500">
                        {ra.description}
                      </p>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
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
