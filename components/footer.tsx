"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function Footer() {
  const [year, setYear] = useState<number | null>(null)
  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])
  return (
    <footer className="border-t border-white/5 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10"
                style={{ boxShadow: "0 0 10px rgba(255,215,0,0.1)" }}
              >
                <span className="text-xs font-bold text-primary">V</span>
              </div>
              <span className="text-lg font-bold text-zinc-100">
                Vorqe<span className="gold-text">nox</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              The ultimate destination for premium apps, games, AI tools, and
              exclusive digital offers.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-zinc-500 transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-zinc-500 transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-500 transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">
              Contact
            </h3>
            <a
              href="mailto:Vorqenox@gmail.com"
              className="text-sm text-primary transition-opacity hover:opacity-80"
            >
              Vorqenox@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-zinc-600">
            {year ? `\u00A9 ${year} Vorqenox. All rights reserved.` : "\u00A9 Vorqenox. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
