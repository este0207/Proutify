<script>
  import { onMount } from 'svelte';
  import Header from '../Components/Header.svelte';
  import { currentTrack, isPlaying } from '../../lib/playerStore.js';

  let token = null;
  let tracks = []; // Variable pour stocker les morceaux

  onMount(async () => {
    token = localStorage.getItem('spotify_access_token');
    console.log("Token récupéré :", token);
    if (token) {
      tracks = await getSavedTracks(token); 
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
    console.log(`Titre : ${track.track.name}, Artiste : ${track.track.artists[0].name}`);
  }
</script>

<Header></Header>
<div class="MusicContainer">
  {#if tracks.length > 0}
    {#each tracks as track}
      <button class="card" on:click={() => handleClick(track)}>
        {#if track.track.album.images && track.track.album.images.length > 0}
          <img src="{track.track.album.images[0].url}" alt="Pochette de l'album {track.track.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
        {/if}
        <strong>{track.track.name}</strong> — {track.track.artists[0].name}
      </button>
    {/each}
  {:else}
    <p>Aucun morceau trouvé ou non connecté à Spotify.</p>
  {/if}
</div>

<style>
    .MusicContainer{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 20px;
    }

    .card{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: antiquewhite;
        border-radius: 20px;
        border: none;
        padding: 10px;
        transition: 0.5s;
    }

    .card:hover{
      transform: scale(1.1);
      cursor: pointer;
    }
</style>