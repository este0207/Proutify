
<script>
    import UserPicture from "./UserPicture.svelte";
    import SearchBar from "./SearchBar.svelte";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    let theme = 'light';
    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    onMount(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            theme = saved;
            document.documentElement.setAttribute('data-theme', theme);
        }
    });

    function handleClick() {
        goto('/likes');
    }

    function returnHome() {
        goto('/');
    }
</script>

<div class="header">
    <button class="LogoBtn" on:click={returnHome} aria-label="Accueil">
        <h1 class="Logo">Sonora</h1>
    </button>
    <div class="searchbar-center">
        <SearchBar />
    </div>
    <div class="profil">
        <button on:click={() => handleClick()} class="likeBtn" aria-label="Voir les likes">
            <i class="fa-solid fa-book"></i>
        </button>
        <UserPicture></UserPicture>
        <button class="themeSwitch" aria-label="Changer de thème" on:click={toggleTheme}>
            <span class="themeSwitch__icon" aria-hidden="true">{theme === 'light' ? '🌞' : '🌙'}</span>
        </button>
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

    .Logo {
        font-family: 'Inter', 'SF Pro Display', 'Roboto', Arial, sans-serif;
        font-weight: 800;
        font-size: 2.1rem;
        letter-spacing: 0.04em;
        color: var(--color-primary);
        text-shadow: 0 2px 12px var(--color-primary-light), 0 1px 0 #fff2;
        margin: 0;
        padding: 0 8px;
        transition: color var(--transition), text-shadow var(--transition), transform var(--transition);
        user-select: none;
    }
    .LogoBtn {
        background: none;
        border: none;
        padding: 0;
        margin: 10px;
        border-radius: 18px;
        width: auto;
        background-color: transparent;
        cursor: pointer;
        box-shadow: none;
        transition: background var(--transition), transform var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .LogoBtn:hover .Logo {
        color: var(--color-primary);
        text-shadow: 0 4px 24px var(--color-primary-light), 0 2px 8px #fff4;
        transform: scale(1.06) rotate(-2deg);
    }
    @media (max-width: 700px) {
        .Logo {
            font-size: 1.3rem;
            padding: 0 2px;
        }
        .LogoBtn {
            margin: 4px;
        }
    }

    .LogoBtn:hover{
        transform: scale(1.1);
    }

    .likeBtn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
        border: none;
        box-shadow: 0 2px 8px var(--color-shadow);
        cursor: pointer;
        transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
        position: relative;
        outline: none;
    }
    .likeBtn:hover {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        transform: translateY(-2px) scale(1.08);
        box-shadow: 0 4px 16px var(--color-shadow);
    }
    .likeBtn:active {
        transform: scale(0.96);
        box-shadow: 0 1px 2px var(--color-shadow);
    }
    .likeBtn i {
        color: #fff;
        font-size: 1.4rem;
        transition: transform 0.2s, color 0.2s;
        text-shadow: 0 1px 4px #000a;
    }
    .likeBtn:hover i {
        animation: pulse 0.5s;
        color: var(--color-primary);
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.25); }
        100% { transform: scale(1); }
    }
    
    .themeSwitch {
        margin-left: 10px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
        box-shadow: 0 2px 8px var(--color-shadow);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
        font-size: 1.2rem;
        color: #fff;
        outline: none;
    }
    .themeSwitch:hover {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        box-shadow: 0 4px 16px var(--color-shadow);
        transform: scale(1.08);
    }
    .themeSwitch__icon {
        font-size: 1.25rem;
        pointer-events: none;
        user-select: none;
    }
    
@media (max-width: 700px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    width: 100vw;
    padding: 0 2vw;
    gap: 8px;
    min-width: 0;
  }
  .Logo {
    font-size: 1.1rem;
    padding: 0 1px;
    text-align: center;
    width: 100%;
  }
  .LogoBtn {
    margin: 2px auto;
    width: 100%;
    justify-content: center;
  }
  .searchbar-center {
    width: 100%;
    min-width: 0;
    justify-content: center;
    margin: 0 auto;
    padding: 0;
  }
  .profil {
    gap: 4px;
    justify-content: center;
    width: 100%;
    margin-bottom: 4px;
  }
  .themeSwitch, .likeBtn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
}
    
</style>