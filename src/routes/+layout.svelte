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


<div class="container">
    <slot/>
    <PlayBar></PlayBar>
    <Notification message={notif.message} type={notif.type} visible={notif.visible} duration={notif.duration} />
</div>
