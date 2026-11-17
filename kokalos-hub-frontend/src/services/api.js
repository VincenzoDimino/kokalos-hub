import axios from 'axios';

// Legge l'URL dalla variabile d'ambiente di Vite se disponibile, altrimenti usa localhost
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  
  const isAdminRequest = config.url?.startsWith('/admin/');
  const token = isAdminRequest
    ? (localStorage.getItem('kokalos_jwt') || localStorage.getItem('kokalos_user_jwt'))
    : (localStorage.getItem('kokalos_user_jwt') || localStorage.getItem('kokalos_jwt'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;