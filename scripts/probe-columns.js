import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lcxhtpfkgtmbffnhpnni.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGh0cGZrZ3RtYmZmbmhwbm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzE5MDUsImV4cCI6MjA4NzYwNzkwNX0.FjYAX4_G4JsVzOPRQvY7F0MzjdWvsresLT3eBwDU4rQ"
);

async function main() {
  // Try inserting a test row into articles with expected columns to see error messages
  console.log("=== PROBING articles TABLE ===");
  
  // First try selecting with specific columns to see which exist
  const testCols = [
    "id", "title", "slug", "description", "content", "category",
    "image_url", "imageUrl", "download_url", "downloadUrl",
    "is_featured", "isFeatured", "featured",
    "enable_timer", "enableTimer", "timer_enabled",
    "timer_duration", "timerDuration", "timer_seconds",
    "specifications", "specs",
    "created_at", "createdAt", "updated_at", "updatedAt",
    "status", "published", "is_published",
    "author", "tags", "views", "clicks"
  ];
  
  for (const col of testCols) {
    const { data, error } = await supabase
      .from("articles")
      .select(col)
      .limit(1);
    if (!error) {
      console.log(`  [OK] articles.${col} EXISTS`);
    }
  }

  console.log("\n=== PROBING site_settings TABLE ===");
  const settingsCols = [
    "id", "key", "value", "setting_key", "setting_value",
    "site_name", "siteName", "site_title",
    "ipqs_active", "ipqs_enabled", "enable_ipqs",
    "vpn_detection", "vpn_enabled",
    "ghost_refresh", "ghost_refresh_enabled",
    "social_proof_enabled", "enable_social_proof",
    "created_at", "updated_at",
    "maintenance_mode", "theme"
  ];
  
  for (const col of settingsCols) {
    const { data, error } = await supabase
      .from("site_settings")
      .select(col)
      .limit(1);
    if (!error) {
      console.log(`  [OK] site_settings.${col} EXISTS`);
    }
  }

  // Now try to insert a test article to see full insert behavior
  console.log("\n=== TEST INSERT articles ===");
  const { data: insertData, error: insertErr } = await supabase
    .from("articles")
    .insert({
      title: "__PROBE__",
      slug: "__probe__",
      description: "test",
      content: "test",
      category: "test",
      image_url: "https://example.com/test.jpg",
      download_url: "https://example.com/test",
      is_featured: false,
      enable_timer: false,
      timer_duration: 30,
      specifications: "[]"
    })
    .select();
  
  if (insertErr) {
    console.log("  Insert error:", insertErr.message);
    console.log("  Details:", insertErr.details);
    console.log("  Hint:", insertErr.hint);
  } else {
    console.log("  Insert success! Row:", JSON.stringify(insertData[0], null, 2));
    // Clean up
    if (insertData[0]?.id) {
      await supabase.from("articles").delete().eq("id", insertData[0].id);
      console.log("  Cleaned up test row");
    }
  }

  // Try insert into site_settings
  console.log("\n=== TEST INSERT site_settings ===");
  const { data: settingsInsert, error: settingsErr } = await supabase
    .from("site_settings")
    .insert({
      key: "__probe__",
      value: "test"
    })
    .select();
  
  if (settingsErr) {
    console.log("  Insert error:", settingsErr.message);
    console.log("  Details:", settingsErr.details);
    
    // Try alternative schema
    const { data: s2, error: e2 } = await supabase
      .from("site_settings")
      .insert({
        setting_key: "__probe__",
        setting_value: "test"
      })
      .select();
    if (e2) {
      console.log("  Alt insert error:", e2.message);
    } else {
      console.log("  Alt insert success! Row:", JSON.stringify(s2[0], null, 2));
      if (s2[0]?.id) {
        await supabase.from("site_settings").delete().eq("id", s2[0].id);
      }
    }
  } else {
    console.log("  Insert success! Row:", JSON.stringify(settingsInsert[0], null, 2));
    if (settingsInsert[0]?.id) {
      await supabase.from("site_settings").delete().eq("id", settingsInsert[0].id);
      console.log("  Cleaned up test row");
    }
  }
}

main().catch(console.error);
