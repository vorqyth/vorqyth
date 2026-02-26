"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/15 to-[#B8860B]/10"
            style={{ boxShadow: "0 0 15px rgba(255,215,0,0.15)" }}
          >
            <span className="text-sm font-black text-[#FFD700]">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-100">
            Vorqe<span className="text-[#FFD700]" style={{ textShadow: "0 0 10px rgba(255,215,0,0.3)" }}>nox</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Home</Link>
          <Link href="/privacy" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Privacy</Link>
          <Link href="/terms" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Terms</Link>
          <a href="mailto:Vorqenox@gmail.com" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all hover:border-[#FFD700]/40 hover:text-[#FFD700]"
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all hover:border-[#FFD700]/40 hover:text-[#FFD700] md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFD700]" />
                <input
                  type="text"
                  placeholder="Search apps, games, tools..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#FFD700]/20 bg-white/5 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 backdrop-blur-xl focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              <Link href="/" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/privacy" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100" onClick={() => setMenuOpen(false)}>Privacy</Link>
              <Link href="/terms" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100" onClick={() => setMenuOpen(false)}>Terms</Link>
              <a href="mailto:Vorqenox@gmail.com" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100">Contact</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
