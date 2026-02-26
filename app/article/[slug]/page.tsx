import { ArticleClient } from "@/components/article-client"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/articles?slug=${slug}`)
    const article = await res.json()
    if (!article) return { title: "Not Found" }
    return {
      title: `${article.title} - Vorqenox`,
      description: article.description,
    }
  } catch {
    return { title: "Article - Vorqenox" }
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ArticleClient slug={slug} />
}
