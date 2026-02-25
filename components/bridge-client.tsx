"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Shield, CheckCircle, Timer, Download } from "lucide-react"
import Link from "next/link"
import type { Article } from "@/lib/data"

export function BridgeClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`/api/articles?slug=${slug}`)
      .then((r) => r.json())
      .then(setArticle)
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsReady(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/15 to-[#B8860B]/10" style={{ boxShadow: "0 0 15px rgba(255,215,0,0.15)" }}>
              <span className="text-sm font-black text-[#FFD700]">V</span>
            </div>
            <span className="text-xl font-bold text-zinc-100">
              Vorqe<span className="text-[#FFD700]" style={{ textShadow: "0 0 10px rgba(255,215,0,0.3)" }}>nox</span>
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl" style={{ boxShadow: "0 0 40px rgba(255,215,0,0.06)" }}>
          <div className="border-b border-white/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/10">
              {isReady ? <CheckCircle className="h-8 w-8 text-[#FFD700]" /> : <Timer className="h-8 w-8 text-[#FFD700]" />}
            </div>
            <h1 className="mb-2 text-xl font-bold text-zinc-100 text-balance">
              {article?.title || "Loading..."}
            </h1>
            <p className="text-sm text-zinc-500">
              {isReady ? "Your download link is verified and ready" : "Verifying your access. Please wait..."}
            </p>
          </div>

          {!isReady && (
            <div className="px-8 py-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Verification in progress</span>
                <span className="text-xs font-mono text-[#FFD700]">{timeLeft}s</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B]"
                  animate={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ boxShadow: "0 0 10px rgba(255,215,0,0.5), 0 0 25px rgba(255,215,0,0.2)" }}
                />
              </div>
            </div>
          )}

          <div className="p-8">
            {isReady && article ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <a
                  href={article.download_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] py-4 text-base font-bold text-zinc-950 transition-all hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                  style={{ boxShadow: "0 0 25px rgba(255,215,0,0.25)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Download className="relative h-5 w-5" />
                  <span className="relative">Download Now</span>
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <Shield className="h-3.5 w-3.5 text-[#FFD700]" />
                  <span>Secured and verified link</span>
                </div>
              </motion.div>
            ) : !isReady ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-4 text-sm text-zinc-500 backdrop-blur-xl">
                <Shield className="h-4 w-4" />
                Please wait for verification
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href={`/article/${slug}`} className="text-xs text-zinc-500 transition-colors hover:text-[#FFD700]">
            Back to article
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
