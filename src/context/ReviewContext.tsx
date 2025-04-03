import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ReviewState, ReviewAction } from '../types/reviews';

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  filters: {
    rating: null,
    hasResponse: null,
  },
  sort: 'newest',
  page: 1,
  hasMore: true,
};

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        loading: false,
        error: null,
        hasMore: action.payload.length === 10, // Assuming page size is 10
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, page: 1, reviews: [] };
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1, reviews: [] };
    case 'LOAD_MORE':
      return { ...state, page: state.page + 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface ReviewContextType {
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  return (
    <ReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
} 