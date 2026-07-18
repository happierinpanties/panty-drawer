import { client } from '/js/supabase-client.js';

(async function gate() {
  const { data: { session } } = await client.auth.getSession();
  let allowed = false;
  if (session) {
    const { data, error } = await client.rpc('is_allowed_user');
    if (error) console.error('Allowlist check error:', JSON.stringify(error));
    allowed = !!data;
  }
  if (!allowed) {
    const redirectTo = encodeURIComponent(window.location.pathname);
    window.location.replace(`/signin.html?redirect=${redirectTo}`);
  }
})();
