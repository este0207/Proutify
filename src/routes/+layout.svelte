<script>
    import "../app.css"
    import PlayBar from "./Components/PlayBar.svelte";
    import Notification from './Components/Notification.svelte';
    import { notification } from '../lib/notificationStore.js';
    import { onDestroy } from 'svelte';
    let notif = {};
    const unsubscribe = notification.subscribe(value => notif = value);
    onDestroy(unsubscribe);
</script>

<style>
.main-layout {
    min-height: 100vh;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-main);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 90px; /* Pour laisser la place au PlayBar */
    transition: background var(--transition), color var(--transition);
}
@media (max-width: 700px) {
    .main-layout {
        padding-bottom: 120px;
    }
}
</style>


<div class="container">
    <slot/>
    <PlayBar></PlayBar>
    <Notification message={notif.message} type={notif.type} visible={notif.visible} duration={notif.duration} />
</div>
