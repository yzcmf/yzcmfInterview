import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  Api, 
  User, 
  Post, 
  Comment, 
  ApiResponse, 
  PaginatedResponse,
  UserFilters,
  PostFilters,
  PaginationParams
} from '../../../shared/types/api';

// API Client implementation for Astro
export class AstroApiClient implements Api {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:4321/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      // In Astro, we might store tokens differently (cookies, etc.)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    return response.data;
  }

  // User API implementation
  users = {
    create: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> => {
      const response = await this.client.post('/users', user);
      return this.handleResponse(response);
    },

    getById: async (id: string): Promise<ApiResponse<User>> => {
      const response = await this.client.get(`/users/${id}`);
      return this.handleResponse(response);
    },

    getByEmail: async (email: string): Promise<ApiResponse<User>> => {
      const response = await this.client.get(`/users/email/${email}`);
      return this.handleResponse(response);
    },

    update: async (id: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
      const response = await this.client.put(`/users/${id}`, updates);
      return this.handleResponse(response);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await this.client.delete(`/users/${id}`);
      return this.handleResponse(response);
    },

    list: async (filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<User>>> => {
      const response = await this.client.get('/users', { params: filters });
      return this.handleResponse(response);
    },
  };

  // Post API implementation
  posts = {
    create: async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Post>> => {
      const response = await this.client.post('/posts', post);
      return this.handleResponse(response);
    },

    getById: async (id: string): Promise<ApiResponse<Post>> => {
      const response = await this.client.get(`/posts/${id}`);
      return this.handleResponse(response);
    },

    update: async (id: string, updates: Partial<Post>): Promise<ApiResponse<Post>> => {
      const response = await this.client.put(`/posts/${id}`, updates);
      return this.handleResponse(response);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await this.client.delete(`/posts/${id}`);
      return this.handleResponse(response);
    },

    list: async (filters?: PostFilters): Promise<ApiResponse<PaginatedResponse<Post>>> => {
      const response = await this.client.get('/posts', { params: filters });
      return this.handleResponse(response);
    },

    getByAuthor: async (authorId: string, filters?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Post>>> => {
      const response = await this.client.get(`/users/${authorId}/posts`, { params: filters });
      return this.handleResponse(response);
    },
  };

  // Comment API implementation
  comments = {
    create: async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>> => {
      const response = await this.client.post('/comments', comment);
      return this.handleResponse(response);
    },

    getById: async (id: string): Promise<ApiResponse<Comment>> => {
      const response = await this.client.get(`/comments/${id}`);
      return this.handleResponse(response);
    },

    update: async (id: string, updates: Partial<Comment>): Promise<ApiResponse<Comment>> => {
      const response = await this.client.put(`/comments/${id}`, updates);
      return this.handleResponse(response);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      const response = await this.client.delete(`/comments/${id}`);
      return this.handleResponse(response);
    },

    getByPost: async (postId: string, filters?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Comment>>> => {
      const response = await this.client.get(`/posts/${postId}/comments`, { params: filters });
      return this.handleResponse(response);
    },
  };

  // Auth API implementation
  auth = {
    login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
      const response = await this.client.post('/auth/login', { email, password });
      const data = this.handleResponse(response);
      if (data.success && data.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
      return data;
    },

    register: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
      const response = await this.client.post('/auth/register', user);
      const data = this.handleResponse(response);
      if (data.success && data.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
      return data;
    },

    logout: async (): Promise<ApiResponse<void>> => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      const response = await this.client.post('/auth/logout');
      return this.handleResponse(response);
    },

    refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
      const response = await this.client.post('/auth/refresh');
      const data = this.handleResponse(response);
      if (data.success && data.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
      return data;
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
      const response = await this.client.get('/auth/me');
      return this.handleResponse(response);
    },
  };
}

// Create and export the default API instance
export const api = new AstroApiClient();

// Export the API type for use in components
export type { Api, User, Post, Comment, ApiResponse, PaginatedResponse }; 