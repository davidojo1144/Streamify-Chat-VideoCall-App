import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'https://streamify-chat-video-call-app.vercel.app/api',
  withCredentials : true, //Include cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});