<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import MusicProfile from './MusicProfile.svelte';
  let query = '';
  let suggestions = [];
  let loading = false;
  let error = '';
  let debounceTimeout;

  // Store pour le token Spotify
  let token = '';
  onMount(() => {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('spotify_access_token') || '';
    }
  });

  // Fonction de recherche Spotify
  async function searchSpotify(q) {
    if (!q || !token) {
      suggestions = [];
      return;
    }
    loading = true;
    error = '';
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.tracks && data.tracks.items) {
        suggestions = data.tracks.items;
      } else {
        suggestions = [];
      }
    } catch (e) {
      error = 'Erreur lors de la recherche Spotify.';
      suggestions = [];
    }
    loading = false;
  }

  function handleInput(e) {
    query = e.target.value;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchSpotify(query);
    }, 350);
  }

  let selectedTrack = null;

  function openProfile(track) {
    selectedTrack = track;
  }
  function closeProfile() {
    selectedTrack = null;
  }
</script>

<div class="searchbar-container">
  <input
    class="search-input"
    type="text"
    placeholder="Rechercher un titre Spotify..."
    on:input={handleInput}
    bind:value={query}
    aria-label="Recherche Spotify"
    autocomplete="off"
  />
  {#if loading}
    <div class="suggestions"><span class="loader"></span></div>
  {:else if error}
    <div class="suggestions error">{error}</div>
  {:else if suggestions.length > 0 && query}
    <ul class="suggestions">
      {#each suggestions as track}
        <li class="suggestion-item" on:click={() => openProfile(track)}>
          {#if track.album && track.album.images && track.album.images[0]}
            <img src={track.album.images[0].url} alt={track.name} class="suggestion-img" />
          {/if}
          <span class="suggestion-title">{track.name}</span>
          <span class="suggestion-artist">{track.artists[0].name}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

{#if selectedTrack}
  <MusicProfile track={selectedTrack} onClose={closeProfile} />
{/if}

<style>
.searchbar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 350px;
  max-width: 90vw;
}
.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  font-size: 1.1rem;
  background: #222;
  color: #fff;
  box-shadow: 0 2px 8px rgba(30,185,84,0.10);
  outline: none;
}
.suggestions {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #181818;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(30,185,84,0.10);
  margin-top: 6px;
  z-index: 100;
  padding: 0;
  list-style: none;
  color: #fff;
  max-height: 350px;
  overflow-y: auto;
}
.suggestions.error {
  color: #ff4d4d;
  padding: 10px;
}
.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #222;
  transition: background 0.15s;
}
.suggestion-item:last-child {
  border-bottom: none;
}
.suggestion-item:hover {
  background: #222;
}
.suggestion-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.suggestion-title {
  font-weight: 600;
  font-size: 1.05rem;
}
.suggestion-artist {
  color: #1db954;
  font-size: 0.95rem;
  margin-left: 8px;
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
</style> 