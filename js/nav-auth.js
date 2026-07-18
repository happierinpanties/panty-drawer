import { client } from '/js/supabase-client.js';

async function checkAuthStatus() {
  const { data: { session } } = await client.auth.getSession();
  if (!session) return { session: null, allowed: false };
  const { data, error } = await client.rpc('is_allowed_user');
  if (error) {
    console.error('Allowlist check error:', JSON.stringify(error));
    return { session, allowed: false };
  }
  return { session, allowed: !!data };
}

function renderAuthArea(session) {
  const area = document.getElementById('authArea');
  if (!area) return;

  if (session) {
    area.innerHTML = `
      <span class="auth-email">${session.user.email}</span>
      <button class="btn-text" id="navSignOutBtn">Sign Out</button>`;
    document.getElementById('navSignOutBtn').addEventListener('click', async () => {
      await client.auth.signOut();
    });
  } else {
    const redirectTo = encodeURIComponent(window.location.pathname);
    area.innerHTML = `<a href="/signin.html?redirect=${redirectTo}" class="btn-text">Sign In</a>`;
  }
}

function toggleGatedLinks(allowed) {
  document.querySelectorAll('[data-auth="required"]').forEach(el => {
    el.style.display = allowed ? '' : 'none';
  });
}

async function refresh() {
  const { session, allowed } = await checkAuthStatus();
  renderAuthArea(session);
  toggleGatedLinks(allowed);
}

refresh();
client.auth.onAuthStateChange(() => refresh());
