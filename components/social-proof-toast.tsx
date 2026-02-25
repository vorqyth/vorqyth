"use client"

import { useState, useEffect } from "react"
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
  // If already masked (contains asterisks), return as-is
  if (name.includes("*")) return name
  // Otherwise, mask: keep first 2 chars and last char
  if (name.length <= 3) return name
  const first = name.slice(0, 2)
  const last = name.slice(-1)
  const stars = "****"
  return `${first}${stars}${last}`
}

export function SocialProofToast() {
  const [current, setCurrent] = useState<ProofItem | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const showNext = async () => {
      try {
        const res = await fetch("/api/social-proof")
        const items: ProofItem[] = await res.json()
        if (!Array.isArray(items) || items.length === 0) return

        const randomItem = items[Math.floor(Math.random() * items.length)]
        setCurrent(randomItem)
        setDismissed(false)

        timeout = setTimeout(() => {
          setCurrent(null)
          timeout = setTimeout(showNext, Math.random() * 10000 + 8000)
        }, 5000)
      } catch {
        // silently fail
      }
    }

    timeout = setTimeout(showNext, 5000)

    return () => clearTimeout(timeout)
  }, [])

  if (dismissed) return null

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-4 left-4 z-50 flex max-w-xs items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/80 p-3 shadow-lg backdrop-blur-md"
          style={{ boxShadow: "0 0 20px rgba(255,215,0,0.08), 0 4px 20px rgba(0,0,0,0.3)" }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            style={{ boxShadow: "0 0 10px rgba(255,215,0,0.15)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-100">
              {maskName(current.name)}{" "}
              <span className="font-normal text-zinc-500">just accessed</span>
            </p>
            <p className="text-xs text-primary">
              {current.gift_card_type} - {current.price}
            </p>
            <p className="text-[10px] text-zinc-600">{current.time_ago}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrent(null)
              setDismissed(true)
            }}
            className="flex-shrink-0 text-zinc-600 hover:text-zinc-300"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
