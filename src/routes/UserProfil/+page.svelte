<script>
import Header from "../Components/Header.svelte";
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let user = null;
let error = '';
let loading = true;

onMount(async () => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('spotify_access_token');
  }
  if (!token) {
    error = 'Token Spotify manquant. Connecte-toi d\'abord.';
    loading = false;
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
      loading = false;
      return;
    }
    user = await res.json();
  } catch (e) {
    error = 'Erreur réseau : ' + e.message;
  }
  loading = false;
});

function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('spotify_access_token');
    goto('/');
  }
}
</script>

<Header />
<div class="mainPage">
  {#if loading}
    <div style="text-align:center;margin-top:60px;">Chargement du profil...</div>
  {:else if error}
    <div style="color:red;text-align:center;">{error}</div>
  {:else if user}
    <section class="profile-section">
      <h1>Profil Spotify</h1>
      <div class="profile-card">
        {#if user.images && user.images.length > 0}
          <img src={user.images[0].url} alt={user.display_name} class="profile-img" />
        {/if}
        <span class="profile-name">{user.display_name}</span>
        <span class="profile-email">{user.email}</span>
        <span class="profile-id">ID : {user.id}</span>
        <button class="btn-primary logout-btn" on:click={logout}>Se déconnecter</button>
      </div>
    </section>
  {/if}
</div>

<style>
.mainPage {
    min-height: 100vh;
    color: #fff;
    padding: 0 0 40px 0;
}
.profile-section {
    text-align: center;
    padding: 60px 20px 40px 20px;
}
.profile-section h1 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    font-weight: 800;
}
.profile-card {
    background: #222;
    border-radius: 18px;
    padding: 32px 28px 24px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    margin: 0 auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    gap: 16px;
}
.profile-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 12px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.profile-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
}
.profile-email {
    font-size: 1.1rem;
    color: #b3b3b3;
}
.profile-id {
    font-size: 0.95rem;
    color: #888;
}
.btn-primary.logout-btn {
    background: #1db954;
    color: #fff;
    border: none;
    padding: 12px 32px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 18px;
}
.btn-primary.logout-btn:hover {
    background: #1ed760;
}
</style> 