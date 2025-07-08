<script>
    import { onMount } from 'svelte';
    import { imageUrl, currentTrack, isPlaying } from '$lib/playerStore';
    let player;
    let deviceId = 'bfac007cd4e2302208886926fa5e04b43aaa079';
    let isReady = false;
    let track = null;
    let isPaused = true;

    function loadSpotifySDK() {
        return new Promise((resolve) => {
            if (window.Spotify) {
                resolve();
            } else {
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.onload = resolve;
                document.body.appendChild(script);
            }
        });
    }

    onMount(async () => {
        await loadSpotifySDK();
        window.onSpotifyWebPlaybackSDKReady = () => {
            let token;
            if (typeof window !== 'undefined') {
                token = localStorage.getItem('spotify_access_token');
            }
            player = new window.Spotify.Player({
                name: 'Proutify Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                deviceId = device_id;
                localStorage.setItem('spotify_device_id', device_id);
                isReady = true;
            });
            player.addListener('player_state_changed', state => {
                if (!state) return;
                track = state.track_window.current_track;
                isPaused = state.paused;
                // Met à jour le store avec l'image de l'album
                imageUrl.set(track && track.album && track.album.images.length > 0 ? track.album.images[0].url : '');
            });
            player.connect();
        };
    });

    let currentTrackValue = null;
    let isPlayingValue = false;

    $currentTrack = null;
    $isPlaying = false;

    const unsubscribeTrack = currentTrack.subscribe(value => {
        currentTrackValue = value;
    });
    const unsubscribePlaying = isPlaying.subscribe(value => {
        isPlayingValue = value;
    });

    $: if (currentTrackValue && isPlayingValue && isReady) {
        // On lance la lecture du morceau sélectionné
        play(currentTrackValue.track.uri);
    }

    function play(uri = null) {
        const body = uri ? { uris: [uri] } : {};
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : ''),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        isPaused = false;
    }
    function pause() {
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : ''),
                'Content-Type': 'application/json',
            }
        });
        isPaused = true;
    }

    function handlePlayPause() {
        if (isPaused) {
            play();
        } else {
            pause();
        }
    }

    function updateCurrentTrack() {
        if (player) {
            player.getCurrentState().then(state => {
                if (!state) return;
                track = state.track_window.current_track;
                isPaused = state.paused;
                imageUrl.set(track && track.album && track.album.images.length > 0 ? track.album.images[0].url : '');
            });
        }
    }

    function nextTrack() {
        fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : ''),
                'Content-Type': 'application/json',
            }
        }).then(() => {
            setTimeout(updateCurrentTrack, 500);
        });
    }

    function previousTrack() {
        fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : ''),
                'Content-Type': 'application/json',
            }
        }).then(() => {
            setTimeout(updateCurrentTrack, 500);
        });
    }
</script>


<div class="PlayBtnContainer">
    <button aria-label="Musique Précedente" on:click={previousTrack}><i class="fa-solid fa-backward"></i></button>
    <button aria-label="Play musique" on:click={handlePlayPause}>
        <i class={isPaused ? "fa-solid fa-play play" : "fa-solid fa-pause play"}></i>
    </button>
    <button aria-label="Musique suivante" on:click={nextTrack}><i class="fa-solid fa-forward"></i></button>
</div>

<style>

    .PlayBtnContainer{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    button{
        width: 50px;
        height: 40px;
        border-radius: 10px;
        border: none;
    }

    button:hover{
        cursor: pointer;
    }
</style>