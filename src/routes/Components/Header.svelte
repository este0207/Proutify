
<script>
    import UserPicture from "./UserPicture.svelte";
    import SearchBar from "./SearchBar.svelte";
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
    <div class="searchbar-center">
        <SearchBar />
    </div>
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
    .searchbar-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .LogoBtn {
      background: none;
      border: none;
      padding: 0;
      width: 7%;
      cursor: pointer;
    }

    .likeBtn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1db954 0%, #111 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(30,185,84,0.15);
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
        position: relative;
    }
    .likeBtn:hover {
        background: linear-gradient(135deg, #111 0%, #1db954 100%);
        transform: translateY(-2px) scale(1.08);
        box-shadow: 0 4px 16px rgba(30,185,84,0.25);
    }
    .likeBtn i {
        color: #1db954;
        font-size: 1.4rem;
        transition: transform 0.2s, color 0.2s;
        text-shadow: 0 1px 4px #000a;
    }
    .likeBtn:hover i {
        animation: pulse 0.5s;
        color: #fff;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.25); }
        100% { transform: scale(1); }
    }
    
</style>