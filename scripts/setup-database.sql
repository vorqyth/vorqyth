-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'apps' CHECK (category IN ('apps', 'games', 'ai-tools', 'gift-cards')),
  image_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  specs JSONB DEFAULT '[]'::jsonb,
  download_url TEXT DEFAULT '',
  enable_timer BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Vorqenox',
  logo_url TEXT DEFAULT '',
  neon_color TEXT DEFAULT '#FFD700',
  social_links JSONB DEFAULT '{"twitter":"","telegram":"","youtube":"","instagram":""}'::jsonb,
  ipqs_active BOOLEAN DEFAULT false
);

-- Create social_proof table
CREATE TABLE IF NOT EXISTS social_proof (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  gift_card_type TEXT NOT NULL,
  price TEXT NOT NULL,
  time_ago TEXT NOT NULL
);

-- Insert default site settings if none exist
INSERT INTO site_settings (site_name, logo_url, neon_color, social_links, ipqs_active)
SELECT 'Vorqenox', '', '#FFD700', '{"twitter":"","telegram":"","youtube":"","instagram":""}'::jsonb, false
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Insert default articles if none exist
INSERT INTO articles (title, slug, description, content, category, image_url, is_featured, specs, download_url, enable_timer)
SELECT * FROM (VALUES
  (
    'ChatGPT Pro - Unlimited AI Power',
    'chatgpt-pro-unlimited',
    'Unlock the full potential of ChatGPT with Pro access. No limits, no restrictions.',
    'ChatGPT Pro gives you unlimited access to the most powerful AI language model. With advanced reasoning, code generation, and creative writing capabilities, this is the ultimate tool for professionals and creators alike.

Features include:
- Unlimited message cap
- Priority access during peak times
- Advanced data analysis
- Image generation with DALL-E
- Custom GPT creation',
    'ai-tools',
    '',
    true,
    '[{"label":"Version","value":"4.5 Turbo"},{"label":"Platform","value":"Web / iOS / Android"},{"label":"Size","value":"Cloud-based"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/chatgpt',
    true
  ),
  (
    'Spotify Premium - Ad-Free Music',
    'spotify-premium-ad-free',
    'Stream millions of songs ad-free with Spotify Premium. Download music for offline listening.',
    'Enjoy an enhanced music experience with Spotify Premium. Stream over 100 million tracks without interruption, download your favorites for offline listening, and enjoy superior audio quality.

What you get:
- Ad-free music streaming
- Offline downloads
- High quality audio (320kbps)
- Unlimited skips
- Cross-device sync',
    'apps',
    '',
    true,
    '[{"label":"Version","value":"8.9.2"},{"label":"Platform","value":"All Platforms"},{"label":"Size","value":"150 MB"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/spotify',
    true
  ),
  (
    'GTA VI Mobile - Early Access',
    'gta-vi-mobile-early-access',
    'Experience the next generation of open-world gaming on mobile. GTA VI is here.',
    'Grand Theft Auto VI brings the legendary franchise to a whole new level. Explore a massive open world, engage in thrilling missions, and experience next-gen graphics on your mobile device.

Highlights:
- Massive open world map
- Next-gen graphics engine
- Online multiplayer
- Regular content updates
- Controller support',
    'games',
    '',
    true,
    '[{"label":"Version","value":"1.0 Beta"},{"label":"Platform","value":"Android / iOS"},{"label":"Size","value":"2.8 GB"},{"label":"License","value":"Free-to-Play"}]'::jsonb,
    'https://example.com/gtavi',
    true
  ),
  (
    'Midjourney V6 - AI Art Generator',
    'midjourney-v6-ai-art',
    'Create stunning AI-generated artwork with Midjourney V6. Photorealistic results in seconds.',
    'Midjourney V6 represents a quantum leap in AI image generation. Create breathtaking photorealistic images, artistic masterpieces, and creative designs with simple text prompts.

Capabilities:
- Photorealistic image generation
- Style mixing and blending
- Upscaling to 4K resolution
- Batch generation
- Custom training support',
    'ai-tools',
    '',
    false,
    '[{"label":"Version","value":"6.0"},{"label":"Platform","value":"Discord / Web"},{"label":"Quality","value":"4K Output"},{"label":"License","value":"Subscription"}]'::jsonb,
    'https://example.com/midjourney',
    true
  ),
  (
    'Netflix Premium - 4K Streaming',
    'netflix-premium-4k',
    'Watch unlimited movies and shows in 4K Ultra HD. Netflix Premium at your fingertips.',
    'Enjoy the best of entertainment with Netflix Premium. Stream thousands of movies, TV shows, and documentaries in stunning 4K Ultra HD quality.

Benefits:
- 4K Ultra HD streaming
- Multiple device support
- Download for offline viewing
- No advertisements
- Exclusive originals',
    'apps',
    '',
    false,
    '[{"label":"Quality","value":"4K Ultra HD"},{"label":"Screens","value":"4 Simultaneous"},{"label":"Downloads","value":"Unlimited"},{"label":"License","value":"Premium"}]'::jsonb,
    'https://example.com/netflix',
    true
  )
) AS t(title, slug, description, content, category, image_url, is_featured, specs, download_url, enable_timer)
WHERE NOT EXISTS (SELECT 1 FROM articles LIMIT 1);

-- Insert default social proof if none exist
INSERT INTO social_proof (name, gift_card_type, price, time_ago)
SELECT * FROM (VALUES
  ('Mo****ed K.', 'ChatGPT Pro', 'Premium', '2 min ago'),
  ('Sa****ah M.', 'Spotify Premium', 'Full Access', '5 min ago'),
  ('Om****ar R.', 'Netflix 4K', 'Annual Plan', '8 min ago'),
  ('Fa****ma A.', 'Midjourney V6', 'Pro License', '12 min ago'),
  ('Yo****ef B.', 'GTA VI Mobile', 'Early Access', '15 min ago')
) AS t(name, gift_card_type, price, time_ago)
WHERE NOT EXISTS (SELECT 1 FROM social_proof LIMIT 1);

-- Enable realtime for articles table
ALTER PUBLICATION supabase_realtime ADD TABLE articles;
