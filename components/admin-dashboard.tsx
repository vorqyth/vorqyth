"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  FileText,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Globe,
  Palette,
  Link as LinkIcon,
  ChevronDown,
  Check,
  AlertCircle,
  Shield,
} from "lucide-react"
import type { Article, SiteSettings, SocialProofItem } from "@/lib/data"

type Tab = "settings" | "posts" | "social-proof"

// ---- Toast Notification ----
function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
        type === "success"
          ? "border border-primary/30 bg-primary/10 text-primary"
          : "border border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      {type === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message}
    </motion.div>
  )
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("posts")
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type })
    },
    []
  )

  const tabs = [
    {
      key: "settings" as Tab,
      label: "Site Settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      key: "posts" as Tab,
      label: "Manage Articles",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: "social-proof" as Tab,
      label: "Social Proof",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <span className="text-sm font-bold text-primary">V</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100">
                Admin Panel
              </h1>
              <p className="text-[10px] text-zinc-500">
                Vorqenox Dashboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin"
            }}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-destructive/50 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="border-b border-white/5 bg-zinc-950/50">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "border border-primary/50 bg-primary/10 text-primary"
                  : "border border-transparent bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SiteSettingsPanel showToast={showToast} />
            </motion.div>
          )}
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PostManager showToast={showToast} />
            </motion.div>
          )}
          {activeTab === "social-proof" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SocialProofEditor showToast={showToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Site Settings Panel ----
function SiteSettingsPanel({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => {
        showToast("Failed to load settings", "error")
        setLoading(false)
      })
  }, [showToast])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      showToast("Settings saved successfully")
    } catch {
      showToast("Failed to save settings", "error")
    }
    setSaving(false)
  }

  if (loading || !settings) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <SectionCard
        title="Site Identity"
        icon={<Globe className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Site Name
            </label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) =>
                setSettings({ ...settings, site_name: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Logo URL
            </label>
            <input
              type="text"
              value={settings.logo_url}
              onChange={(e) =>
                setSettings({ ...settings, logo_url: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Color Picker */}
      <SectionCard
        title="Accent Color"
        icon={<Palette className="h-4 w-4" />}
      >
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.neon_color}
            onChange={(e) =>
              setSettings({ ...settings, neon_color: e.target.value })
            }
            className="h-10 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-900"
          />
          <input
            type="text"
            value={settings.neon_color}
            onChange={(e) =>
              setSettings({ ...settings, neon_color: e.target.value })
            }
            className="w-32 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-primary focus:outline-none"
          />
          <div
            className="h-10 flex-1 rounded-lg"
            style={{
              backgroundColor: settings.neon_color,
              boxShadow: `0 0 20px ${settings.neon_color}`,
            }}
          />
        </div>
      </SectionCard>

      {/* IPQS Toggle */}
      <SectionCard
        title="Security Shield"
        icon={<Shield className="h-4 w-4" />}
      >
        <ToggleSwitch
          label="IPQS Active"
          description="Enable IPQualityScore for Tier 1 traffic (US, UK, CA, AU)"
          checked={settings.ipqs_active ?? false}
          onChange={(v) => setSettings({ ...settings, ipqs_active: v })}
        />
      </SectionCard>

      {/* Social Links */}
      <SectionCard
        title="Social Links"
        icon={<LinkIcon className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {(["twitter", "telegram", "youtube", "instagram"] as const).map(
            (key) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs capitalize text-zinc-500">
                  {key}
                </label>
                <input
                  type="text"
                  value={settings.social_links[key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: {
                        ...settings.social_links,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            )
          )}
        </div>
      </SectionCard>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  )
}

// ---- Post Manager ----
function PostManager({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [editing, setEditing] = useState<Article | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/articles")
      const data = await res.json()
      setArticles(data)
    } catch {
      showToast("Failed to load articles", "error")
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const handleSave = async (article: Article) => {
    try {
      if (isNew) {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(article),
        })
        if (!res.ok) throw new Error()
        showToast("Article created successfully")
      } else {
        const res = await fetch(`/api/articles/${article.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(article),
        })
        if (!res.ok) throw new Error()
        showToast("Article updated successfully")
      }
      setEditing(null)
      setIsNew(false)
      loadArticles()
    } catch {
      showToast("Failed to save article", "error")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      showToast("Article deleted successfully")
      setConfirmDelete(null)
      loadArticles()
    } catch {
      showToast("Failed to delete article", "error")
    }
  }

  const newArticle = (): Article => ({
    id: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "apps",
    image_url: "",
    is_featured: false,
    specs: [
      { label: "Version", value: "" },
      { label: "Platform", value: "" },
      { label: "Size", value: "" },
      { label: "License", value: "" },
    ],
    download_url: "",
    enable_timer: true,
    created_at: "",
    updated_at: "",
  })

  if (editing) {
    return (
      <ArticleEditor
        article={editing}
        onSave={handleSave}
        onCancel={() => {
          setEditing(null)
          setIsNew(false)
        }}
      />
    )
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Articles</h2>
          <p className="text-xs text-zinc-500">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(newArticle())
            setIsNew(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
          style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
        >
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
          <FileText className="mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">No articles yet</p>
          <button
            type="button"
            onClick={() => {
              setEditing(newArticle())
              setIsNew(true)
            }}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            Add your first article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md transition-colors hover:border-white/10"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-sm font-bold text-primary">
                  {article.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-zinc-100">
                  {article.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    {article.category}
                  </span>
                  {article.is_featured && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                      Featured
                    </span>
                  )}
                  {article.enable_timer && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                      Timer
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(article)
                    setIsNew(false)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-transparent text-zinc-400 transition-all hover:border-primary/50 hover:text-primary"
                  aria-label="Edit article"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {confirmDelete === article.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      className="flex h-8 items-center gap-1 rounded-lg border border-destructive/50 bg-transparent px-2 text-[10px] font-medium text-destructive transition-all hover:bg-destructive/10"
                      aria-label="Confirm delete"
                    >
                      <Check className="h-3 w-3" />
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-transparent text-zinc-400 hover:text-zinc-100"
                      aria-label="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(article.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-transparent text-zinc-400 transition-all hover:border-destructive/50 hover:text-destructive"
                    aria-label="Delete article"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Article Editor ----
function ArticleEditor({
  article,
  onSave,
  onCancel,
}: {
  article: Article
  onSave: (article: Article) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Article>(article)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof Article, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    if (!form.slug.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100">
          {article.id ? "Edit Article" : "New Article"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>

      <SectionCard
        title="Basic Info"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value)
                if (!article.id)
                  update("slug", generateSlug(e.target.value))
              }}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="Article title..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="article-slug"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="Short description..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              rows={8}
              className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="Full article content... Use - for bullet points"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">
                Category
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                >
                  <option value="apps">Apps</option>
                  <option value="games">Games</option>
                  <option value="ai-tools">AI Tools</option>
                  <option value="gift-cards">Gift Cards</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">
                Download URL
              </label>
              <input
                type="text"
                value={form.download_url}
                onChange={(e) => update("download_url", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Image URL
            </label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => update("image_url", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Toggles */}
      <SectionCard
        title="Article Options"
        icon={<Settings className="h-4 w-4" />}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ToggleSwitch
            label="Featured"
            description="Show in featured section"
            checked={form.is_featured}
            onChange={(v) => update("is_featured", v)}
          />
          <ToggleSwitch
            label="Timer"
            description="Enable countdown timer"
            checked={form.enable_timer}
            onChange={(v) => update("enable_timer", v)}
          />
        </div>
      </SectionCard>

      {/* Specs */}
      <SectionCard
        title="Specifications"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="space-y-3">
          {form.specs.map((spec, i) => (
            <div key={`spec-${i}`} className="flex gap-3">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => {
                  const newSpecs = [...form.specs]
                  newSpecs[i] = { ...newSpecs[i], label: e.target.value }
                  update("specs", newSpecs)
                }}
                className="w-1/3 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                placeholder="Label"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const newSpecs = [...form.specs]
                  newSpecs[i] = { ...newSpecs[i], value: e.target.value }
                  update("specs", newSpecs)
                }}
                className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => {
                  const newSpecs = form.specs.filter((_, idx) => idx !== i)
                  update("specs", newSpecs)
                }}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-transparent text-zinc-400 hover:text-destructive"
                aria-label="Remove spec"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update("specs", [...form.specs, { label: "", value: "" }])
            }
            className="text-xs text-primary hover:underline"
          >
            + Add specification
          </button>
        </div>
      </SectionCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !form.title.trim() || !form.slug.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Article"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm text-zinc-400 transition-all hover:text-zinc-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ---- Social Proof Editor ----
function SocialProofEditor({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [items, setItems] = useState<SocialProofItem[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => {
        showToast("Failed to load notifications", "error")
        setLoading(false)
      })
  }, [showToast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/social-proof", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      if (!res.ok) throw new Error()
      showToast("Social proof saved successfully")
    } catch {
      showToast("Failed to save notifications", "error")
    }
    setSaving(false)
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        gift_card_type: "",
        price: "",
        time_ago: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Social Proof Notifications
          </h2>
          <p className="text-xs text-zinc-500">
            {items.length} notification{items.length !== 1 ? "s" : ""} - shown randomly to visitors
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
          style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
        >
          <Plus className="h-4 w-4" />
          New Notification
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
          <Users className="mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">No notifications yet</p>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            Add your first notification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Notification #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Masked Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(i, "name", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                    placeholder="Mo****ed K."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Product / Service
                  </label>
                  <input
                    type="text"
                    value={item.gift_card_type}
                    onChange={(e) =>
                      updateItem(i, "gift_card_type", e.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                    placeholder="ChatGPT Pro"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Access Type
                  </label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                    placeholder="Premium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Time Ago
                  </label>
                  <input
                    type="text"
                    value={item.time_ago}
                    onChange={(e) =>
                      updateItem(i, "time_ago", e.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-primary focus:outline-none"
                    placeholder="2 min ago"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        style={{ boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Notifications"}
      </button>
    </div>
  )
}

// ---- Helpers ----
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-bold text-zinc-100">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex flex-col items-start gap-2 rounded-lg border border-white/5 bg-zinc-900/50 p-3 text-left transition-all hover:border-primary/30"
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-medium text-zinc-100">{label}</span>
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-zinc-700"
          }`}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
              checked
                ? "bg-primary-foreground right-0.5"
                : "bg-zinc-400 right-[calc(100%-18px)]"
            }`}
          />
        </div>
      </div>
      {description && (
        <span className="text-[10px] text-zinc-500">
          {description}
        </span>
      )}
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-900" />
      ))}
    </div>
  )
}
