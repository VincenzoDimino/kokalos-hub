import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  // Le API amministrative devono usare sempre il JWT admin, anche se nel browser
  // è rimasta aperta una sessione visitatore contemporanea.
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
