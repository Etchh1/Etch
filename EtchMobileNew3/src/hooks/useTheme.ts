import { useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useThemeStore } from '@/store/theme';
import { STORAGE_KEYS } from '@/constants/config';
import { ThemeMode } from '@/types';
import { theme } from '@/styles/theme';

export function useTheme() {
  const { mode, setMode } = useThemeStore();

  const loadTheme = useCallback(async () => {
    try {
      const savedMode = await SecureStore.getItemAsync(STORAGE_KEYS.THEME);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
        setMode(savedMode);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }, [setMode]);

  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    await setMode(newMode);
  }, [mode, setMode]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const currentTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      // Add dark mode color overrides here if needed
    },
  };

  return {
    theme: currentTheme,
    mode,
    toggleTheme,
  };
} 