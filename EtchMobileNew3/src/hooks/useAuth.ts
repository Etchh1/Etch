import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { LoginCredentials, RegisterCredentials } from '@/types';
import { ROUTES } from '@/constants/config';

export function useAuth() {
  const router = useRouter();
  const { login, register, logout, setUser, setToken, isAuthenticated } = useAuthStore();

  const checkAuth = useCallback(async () => {
    const [currentUser, token] = await Promise.all([
      auth.getCurrentUser(),
      auth.getToken(),
    ]);

    if (currentUser && token) {
      setUser(currentUser);
      setToken(token);
    }
  }, [setUser, setToken]);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      await login(credentials);
      router.replace(ROUTES.HOME);
    },
    [login, router]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      await register(credentials);
      router.replace(ROUTES.HOME);
    },
    [register, router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace(ROUTES.AUTH.LOGIN);
  }, [logout, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
} 