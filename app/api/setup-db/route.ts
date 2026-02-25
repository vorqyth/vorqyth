import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const results: Record<string, unknown> = {}

  // ---- Discover articles schema by probing columns ----
  const articleProbes = [
    "id", "title", "slug", "description", "content", "category",
    "image_url", "download_url", "is_featured", "enable_timer",
    "specs", "created_at", "updated_at"
  ]
  
  const validArticleCols: string[] = []
  for (const col of articleProbes) {
    const { error } = await supabase.from("articles").select(col).limit(0)
    if (!error) validArticleCols.push(col)
  }
  results.articles_columns = validArticleCols

  // ---- Discover site_settings schema ----
  const settingsProbes = [
    "id", "site_name", "logo_url", "neon_color", "social_links", "ipqs_active",
    "key", "value", "created_at", "updated_at"
  ]
  const validSettingsCols: string[] = []
  for (const col of settingsProbes) {
    const { error } = await supabase.from("site_settings").select(col).limit(0)
    if (!error) validSettingsCols.push(col)
  }
  results.site_settings_columns = validSettingsCols

  // ---- Check social_proof ----
  const { error: spError } = await supabase.from("social_proof").select("id").limit(0)
  results.social_proof_exists = !spError
  if (spError) results.social_proof_error = spError.message

  // ---- Try to seed data ----
  const { data: existingArticles } = await supabase.from("articles").select("id").limit(1)
  if (!existingArticles || existingArticles.length === 0) {
    // Try inserting a test article
    const testArticle: Record<string, unknown> = { title: "Test Article", slug: "test-article-seed" }
    // Add columns that exist
    if (validArticleCols.includes("description")) testArticle.description = "Test description"
    if (validArticleCols.includes("content")) testArticle.content = "Test content"
    if (validArticleCols.includes("category")) testArticle.category = "apps"
    if (validArticleCols.includes("image_url")) testArticle.image_url = ""
    if (validArticleCols.includes("is_featured")) testArticle.is_featured = true
    if (validArticleCols.includes("specs")) testArticle.specs = [{ label: "Version", value: "1.0" }]
    if (validArticleCols.includes("download_url")) testArticle.download_url = "https://example.com"
    if (validArticleCols.includes("enable_timer")) testArticle.enable_timer = true

    const { data: insertResult, error: insertError } = await supabase
      .from("articles")
      .insert(testArticle)
      .select()

    if (insertError) {
      results.seed_error = insertError.message
      results.seed_details = insertError.details
      results.seed_hint = insertError.hint
    } else {
      results.seed_success = true
      results.seeded_article = insertResult
      // Delete the test article
      if (insertResult && insertResult.length > 0) {
        await supabase.from("articles").delete().eq("id", insertResult[0].id)
        results.cleaned_up = true
      }
    }
  } else {
    results.articles_already_seeded = true
    results.sample_article = existingArticles
  }

  console.log("[v0] SETUP-DB RESULTS:", JSON.stringify(results, null, 2))
  return NextResponse.json(results)
}
