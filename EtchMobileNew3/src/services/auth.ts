import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants/config';
import { LoginCredentials, RegisterCredentials, User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    await this.setAuthData(response.data);
    return response.data;
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials);
    await this.setAuthData(response.data);
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      await this.clearAuthData();
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  public async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  }

  private async setAuthData(authData: AuthResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, authData.token, {}),
      SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user), {}),
    ]);
    api.setToken(authData.token);
  }

  private async clearAuthData(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
    ]);
    api.removeToken();
  }
}

export const auth = AuthService.getInstance(); 