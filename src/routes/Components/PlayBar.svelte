<script>
    import PlayBtn from "./PlayBtn.svelte";
    import { imageUrl, currentTrack } from '$lib/playerStore';
    let volume = 50;
    
    $: volumeIcon = volume == 0
        ? 'fa-volume-xmark'
        : volume < 40
            ? 'fa-volume-low'
            : volume < 80
                ? 'fa-volume'
                : 'fa-volume-high';

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

    // Appel à chaque changement de volume
    $: setSpotifyVolume(volume);
</script>

<div class="barContainer">
    <div class="musicProfil">
        <img src={$imageUrl} alt="Music Profile">
        <p>{($currentTrack && $currentTrack.track && $currentTrack.track.name) ? $currentTrack.track.name : ''}</p>
    </div>
    <div class="playBtn">
        <PlayBtn></PlayBtn>
    </div>
    <div class="volumeBtn">
        <button aria-label="Régler le volume">
            <i class={`fa-solid ${volumeIcon}`}></i>
        </button>
        <input type="range" min="0" max="100" bind:value={volume} />
    </div>
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
        left: 0;
        width: 99%;
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

    .fa-solid{
        background: transparent;
        border: none;
        color: rgb(0, 0, 0);
    }

    .volumeBtn {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .volumeBtn input[type="range"] {
        width: 80px;
        accent-color: #1db954;
    }

</style>