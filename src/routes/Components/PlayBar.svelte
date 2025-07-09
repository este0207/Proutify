<script>
    import PlayBtn from "./PlayBtn.svelte";
    import YouTubePlayer from "./YouTubePlayer.svelte";
    import { imageUrl, currentTrack } from '$lib/playerStore';
    import { onMount, onDestroy } from 'svelte';
    let volume = 50;
    let debounceTimeout;
    let ytPlayerRef;
    let ytPlaylist = [];
    let ytIndex = 0;
    let ytReady = false;
    let ytIsPlaying = false;

    // Fonction pour régler le volume sur le device Spotify
    async function setSpotifyVolume(vol) {
        if (typeof window === 'undefined') return; // Ne rien faire côté serveur
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;
        try {
            await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${vol}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    // Debounce l'appel à l'API Spotify
    $: if ($currentTrack?.source !== 'youtube') {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            setSpotifyVolume(volume);
        }, 200);
    }

    // Gestion de la playlist YouTube
    $: if ($currentTrack?.source === 'youtube') {
        // On crée la playlist à partir de la dernière liste de suggestions YouTube
        if ($currentTrack.video && $currentTrack.video._playlist) {
            ytPlaylist = $currentTrack.video._playlist;
            ytIndex = $currentTrack.video._playlistIndex;
        } else {
            ytPlaylist = [$currentTrack.video.id];
            ytIndex = 0;
        }
    }

    function handlePlayPause() {
        if ($currentTrack?.source === 'youtube') {
            if (ytIsPlaying) {
                ytPlayerRef.pause();
                ytIsPlaying = false;
            } else {
                ytPlayerRef.play();
                ytIsPlaying = true;
            }
        }
    }
    function handleNext() {
        if ($currentTrack?.source === 'youtube') {
            ytPlayerRef.next();
        }
    }
    function handlePrev() {
        if ($currentTrack?.source === 'youtube') {
            ytPlayerRef.prev();
        }
    }
    function handleVolume(e) {
        volume = +e.target.value;
        if ($currentTrack?.source === 'youtube') {
            ytPlayerRef.setVolumeLevel(volume);
        }
    }
    function onYtChangeIndex(e) {
        ytIndex = e.detail.index;
        // Met à jour currentTrack pour rafraîchir l'affichage
        if ($currentTrack?.source === 'youtube' && ytPlaylist.length > ytIndex) {
            const videoId = ytPlaylist[ytIndex];
            // On ne connaît que l'id, il faut retrouver les infos de la vidéo
            // On va supposer que la playlist initiale (dans $currentTrack.video._playlist) correspond à la liste des suggestions
            // et que $currentTrack.video._playlistData contient les objets vidéo complets (à ajouter dans SearchBar)
            let videoData = null;
            if ($currentTrack.video._playlistData && $currentTrack.video._playlistData[ytIndex]) {
                videoData = $currentTrack.video._playlistData[ytIndex];
            } else {
                // fallback minimal
                videoData = { id: videoId, title: 'Vidéo YouTube', thumbnail: '', author: '' };
            }
            currentTrack.set({
                source: 'youtube',
                video: { ...videoData, _playlist: ytPlaylist, _playlistIndex: ytIndex, _playlistData: $currentTrack.video._playlistData }
            });
        }
    }
    function onYtEnded() {
        if (ytIndex < ytPlaylist.length - 1) {
            ytPlayerRef.next();
        }
    }
</script>

<div class="barContainer">
    {#if $currentTrack?.source === 'youtube'}
        <div class="musicProfil">
            <img src={$currentTrack.video.thumbnail} alt="Miniature YouTube">
            <p>{$currentTrack.video.title}</p>
        </div>
        <div class="playBtn">
            <button aria-label="Musique Précédente" on:click={handlePrev}><i class="fa-solid fa-backward"></i></button>
            <button aria-label="Play musique" on:click={handlePlayPause}>
                <i class={ytIsPlaying ? "fa-solid fa-pause play" : "fa-solid fa-play play"}></i>
            </button>
            <button aria-label="Musique suivante" on:click={handleNext}><i class="fa-solid fa-forward"></i></button>
        </div>
        <div class="volumeBtn">
            <input type="range" min="0" max="100" bind:value={volume} on:input={handleVolume} />
        </div>
        <YouTubePlayer
            bind:this={ytPlayerRef}
            playlist={ytPlaylist}
            currentIndex={ytIndex}
            {volume}
            on:changeIndex={onYtChangeIndex}
            on:ended={onYtEnded}
        />
    {:else}
        <div class="musicProfil">
            <img src={$imageUrl} alt="Music Profile">
            <p>{($currentTrack && $currentTrack.track && $currentTrack.track.name) ? $currentTrack.track.name : ''}</p>
        </div>
        <div class="playBtn">
            <PlayBtn></PlayBtn>
        </div>
        <div class="volumeBtn">
            <input type="range" min="0" max="100" bind:value={volume} />
        </div>
    {/if}
</div>

<style>

    *{
        color: aliceblue;
    }
    .barContainer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 60px;
        background-color: black;
        z-index: 1000;
        margin: 10px 5px;
        padding: 10px 0;
        border-radius: 20px;
    }

    div{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .musicProfil{
        display: flex;
        /* background-color: aqua; */
        padding-left: 20px;
        color: white;
        gap: 20px;
    }

    img{
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 10px;
    }

    .playBtn {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
    }
    .playBtn button {
        width: 50px;
        height: 40px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #181818 0%, #2196f3 100%);
        color: #fff;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
        box-shadow: 0 2px 8px rgba(33,150,243,0.10);
        outline: none;
        cursor: pointer;
    }
    .playBtn button:hover {
        background: linear-gradient(135deg, #2196f3 0%, #181818 100%);
        color: #fff;
        transform: scale(1.08);
        box-shadow: 0 4px 16px rgba(33,150,243,0.18);
    }
    .playBtn button:active, .playBtn button.active {
        background: #1ed760;
        color: #181818;
        transform: scale(0.98);
    }
    .playBtn i.play {
        font-size: 1.5rem;
        transition: color 0.2s;
    }
    .volumeBtn {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .volumeBtn input[type="range"] {
        width: 150px;
        accent-color: #2196f3;
    }

</style>