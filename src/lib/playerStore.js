import { writable } from 'svelte/store';

// currentTrack peut être :
// { source: 'spotify', track: { ...objet Spotify... } }
// ou { source: 'youtube', video: { id, title, thumbnail, author } }
export const currentTrack = writable(null);

export const imageUrl = writable(''); 
export const isPlaying = writable(false); 