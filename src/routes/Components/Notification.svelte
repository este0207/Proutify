<script>
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
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

<div class="notification {type} {visible ? 'show' : ''}" transition:fade={{ duration: 350 }}>
  {message}
</div>

<style>
.notification {
    position: fixed;
    top: 32px;
    right: 32px;
    left: auto;
    min-width: 220px;
    max-width: 320px;
    padding: 18px 28px;
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px var(--color-shadow);
    border: 1px solid var(--color-border);
    font-size: 1.08rem;
    font-family: var(--font-main);
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 14px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(120%) scale(0.98);
    transition: opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1);
}
.notification.show {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0) scale(1);
    animation: fadeInRight 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(60%) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.notification.success {
    border-left: 6px solid var(--color-primary);
}
.notification.error {
    border-left: 6px solid #e74c3c;
}
.notification i {
    font-size: 1.3rem;
    margin-right: 8px;
}
@media (max-width: 600px) {
    .notification {
        top: 10px;
        right: 10px;
        min-width: 120px;
        max-width: 90vw;
        padding: 10px 12px;
        font-size: 0.98rem;
    }
}
</style> 