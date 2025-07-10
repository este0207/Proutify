<script>
// Paramètres Spotify
const clientId = '8d46010311a641e8b31e723f1d3cf467';      
const redirectUri = typeof window !== 'undefined' && window.location.hostname === 'sonora-fr.vercel.app'
  ? 'https://sonora-fr.vercel.app/callback'
  : 'http://127.0.0.1:5173/callback';
const scope = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state user-library-read user-library-modify';

function generateCodeVerifier(length = 128) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function loginWithSpotify() {
  const codeVerifier = generateCodeVerifier();
  if (typeof window !== 'undefined') {
    localStorage.setItem('code_verifier', codeVerifier);
  }
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;
  window.location.href = authUrl;
}
</script>

<button class="login-btn" on:click={loginWithSpotify}>
  Se connecter avec Spotify
</button> 

<style>
  .login-btn {
    padding: 10px 28px;
    border-radius: 24px;
    border: none;
    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
    color: #fff;
    font-size: 1.08rem;
    font-weight: 500;
    box-shadow: 0 2px 8px var(--color-shadow);
    cursor: pointer;
    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
    margin-top: 18px;
}
.login-btn:hover {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    box-shadow: 0 4px 16px var(--color-shadow);
    transform: scale(1.06);
}
</style>