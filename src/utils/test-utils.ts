import { jest } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dangerouslyGetChildren: jest.fn(),
};

// Mock route
export const mockRoute = {
  key: 'test',
  name: 'Test',
  params: {},
};

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => mockNavigation,
    useRoute: () => mockRoute,
  };
});

// Mock async storage
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo modules
export const mockExpoModules = {
  StatusBar: {
    setBarStyle: jest.fn(),
    setBackgroundColor: jest.fn(),
    setHidden: jest.fn(),
  },
  SystemUI: {
    setBackgroundColorAsync: jest.fn(),
    setStatusBarStyleAsync: jest.fn(),
  },
};

// Mock platform specific code
export const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj: Record<string, unknown>) => obj.ios),
};

jest.mock('react-native/Libraries/Utilities/Platform', () => mockPlatform);

// Helper to wait for promises to resolve
export const waitForPromises = (): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, 0));

// Helper to mock API responses
export const mockApiResponse = <T>(data: T, status = 200): Promise<Response> => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response);
};

// Helper to create test data
export const createTestData = {
  user: (overrides: Record<string, unknown> = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  }),
  // Add more test data creators as needed
}; 