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

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Featured
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Link href={`/article/${article.slug}`} className="group block">
              <div
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:border-primary/20"
                style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
              >
                <div className="relative p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {categoryIcons[article.category]}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category.replace("-", " ")}
                    </span>
                    {i === 0 && (
                      <span
                        className="ml-auto rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary"
                        style={{ boxShadow: "0 0 10px rgba(255,215,0,0.2)" }}
                      >
                        HOT
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-zinc-100 transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <span>Get Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: "inset 0 0 30px rgba(255,215,0,0.03)",
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
