import { BridgeClient } from "@/components/bridge-client"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Download - Vorqenox`,
    description: `Secure download access for ${slug}`,
  }
}

export default async function BridgePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BridgeClient slug={slug} />
}
