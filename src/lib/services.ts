import { supabase } from './auth';
import { Service, Availability, Booking } from '../types/auth';

export const createService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create service');
  }
};

export const updateService = async (id: string, updates: Partial<Service>) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to update service');
  }
};

export const searchServices = async (params: {
  category?: string;
  location?: string;
  maxPrice?: number;
  query?: string;
}) => {
  try {
    let query = supabase.from('services').select('*, profiles(*)');

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.location) {
      query = query.eq('location', params.location);
    }

    if (params.maxPrice) {
      query = query.lte('price', params.maxPrice);
    }

    if (params.query) {
      query = query.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to search services');
  }
};

export const createAvailability = async (availability: Omit<Availability, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('availability')
      .insert([availability])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create availability');
  }
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...booking, status: 'PENDING' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create booking');
  }
};

export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to update booking status');
  }
}; 