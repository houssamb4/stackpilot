const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  isActive: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ServerStats {
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  };
  load: {
    one: number;
    five: number;
    fifteen: number;
  };
  uptimeSeconds: number;
  platform: string;
  hostname: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  async register(data: RegisterData): Promise<{ message: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.setToken(null);
  }

  // User endpoints
  async getMe(): Promise<User> {
    return this.request('/users/me');
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAllUsers(): Promise<{ users: User[] }> {
    return this.request('/admin/users');
  }

  async getPendingUsers(): Promise<{ users: User[] }> {
    return this.request('/admin/users/pending');
  }

  async activateUser(userId: string): Promise<{ message: string }> {
    return this.request(`/admin/users/${userId}/activate`, {
      method: 'PUT',
    });
  }

  async deactivateUser(userId: string): Promise<{ message: string }> {
    return this.request(`/admin/users/${userId}/deactivate`, {
      method: 'PUT',
    });
  }

  // Health endpoint
  async getHealth(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return this.request('/health');
  }

  // Stats endpoints
  async getServerStats(): Promise<ServerStats> {
    return this.request('/stats/server');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { User, AuthResponse, LoginCredentials, RegisterData, ServerStats };
