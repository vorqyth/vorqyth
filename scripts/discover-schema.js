const SUPABASE_URL = "https://lcxhtpfkgtmbffnhpnni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGh0cGZrZ3RtYmZmbmhwbm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzE5MDUsImV4cCI6MjA4NzYwNzkwNX0.FjYAX4_G4JsVzOPRQvY7F0MzjdWvsresLT3eBwDU4rQ";

async function probeColumn(table, col) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${col}&limit=0`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  return res.ok;
}

async function main() {
  const articleCols = [
    "id", "title", "slug", "description", "content", "body", "excerpt", "summary",
    "category", "type", "tag", "tags",
    "image_url", "imageUrl", "image", "thumbnail", "cover_image", "cover",
    "download_url", "downloadUrl", "download_link", "link", "url", "redirect_url",
    "is_featured", "isFeatured", "featured",
    "enable_timer", "enableTimer", "timer_enabled", "timer", "has_timer", "show_timer",
    "timer_duration", "timerDuration", "timer_seconds", "countdown", "timer_value",
    "specifications", "specs", "spec", "features", "details",
    "status", "published", "is_published", "active", "is_active", "is_visible",
    "author", "author_name",
    "views", "clicks", "downloads",
    "created_at", "createdAt", "updated_at", "updatedAt",
    "meta_title", "meta_description", "seo_title",
    "order", "position", "sort_order", "priority"
  ];

  console.log("=== ARTICLES TABLE ===");
  const foundArticle = [];
  for (const col of articleCols) {
    const ok = await probeColumn("articles", col);
    if (ok) {
      foundArticle.push(col);
      console.log("  FOUND: " + col);
    }
  }
  console.log("ARTICLES COLUMNS: " + JSON.stringify(foundArticle));

  const settingsCols = [
    "id", "key", "value",
    "setting_key", "setting_value",
    "name", "site_name", "siteName", "site_title",
    "logo_url", "logo", "favicon",
    "ipqs_active", "ipqs_enabled", "enable_ipqs",
    "vpn_detection", "vpn_enabled", "enable_vpn",
    "ghost_refresh", "ghost_refresh_enabled", "enable_ghost_refresh",
    "social_proof_enabled", "enable_social_proof",
    "maintenance_mode", "theme", "description",
    "created_at", "updated_at",
    "type", "category", "group_name", "section"
  ];

  console.log("\n=== SITE_SETTINGS TABLE ===");
  const foundSettings = [];
  for (const col of settingsCols) {
    const ok = await probeColumn("site_settings", col);
    if (ok) {
      foundSettings.push(col);
      console.log("  FOUND: " + col);
    }
  }
  console.log("SITE_SETTINGS COLUMNS: " + JSON.stringify(foundSettings));

  // Also try to get one row to see structure
  console.log("\n=== RAW DATA SAMPLE ===");
  for (const table of ["articles", "site_settings"]) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        console.log(table + " sample keys: " + JSON.stringify(Object.keys(data[0])));
      } else {
        // Try HEAD to get column hints from response
        console.log(table + ": empty, columns from probing above");
      }
    }
  }
}

main().catch(console.error);
