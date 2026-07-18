import { client } from '/js/supabase-client.js';

async function isSignedInAndAllowed() {
  const { data: { session } } = await client.auth.getSession();
  if (!session) return false;
  const { data, error } = await client.rpc('is_allowed_user');
  if (error) {
    console.error('Allowlist check error:', JSON.stringify(error));
    return false;
  }
  return !!data;
}

async function updateNavAuthVisibility() {
  const allowed = await isSignedInAndAllowed();
  document.querySelectorAll('[data-auth="required"]').forEach(el => {
    el.style.display = allowed ? '' : 'none';
  });
}

updateNavAuthVisibility();
client.auth.onAuthStateChange(() => updateNavAuthVisibility());
