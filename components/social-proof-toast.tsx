"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X } from "lucide-react"

interface ProofItem {
  id: string
  name: string
  gift_card_type: string
  price: string
  time_ago: string
}

function maskName(name: string): string {
  if (name.includes("*")) return name
  if (name.length <= 3) return name
  const first = name.slice(0, 2)
  const last = name.slice(-1)
  return `${first}****${last}`
}

export function SocialProofToast() {
  const [current, setCurrent] = useState<ProofItem | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [items, setItems] = useState<ProofItem[]>([])

  const showRandom = useCallback(() => {
    if (items.length === 0) return
    const randomItem = items[Math.floor(Math.random() * items.length)]
    setCurrent(randomItem)
    setDismissed(false)
  }, [items])

  useEffect(() => {
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data: ProofItem[]) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    const initialDelay = setTimeout(() => {
      showRandom()
    }, 4000)

    const interval = setInterval(() => {
      showRandom()
    }, 15000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [items, showRandom])

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (!current) return
    const hide = setTimeout(() => setCurrent(null), 5000)
    return () => clearTimeout(hide)
  }, [current])

  if (dismissed) return null

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ x: -120, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -120, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-50 flex max-w-xs items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl"
          style={{ boxShadow: "0 0 25px rgba(255,215,0,0.1), 0 8px 32px rgba(0,0,0,0.4)" }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/15 to-[#B8860B]/10 text-[#FFD700]"
            style={{ boxShadow: "0 0 12px rgba(255,215,0,0.2)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-100">
              {maskName(current.name)}{" "}
              <span className="font-normal text-zinc-500">just accessed</span>
            </p>
            <p className="text-xs font-semibold text-[#FFD700]">
              {current.gift_card_type}
            </p>
            <p className="text-[10px] text-zinc-600">{current.time_ago}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrent(null)
              setDismissed(true)
            }}
            className="flex-shrink-0 rounded-lg p-1 text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-300"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
