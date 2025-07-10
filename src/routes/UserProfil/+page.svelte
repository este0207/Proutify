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
<div class="userprofil-wrapper">
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
.userprofil-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    background: var(--color-bg-secondary);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 32px 24px;
    margin-top: 32px;
    transition: background var(--transition), box-shadow var(--transition);
}
.profile-section {
    text-align: center;
    padding: 36px 18px 18px 18px;
}
.profile-section h1 {
    font-size: 2.1rem;
    margin-bottom: 18px;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: 0.03em;
    text-shadow: 0 2px 12px var(--color-primary-light), 0 1px 0 #fff2;
}
.profile-card {
    background: var(--color-bg);
    border-radius: 24px;
    padding: 32px 28px 24px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    margin: 0 auto;
    box-shadow: 0 4px 24px var(--color-shadow);
    gap: 16px;
    border: 1px solid var(--color-border);
    animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1);
}
.profile-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 12px;
    object-fit: cover;
    box-shadow: 0 2px 8px var(--color-shadow);
    border: 2px solid var(--color-primary);
    background: #fff;
    transition: box-shadow 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1);
}
.profile-img:hover {
    transform: scale(1.04) rotate(-2deg);
    box-shadow: 0 8px 32px var(--color-shadow);
}
.profile-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-primary);
    text-align: center;
}
.profile-email {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    text-align: center;
}
.profile-id {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    text-align: center;
}
.btn-primary.logout-btn {
    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
    color: #fff;
    border: none;
    padding: 10px 28px;
    border-radius: 24px;
    font-size: 1.08rem;
    font-weight: 600;
    box-shadow: 0 2px 8px var(--color-shadow);
    cursor: pointer;
    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
    margin-top: 18px;
}
.btn-primary.logout-btn:hover {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    box-shadow: 0 4px 16px var(--color-shadow);
    transform: scale(1.06);
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to { opacity: 1; transform: none; }
}
@media (max-width: 900px) {
    .userprofil-wrapper {
        padding: 12px 2vw;
        margin-top: 12px;
    }
    .profile-card {
        width: 98vw;
        min-width: 0;
        padding: 18px 2vw 12px 2vw;
    }
    .profile-img {
        width: 80px;
        height: 80px;
    }
}
@media (max-width: 600px) {
    .userprofil-wrapper {
        padding: 6px 1vw;
        margin-top: 6px;
    }
    .profile-section {
        padding: 12px 2vw 8px 2vw;
    }
    .profile-section h1 {
        font-size: 1rem;
    }
    .profile-card {
        width: 100vw;
        min-width: 0;
        padding: 8px 2vw 6px 2vw;
    }
    .profile-img {
        width: 48px;
        height: 48px;
    }
    .profile-name {
        font-size: 0.95rem;
    }
    .profile-email, .profile-id {
        font-size: 0.8rem;
    }
    .btn-primary.logout-btn {
        font-size: 0.88rem;
        padding: 7px 6px;
    }
}
</style> 