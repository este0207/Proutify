<script>
    import PlayBtn from "./PlayBtn.svelte";
    import YouTubePlayer from "./YouTubePlayer.svelte";
    import { imageUrl, currentTrack } from '$lib/playerStore';
    import { onMount, onDestroy } from 'svelte';
    import { showNotification } from '../../lib/notificationStore.js';
    let volume = 50;
    let debounceTimeout;
    let ytPlayerRef;
    let ytPlaylist = [];
    let ytIndex = 0;
    let ytReady = false;
    let ytIsPlaying = false;

    // --- Ajout pour la barre de progression ---
    let progress = 0; // en secondes
    let duration = 0; // en secondes
    let seeking = false;
    let seekValue = 0;
    let progressInterval;

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

    // Pour YouTube
    function updateYtProgress() {
        if ($currentTrack?.source === 'youtube' && ytPlayerRef && ytPlayerRef.player) {
            try {
                progress = ytPlayerRef.player.getCurrentTime();
                duration = ytPlayerRef.player.getDuration();
            } catch {}
        }
    }

    // Pour Spotify
    async function updateSpotifyProgress() {
        if ($currentTrack?.source === 'spotify' && window.Spotify && window.Spotify.Player) {
            const deviceId = localStorage.getItem('spotify_device_id');
            const token = localStorage.getItem('spotify_access_token');
            if (!token || !deviceId) return;
            const res = await fetch('https://api.spotify.com/v1/me/player', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data && data.progress_ms != null && data.item && data.item.duration_ms) {
                progress = data.progress_ms / 1000;
                duration = data.item.duration_ms / 1000;
            }
        }
    }

    function formatTime(sec) {
        if (!sec || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Mise à jour régulière
    onMount(() => {
        progressInterval = setInterval(() => {
            if ($currentTrack?.source === 'youtube') updateYtProgress();
            else if ($currentTrack?.source === 'spotify') updateSpotifyProgress();
        }, 800);
    });
    onDestroy(() => { clearInterval(progressInterval); });

    // Seek YouTube
    function handleSeekYt(e) {
        const val = +e.target.value;
        ytPlayerRef.player.seekTo(val, true);
        seeking = false;
    }
    // Seek Spotify
    async function handleSeekSpotify(e) {
        const val = +e.target.value;
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;
        await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${val * 1000}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        seeking = false;
    }

    // Ajout d'une fonction pour liker la musique Spotify en cours
    async function likeCurrentTrack() {
        if ($currentTrack?.source !== 'spotify' || !$currentTrack.track?.id) {
            showNotification('Impossible d\'ajouter ce morceau aux likes.', 'error');
            return;
        }
        const token = typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null;
        if (!token) {
            showNotification('Non connecté à Spotify.', 'error');
            return;
        }
        try {
            await fetch(`https://api.spotify.com/v1/me/tracks?ids=${$currentTrack.track.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            showNotification('Ajouté à vos likes !', 'success');
        } catch (e) {
            showNotification('Erreur lors de l\'ajout aux likes.', 'error');
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
        <div class="likeBtnBar">
            <button aria-label="Ajouter aux likes" on:click={likeCurrentTrack}>
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
    {/if}
</div>

<style>
    .barContainer {
        display: grid;
        grid-template-columns: 1.2fr 2fr 1.2fr 0.7fr;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        min-width: 320px;
        max-width: 900px;
        height: 70px;
        background: var(--color-bg-secondary);
        z-index: 1000;
        margin: 12px 0;
        padding: 0 0;
        border-radius: var(--radius);
        box-shadow: 0 4px 24px var(--color-shadow);
        border: 1px solid var(--color-border);
        transition: background var(--transition), box-shadow var(--transition);
    }
    .musicProfil {
        display: flex;
        align-items: center;
        gap: 18px;
        padding-left: 18px;
        color: var(--color-text);
    }
    .musicProfil img {
        width: 54px;
        height: 54px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 2px 8px var(--color-shadow);
        border: 1px solid var(--color-border);
        background: #fff;
    }
    .musicProfil p {
        font-size: 1.08rem;
        font-weight: 500;
        color: var(--color-text);
        margin: 0;
        letter-spacing: 0.01em;
    }
    .playBtn {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;
    }
    .playBtn button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
        color: #fff;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
        box-shadow: 0 2px 8px var(--color-shadow);
        outline: none;
        cursor: pointer;
    }
    .playBtn button:hover {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        color: #fff;
        transform: scale(1.10);
        box-shadow: 0 6px 18px var(--color-shadow);
    }
    .playBtn button:active, .playBtn button.active {
        background: var(--color-primary);
        color: #fff;
        transform: scale(0.97);
    }
    .playBtn i.play {
        font-size: 1.5rem;
        transition: color var(--transition);
    }
    .volumeBtn {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .volumeBtn input[type="range"] {
        width: 120px;
        accent-color: var(--color-primary);
        background: transparent;
    }
    .likeBtnBar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
    }
    .likeBtnBar button {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
        border: none;
        box-shadow: 0 2px 8px var(--color-shadow);
        cursor: pointer;
        transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .likeBtnBar button:hover {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        transform: translateY(-2px) scale(1.10);
        box-shadow: 0 6px 18px var(--color-shadow);
    }
    .likeBtnBar i {
        color: #fff;
        font-size: 1.25rem;
        transition: transform var(--transition), color var(--transition);
        text-shadow: 0 1px 4px #0002;
    }
    .likeBtnBar button:hover i {
        animation: pulse 0.5s;
        color: var(--color-primary);
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.18); }
        100% { transform: scale(1); }
    }
    @media (max-width: 700px) {
        .barContainer {
            width: 98vw;
            min-width: 0;
            max-width: 100vw;
            padding: 0 2vw;
            height: 54px;
        }
        .musicProfil img {
            width: 32px;
            height: 32px;
        }
        .musicProfil p {
            font-size: 0.85rem;
        }
        .playBtn button {
            width: 28px;
            height: 28px;
            font-size: 0.95rem;
        }
        .likeBtnBar button {
            width: 22px;
            height: 22px;
        }
        .volumeBtn input[type="range"] {
            width: 48px;
        }
    }
</style>