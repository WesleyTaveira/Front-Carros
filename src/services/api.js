import axios from 'axios';

const apiUrl = import.meta.env.API_URL || 'http://localhost:3333'

export const api  = axios.create({
    baseURL: apiUrl,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default api;