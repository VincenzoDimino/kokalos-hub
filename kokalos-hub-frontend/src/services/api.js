import axios from 'axios';

// Determina automaticamente l'URL del backend in base a dove si trova il browser
let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  API_BASE_URL = 'http://localhost:8080/api';
} else {
  // Rimuove "-frontend" dal nome del dominio per puntare direttamente al backend su Northflank
  const currentHost = window.location.host;
  const backendHost = currentHost.replace('-frontend', '');
  API_BASE_URL = `https://${backendHost}/api`;
}

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