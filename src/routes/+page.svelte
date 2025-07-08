
<script>
    import Header from "./Components/Header.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // Ajout pour la redirection
    let isLoggedIn = false;
    let playlists = [];
    let featured = [];
    let newReleases = [];
    let topPlaylists = [];
    let loading = true;
    let error = '';

    onMount(async () => {
        let token;
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('spotify_access_token');
        }
        isLoggedIn = !!token;
        if (isLoggedIn) {
            loading = true;
            try {
                // Playlists mises en avant
                let res1 = await fetch('https://api.spotify.com/v1/browse/featured-playlists?country=FR&limit=10', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let data1 = await res1.json();
                featured = data1.playlists ? data1.playlists.items : [];

                // Nouveautés (albums)
                let res2 = await fetch('https://api.spotify.com/v1/browse/new-releases?country=FR&limit=10', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let data2 = await res2.json();
                newReleases = data2.albums ? data2.albums.items : [];

                // Playlists populaires (catégorie top)
                let res3 = await fetch('https://api.spotify.com/v1/browse/categories/toplists/playlists?country=FR&limit=10', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let data3 = await res3.json();
                topPlaylists = data3.playlists ? data3.playlists.items : [];
            } catch (e) {
                error = 'Erreur lors de la récupération des playlists Spotify.';
            }
            loading = false;
        }
    });

    function handleLogin() {
        goto('/login');
    }
</script>

<Header />
<div class="mainPage">
    {#if !isLoggedIn}
        <section class="hero">
            <h1>Bienvenue sur Proutify</h1>
            <p>Écoutez, découvrez et partagez la musique que vous aimez.</p>
            <div class="actions">
                <button class="btn-primary" on:click={handleLogin}>Se connecter</button>
            </div>
        </section>
        <section class="featured">
            <h2>Playlists populaires</h2>
            <div class="playlists">
                <div class="playlist-card">
                    <img src="/Proutify_icon.png" alt="Chill Vibes" />
                    <span>Chill Vibes</span>
                </div>
                <div class="playlist-card">
                    <img src="/Proutify_icon.png" alt="Hits du moment" />
                    <span>Hits du moment</span>
                </div>
                <div class="playlist-card">
                    <img src="/Proutify_icon.png" alt="Découvertes" />
                    <span>Découvertes</span>
                </div>
            </div>
        </section>
    {:else}
        {#if loading}
            <div style="text-align:center;margin-top:60px;">Chargement des playlists Spotify...</div>
        {:else if error}
            <div style="color:red;text-align:center;">{error}</div>
        {:else}
            <section class="spotify-section">
                <h2>Playlists mises en avant</h2>
                <div class="horizontal-scroll">
                    {#each featured as playlist}
                        <div class="playlist-card">
                            <img src={playlist.images[0].url} alt={playlist.name} />
                            <span>{playlist.name}</span>
                        </div>
                    {/each}
                </div>
            </section>
            <section class="spotify-section">
                <h2>Nouveautés</h2>
                <div class="horizontal-scroll">
                    {#each newReleases as album}
                        <div class="playlist-card">
                            <img src={album.images[0].url} alt={album.name} />
                            <span>{album.name}</span>
                        </div>
                    {/each}
                </div>
            </section>
            <section class="spotify-section">
                <h2>Top Playlists</h2>
                <div class="horizontal-scroll">
                    {#each topPlaylists as playlist}
                        <div class="playlist-card">
                            <img src={playlist.images[0].url} alt={playlist.name} />
                            <span>{playlist.name}</span>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    {/if}
</div>

<style>
.mainPage {
    min-height: 100vh;
    color: #fff;
    padding: 0 0 40px 0;
}
.hero {
    text-align: center;
    padding: 60px 20px 40px 20px;
}
.hero h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    font-weight: 800;
}
.hero p {
    font-size: 1.3rem;
    margin-bottom: 30px;
    color: #b3b3b3;
}
.actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}
.btn-primary {
    background: #1db954;
    color: #fff;
    border: none;
    padding: 12px 32px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}
.btn-primary:hover {
    background: #1ed760;
}
/* .btn-secondary {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
    padding: 12px 32px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
    background: #fff;
    color: #181818;
} */
.featured {
    margin-top: 50px;
    padding: 0 20px;
}
.featured h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: 700;
}
.playlists {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}
.playlist-card {
    background: #222;
    border-radius: 18px;
    padding: 20px 18px 12px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}
.playlist-card:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 8px 32px rgba(30,217,96,0.15);
}
.playlist-card img {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    margin-bottom: 12px;
    object-fit: cover;
}
.playlist-card span {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
}
.spotify-section {
    margin-top: 40px;
    padding: 0 20px;
}
.horizontal-scroll {
    display: flex;
    overflow-x: auto;
    gap: 24px;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #1db954 #222;
}
.horizontal-scroll::-webkit-scrollbar {
    height: 8px;
}
.horizontal-scroll::-webkit-scrollbar-thumb {
    background: #1db954;
    border-radius: 4px;
}
.horizontal-scroll::-webkit-scrollbar-track {
    background: #222;
    border-radius: 4px;
}
.playlist-card {
    min-width: 160px;
    max-width: 180px;
}
</style>
