import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'https://streamify-weld-iota.vercel.app//api',
  withCredentials : true, //Include cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});