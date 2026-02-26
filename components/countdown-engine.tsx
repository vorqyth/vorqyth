"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Download } from "lucide-react"

export function CountdownEngine({
  downloadUrl,
}: {
  articleSlug?: string
  downloadUrl: string
}) {
  const [mounted, setMounted] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const randomTime = Math.floor(Math.random() * (90 - 29 + 1)) + 29
    setTotalTime(randomTime)
    setTimeLeft(randomTime)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || totalTime === 0) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mounted, totalTime])

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  if (!mounted) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="border-b border-white/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/10 text-[#FFD700]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Securing Link...</h3>
              <p className="text-xs text-zinc-500">Please wait while we prepare your secure link</p>
            </div>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
            <div className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B]" />
          </div>
        </div>
        <div className="p-6">
          <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-zinc-500 backdrop-blur-xl">
            <Lock className="h-4 w-4" />
            Waiting for verification...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl" style={{ boxShadow: "0 0 20px rgba(255,215,0,0.04)" }}>
      <div className="border-b border-white/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/10 text-[#FFD700]">
            {isComplete ? <Shield className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              {isComplete ? "Link Secured" : "Securing Link..."}
            </h3>
            <p className="text-xs text-zinc-500">
              {isComplete ? "Your download link is ready" : "Please wait while we prepare your secure link"}
            </p>
          </div>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ boxShadow: "0 0 12px rgba(255,215,0,0.5), 0 0 25px rgba(255,215,0,0.2)" }}
          />
          <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {isComplete ? "Complete" : `${Math.round(progress)}% - ${timeLeft}s remaining`}
          </span>
          <span className="text-xs font-mono text-[#FFD700]">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="p-6">
        {isComplete ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] py-3.5 text-sm font-bold text-zinc-950 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.35)]"
            style={{ boxShadow: "0 0 20px rgba(255,215,0,0.2)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Download className="relative h-4 w-4" />
            <span className="relative">Access Download</span>
          </a>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-zinc-500 backdrop-blur-xl">
            <Lock className="h-4 w-4" />
            Waiting for verification...
          </div>
        )}
      </div>
    </div>
  )
}
