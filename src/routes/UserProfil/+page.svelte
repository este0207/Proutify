<script>
import { onMount } from 'svelte';
let user = null;
let error = '';

onMount(async () => {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    error = 'Token Spotify manquant. Connecte-toi d\'abord.';
    return;
  }
  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      error = 'Erreur lors de la récupération du profil Spotify.';
      return;
    }
    user = await res.json();
  } catch (e) {
    error = 'Erreur réseau : ' + e.message;
  }
});
</script>

{#if error}
  <p style="color:red">{error}</p>
{:else if user}
  <div>
    <h2>{user.display_name}</h2>
    {#if user.images && user.images.length > 0}
      <img src={user.images[0].url} alt={user.display_name} width="100" />
    {/if}
    <p>Email : {user.email}</p>
    <p>ID Spotify : {user.id}</p>
  </div>
{:else}
  <p>Chargement du profil...</p>
{/if} 