<script>
  import { onDestroy } from 'svelte';
  export let message = '';
  export let type = 'info'; // 'info', 'success', 'error'
  export let visible = false;
  export let duration = 3000;
  let timeout;

  $: if (visible && message) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      visible = false;
    }, duration);
  }

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<div class="notification {type} {visible ? 'show' : ''}">
  {message}
</div>

<style>
.notification {
  position: fixed;
  top: 32px;
  right: 32px;
  min-width: 240px;
  max-width: 350px;
  background: #222;
  color: #fff;
  padding: 18px 28px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  opacity: 0;
  transform: translateX(120%);
  transition: opacity 0.3s, transform 0.4s;
  z-index: 3000;
  pointer-events: none;
}
.notification.show {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
.notification.success {
  background: #2196f3;
  color: #fff;
}
.notification.error {
  background: #ff4d4d;
  color: #fff;
}
</style> 