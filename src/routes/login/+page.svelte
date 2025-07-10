<script>
  import SpotifyAuth from '../Components/SpotifyAuth.svelte';
</script>

<div class="login-container">
  <div class="login-logo">
    <i class="fa-solid fa-music"></i>
  </div>
  <h1 class="login-title">Connexion</h1>
  <p class="login-subtitle">
    Connecte-toi avec Spotify pour profiter de toutes les fonctionnalités de Proutify.
  </p>
  <hr class="login-separator" />
  <div class="auth-box">
    <SpotifyAuth />
  </div>
  <p class="login-privacy">
    Proutify ne publie rien sur votre compte Spotify.
  </p>
</div>

<style>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    background: var(--color-bg-secondary);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    padding: 32px 24px;
    margin: 32px auto 0 auto;
    max-width: 420px;
    width: 100%;
    transition: background var(--transition), box-shadow var(--transition);
}
.login-title {
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 18px;
    letter-spacing: 0.01em;
    text-align: center;
}
.login-logo {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 10px;
  text-align: center;
  animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
}
.login-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  text-align: center;
  margin-bottom: 18px;
  animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1);
}
.login-separator {
  border: none;
  border-top: 1.5px solid var(--color-border);
  margin: 18px 0;
  width: 60%;
  animation: fadeIn 0.9s cubic-bezier(.4,0,.2,1);
}
.login-privacy {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  text-align: center;
  margin-top: 18px;
  animation: fadeIn 1s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 600px) {
    .login-container {
        padding: 18px 6vw;
        margin-top: 18px;
    }
    .login-title {
        font-size: 1.08rem;
    }
}
</style>
