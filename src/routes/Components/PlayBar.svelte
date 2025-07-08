<script>
    import PlayBtn from "./PlayBtn.svelte";
    import { imageUrl } from '$lib/playerStore';
</script>

<div class="barContainer">
    <div class="musicProfil">
        <img src={$imageUrl} alt="Music Profile">
    </div>
    <div class="playBtn">
        <PlayBtn></PlayBtn>
    </div>
    <div class="volumeBtn">
        <button aria-label="Régler le volume"><i class="fa-solid fa-volume-low"></i></button>
        <!-- <input type="range" min="0" max="100" value="50" /> -->
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
        width: 60px;
        padding-left: 20px;
    }

    img{
        width: 100%;
        border-radius: 10px;
    }

</style>