import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TIER_1_COUNTRIES = ["US", "GB", "CA", "AU"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, admin
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".") ||
    pathname === "/blocked"
  ) {
    return NextResponse.next()
  }

  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"

  // Skip for localhost/dev
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return NextResponse.next()
  }

  try {
    const baseUrl = request.nextUrl.origin
    const res = await fetch(`${baseUrl}/api/vpn-check`, {
      headers: {
        "x-forwarded-for": ip,
        "x-real-ip": ip,
      },
    })

    if (res.ok) {
      const data = await res.json()
      if (data.blocked) {
        return NextResponse.redirect(new URL("/blocked", request.url))
      }
    }
  } catch {
    // Fail-open: allow traffic if check fails
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|blocked).*)"],
}
