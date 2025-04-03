import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants/config';
import { ThemeMode } from '@/types';

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

type SetState = (
  partial: ThemeStore | Partial<ThemeStore> | ((state: ThemeStore) => ThemeStore | Partial<ThemeStore>),
  replace?: boolean
) => void;

export const useThemeStore = create<ThemeStore>((set: SetState) => ({
  mode: 'light',

  setMode: async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.THEME, mode, {});
      set({ mode });
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  },
})); 