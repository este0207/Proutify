
<script>
    import Header from "./Components/Header.svelte";
</script>

<Header />
<div class="mainPage">
    <section class="hero">
        <h1>Bienvenue sur Proutify</h1>
        <p>Écoutez, découvrez et partagez la musique que vous aimez.</p>
        <div class="actions">
            <button class="btn-primary">Se connecter</button>
            <button class="btn-secondary">S'inscrire</button>
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
.btn-secondary {
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
}
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
</style>
