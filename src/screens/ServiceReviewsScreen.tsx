import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  provider_response?: string;
}

const PAGE_SIZE = 10;

export default function ServiceReviewsScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadReviews = useCallback(async (pageNum: number = 0, isRefreshing: boolean = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setLoading(true);
      }

      let query = supabase
        .from('service_reviews')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('service_id', serviceId)
        .order(sortBy === 'date' ? 'created_at' : 'rating', { ascending: sortOrder === 'asc' })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (filterRating) {
        query = query.eq('rating', filterRating);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      if (isRefreshing) {
        setReviews(data || []);
      } else {
        setReviews(prev => pageNum === 0 ? (data || []) : [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (err) {
      console.error('Error loading reviews:', err);
      Alert.alert('Error', 'Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [serviceId, sortBy, sortOrder, filterRating]);

  useEffect(() => {
    setPage(0);
    loadReviews(0);
  }, [loadReviews]);

  const handleRefresh = useCallback(() => {
    setPage(0);
    loadReviews(0, true);
  }, [loadReviews]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews(nextPage);
    }
  }, [loading, hasMore, page, loadReviews]);

  const renderReview = useCallback(({ item }: { item: Review }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.profiles.full_name}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {'⭐️'.repeat(item.rating)}
            {'☆'.repeat(5 - item.rating)}
          </Text>
        </View>
      </View>

      <Text style={styles.comment}>{item.comment}</Text>

      {item.provider_response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Provider&apos;s Response:</Text>
          <Text style={styles.responseText}>{item.provider_response}</Text>
        </View>
      )}
    </Card>
  ), []);

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [loading]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reviews found</Text>
      </View>
    );
  }, [loading]);

  const renderFilterButtons = useCallback(() => (
    <View style={styles.filterContainer}>
      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.activeButton]}
          onPress={() => setSortBy('date')}
        >
          <Text style={styles.buttonText}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'rating' && styles.activeButton]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={styles.buttonText}>Rating</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        <Ionicons
          name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
          size={20}
          color="#007AFF"
        />
      </TouchableOpacity>

      <View style={styles.ratingFilter}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              filterRating === rating && styles.activeButton,
            ]}
            onPress={() => setFilterRating(filterRating === rating ? null : rating)}
          >
            <Text style={styles.ratingButtonText}>
              {rating} {rating === 1 ? 'Star' : 'Stars'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ), [sortBy, sortOrder, filterRating]);

  if (loading && page === 0) {
    return (
      <Screen>
        <ActivityIndicator style={styles.loader} size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      {renderFilterButtons()}
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  reviewCard: {
    marginBottom: 16,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  ratingContainer: {
    marginLeft: 8,
  },
  rating: {
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  responseContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666666',
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sortButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333333',
  },
  orderButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  ratingFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#333333',
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
}); 