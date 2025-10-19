import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://streamify-chat-video-call-app.vercel.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});