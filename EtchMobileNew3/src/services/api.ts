import { API_URL } from '@/constants/config';
import { ApiError, ApiResponse } from '@/types';

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private headers: Record<string, string>;

  private constructor() {
    this.baseUrl = API_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string): void {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  public removeToken(): void {
    const { Authorization, ...headers } = this.headers;
    this.headers = headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'An error occurred',
        status: response.status,
        errors: data.errors,
      };
      throw error;
    }

    return {
      data,
      message: data.message,
      status: response.status,
    };
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  public async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = ApiService.getInstance(); 