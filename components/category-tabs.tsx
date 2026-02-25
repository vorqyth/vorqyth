"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, Gamepad2, Brain, CreditCard, ArrowRight } from "lucide-react"
import type { Article } from "@/lib/data"

const categories = [
  { key: "all", label: "All", icon: null },
  { key: "apps", label: "Apps", icon: <Smartphone className="h-4 w-4" /> },
  { key: "games", label: "Games", icon: <Gamepad2 className="h-4 w-4" /> },
  { key: "ai-tools", label: "AI Tools", icon: <Brain className="h-4 w-4" /> },
  { key: "gift-cards", label: "Gift Cards", icon: <CreditCard className="h-4 w-4" /> },
]

export function CategoryTabs({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState("all")

  const filtered = active === "all" ? articles : articles.filter((a) => a.category === active)

  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-lg font-bold text-zinc-100">
        Browse by{" "}
        <span className="text-[#FFD700]" style={{ textShadow: "0 0 8px rgba(255,215,0,0.25)" }}>
          Category
        </span>
      </h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActive(cat.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === cat.key
                ? "border border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                : "border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl hover:border-[#FFD700]/20 hover:text-zinc-200"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-200 hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.08)]"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/10">
                <span className="text-lg font-bold text-[#FFD700]">
                  {article.title.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 text-sm font-bold text-zinc-100 transition-colors group-hover:text-[#FFD700] truncate">
                  {article.title}
                </h3>
                <p className="mb-2 line-clamp-1 text-xs text-zinc-500">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#FFD700]">
                  <span>View</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-16 backdrop-blur-xl">
          <p className="text-sm text-zinc-500">No articles found in this category.</p>
        </div>
      )}
    </section>
  )
}
