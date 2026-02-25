import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("[seed] Starting database seed...");
  console.log("[seed] Supabase URL:", supabaseUrl);

  // 1. Check if articles table exists by trying to select from it
  const { data: existingArticles, error: articlesError } = await supabase
    .from("articles")
    .select("id")
    .limit(1);

  if (articlesError) {
    console.error("[seed] ERROR: 'articles' table does not exist or is inaccessible.");
    console.error("[seed] Error details:", articlesError.message);
    console.log("");
    console.log("[seed] You MUST run the SQL from scripts/setup-database.sql in your Supabase SQL Editor first.");
    process.exit(1);
  }

  console.log("[seed] Tables found! Checking for existing data...");

  // 2. Seed articles if empty
  if (!existingArticles || existingArticles.length === 0) {
    console.log("[seed] Seeding articles...");
    const { error } = await supabase.from("articles").insert([
      {
        title: "ChatGPT Pro - Unlimited AI Power",
        slug: "chatgpt-pro-unlimited",
        description: "Unlock the full potential of ChatGPT with Pro access. No limits, no restrictions.",
        content: "ChatGPT Pro gives you unlimited access to the most powerful AI language model. With advanced reasoning, code generation, and creative writing capabilities, this is the ultimate tool for professionals and creators alike.\n\nFeatures include:\n- Unlimited message cap\n- Priority access during peak times\n- Advanced data analysis\n- Image generation with DALL-E\n- Custom GPT creation",
        category: "ai-tools",
        image_url: "",
        is_featured: true,
        specs: [
          { label: "Version", value: "4.5 Turbo" },
          { label: "Platform", value: "Web / iOS / Android" },
          { label: "Size", value: "Cloud-based" },
          { label: "License", value: "Premium" },
        ],
        download_url: "https://example.com/chatgpt",
        enable_timer: true,
      },
      {
        title: "Spotify Premium - Ad-Free Music",
        slug: "spotify-premium-ad-free",
        description: "Stream millions of songs ad-free with Spotify Premium. Download music for offline listening.",
        content: "Enjoy an enhanced music experience with Spotify Premium. Stream over 100 million tracks without interruption, download your favorites for offline listening, and enjoy superior audio quality.\n\nWhat you get:\n- Ad-free music streaming\n- Offline downloads\n- High quality audio (320kbps)\n- Unlimited skips\n- Cross-device sync",
        category: "apps",
        image_url: "",
        is_featured: true,
        specs: [
          { label: "Version", value: "8.9.2" },
          { label: "Platform", value: "All Platforms" },
          { label: "Size", value: "150 MB" },
          { label: "License", value: "Premium" },
        ],
        download_url: "https://example.com/spotify",
        enable_timer: true,
      },
      {
        title: "GTA VI Mobile - Early Access",
        slug: "gta-vi-mobile-early-access",
        description: "Experience the next generation of open-world gaming on mobile. GTA VI is here.",
        content: "Grand Theft Auto VI brings the legendary franchise to a whole new level. Explore a massive open world, engage in thrilling missions, and experience next-gen graphics on your mobile device.\n\nHighlights:\n- Massive open world map\n- Next-gen graphics engine\n- Online multiplayer\n- Regular content updates\n- Controller support",
        category: "games",
        image_url: "",
        is_featured: true,
        specs: [
          { label: "Version", value: "1.0 Beta" },
          { label: "Platform", value: "Android / iOS" },
          { label: "Size", value: "2.8 GB" },
          { label: "License", value: "Free-to-Play" },
        ],
        download_url: "https://example.com/gtavi",
        enable_timer: true,
      },
      {
        title: "Midjourney V6 - AI Art Generator",
        slug: "midjourney-v6-ai-art",
        description: "Create stunning AI-generated artwork with Midjourney V6. Photorealistic results in seconds.",
        content: "Midjourney V6 represents a quantum leap in AI image generation. Create breathtaking photorealistic images, artistic masterpieces, and creative designs with simple text prompts.\n\nCapabilities:\n- Photorealistic image generation\n- Style mixing and blending\n- Upscaling to 4K resolution\n- Batch generation\n- Custom training support",
        category: "ai-tools",
        image_url: "",
        is_featured: false,
        specs: [
          { label: "Version", value: "6.0" },
          { label: "Platform", value: "Discord / Web" },
          { label: "Quality", value: "4K Output" },
          { label: "License", value: "Subscription" },
        ],
        download_url: "https://example.com/midjourney",
        enable_timer: true,
      },
      {
        title: "Netflix Premium - 4K Streaming",
        slug: "netflix-premium-4k",
        description: "Watch unlimited movies and shows in 4K Ultra HD. Netflix Premium at your fingertips.",
        content: "Enjoy the best of entertainment with Netflix Premium. Stream thousands of movies, TV shows, and documentaries in stunning 4K Ultra HD quality.\n\nBenefits:\n- 4K Ultra HD streaming\n- Multiple device support\n- Download for offline viewing\n- No advertisements\n- Exclusive originals",
        category: "apps",
        image_url: "",
        is_featured: false,
        specs: [
          { label: "Quality", value: "4K Ultra HD" },
          { label: "Screens", value: "4 Simultaneous" },
          { label: "Downloads", value: "Unlimited" },
          { label: "License", value: "Premium" },
        ],
        download_url: "https://example.com/netflix",
        enable_timer: true,
      },
    ]);

    if (error) {
      console.error("[seed] Failed to seed articles:", error.message);
    } else {
      console.log("[seed] Articles seeded successfully!");
    }
  } else {
    console.log("[seed] Articles already exist, skipping seed.");
  }

  // 3. Seed site_settings if empty
  const { data: existingSettings, error: settingsError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1);

  if (settingsError) {
    console.error("[seed] site_settings table not found:", settingsError.message);
    process.exit(1);
  }

  if (!existingSettings || existingSettings.length === 0) {
    console.log("[seed] Seeding site_settings...");
    const { error } = await supabase.from("site_settings").insert([
      {
        site_name: "Vorqenox",
        logo_url: "",
        neon_color: "#FFD700",
        social_links: { twitter: "", telegram: "", youtube: "", instagram: "" },
        ipqs_active: false,
      },
    ]);

    if (error) {
      console.error("[seed] Failed to seed site_settings:", error.message);
    } else {
      console.log("[seed] Site settings seeded successfully!");
    }
  } else {
    console.log("[seed] Site settings already exist, skipping seed.");
  }

  // 4. Seed social_proof if empty
  const { data: existingProof, error: proofError } = await supabase
    .from("social_proof")
    .select("id")
    .limit(1);

  if (proofError) {
    console.error("[seed] social_proof table not found:", proofError.message);
    process.exit(1);
  }

  if (!existingProof || existingProof.length === 0) {
    console.log("[seed] Seeding social_proof...");
    const { error } = await supabase.from("social_proof").insert([
      { name: "Mo****ed K.", gift_card_type: "ChatGPT Pro", price: "Premium", time_ago: "2 min ago" },
      { name: "Sa****ah M.", gift_card_type: "Spotify Premium", price: "Full Access", time_ago: "5 min ago" },
      { name: "Om****ar R.", gift_card_type: "Netflix 4K", price: "Annual Plan", time_ago: "8 min ago" },
      { name: "Fa****ma A.", gift_card_type: "Midjourney V6", price: "Pro License", time_ago: "12 min ago" },
      { name: "Yo****ef B.", gift_card_type: "GTA VI Mobile", price: "Early Access", time_ago: "15 min ago" },
    ]);

    if (error) {
      console.error("[seed] Failed to seed social_proof:", error.message);
    } else {
      console.log("[seed] Social proof seeded successfully!");
    }
  } else {
    console.log("[seed] Social proof already exists, skipping seed.");
  }

  // 5. Verify all data
  const { data: allArticles } = await supabase.from("articles").select("id, title, slug");
  const { data: allSettings } = await supabase.from("site_settings").select("id, site_name, ipqs_active");
  const { data: allProof } = await supabase.from("social_proof").select("id, name");

  console.log("");
  console.log("[seed] === VERIFICATION ===");
  console.log("[seed] Articles: " + (allArticles?.length || 0) + " records");
  if (allArticles) allArticles.forEach((a) => console.log("  - " + a.title + " (" + a.slug + ")"));
  console.log("[seed] Site Settings: " + (allSettings?.length || 0) + " records");
  if (allSettings) allSettings.forEach((s) => console.log("  - " + s.site_name + " (ipqs_active: " + s.ipqs_active + ")"));
  console.log("[seed] Social Proof: " + (allProof?.length || 0) + " records");
  if (allProof) allProof.forEach((p) => console.log("  - " + p.name));
  console.log("");
  console.log("[seed] Database seed complete!");
}

seed().catch((err) => {
  console.error("[seed] Unhandled error:", err);
  process.exit(1);
});
