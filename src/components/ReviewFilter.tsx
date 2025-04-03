import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import { ReviewFilter as ReviewFilterType, ReviewSort } from '../types/reviews';

interface ReviewFilterProps {
  filters: ReviewFilterType;
  sort: ReviewSort;
  onFilterChange: (filters: ReviewFilterType) => void;
  onSortChange: (sort: ReviewSort) => void;
}

export function ReviewFilter({
  filters,
  sort,
  onFilterChange,
  onSortChange,
}: ReviewFilterProps) {
  const handleRatingFilter = useCallback((rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? null : rating,
    });
  }, [filters, onFilterChange]);

  const handleResponseFilter = useCallback(() => {
    onFilterChange({
      ...filters,
      hasResponse: filters.hasResponse === null ? true : !filters.hasResponse,
    });
  }, [filters, onFilterChange]);

  const handleSortChange = useCallback((newSort: ReviewSort) => {
    onSortChange(newSort);
  }, [onSortChange]);

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'newest' && styles.activeButton]}
          onPress={() => handleSortChange('newest')}
          accessible={true}
          accessibilityLabel="Sort by newest"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'oldest' && styles.activeButton]}
          onPress={() => handleSortChange('oldest')}
          accessible={true}
          accessibilityLabel="Sort by oldest"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Oldest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'highest' && styles.activeButton]}
          onPress={() => handleSortChange('highest')}
          accessible={true}
          accessibilityLabel="Sort by highest rating"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Highest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'lowest' && styles.activeButton]}
          onPress={() => handleSortChange('lowest')}
          accessible={true}
          accessibilityLabel="Sort by lowest rating"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Lowest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filters.hasResponse && styles.activeButton]}
          onPress={handleResponseFilter}
          accessible={true}
          accessibilityLabel={filters.hasResponse ? "Show all reviews" : "Show only reviews with responses"}
          accessibilityRole="button"
        >
          <Ionicons
            name={filters.hasResponse ? "checkmark-circle" : "checkmark-circle-outline"}
            size={20}
            color={filters.hasResponse ? "#FFFFFF" : "#007AFF"}
          />
          <Text style={[styles.buttonText, filters.hasResponse && styles.activeText]}>
            With Response
          </Text>
        </TouchableOpacity>

        <View style={styles.ratingFilter}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                filters.rating === rating && styles.activeButton,
              ]}
              onPress={() => handleRatingFilter(rating)}
              accessible={true}
              accessibilityLabel={`${rating} ${rating === 1 ? 'star' : 'stars'} filter`}
              accessibilityRole="button"
            >
              <Text style={[styles.ratingText, filters.rating === rating && styles.activeText]}>
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  ratingFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333333',
  },
  activeText: {
    color: '#FFFFFF',
  },
  ratingText: {
    fontSize: 14,
    color: '#333333',
  },
}); 