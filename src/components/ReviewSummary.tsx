import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Themed';
import { router } from 'expo-router';
import { useReviewSummary } from '../hooks/useReviewSummary';

interface ReviewSummaryProps {
  serviceId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export function ReviewSummary({
  serviceId,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewSummaryProps) {
  const {
    getAccessibilityLabel,
    getRatingBarAccessibilityLabel,
    getRatingBarPercentage,
  } = useReviewSummary({
    averageRating,
    totalReviews,
    ratingDistribution,
  });

  const handleViewAllReviews = () => {
    router.push(`/services/${serviceId}/reviews`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleViewAllReviews}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="button"
      accessibilityHint="Double tap to view all reviews"
    >
      <View style={styles.summaryHeader}>
        <View 
          style={styles.ratingContainer}
          accessible={true}
          accessibilityLabel={`Average rating: ${averageRating.toFixed(1)} out of 5 stars`}
        >
          <Text 
            style={styles.averageRating}
            accessible={true}
            accessibilityLabel={`${averageRating.toFixed(1)}`}
          >
            {averageRating.toFixed(1)}
          </Text>
          <Text 
            style={styles.ratingStars}
            accessible={true}
            accessibilityLabel={`${Math.round(averageRating)} star rating`}
          >
            {'⭐️'.repeat(Math.round(averageRating))}
            {'☆'.repeat(5 - Math.round(averageRating))}
          </Text>
          <Text 
            style={styles.totalReviews}
            accessible={true}
            accessibilityLabel={`Based on ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`}
          >
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
      </View>

      <View 
        style={styles.distributionContainer}
        accessible={true}
        accessibilityLabel="Rating distribution"
        accessibilityRole="summary"
      >
        {[5, 4, 3, 2, 1].map((rating) => (
          <View 
            key={rating} 
            style={styles.ratingBarContainer}
            accessible={true}
            accessibilityLabel={getRatingBarAccessibilityLabel(rating)}
          >
            <Text 
              style={styles.ratingLabel}
              accessible={true}
              accessibilityLabel={`${rating} stars`}
            >
              {rating} stars
            </Text>
            <View 
              style={styles.ratingBarBackground}
              accessible={true}
              accessibilityLabel={`${getRatingBarPercentage(rating).toFixed(0)}% of reviews`}
            >
              <View
                style={[
                  styles.ratingBarFill,
                  { width: `${getRatingBarPercentage(rating)}%` },
                ]}
              />
            </View>
            <Text 
              style={styles.ratingCount}
              accessible={true}
              accessibilityLabel={`${ratingDistribution[rating] || 0} reviews`}
            >
              {ratingDistribution[rating] || 0}
            </Text>
          </View>
        ))}
      </View>

      <Text 
        style={styles.viewAllText}
        accessible={true}
        accessibilityLabel="View all reviews"
        accessibilityRole="link"
      >
        View all reviews →
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingStars: {
    fontSize: 16,
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666666',
  },
  distributionContainer: {
    marginBottom: 16,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    width: 60,
    fontSize: 12,
    color: '#666666',
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
}); 