import urllib.request
import json

SUPABASE_URL = "https://lcxhtpfkgtmbffnhpnni.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGh0cGZrZ3RtYmZmbmhwbm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzE5MDUsImV4cCI6MjA4NzYwNzkwNX0.FjYAX4_G4JsVzOPRQvY7F0MzjdWvsresLT3eBwDU4rQ"

def probe_column(table, col):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={col}&limit=0"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    })
    try:
        urllib.request.urlopen(req)
        return True
    except:
        return False

def get_sample(table):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=*&limit=1"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    })
    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode())
        return data
    except Exception as e:
        return str(e)

article_cols = [
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
]

settings_cols = [
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
]

print("=== ARTICLES TABLE ===")
found_articles = []
for col in article_cols:
    if probe_column("articles", col):
        found_articles.append(col)
        print(f"  FOUND: {col}")

print(f"\nARTICLES COLUMNS: {json.dumps(found_articles)}")

print("\n=== SITE_SETTINGS TABLE ===")
found_settings = []
for col in settings_cols:
    if probe_column("site_settings", col):
        found_settings.append(col)
        print(f"  FOUND: {col}")

print(f"\nSITE_SETTINGS COLUMNS: {json.dumps(found_settings)}")

print("\n=== RAW DATA SAMPLES ===")
for table in ["articles", "site_settings"]:
    sample = get_sample(table)
    if isinstance(sample, list) and len(sample) > 0:
        print(f"{table} sample keys: {json.dumps(list(sample[0].keys()))}")
        print(f"{table} sample data: {json.dumps(sample[0], default=str)}")
    else:
        print(f"{table}: empty or error - {sample}")
