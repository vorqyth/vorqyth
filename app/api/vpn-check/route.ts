import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const TIER_1_COUNTRIES = ["US", "GB", "CA", "AU"]
const IPQS_API_KEY = process.env.IPQS_API_KEY || ""

interface FreeCheckResult {
  isVpn: boolean
  countryCode: string
}

interface IpqsResult {
  success: boolean
  proxy: boolean
  vpn: boolean
  tor: boolean
  country_code: string
  fraud_score: number
}

async function freeVpnCheck(ip: string): Promise<FreeCheckResult> {
  try {
    const res = await fetch(`https://vpnapi.io/api/${ip}?key=Lik3clNG6PMbrHuHo6hPI9iRst3SmsXL`)
    const data = await res.json()
    return {
      isVpn: data?.security?.vpn || data?.security?.proxy || data?.security?.tor || false,
      countryCode: data?.location?.country_code || "UNKNOWN",
    }
  } catch {
    return { isVpn: false, countryCode: "UNKNOWN" }
  }
}

async function ipqsCheck(ip: string): Promise<IpqsResult> {
  try {
    const res = await fetch(
      `https://ipqualityscore.com/api/json/ip/${IPQS_API_KEY}/${ip}?strictness=1&allow_public_access_points=true`
    )
    return await res.json()
  } catch {
    return { success: false, proxy: false, vpn: false, tor: false, country_code: "UNKNOWN", fraud_score: 0 }
  }
}

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"

  // Skip check for localhost
  if (ip === "127.0.0.1" || ip === "::1") {
    return NextResponse.json({ blocked: false, reason: "localhost" })
  }

  // Step 1: Free VPN check for all traffic
  const freeResult = await freeVpnCheck(ip)

  if (freeResult.isVpn) {
    return NextResponse.json({ blocked: true, reason: "vpn_detected" })
  }

  // Step 2: Check if this is Tier 1 traffic
  const isTier1 = TIER_1_COUNTRIES.includes(freeResult.countryCode)

  if (isTier1 && IPQS_API_KEY) {
    // Check if IPQS is toggled on in site_settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("ipqs_active")
      .limit(1)
      .single()

    if (settings?.ipqs_active) {
      const ipqsResult = await ipqsCheck(ip)
      if (ipqsResult.vpn || ipqsResult.proxy || ipqsResult.tor || ipqsResult.fraud_score > 85) {
        return NextResponse.json({ blocked: true, reason: "ipqs_flagged", score: ipqsResult.fraud_score })
      }
    }
  }

  return NextResponse.json({
    blocked: false,
    country: freeResult.countryCode,
    tier: isTier1 ? 1 : 2,
  })
}
