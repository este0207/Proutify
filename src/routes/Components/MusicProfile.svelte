<script>
  export let track = null;
  export let onClose = () => {};
  import { onMount } from 'svelte';
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
      alert('Ajouté à votre bibliothèque !');
    } catch (e) {
      alert("Erreur lors de l'ajout à la bibliothèque.");
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
      alert("Erreur lors de la lecture du morceau.");
    }
  }
</script>

{#if track}
  <div class="music-profile-overlay" on:click={onClose}>
    <div class="music-profile-card" on:click|stopPropagation>
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
        <button class="btn-primary" on:click={addToLibrary}>Ajouter à ma bibliothèque</button>
        <button class="btn-secondary" on:click={playTrack}>Écouter</button>
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
  /* Correction pour forcer le centrage même en cas de scroll */
  min-height: 100vh;
  min-width: 100%;
}
.music-profile-card {
  background: #181818;
  border-radius: 24px;
  padding: 36px 32px 28px 32px;
  box-shadow: 0 8px 32px rgba(30,217,96,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  /* Correction pour le centrage vertical/horizontal */
  left: 0;
  top: 0;
  transform: none;
}
.cover {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  margin-bottom: 18px;
}
h2 {
  font-size: 2rem;
  margin: 0 0 8px 0;
  color: #fff;
}
h3 {
  font-size: 1.2rem;
  color: #1db954;
  margin: 0 0 8px 0;
}
.album {
  color: #b3b3b3;
  margin-bottom: 10px;
}
.popularity {
  color: #fff;
  margin-bottom: 18px;
}
.actions {
  display: flex;
  gap: 18px;
  margin-top: 10px;
}
.btn-primary {
  background: #1db954;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #1ed760;
}
.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #1db954;
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
  background: #1db954;
  color: #181818;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
}
.loader {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid #1db954;
  border-radius: 50%;
  border-top: 3px solid #fff;
  animation: spin 0.8s linear infinite;
  margin: 8px auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.error {
  color: #ff4d4d;
  margin: 10px 0;
}
</style> 