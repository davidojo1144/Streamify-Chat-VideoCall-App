import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials : true, //Include cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});