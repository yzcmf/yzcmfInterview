import axios, { AxiosInstance } from 'axios';

// Types for our API
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: 'house_holder' | 'renter';
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  amenities: string;
  images: string;
  is_available: boolean;
  owner_id: number;
  created_at: string;
  updated_at?: string;
  owner?: User;
  reviews?: Review[];
}

export interface Booking {
  id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  guest_count: number;
  special_requests?: string;
  property_id: number;
  renter_id: number;
  created_at: string;
  updated_at?: string;
  property?: Property;
  renter?: User;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  property_id: number;
  author_id: number;
  created_at: string;
  author?: User;
}

// API Client implementation for React
export class ReactApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth API implementation
  auth = {
    register: async (userData: {
      email: string;
      username: string;
      full_name?: string;
      phone?: string;
      role: 'house_holder' | 'renter';
      password: string;
    }): Promise<User> => {
      console.log('Making registration request with data:', userData);
      try {
        const response = await this.client.post('/register', userData);
        console.log('Registration response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Registration API error:', error);
        throw error;
      }
    },

    login: async (username: string, password: string): Promise<{ access_token: string; token_type: string }> => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await this.client.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const data = response.data;
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }
      return data;
    },

    logout: async (): Promise<void> => {
      localStorage.removeItem('auth_token');
    },

    getCurrentUser: async (): Promise<User> => {
      const response = await this.client.get('/users/me');
      return response.data;
    },
  };

  // Property API implementation
  properties = {
    create: async (property: {
      title: string;
      description: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      price_per_night: number;
      bedrooms: number;
      bathrooms: number;
      max_guests: number;
      property_type: string;
      amenities: string;
      images: string;
      is_available?: boolean;
    }): Promise<Property> => {
      const response = await this.client.post('/properties', property);
      return response.data;
    },

    getById: async (id: number): Promise<Property> => {
      const response = await this.client.get(`/properties/${id}`);
      return response.data;
    },

    update: async (id: number, updates: Partial<Property>): Promise<Property> => {
      const response = await this.client.put(`/properties/${id}`, updates);
      return response.data;
    },

    delete: async (id: number): Promise<{ message: string }> => {
      const response = await this.client.delete(`/properties/${id}`);
      return response.data;
    },

    list: async (params?: {
      skip?: number;
      limit?: number;
      city?: string;
      min_price?: number;
      max_price?: number;
      property_type?: string;
    }): Promise<Property[]> => {
      const response = await this.client.get('/properties', { params });
      return response.data;
    },

    getReviews: async (propertyId: number): Promise<Review[]> => {
      const response = await this.client.get(`/properties/${propertyId}/reviews`);
      return response.data;
    },
  };

  // Booking API implementation
  bookings = {
    create: async (booking: {
      property_id: number;
      check_in_date: string;
      check_out_date: string;
      guest_count: number;
      special_requests?: string;
    }): Promise<Booking> => {
      const response = await this.client.post('/bookings', booking);
      return response.data;
    },

    update: async (id: number, updates: {
      check_in_date?: string;
      check_out_date?: string;
      guest_count?: number;
      special_requests?: string;
      status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    }): Promise<Booking> => {
      const response = await this.client.put(`/bookings/${id}`, updates);
      return response.data;
    },

    list: async (): Promise<Booking[]> => {
      const response = await this.client.get('/bookings');
      return response.data;
    },

    getById: async (id: number): Promise<Booking> => {
      const response = await this.client.get(`/bookings/${id}`);
      return response.data;
    },
  };

  // Review API implementation
  reviews = {
    create: async (review: {
      property_id: number;
      rating: number;
      comment: string;
    }): Promise<Review> => {
      const response = await this.client.post('/reviews', review);
      return response.data;
    },
  };

  // Payment API
  payments = {
    createIntent: async (booking_id: number, amount: number): Promise<{ client_secret: string; payment_intent_id: string; amount: number }> => {
      const response = await this.client.post('/payments/create', { booking_id, amount });
      return response.data;
    },
    // Optionally, webhook or status check can be added here
  };

  // Messaging API
  messages = {
    send: async (data: { receiver_id: number; property_id: number; content: string }): Promise<any> => {
      const response = await this.client.post('/messages/', data);
      return response.data;
    },
    getConversation: async (user_id: number, property_id: number): Promise<any[]> => {
      const response = await this.client.get('/messages/conversation', { params: { user_id, property_id } });
      return response.data;
    },
    markRead: async (message_id: number): Promise<any> => {
      const response = await this.client.patch(`/messages/${message_id}/read`);
      return response.data;
    },
    getUnreadCount: async (): Promise<{ unread_count: number }> => {
      const response = await this.client.get('/messages/unread_count');
      return response.data;
    },
  };

  // Admin API
  admin = {
    getStats: async (): Promise<any> => {
      const response = await this.client.get('/admin/stats');
      return response.data;
    },
    listUsers: async (): Promise<User[]> => {
      const response = await this.client.get('/admin/users');
      return response.data;
    },
    updateUser: async (user_id: number, updates: { is_active?: boolean; is_admin?: boolean; role?: string }): Promise<User> => {
      const response = await this.client.patch(`/admin/users/${user_id}`, updates);
      return response.data;
    },
    listProperties: async (): Promise<Property[]> => {
      const response = await this.client.get('/admin/properties');
      return response.data;
    },
    updateProperty: async (property_id: number, updates: { is_available?: boolean; approved?: boolean }): Promise<Property> => {
      const response = await this.client.patch(`/admin/properties/${property_id}`, updates);
      return response.data;
    },
    listBookings: async (): Promise<Booking[]> => {
      const response = await this.client.get('/admin/bookings');
      return response.data;
    },
    listReviews: async (): Promise<Review[]> => {
      const response = await this.client.get('/admin/reviews');
      return response.data;
    },
  };
}

// Create and export the default API instance
export const api = new ReactApiClient(); 