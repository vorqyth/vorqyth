"use client"

import { useEffect, useRef } from "react"

export function GhostRefresh() {
  const hasRefreshed = useRef(false)
  const hasInteracted = useRef(false)

  useEffect(() => {
    // Check if we already did the ghost refresh this session
    if (typeof window !== "undefined" && sessionStorage.getItem("ghost_refreshed")) {
      hasRefreshed.current = true
      return
    }

    const handleInteraction = () => {
      if (hasInteracted.current || hasRefreshed.current) return
      hasInteracted.current = true

      // Wait 3 seconds after first interaction, then do a silent reload
      setTimeout(() => {
        if (!hasRefreshed.current) {
          hasRefreshed.current = true
          sessionStorage.setItem("ghost_refreshed", "1")
          // Silent reload - uses replace to avoid adding to browser history
          window.location.replace(window.location.href)
        }
      }, 3000)
    }

    // Listen for first user interaction
    const events = ["click", "scroll", "touchstart", "keydown"]
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  return null
}
