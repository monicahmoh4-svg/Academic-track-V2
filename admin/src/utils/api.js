import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// NOTE: No 401 redirect interceptor here — that was silently eating login errors.
// Each page handles auth failures individually.
api.interceptors.response.use(
  r => r,
  err => Promise.reject(err)
);

export default api;
