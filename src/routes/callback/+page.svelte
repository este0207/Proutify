<script>
import { onMount } from 'svelte';

const clientId = '8d46010311a641e8b31e723f1d3cf467'; 
const redirectUri = typeof window !== 'undefined' && window.location.hostname === 'sonora-fr.vercel.app'
  ? 'https://sonora-fr.vercel.app/callback'
  : 'http://127.0.0.1:5173/callback';
let message = 'Connexion à Spotify...';

onMount(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  let codeVerifier;
  if (typeof window !== 'undefined') {
    codeVerifier = localStorage.getItem('code_verifier');
  }

  if (!code) {
    message = 'Erreur : code d\'autorisation manquant.';
    return;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data = await response.json();
    if (data.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_access_token', data.access_token);
      }
      message = 'Connexion réussie !';
      setTimeout(() => {
        window.location.href = '/';
      }, 1000); 
    } else {
      message = 'Erreur lors de la récupération du token : ' + (data.error_description || JSON.stringify(data));
    }
  } catch (e) {
    message = 'Erreur réseau : ' + e.message;
  }
});
</script>

<h1>{message}</h1> 