-- =============================================
-- Vorqenox Database Migration (Idempotent)
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. CREATE TABLES (if they don't exist)
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS social_proof (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);

-- 2. ADD COLUMNS to articles (idempotent)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'apps';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS download_url TEXT DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS enable_timer BOOLEAN DEFAULT true;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add unique constraint on slug if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'articles_slug_key'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT articles_slug_key UNIQUE (slug);
  END IF;
END $$;

-- 3. ADD COLUMNS to site_settings (idempotent)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'Vorqenox';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS neon_color TEXT DEFAULT '#FFD700';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{"twitter":"","telegram":"","youtube":"","instagram":""}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ipqs_active BOOLEAN DEFAULT false;

-- 4. ADD COLUMNS to social_proof (idempotent)
ALTER TABLE social_proof ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE social_proof ADD COLUMN IF NOT EXISTS gift_card_type TEXT NOT NULL DEFAULT '';
ALTER TABLE social_proof ADD COLUMN IF NOT EXISTS price TEXT NOT NULL DEFAULT '';
ALTER TABLE social_proof ADD COLUMN IF NOT EXISTS time_ago TEXT NOT NULL DEFAULT '';

-- 5. ENABLE RLS (Row Level Security) with permissive policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_proof ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for articles
DROP POLICY IF EXISTS "Public read articles" ON articles;
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert articles" ON articles;
CREATE POLICY "Public insert articles" ON articles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update articles" ON articles;
CREATE POLICY "Public update articles" ON articles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete articles" ON articles;
CREATE POLICY "Public delete articles" ON articles FOR DELETE USING (true);

-- Allow public read/write for site_settings
DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert settings" ON site_settings;
CREATE POLICY "Public insert settings" ON site_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update settings" ON site_settings;
CREATE POLICY "Public update settings" ON site_settings FOR UPDATE USING (true);

-- Allow public read/write for social_proof
DROP POLICY IF EXISTS "Public read social_proof" ON social_proof;
CREATE POLICY "Public read social_proof" ON social_proof FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert social_proof" ON social_proof;
CREATE POLICY "Public insert social_proof" ON social_proof FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update social_proof" ON social_proof;
CREATE POLICY "Public update social_proof" ON social_proof FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete social_proof" ON social_proof;
CREATE POLICY "Public delete social_proof" ON social_proof FOR DELETE USING (true);

-- 6. SEED default data (only if tables are empty)
INSERT INTO site_settings (site_name, logo_url, neon_color, social_links, ipqs_active)
SELECT 'Vorqenox', '', '#FFD700', '{"twitter":"","telegram":"","youtube":"","instagram":""}'::jsonb, false
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

INSERT INTO articles (title, slug, description, content, category, image_url, is_featured, specs, download_url, enable_timer)
SELECT * FROM (VALUES
  (
    'ChatGPT Pro - Unlimited AI Power',
    'chatgpt-pro-unlimited',
    'Unlock the full potential of ChatGPT with Pro access. No limits, no restrictions.',
    E'ChatGPT Pro gives you unlimited access to the most powerful AI language model.\n\nFeatures include:\n- Unlimited message cap\n- Priority access during peak times\n- Advanced data analysis\n- Image generation with DALL-E\n- Custom GPT creation',
    'ai-tools', '', true,
    '[{"label":"Version","value":"4.5 Turbo"},{"label":"Platform","value":"Web / iOS / Android"},{"label":"Size","value":"Cloud-based"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/chatgpt', true
  ),
  (
    'Spotify Premium - Ad-Free Music',
    'spotify-premium-ad-free',
    'Stream millions of songs ad-free with Spotify Premium.',
    E'Enjoy an enhanced music experience with Spotify Premium.\n\nWhat you get:\n- Ad-free music streaming\n- Offline downloads\n- High quality audio (320kbps)\n- Unlimited skips',
    'apps', '', true,
    '[{"label":"Version","value":"8.9.2"},{"label":"Platform","value":"All Platforms"},{"label":"Size","value":"150 MB"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/spotify', true
  ),
  (
    'GTA VI Mobile - Early Access',
    'gta-vi-mobile-early-access',
    'Experience the next generation of open-world gaming on mobile.',
    E'Grand Theft Auto VI brings the legendary franchise to mobile.\n\nHighlights:\n- Massive open world map\n- Next-gen graphics engine\n- Online multiplayer\n- Controller support',
    'games', '', true,
    '[{"label":"Version","value":"1.0 Beta"},{"label":"Platform","value":"Android / iOS"},{"label":"Size","value":"2.8 GB"},{"label":"License","value":"Free-to-Play"}]'::jsonb,
    'https://example.com/gtavi', true
  ),
  (
    'Midjourney V6 - AI Art Generator',
    'midjourney-v6-ai-art',
    'Create stunning AI-generated artwork with Midjourney V6.',
    E'Midjourney V6 represents a quantum leap in AI image generation.\n\nCapabilities:\n- Photorealistic generation\n- Style mixing\n- 4K upscaling\n- Batch generation',
    'ai-tools', '', false,
    '[{"label":"Version","value":"6.0"},{"label":"Platform","value":"Discord / Web"},{"label":"Quality","value":"4K Output"},{"label":"License","value":"Subscription"}]'::jsonb,
    'https://example.com/midjourney', true
  ),
  (
    'Netflix Premium - 4K Streaming',
    'netflix-premium-4k',
    'Watch unlimited movies and shows in 4K Ultra HD.',
    E'Enjoy the best of entertainment with Netflix Premium.\n\nBenefits:\n- 4K Ultra HD streaming\n- Multiple device support\n- Download for offline viewing\n- No advertisements',
    'apps', '', false,
    '[{"label":"Quality","value":"4K Ultra HD"},{"label":"Screens","value":"4 Simultaneous"},{"label":"Downloads","value":"Unlimited"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/netflix', true
  )
) AS t(title, slug, description, content, category, image_url, is_featured, specs, download_url, enable_timer)
WHERE NOT EXISTS (SELECT 1 FROM articles LIMIT 1);

INSERT INTO social_proof (name, gift_card_type, price, time_ago)
SELECT * FROM (VALUES
  ('Mo****ed K.', 'ChatGPT Pro', 'Premium', '2 min ago'),
  ('Sa****ah M.', 'Spotify Premium', 'Full Access', '5 min ago'),
  ('Om****ar R.', 'Netflix 4K', 'Annual Plan', '8 min ago'),
  ('Fa****ma A.', 'Midjourney V6', 'Pro License', '12 min ago'),
  ('Yo****ef B.', 'GTA VI Mobile', 'Early Access', '15 min ago')
) AS t(name, gift_card_type, price, time_ago)
WHERE NOT EXISTS (SELECT 1 FROM social_proof LIMIT 1);

-- 7. ENABLE REALTIME for articles
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE articles;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
