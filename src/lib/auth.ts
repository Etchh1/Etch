import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AuthState, User, UserRole } from '../types/auth';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const signUp = async (email: string, password: string, role: UserRole): Promise<AuthState> => {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, role, email }]);

      if (profileError) throw profileError;

      return {
        user: { ...authData.user, role } as User,
        session: authData.session,
        loading: false,
        error: null,
      };
    }

    throw new Error('User creation failed');
  } catch (error) {
    return {
      user: null,
      session: null,
      loading: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign up',
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthState> => {
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: { ...authData.user, ...profileData } as User,
        session: authData.session,
        loading: false,
        error: null,
      };
    }

    throw new Error('Sign in failed');
  } catch (error) {
    return {
      user: null,
      session: null,
      loading: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign in',
    };
  }
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<AuthState> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (session?.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: { ...session.user, ...profileData } as User,
        session,
        loading: false,
        error: null,
      };
    }

    return {
      user: null,
      session: null,
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      loading: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching user',
    };
  }
}; 