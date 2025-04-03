export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  providerId: string;
  price: number;
  location: string;
  availability: string[];
  images: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceFilter {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  userId: string;
  providerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 