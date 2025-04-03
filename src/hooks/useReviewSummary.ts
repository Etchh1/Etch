import { useCallback } from 'react';

interface RatingDistribution {
  [key: number]: number;
}

interface UseReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export function useReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
}: UseReviewSummaryProps) {
  const getPercentage = useCallback((count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  }, [totalReviews]);

  const getAccessibilityLabel = useCallback(() => {
    const ratingText = `Average rating: ${averageRating.toFixed(1)} out of 5 stars`;
    const reviewsText = `Based on ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`;
    const distributionText = Object.entries(ratingDistribution)
      .map(([stars, count]) => `${count} ${count === 1 ? 'review' : 'reviews'} with ${stars} stars`)
      .join(', ');
    
    return `${ratingText}. ${reviewsText}. Distribution: ${distributionText}`;
  }, [averageRating, totalReviews, ratingDistribution]);

  const getRatingBarAccessibilityLabel = useCallback((rating: number) => {
    const count = ratingDistribution[rating] || 0;
    const percentage = getPercentage(count);
    return `${rating} stars: ${count} reviews, ${percentage.toFixed(0)}%`;
  }, [ratingDistribution, getPercentage]);

  const getRatingBarPercentage = useCallback((rating: number) => {
    return getPercentage(ratingDistribution[rating] || 0);
  }, [ratingDistribution, getPercentage]);

  return {
    getPercentage,
    getAccessibilityLabel,
    getRatingBarAccessibilityLabel,
    getRatingBarPercentage,
  };
} 