import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Etch',
  slug: 'etch',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.etch.mobile'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.etch.mobile'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    supabaseUrl: 'https://bezbijravdsaghaoseiw.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlemJpanJhdmRzYWdoYW9zZWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODIzODgsImV4cCI6MjA1ODE1ODM4OH0.lb_AxWHh9xBmeWYlKXE0KSim0VlqabGbw9lMpgDPGO0',
    eas: {
      projectId: 'your-project-id'
    }
  },
  plugins: [
    'expo-router'
  ]
}) 