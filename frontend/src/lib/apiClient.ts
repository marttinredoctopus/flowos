import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends HttpOnly cookie automatically
});

// Attach access token from Zustand store on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Access token lives in memory (Zustand) — read it dynamically
    try {
      const state = (window as any).__FLOWOS_AUTH_TOKEN__;
      if (state) config.headers.Authorization = `Bearer ${state}`;
    } catch {}
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }
      isRefreshing = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = res.data.accessToken;
        (window as any).__FLOWOS_AUTH_TOKEN__ = newToken;
        queue.forEach((cb) => cb(newToken));
        queue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        (window as any).__FLOWOS_AUTH_TOKEN__ = null;
        window.location.href = '/';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
