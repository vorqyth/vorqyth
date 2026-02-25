import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lcxhtpfkgtmbffnhpnni.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGh0cGZrZ3RtYmZmbmhwbm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzE5MDUsImV4cCI6MjA4NzYwNzkwNX0.FjYAX4_G4JsVzOPRQvY7F0MzjdWvsresLT3eBwDU4rQ"
);

async function probeTable(table, columns) {
  console.log(`\n=== ${table} ===`);
  const found = [];
  for (const col of columns) {
    const { error } = await supabase.from(table).select(col).limit(1);
    if (!error) {
      found.push(col);
      console.log(`  YES: ${col}`);
    }
  }
  console.log(`  FOUND COLUMNS: [${found.join(", ")}]`);
  return found;
}

async function main() {
  // Articles - test every reasonable column name
  await probeTable("articles", [
    "id", "title", "slug", "description", "content", "body",
    "category", "type", "tag", "tags",
    "image_url", "imageUrl", "image", "thumbnail", "cover_image", "cover",
    "download_url", "downloadUrl", "download_link", "link", "url", "redirect_url",
    "is_featured", "isFeatured", "featured",
    "enable_timer", "enableTimer", "timer_enabled", "timer", "has_timer",
    "timer_duration", "timerDuration", "timer_seconds", "countdown", "timer_value",
    "specifications", "specs", "spec", "features", "details",
    "status", "published", "is_published", "active", "is_active",
    "author", "author_name",
    "views", "clicks", "downloads",
    "created_at", "createdAt", "updated_at", "updatedAt",
    "meta_title", "meta_description", "seo_title"
  ]);

  // Site settings - test every reasonable column name
  await probeTable("site_settings", [
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
  ]);

  console.log("\nDone!");
}

main().catch(console.error);
