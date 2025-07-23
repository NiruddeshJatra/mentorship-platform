// src/lib/api.ts
// API utility for fetch requests with base URL, error handling, and token support

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.PROD 
    ? 'https://intellectify-backend.onrender.com/api' 
    : 'http://localhost:5000/api';

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.error || data.message || 'API request failed');
    (error as any).status = response.status;
    throw error;
  }
  
  return data as T;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add auth token if present (always, for all requests)
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Include credentials for all requests
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials, // This is crucial for cookies
    mode: 'cors' // Explicitly enable CORS
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Add a separate function for OAuth requests that need special handling
export async function apiOAuthRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  
  return handleResponse<T>(response);
}