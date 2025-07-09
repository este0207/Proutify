<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import MusicProfile from './MusicProfile.svelte';
  import { currentTrack } from '$lib/playerStore';
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

  let searchSource = 'spotify'; // 'spotify' ou 'youtube'

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

  // Fonction de recherche YouTube sans clé API
  async function searchYouTube(q) {
    if (!q) {
      suggestions = [];
      return;
    }
    loading = true;
    error = '';
    try {
      const res = await fetch(`https://corsproxy.io/?https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`);
      const text = await res.text();
      // Extraction des données JSON de la page YouTube
      const initialDataMatch = text.match(/var ytInitialData = (\{.*?\});<\/script>/);
      if (initialDataMatch) {
        const ytData = JSON.parse(initialDataMatch[1]);
        // Extraction des vidéos
        const videoItems = ytData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents
          .flatMap(section => section.itemSectionRenderer?.contents || [])
          .filter(item => item.videoRenderer)
          .map(item => item.videoRenderer);
        suggestions = videoItems.map(video => ({
          id: video.videoId,
          title: video.title.runs[0].text,
          thumbnail: video.thumbnail.thumbnails[0].url,
          author: video.ownerText?.runs[0]?.text || '',
          type: 'youtube'
        }));
      } else {
        suggestions = [];
      }
    } catch (e) {
      error = 'Erreur lors de la recherche YouTube.';
      suggestions = [];
    }
    loading = false;
  }

  async function pauseSpotify() {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('spotify_access_token') || '';
    }
    if (!token) return;
    try {
      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {}
  }

  function handleInput(e) {
    query = e.target.value;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (searchSource === 'spotify') {
        searchSpotify(query);
      } else {
        searchYouTube(query);
      }
    }, 350);
  }

  function setSource(source) {
    if (searchSource !== source) {
      searchSource = source;
      suggestions = [];
      query = '';
      error = '';
    }
  }

  let selectedTrack = null;
  let searchInputRef;

  function openProfile(track) {
    if (searchSource === 'youtube') {
      pauseSpotify(); // On met en pause Spotify si besoin
      // On ajoute la playlist, l'index courant et la liste complète des objets vidéo
      const playlist = suggestions.map(v => v.id);
      const playlistIndex = suggestions.findIndex(v => v.id === track.id);
      const playlistData = suggestions;
      currentTrack.set({
        source: 'youtube',
        video: { ...track, _playlist: playlist, _playlistIndex: playlistIndex, _playlistData: playlistData }
      });
    } else {
      currentTrack.set({ source: 'spotify', track });
    }
    selectedTrack = track;
    suggestions = [];
    query = '';
    if (searchInputRef) searchInputRef.blur();
  }
  function closeProfile() {
    selectedTrack = null;
  }
</script>

<div class="searchbar-container">
  <div class="search-source-btns">
    <button class:active={searchSource === 'spotify'} on:click={() => setSource('spotify')}>Spotify</button>
    <button class:active={searchSource === 'youtube'} on:click={() => setSource('youtube')}>YouTube</button>
  </div>
  <input
    class="search-input"
    type="text"
    placeholder={searchSource === 'spotify' ? 'Rechercher un titre Spotify...' : 'Rechercher sur YouTube...'}
    on:input={handleInput}
    bind:value={query}
    aria-label={searchSource === 'spotify' ? 'Recherche Spotify' : 'Recherche YouTube'}
    autocomplete="off"
    bind:this={searchInputRef}
  />
  {#if loading}
    <div class="suggestions"><span class="loader"></span></div>
  {:else if error}
    <div class="suggestions error">{error}</div>
  {:else if suggestions.length > 0 && query}
    <ul class="suggestions">
      {#if searchSource === 'spotify'}
        {#each suggestions as track}
          <li class="suggestion-item" on:click={() => openProfile(track)}>
            {#if track.album && track.album.images && track.album.images[0]}
              <img src={track.album.images[0].url} alt={track.name} class="suggestion-img" />
            {/if}
            <span class="suggestion-title">{track.name}</span>
            <span class="suggestion-artist">{track.artists[0].name}</span>
          </li>
        {/each}
      {:else}
        {#each suggestions as video}
          <li class="suggestion-item" on:click={() => openProfile(video)}>
            <img src={video.thumbnail} alt={video.title} class="suggestion-img" />
            <span class="suggestion-title">{video.title}</span>
            <span class="suggestion-artist">{video.author}</span>
          </li>
        {/each}
      {/if}
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
  box-shadow: 0 8px 32px rgba(33,150,243,0.15);
  outline: none;
}
.suggestions {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #181818;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(33,150,243,0.15);
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
  color: #2196f3;
  font-size: 0.95rem;
  margin-left: 8px;
}
.loader {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid #2196f3;
  border-radius: 50%;
  border-top: 3px solid #fff;
  animation: spin 0.8s linear infinite;
  margin: 8px auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.search-source-btns {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  width: 100%;
}
.search-source-btns button {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 12px 12px 0 0;
  background: #181818;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.search-source-btns button.active,
.search-source-btns button:focus {
  background: #2196f3;
  color: #fff;
}
</style> 