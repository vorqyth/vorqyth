"use client"

import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff } from "lucide-react"
import { AdminDashboard } from "@/components/admin-dashboard"

const ADMIN_PASSWORD = "Elfr3onela3zamx430#"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10"
            style={{ boxShadow: "0 0 20px rgba(255,215,0,0.15)" }}
          >
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Admin Panel</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your password to access
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div
            className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-md"
            style={{ boxShadow: "0 0 30px rgba(255,215,0,0.03)" }}
          >
            <div className="p-6">
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium text-zinc-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-4 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-xs text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/5 p-4">
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-zinc-950 transition-all hover:opacity-90"
                style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
