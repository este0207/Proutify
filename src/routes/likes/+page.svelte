<script>
  import { onMount } from 'svelte';
  import Header from '../Components/Header.svelte';
  import { currentTrack, isPlaying } from '../../lib/playerStore.js';

  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('spotify_access_token');
  }
  let tracks = []; // Variable pour stocker les morceaux
  let isLoading = true;

  onMount(async () => {
    if (token) {
      isLoading = true;
      tracks = await getSavedTracks(token); 
      isLoading = false;
    } else {
      isLoading = false;
    }
  });

  async function getSavedTracks(token) {
    let allTracks = [];
    let offset = 0;
    let total = 0;
    do {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.items) {
        allTracks = allTracks.concat(data.items);
        total = data.total;
        offset += data.items.length;
      } else {
        break; // En cas d'erreur
      }
    } while (offset < total);
    return allTracks;
  }

  function handleClick(track) {
    currentTrack.set(track);
    isPlaying.set(true);
  }
</script>

<Header />
<div class="likes-wrapper">
  <section class="likes-hero">
    <h1>Musiques likées</h1>
    <p>Retrouvez ici tous vos morceaux favoris sauvegardés sur Spotify.</p>
  </section>
  <section class="likes-list">
    {#if isLoading}
      <div class="loader"></div>
    {:else if tracks.length > 0}
      <div class="MusicContainer">
        {#each tracks as track}
          <button class="card" on:click={() => handleClick(track)}>
            {#if track.track.album.images && track.track.album.images.length > 0}
              <img src="{track.track.album.images[0].url}" alt="Pochette de l'album {track.track.name}" />
            {/if}
            <span class="track-title">{track.track.name}</span>
            <span class="track-artist">{track.track.artists[0].name}</span>
          </button>
        {/each}
      </div>
    {:else}
      <p class="empty">Aucun morceau trouvé ou non connecté à Spotify.</p>
    {/if}
  </section>
</div>

<style>
.likes-wrapper {
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
.likes-hero {
    text-align: center;
    padding: 36px 18px 18px 18px;
}
.likes-hero h1 {
    font-size: 2.1rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 10px;
    letter-spacing: 0.03em;
    text-shadow: 0 2px 12px var(--color-primary-light), 0 1px 0 #fff2;
}
.likes-hero p {
    color: var(--color-text-secondary);
    font-size: 1.08rem;
    margin-bottom: 0;
}
.likes-list {
    padding: 0 0;
}
.MusicContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
}
.card {
    background: var(--color-bg);
    border-radius: 18px;
    box-shadow: 0 2px 12px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 20px 18px 14px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 170px;
    transition: background var(--transition), box-shadow var(--transition), transform 0.18s cubic-bezier(.4,0,.2,1);
    cursor: pointer;
    animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1);
    will-change: transform, box-shadow;
}
.card:hover {
    background: var(--color-primary-light);
    box-shadow: 0 6px 24px var(--color-shadow);
    transform: translateY(-4px) scale(1.04);
}
.card:active {
    transform: scale(0.97);
    box-shadow: 0 1px 2px var(--color-shadow);
}
.card img {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    margin-bottom: 14px;
    object-fit: cover;
    box-shadow: 0 1px 8px var(--color-shadow);
    border: 1px solid var(--color-border);
    background: #fff;
}
.track-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 4px;
    text-align: center;
}
.track-artist {
    font-size: 1rem;
    color: var(--color-primary);
    text-align: center;
}
.empty {
    text-align: center;
    color: var(--color-text-secondary);
    margin-top: 40px;
    font-size: 1.2rem;
}
.loader {
    border: 6px solid var(--color-bg-secondary);
    border-top: 6px solid var(--color-primary);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    margin: 60px auto 40px auto;
    display: block;
}
@keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to { opacity: 1; transform: none; }
}
@media (max-width: 900px) {
  .likes-wrapper {
    padding: 12px 2vw;
    margin-top: 12px;
  }
  .MusicContainer {
    gap: 12px;
  }
  .card {
    width: 110px;
    padding: 10px 6px 8px 6px;
  }
  .card img {
    width: 60px;
    height: 60px;
  }
  .track-title {
    font-size: 0.95rem;
  }
  .track-artist {
    font-size: 0.85rem;
  }
}
@media (max-width: 600px) {
  .likes-wrapper {
    padding: 6px 1vw;
    margin-top: 6px;
  }
  .likes-hero {
    padding: 12px 2vw 8px 2vw;
  }
  .likes-hero h1 {
    font-size: 1rem;
  }
  .MusicContainer {
    gap: 6px;
  }
  .card {
    width: 70px;
    padding: 6px 2px 4px 2px;
  }
  .card img {
    width: 36px;
    height: 36px;
  }
  .track-title {
    font-size: 0.75rem;
  }
  .track-artist {
    font-size: 0.7rem;
  }
}
</style>