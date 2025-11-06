import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ['ws'],
  authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

export default echo;
