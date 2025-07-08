<script>
  import SpotifyAuth from '../Components/SpotifyAuth.svelte';
</script>

<div class="login-container">
  <h1>Connexion</h1>
  <div class="auth-box">
    <SpotifyAuth />
  </div>
</div>

<style>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1db954 0%, #191414 100%);
}

h1 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.auth-box {
  background: rgba(25, 20, 20, 0.85);
  padding: 2rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-box :global(button),
.auth-box :global(a) {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  background: #1db954;
  color: #fff;
  font-weight: bold;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  text-decoration: none;
}

.auth-box :global(button):hover,
.auth-box :global(a):hover {
  background: #17a74a;
}
</style>
