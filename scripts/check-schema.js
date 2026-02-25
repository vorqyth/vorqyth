import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcxhtpfkgtmbffnhpnni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGh0cGZrZ3RtYmZmbmhwbm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzE5MDUsImV4cCI6MjA4NzYwNzkwNX0.FjYAX4_G4JsVzOPRQvY7F0MzjdWvsresLT3eBwDU4rQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('[schema] Checking articles table...');
  const { data: articles, error: artErr } = await supabase.from('articles').select('*').limit(1);
  if (artErr) {
    console.log('[schema] articles error:', artErr.message);
  } else {
    console.log('[schema] articles columns:', articles.length > 0 ? Object.keys(articles[0]) : 'empty table - inserting test row');
    if (articles.length === 0) {
      // Try to get columns by selecting with a fake filter
      const { data: artAll, error: artAllErr } = await supabase.from('articles').select();
      console.log('[schema] articles select all:', artAllErr ? artAllErr.message : `${artAll?.length} rows`);
    } else {
      console.log('[schema] articles sample:', JSON.stringify(articles[0], null, 2));
    }
  }

  console.log('\n[schema] Checking site_settings table...');
  const { data: settings, error: setErr } = await supabase.from('site_settings').select('*').limit(1);
  if (setErr) {
    console.log('[schema] site_settings error:', setErr.message);
  } else {
    console.log('[schema] site_settings columns:', settings.length > 0 ? Object.keys(settings[0]) : 'empty table');
    if (settings.length > 0) {
      console.log('[schema] site_settings sample:', JSON.stringify(settings[0], null, 2));
    }
  }

  console.log('\n[schema] Checking social_proof table...');
  const { data: sp, error: spErr } = await supabase.from('social_proof').select('*').limit(1);
  if (spErr) {
    console.log('[schema] social_proof error:', spErr.message);
  } else {
    console.log('[schema] social_proof columns:', sp.length > 0 ? Object.keys(sp[0]) : 'empty table');
    if (sp.length > 0) {
      console.log('[schema] social_proof sample:', JSON.stringify(sp[0], null, 2));
    }
  }

  // Check for other possible table names
  console.log('\n[schema] Checking social_proofs table...');
  const { data: sps, error: spsErr } = await supabase.from('social_proofs').select('*').limit(1);
  if (spsErr) {
    console.log('[schema] social_proofs error:', spsErr.message);
  } else {
    console.log('[schema] social_proofs columns:', sps.length > 0 ? Object.keys(sps[0]) : 'empty table');
    if (sps.length > 0) {
      console.log('[schema] social_proofs sample:', JSON.stringify(sps[0], null, 2));
    }
  }

  // Check for notifications table 
  console.log('\n[schema] Checking notifications table...');
  const { data: notifs, error: notifErr } = await supabase.from('notifications').select('*').limit(1);
  if (notifErr) {
    console.log('[schema] notifications error:', notifErr.message);
  } else {
    console.log('[schema] notifications columns:', notifs.length > 0 ? Object.keys(notifs[0]) : 'empty table');
  }
}

checkSchema().catch(console.error);
