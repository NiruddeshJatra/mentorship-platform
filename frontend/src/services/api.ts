import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  User,
  Mentor,
  Topic,
  PaginatedResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  // User Methods
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  // Mentor Methods
  async searchMentors(params?: {
    topic?: string;
    company?: string;
    minRating?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Mentor>> {
    const response = await this.api.get<ApiResponse<PaginatedResponse<Mentor>>>('/mentees/search', { params });
    return response.data.data!;
  }

  // Topics Methods
  async getTopics(): Promise<Topic[]> {
    const response = await this.api.get<ApiResponse<Topic[]>>('/topics');
    return response.data.data!;
  }

  // Generic method for other endpoints
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(endpoint, { params });
    return response.data.data!;
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(endpoint, data);
    return response.data.data!;
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.put<ApiResponse<T>>(endpoint, data);
    return response.data.data!;
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(endpoint);
    return response.data.data!;
  }
}

export const apiService = new ApiService();