export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface ReviewFilter {
  rating: number | null;
  hasResponse: boolean | null;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  filters: ReviewFilter;
  sort: ReviewSort;
  page: number;
  hasMore: boolean;
}

export type ReviewAction =
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: ReviewFilter }
  | { type: 'SET_SORT'; payload: ReviewSort }
  | { type: 'LOAD_MORE' }
  | { type: 'RESET' }; 