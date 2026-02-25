import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const results: Record<string, unknown> = {};

  // Test articles table - try selecting everything
  const { data: articlesData, error: articlesError } = await supabase
    .from("articles")
    .select("*")
    .limit(1);

  if (articlesError) {
    results.articles_error = articlesError.message;
  } else {
    results.articles_columns = articlesData && articlesData.length > 0
      ? Object.keys(articlesData[0])
      : "table_exists_but_empty";

    // If empty, try inserting a minimal row to see what columns are required
    if (!articlesData || articlesData.length === 0) {
      const { error: insertErr } = await supabase
        .from("articles")
        .insert({ _probe: true });
      results.articles_insert_error = insertErr?.message || "no_error";
    }
  }

  // Test site_settings table
  const { data: settingsData, error: settingsError } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1);

  if (settingsError) {
    results.settings_error = settingsError.message;
  } else {
    results.settings_columns = settingsData && settingsData.length > 0
      ? Object.keys(settingsData[0])
      : "table_exists_but_empty";

    if (!settingsData || settingsData.length === 0) {
      const { error: insertErr } = await supabase
        .from("site_settings")
        .insert({ _probe: true });
      results.settings_insert_error = insertErr?.message || "no_error";
    }
  }

  // Test social_proof table
  const { data: spData, error: spError } = await supabase
    .from("social_proof")
    .select("*")
    .limit(1);

  if (spError) {
    results.social_proof_error = spError.message;
  } else {
    results.social_proof_columns = spData && spData.length > 0
      ? Object.keys(spData[0])
      : "table_exists_but_empty";
  }

  // Also probe common column name variants on articles via individual selects
  const columnProbes = [
    "id", "title", "slug", "description", "content", "category",
    "image_url", "imageUrl", "image",
    "download_url", "downloadUrl", "download_link",
    "is_featured", "isFeatured", "featured",
    "enable_timer", "enableTimer", "timer_enabled", "has_timer",
    "timer_duration", "timerDuration", "timer_seconds",
    "specifications", "specs",
    "created_at", "createdAt", "updated_at", "updatedAt",
    "status", "published", "is_published",
    "views", "view_count",
    "author", "tags", "excerpt", "summary"
  ];

  const validArticleColumns: string[] = [];
  const invalidArticleColumns: string[] = [];

  for (const col of columnProbes) {
    const { error } = await supabase
      .from("articles")
      .select(col)
      .limit(0);
    if (!error) {
      validArticleColumns.push(col);
    } else {
      invalidArticleColumns.push(col);
    }
  }

  results.valid_article_columns = validArticleColumns;
  results.invalid_article_columns = invalidArticleColumns;

  // Same for site_settings
  const settingsProbes = [
    "id", "key", "value", "setting_key", "setting_value",
    "site_name", "siteName", "site_title",
    "logo_url", "logoUrl", "logo",
    "ipqs_active", "ipqsActive", "ipqs_enabled",
    "vpn_blocking", "vpnBlocking", "vpn_enabled",
    "maintenance_mode", "maintenanceMode",
    "created_at", "updated_at",
    "social_proof_enabled", "enable_social_proof",
    "ghost_refresh_enabled", "enable_ghost_refresh"
  ];

  const validSettingsColumns: string[] = [];
  for (const col of settingsProbes) {
    const { error } = await supabase
      .from("site_settings")
      .select(col)
      .limit(0);
    if (!error) {
      validSettingsColumns.push(col);
    }
  }
  results.valid_settings_columns = validSettingsColumns;

  console.log("[v0] SCHEMA DISCOVERY RESULTS:", JSON.stringify(results, null, 2));
  return NextResponse.json(results, { status: 200 });
}
