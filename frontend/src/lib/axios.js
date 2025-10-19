import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://streamify-chat-video-call-app.vercel.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});