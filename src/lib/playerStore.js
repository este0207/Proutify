import { writable } from 'svelte/store';
export const imageUrl = writable(''); 
// Nouveau store pour le morceau courant
export const currentTrack = writable(null);
// Nouveau store pour l'état de lecture
export const isPlaying = writable(false); 