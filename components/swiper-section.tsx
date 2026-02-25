"use client"

import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Article } from "@/lib/data"

export function SwiperSection({ articles }: { articles: Article[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
  }, [])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === "left" ? -320 : 320
    el.scrollBy({ left: amount, behavior: "smooth" })
    setTimeout(checkScroll, 300)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100">
          Latest <span className="gold-text">Articles</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-all hover:border-primary/50 hover:text-primary disabled:opacity-30"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-all hover:border-primary/50 hover:text-primary disabled:opacity-30"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href={`/article/${article.slug}`}
              className="group block w-72"
            >
              <div
                className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:border-primary/20"
                style={{ boxShadow: "0 0 15px rgba(255,215,0,0.03)" }}
              >
                <div className="relative h-40 bg-zinc-900">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                    <span className="text-4xl font-bold text-primary/15">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-zinc-950/80 px-2 py-0.5 text-xs font-medium text-primary backdrop-blur-sm">
                      {article.category.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1.5 text-sm font-bold text-zinc-100 transition-colors group-hover:text-primary line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
