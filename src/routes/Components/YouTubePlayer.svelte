<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  export let playlist = [];
  export let currentIndex = 0;
  export let volume = 50;
  const dispatch = createEventDispatcher();
  let player;
  let playerReady = false;
  let playerId = 'yt-player-' + Math.random().toString(36).substr(2, 9);

  function loadYouTubeAPI() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
      }
    });
  }

  function createPlayer() {
    player = new window.YT.Player(playerId, {
      height: '0',
      width: '0',
      videoId: playlist[currentIndex],
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        iv_load_policy: 3
      },
      events: {
        onReady: (event) => {
          playerReady = true;
          event.target.setVolume(volume);
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            dispatch('ended');
          }
        }
      }
    });
  }

  onMount(async () => {
    await loadYouTubeAPI();
    createPlayer();
  });

  onDestroy(() => {
    if (player && player.destroy) player.destroy();
  });

  $: if (playerReady && player && playlist[currentIndex] !== player.getVideoData().video_id) {
    player.loadVideoById(playlist[currentIndex]);
  }
  $: if (playerReady && player) {
    player.setVolume(volume);
  }

  // Méthodes de contrôle
  export function play() {
    if (playerReady && player) player.playVideo();
  }
  export function pause() {
    if (playerReady && player) player.pauseVideo();
  }
  export function next() {
    if (currentIndex < playlist.length - 1) {
      dispatch('changeIndex', { index: currentIndex + 1 });
    }
  }
  export function prev() {
    if (currentIndex > 0) {
      dispatch('changeIndex', { index: currentIndex - 1 });
    }
  }
  export function setVolumeLevel(vol) {
    if (playerReady && player) player.setVolume(vol);
  }
</script>

<!-- Le player est caché (audio only) -->
<div style="width:0;height:0;overflow:hidden;">
  <div id={playerId}></div>
</div> 