import { ShieldOff } from "lucide-react"

export default function BlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <ShieldOff className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-zinc-100">Access Restricted</h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          Your connection has been identified as a VPN or proxy. Please disable your VPN and try again.
        </p>
      </div>
    </div>
  )
}
