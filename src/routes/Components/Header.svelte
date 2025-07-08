
<script>
    import UserPicture from "./UserPicture.svelte";
    import { goto } from '$app/navigation';

    function handleClick() {
        goto('/likes');
    }

    function returnHome() {
        goto('/');
    }
</script>

<div class="header">
    <button class="LogoBtn" on:click={returnHome} aria-label="Accueil">
        <img src="/Proutify_logo.png" alt="Logo" class="Logo" />
    </button>
    <div class="profil">
        <button on:click={() => handleClick()} class="likeBtn" aria-label="Voir les likes">
            <i class="fa-solid fa-heart"></i>
        </button>
       <UserPicture></UserPicture>
    </div>
</div>

<style>

    .Logo{
        width: 100%;
    }

    .profil{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .header{
        display: flex;
        width: 98%;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        backdrop-filter: blur(3px);
    }

    .LogoBtn {
      background: none;
      border: none;
      padding: 0;
      width: 7%;
      cursor: pointer;
    }

    .likeBtn{
        background-color: none;
    }
    
</style>