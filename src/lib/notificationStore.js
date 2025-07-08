import { writable } from 'svelte/store';

export const notification = writable({
  message: '',
  type: 'info',
  visible: false,
  duration: 3000
});

export function showNotification(message, type = 'info', duration = 3000) {
  notification.set({ message, type, visible: true, duration });
} 