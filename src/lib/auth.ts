import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, AuthError, Session, User } from '@supabase/supabase-js';
import { AuthState, UserRole } from '../types/auth';
import { router } from 'expo-router';

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

export type AuthState = {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: AuthError | null;
};

class AuthService {
  private static instance: AuthService;
  private currentState: AuthState = {
    session: null,
    user: null,
    role: null,
    loading: true,
    error: null,
  };

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        this.currentState = {
          session,
          user: session.user,
          role: profile?.role || null,
          loading: false,
          error: null,
        };

        this.redirectBasedOnRole();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          this.currentState = {
            session,
            user: session.user,
            role: profile?.role || null,
            loading: false,
            error: null,
          };

          if (!profile?.role) {
            router.replace('/role-selection');
          } else {
            this.redirectBasedOnRole();
          }
        } else if (event === 'SIGNED_OUT') {
          this.currentState = {
            session: null,
            user: null,
            role: null,
            loading: false,
            error: null,
          };
          router.replace('/auth/login');
        }
      });
    } catch (error) {
      this.currentState.error = error as AuthError;
      this.currentState.loading = false;
    }
  }

  private redirectBasedOnRole() {
    if (this.currentState.role === 'SERVICE_PROVIDER') {
      router.replace('/provider-dashboard');
    } else if (this.currentState.role === 'SERVICE_SEEKER') {
      router.replace('/seeker-dashboard');
    }
  }

  public async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      // After successful signup, redirect to role selection
      if (data.user) {
        router.replace('/role-selection');
      }
    } catch (error) {
      throw error;
    }
  }

  public async selectRole(role: UserRole) {
    try {
      if (!this.currentState.user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: this.currentState.user.id,
          role,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      this.currentState.role = role;
      this.redirectBasedOnRole();
    } catch (error) {
      throw error;
    }
  }

  public async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  public getState(): AuthState {
    return this.currentState;
  }

  public async updateProfile(profile: Partial<Profile>) {
    try {
      if (!this.currentState.user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: this.currentState.user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = AuthService.getInstance(); 