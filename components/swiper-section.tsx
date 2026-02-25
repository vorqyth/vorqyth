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

  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100">
          Latest <span className="text-[#FFD700]" style={{ textShadow: "0 0 8px rgba(255,215,0,0.25)" }}>Articles</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all hover:border-[#FFD700]/40 hover:text-[#FFD700] disabled:opacity-30"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all hover:border-[#FFD700]/40 hover:text-[#FFD700] disabled:opacity-30"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex-shrink-0"
          >
            <Link href={`/article/${article.slug}`} className="group block w-72">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-[0_0_25px_rgba(255,215,0,0.1)]">
                {/* Image placeholder area */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-black text-[#FFD700]/10">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full border border-[#FFD700]/20 bg-zinc-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FFD700] backdrop-blur-sm">
                      {article.category.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1.5 text-sm font-bold text-zinc-100 transition-colors group-hover:text-[#FFD700] line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFD700]">
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
