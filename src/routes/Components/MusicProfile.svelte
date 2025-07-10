<script>
  export let track = null;
  export let onClose = () => {};
  import { onMount } from 'svelte';
  import { showNotification } from '../../lib/notificationStore.js';
  import { fade, scale } from 'svelte/transition';
  let audioFeatures = null;
  let popularity = null;
  let loading = false;
  let error = '';
  let token = '';
  let deviceId = '';

  onMount(async () => {
    if (!track) return;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('spotify_access_token') || '';
      deviceId = localStorage.getItem('spotify_device_id') || '';
    }
    if (!token) return;
    loading = true;
    try {
      // Récupérer la popularité (proche du nombre d'écoutes, valeur 0-100)
      const res = await fetch(`https://api.spotify.com/v1/tracks/${track.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      popularity = data.popularity;
      // Optionnel : récupérer d'autres infos (audio features)
      // const featRes = await fetch(`https://api.spotify.com/v1/audio-features/${track.id}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // audioFeatures = await featRes.json();
    } catch (e) {
      error = 'Erreur lors de la récupération des infos du morceau.';
    }
    loading = false;
  });

  async function addToLibrary() {
    if (!token || !track) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/tracks?ids=${track.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      showNotification('Ajouté à votre bibliothèque !', 'success');
    } catch (e) {
      showNotification("Erreur lors de l'ajout à la bibliothèque.", 'error');
    }
  }

  async function playTrack() {
    if (!token || !track) return;
    let url = 'https://api.spotify.com/v1/me/player/play';
    if (deviceId) {
      url += `?device_id=${deviceId}`;
    }
    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [track.uri] })
      });
    } catch (e) {
      showNotification("Erreur lors de la lecture du morceau.", 'error');
    }
  }
</script>

{#if track}
  <div class="music-profile-overlay" on:click={onClose} transition:fade={{ duration: 350 }}>
    <div class="music-profile-card" on:click|stopPropagation transition:scale={{ duration: 400, start: 0.92 }}>
      <button class="close-btn" on:click={onClose} aria-label="Fermer">&times;</button>
      <img class="cover" src={track.album.images[0].url} alt={track.name} />
      <h2>{track.name}</h2>
      <h3>{track.artists[0].name}</h3>
      <p class="album">Album : {track.album.name}</p>
      {#if loading}
        <div class="loader"></div>
      {:else if error}
        <div class="error">{error}</div>
      {:else}
        <p class="popularity">Popularité : {popularity ?? 'N/A'} / 100</p>
      {/if}
      <div class="actions">
        <button class="btn-primary animated-btn" on:click={addToLibrary}>Ajouter à ma bibliothèque</button>
        <button class="btn-secondary animated-btn" on:click={playTrack}>Écouter</button>
      </div>
    </div>
  </div>
{/if}

<style>
.music-profile-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100%;
}
.music-profile-card {
  background: var(--color-bg-secondary);
  border-radius: 24px;
  padding: 36px 32px 28px 32px;
  box-shadow: 0 8px 32px var(--color-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  left: 0;
  top: 0;
  transform: none;
  border: 1px solid var(--color-border);
  transition: background var(--transition), box-shadow var(--transition);
  animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1);
}
.cover {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  margin-bottom: 18px;
  box-shadow: 0 2px 12px var(--color-shadow);
  border: 1.5px solid var(--color-primary);
  background: #fff;
  transition: box-shadow 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1);
}
.cover:hover {
  transform: scale(1.04) rotate(-2deg);
  box-shadow: 0 8px 32px var(--color-shadow);
}
h2 {
  font-size: 2rem;
  margin: 0 0 8px 0;
  color: var(--color-primary);
  font-weight: 800;
  letter-spacing: 0.03em;
  text-shadow: 0 2px 12px var(--color-primary-light), 0 1px 0 #fff2;
  text-align: center;
}
h3 {
  font-size: 1.2rem;
  color: var(--color-text);
  margin: 0 0 8px 0;
  font-weight: 600;
  text-align: center;
}
.album {
  color: var(--color-text-secondary);
  margin-bottom: 10px;
  text-align: center;
}
.popularity {
  color: var(--color-primary);
  margin-bottom: 18px;
  font-weight: 600;
  text-align: center;
}
.actions {
  display: flex;
  gap: 18px;
  margin-top: 10px;
  justify-content: center;
}
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 24px;
  font-size: 1.08rem;
  font-weight: 600;
  box-shadow: 0 2px 8px var(--color-shadow);
  cursor: pointer;
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  box-shadow: 0 4px 16px var(--color-shadow);
  transform: scale(1.06);
}
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 10px 22px;
  border-radius: 24px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), color var(--transition), border var(--transition), transform var(--transition);
  box-shadow: 0 1px 4px var(--color-shadow);
}
.btn-secondary:hover {
  background: var(--color-primary-light);
  color: #fff;
  border-color: var(--color-primary);
  transform: scale(1.04);
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 18px;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  border: none;
  color: #fff;
  font-size: 2rem;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--color-shadow);
  cursor: pointer;
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
}
.close-btn:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  box-shadow: 0 4px 16px var(--color-shadow);
  transform: scale(1.08) rotate(8deg);
}
.loader {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-primary);
  border-radius: 50%;
  border-top: 3px solid var(--color-bg);
  animation: spin 0.8s linear infinite;
  margin: 8px auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.error {
  color: #e74c3c;
  text-align: center;
  margin: 10px 0;
}
.animated-btn {
  will-change: transform, box-shadow;
  transition: background var(--transition), box-shadow var(--transition), transform 0.18s cubic-bezier(.4,0,.2,1);
}
.animated-btn:active {
  transform: scale(0.96);
  box-shadow: 0 1px 2px var(--color-shadow);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(32px) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 900px) {
  .music-profile-card {
    max-width: 98vw;
    min-width: 0;
    padding: 18px 2vw 12px 2vw;
  }
  .cover {
    width: 110px;
    height: 110px;
  }
}
@media (max-width: 600px) {
  .music-profile-card {
    padding: 8px 2vw 6px 2vw;
    min-width: 0;
    max-width: 100vw;
  }
  .cover {
    width: 70px;
    height: 70px;
  }
  h2 {
    font-size: 1rem;
  }
  h3 {
    font-size: 0.85rem;
  }
  .btn-primary, .btn-secondary {
    font-size: 0.88rem;
    padding: 7px 6px;
  }
  .close-btn {
    width: 28px;
    height: 28px;
    font-size: 1.3rem;
    top: 6px;
    right: 8px;
  }
}
</style> 