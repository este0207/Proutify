<script>
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let user = null;
let error = '';

onMount(async () => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('spotify_access_token');
  }
  if (!token) {
    error = 'Token Spotify manquant.';
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

function handleClick() {
    console.log("redirection a user profil")
    goto('/UserProfil');
}
</script>

<style>
.userPicture {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px var(--color-shadow);
    border: 2px solid var(--color-primary);
    background: #fff;
    transition: box-shadow var(--transition), border var(--transition);
}
@media (max-width: 600px) {
    .userPicture {
        width: 32px;
        height: 32px;
    }
}
</style>

{#if user && user.images && user.images.length > 0}
  <button style="background:none;border:none;padding:0;cursor:pointer" on:click={() => handleClick()}>
    <img src={user.images[0].url} alt="Photo de {user.display_name}" style="border-radius:50%; width:48px; height:48px;" />
  </button>
{/if}
