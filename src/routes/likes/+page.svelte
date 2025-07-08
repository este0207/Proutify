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
<div class="likesPage">
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
.likesPage {
  min-height: 100vh;
  color: #fff;
  padding-bottom: 40px;
}
.likes-hero {
  text-align: center;
  padding: 50px 20px 30px 20px;
}
.likes-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 10px;
}
.likes-hero p {
  color: #b3b3b3;
  font-size: 1.1rem;
}
.likes-list {
  padding: 0 30px;
}
.MusicContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}
.card {
  background: #222;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  border: none;
  padding: 20px 18px 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 170px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 8px 32px rgba(30,217,96,0.15);
  background: #282828;
}
.card img {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  margin-bottom: 14px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.track-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  text-align: center;
}
.track-artist {
  font-size: 1rem;
  color: #1db954;
  text-align: center;
}
.empty {
  text-align: center;
  color: #b3b3b3;
  margin-top: 40px;
  font-size: 1.2rem;
}
.loader {
  border: 6px solid #222;
  border-top: 6px solid #1db954;
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
@media (max-width: 900px) {
  .MusicContainer {
    gap: 18px;
  }
  .card {
    width: 140px;
    padding: 14px 10px 10px 10px;
  }
  .card img {
    width: 80px;
    height: 80px;
  }
}
@media (max-width: 600px) {
  .likes-hero h1 {
    font-size: 1.5rem;
  }
  .MusicContainer {
    gap: 10px;
  }
  .card {
    width: 110px;
    padding: 10px 6px 8px 6px;
  }
  .card img {
    width: 60px;
    height: 60px;
  }
}
</style>