import axios from 'axios';
import type { ContentPost, CalendarView, CreatePostPayload, UploadedFile } from '@/types/content';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = (window as any).__TASKSDONE_AUTH_TOKEN__;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Fetch-based API helpers ─────────────────────────────────────────────────
// Base URL: strip trailing /api so we can use /api/... paths
const API_BASE = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://api.tasksdone.cloud/api';
  return url.replace(/\/api\/?$/, '');
})();

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return (window as any).__TASKSDONE_AUTH_TOKEN__ || '';
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPatch(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  return res.json();
}

// ─── Content ────────────────────────────────────────────────────────────────

export const contentApi = {
  calendar: (year: number, month: number): Promise<CalendarView> =>
    api.get('/content/calendar', { params: { year, month } }).then((r) => r.data),

  list: (params?: Record<string, any>): Promise<ContentPost[]> =>
    api.get('/content', { params }).then((r) => r.data),

  get: (id: string): Promise<ContentPost> =>
    api.get(`/content/${id}`).then((r) => r.data),

  create: (data: CreatePostPayload): Promise<ContentPost> =>
    api.post('/content', data).then((r) => r.data),

  update: (id: string, data: Partial<CreatePostPayload>): Promise<ContentPost> =>
    api.put(`/content/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/content/${id}`).then(() => undefined),
};

// ─── Upload ─────────────────────────────────────────────────────────────────

export const uploadApi = {
  single: (file: File): Promise<UploadedFile> => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/single', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  multiple: (files: File[]): Promise<UploadedFile[]> => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return api.post('/upload/multiple', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  delete: (filename: string): Promise<void> =>
    api.delete(`/upload/${filename}`).then(() => undefined),
};

export default api;
