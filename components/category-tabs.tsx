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
  {
    key: "gift-cards",
    label: "Gift Cards",
    icon: <CreditCard className="h-4 w-4" />,
  },
]

export function CategoryTabs({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState("all")

  const filtered =
    active === "all"
      ? articles
      : articles.filter((a) => a.category === active)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-lg font-bold text-zinc-100">
        Browse by <span className="gold-text">Category</span>
      </h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActive(cat.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              active === cat.key
                ? "border border-primary/50 bg-primary/10 text-primary"
                : "border border-white/5 bg-zinc-900 text-zinc-500 hover:border-primary/20 hover:text-zinc-300"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group flex gap-4 rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md transition-all duration-200 hover:border-primary/20"
              style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {article.title.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 text-sm font-bold text-zinc-100 transition-colors group-hover:text-primary truncate">
                  {article.title}
                </h3>
                <p className="mb-2 line-clamp-1 text-xs text-zinc-500">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  <span>View</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-zinc-500">
            No articles found in this category.
          </p>
        </div>
      )}
    </section>
  )
}
