import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Get the environment variables
const supabaseUrl = 'https://bezbijravdsaghaoseiw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlemJpanJhdmRzYWdoYW9zZWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODIzODgsImV4cCI6MjA1ODE1ODM4OH0.lb_AxWHh9xBmeWYlKXE0KSim0VlqabGbw9lMpgDPGO0'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}) 