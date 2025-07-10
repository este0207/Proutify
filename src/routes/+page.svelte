
<script>
    import Header from "./Components/Header.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // Ajout pour la redirection
    import MusicProfile from "./Components/MusicProfile.svelte";
    let isLoggedIn = false;
    let playlists = [];
    let featured = [];
    let newReleases = [];
    let loading = true;
    let error = '';
    let selectedTrack = null;
    let audiobooks = [];


    async function fetchAudiobooks(query = 'roman') {
        let token = localStorage.getItem('spotify_access_token');
        let res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=audiobook&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        let data = await res.json();
        audiobooks = data.audiobooks && data.audiobooks.items ? data.audiobooks.items : [];
    }

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
                console.log('Réponse featured:', data1);
                featured = data1.playlists ? data1.playlists.items : [];

                // Nouveautés (albums)
                let res2 = await fetch('https://api.spotify.com/v1/browse/new-releases?country=FR&limit=10', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let data2 = await res2.json();
                console.log('Réponse new releases:', data2);
                newReleases = data2.albums ? data2.albums.items : [];
                console.log('Albums:', data2.albums.items);

                // Récupérer toutes les catégories
                let resCat = await fetch('https://api.spotify.com/v1/browse/categories?country=FR&limit=50', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let dataCat = await resCat.json();
                console.log('Réponse catégories:', dataCat);
                console.log('Catégories:', dataCat.categories.items);

                // Chercher la catégorie "toplists"
                let toplistCat = dataCat.categories.items.find(
                    cat => cat.id === "toplists" || cat.name.toLowerCase().includes("top")
                );
                if (toplistCat) {
                    let res3 = await fetch(`https://api.spotify.com/v1/browse/categories/${toplistCat.id}/playlists?country=FR&limit=10`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {

                }

                await fetchAudiobooks('roman');
            } catch (e) {
                error = 'Erreur lors de la récupération des livres audio Spotify : ' + e.message;
            }
            loading = false;
        }
    });

    function handleLogin() {
        goto('/login');
    }

    function closeProfile() {
        selectedTrack = null;
    }
    async function openMusicProfileFromAlbum(album) {
        let token = localStorage.getItem('spotify_access_token');
        let res = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        let data = await res.json();
        if (data.items && data.items.length > 0) {
            selectedTrack = {
                ...data.items[0],
                album: album 
            };
        }
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
            <div style="text-align:center;margin-top:60px;">Chargement des playlists Proutify...</div>
        {:else if error}
            <div style="color:red;text-align:center;">{error}</div>
        {:else}
            <section class="spotify-section">
                <h2>Livres audio à découvrir</h2>
                {#if audiobooks.length > 0}
                    <div class="horizontal-scroll">
                        {#each audiobooks as audiobook}
                            <div class="playlist-card">
                                <img src={audiobook.images[0]?.url} alt={audiobook.name} />
                                <span style="margin-top:10px;font-size:1.2rem;font-weight:700;">{audiobook.name}</span>
                                <!-- <p style="margin:10px 0;color:#b3b3b3;font-size:0.95rem;">{audiobook.description}</p> -->
                                <a href={audiobook.external_urls.spotify} target="_blank" rel="noopener" class="btn-primary" style="margin-top:10px;">Écouter sur Spotify</a>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div>Aucun livre audio disponible.</div>
                {/if}
            </section>
            <section class="spotify-section">
                <h2>Nouveautés</h2>
                <div class="horizontal-scroll">
                    {#each newReleases as album}
                        <button
                            class="playlist-card"
                            type="button"
                            on:click={() => openMusicProfileFromAlbum(album)}
                            aria-label="Ouvrir le profil de l’album {album.name}"
                        >
                            <img src={album.images[0].url} alt={album.name} />
                            <span>{album.name}</span>
                        </button>
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
    background: var(--color-bg-secondary);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 36px 28px 28px 28px;
    margin: 32px auto 24px auto;
    max-width: 700px;
    text-align: center;
    transition: background var(--transition), box-shadow var(--transition);
}
.hero h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 10px;
    letter-spacing: 0.03em;
    text-shadow: 0 2px 12px var(--color-primary-light), 0 1px 0 #fff2;
}
.hero p {
    color: var(--color-text-secondary);
    font-size: 1.15rem;
    margin-bottom: 22px;
}
.actions {
    margin-top: 18px;
}
.btn-primary {
    padding: 12px 32px;
    border-radius: 24px;
    border: none;
    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
    color: #fff;
    font-size: 1.12rem;
    font-weight: 600;
    box-shadow: 0 2px 8px var(--color-shadow);
    cursor: pointer;
    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
}
.btn-primary:hover {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    box-shadow: 0 4px 16px var(--color-shadow);
    transform: scale(1.06);
}
.featured {
    background: var(--color-bg-secondary);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 28px 18px 24px 18px;
    margin: 0 auto 32px auto;
    max-width: 900px;
    transition: background var(--transition), box-shadow var(--transition);
}
.featured h2 {
    color: var(--color-primary);
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 18px;
    letter-spacing: 0.02em;
}
.playlists {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
}
.playlist-card {
    background: var(--color-bg);
    border-radius: 18px;
    box-shadow: 0 2px 12px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 18px 12px 10px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 150px;
    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
    cursor: pointer;
}
.playlist-card img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    margin-bottom: 10px;
    box-shadow: 0 1px 8px var(--color-shadow);
    border: 1px solid var(--color-border);
    background: #fff;
}
.playlist-card span {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.08rem;
    text-align: center;
}
.playlist-card:hover {
    background: var(--color-primary-light);
    box-shadow: 0 6px 24px var(--color-shadow);
    transform: translateY(-4px) scale(1.04);
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
    scrollbar-color: #2196f3 #222;
}
.horizontal-scroll::-webkit-scrollbar {
    height: 8px;
}
.horizontal-scroll::-webkit-scrollbar-thumb {
    background: #2196f3;
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
.home-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    background: var(--color-bg-secondary);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 32px 24px;
    margin-top: 32px;
    transition: background var(--transition), box-shadow var(--transition);
}
@media (max-width: 700px) {
    .hero {
        padding: 10px 1vw 8px 1vw;
        margin: 6px auto 6px auto;
    }
    .hero h1 {
        font-size: 1.1rem;
    }
    .hero p {
        font-size: 0.92rem;
    }
    .featured {
        padding: 6px 1vw 4px 1vw;
        margin-bottom: 6px;
    }
    .featured h2 {
        font-size: 1rem;
    }
    .playlists {
        gap: 4px;
    }
    .playlist-card {
        width: 60px;
        padding: 4px 1px 2px 1px;
    }
    .playlist-card img {
        width: 28px;
        height: 28px;
    }
    .playlist-card span {
        font-size: 0.7rem;
    }
    .btn-primary {
        font-size: 0.92rem;
        padding: 7px 10px;
    }
}
</style>

{#if selectedTrack}
    <MusicProfile track={selectedTrack} onClose={closeProfile} />
{/if}
