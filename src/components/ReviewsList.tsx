import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from './Themed';
import { useReview } from '../context/ReviewContext';
import { supabase } from '../lib/supabase';
import { ReviewCard } from './ReviewCard';
import { ReviewFilter } from './ReviewFilter';

interface ReviewsListProps {
  serviceId: string;
}

export function ReviewsList({ serviceId }: ReviewsListProps) {
  const { state, dispatch } = useReview();
  const { reviews, loading, error, filters, sort, page, hasMore } = state;

  const loadReviews = useCallback(async (isRefreshing = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let query = supabase
        .from('reviews')
        .select('*, user:user_id(id, full_name, avatar_url)')
        .eq('service_id', serviceId);

      // Apply sorting
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'highest':
          query = query.order('rating', { ascending: false });
          break;
        case 'lowest':
          query = query.order('rating', { ascending: true });
          break;
      }

      // Apply filters
      if (filters.rating) {
        query = query.eq('rating', filters.rating);
      }

      if (filters.hasResponse !== null) {
        query = filters.hasResponse
          ? query.not('response', 'is', null)
          : query.is('response', null);
      }

      // Apply pagination
      const { data, error: queryError } = await query
        .range((page - 1) * 10, page * 10 - 1);

      if (queryError) throw queryError;

      const newReviews = data as Review[];
      dispatch({
        type: 'SET_REVIEWS',
        payload: isRefreshing ? newReviews : [...reviews, ...newReviews],
      });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load reviews' });
    }
  }, [serviceId, filters, sort, page, reviews, dispatch]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleRefresh = useCallback(() => {
    dispatch({ type: 'RESET' });
    loadReviews(true);
  }, [loadReviews, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch({ type: 'LOAD_MORE' });
    }
  }, [loading, hasMore, dispatch]);

  const handleFilterChange = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, [dispatch]);

  const handleSortChange = useCallback((newSort) => {
    dispatch({ type: 'SET_SORT', payload: newSort });
  }, [dispatch]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ReviewFilter
        filters={filters}
        sort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewCard review={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && reviews.length > 0 ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  loader: {
    marginVertical: 20,
  },
}); 