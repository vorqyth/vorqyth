"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Zap, Sparkles } from "lucide-react"
import type { Article } from "@/lib/data"

const categoryIcons: Record<string, React.ReactNode> = {
  "ai-tools": <Sparkles className="h-4 w-4" />,
  apps: <Zap className="h-4 w-4" />,
  games: <Star className="h-4 w-4" />,
  "gift-cards": <Star className="h-4 w-4" />,
}

export function HeroCards({ articles }: { articles: Article[] }) {
  const featured = articles.filter((a) => a.is_featured).slice(0, 3)

  if (featured.length === 0 && articles.length === 0) return null

  const display = featured.length > 0 ? featured : articles.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 pb-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-[#FFD700]/40 to-transparent" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
          Featured
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-[#FFD700]/40 to-transparent" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {display.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <Link href={`/article/${article.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.12)]">
                {/* Top shimmer accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

                <div className="relative p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/10 text-[#FFD700]">
                      {categoryIcons[article.category]}
                    </span>
                    <span className="rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 px-3 py-1 text-xs font-medium text-[#FFD700]">
                      {article.category.replace("-", " ")}
                    </span>
                    {i === 0 && (
                      <span className="ml-auto rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] px-3 py-1 text-xs font-bold text-zinc-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                        HOT
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-zinc-100 transition-colors group-hover:text-[#FFD700]">
                    {article.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FFD700]">
                    <span>Get Access</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Hover glow overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: "inset 0 0 40px rgba(255,215,0,0.04)" }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
