// src/lib/api.ts
// API utility for fetch requests with base URL, error handling, and token support

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  if (!res.ok) {
    let errorMsg = 'API error';
    try {
      const err = await res.json();
      errorMsg = err.error || err.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
} 