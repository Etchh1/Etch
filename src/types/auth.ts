import { Session } from '@supabase/supabase-js';

export type UserRole = 'SERVICE_PROVIDER' | 'SERVICE_SEEKER';

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface ServiceProvider extends User {
  role: 'SERVICE_PROVIDER';
  services: Service[];
  availability: Availability[];
  ratings: Rating[];
}

export interface ServiceSeeker extends User {
  role: 'SERVICE_SEEKER';
  preferences: ServicePreference[];
  bookings: Booking[];
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Rating {
  id: string;
  providerId: string;
  seekerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface ServicePreference {
  id: string;
  seekerId: string;
  category: string;
  maxPrice?: number;
  location?: string;
}

export interface Booking {
  id: string;
  seekerId: string;
  providerId: string;
  serviceId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  date: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
} 