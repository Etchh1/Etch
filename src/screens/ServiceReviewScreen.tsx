import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import { notificationService } from '../lib/notifications';

interface ServiceDetails {
  id: string;
  title: string;
  provider_id: string;
  profiles: {
    full_name: string;
  };
}

export default function ServiceReviewScreen() {
  const { serviceId, bookingId } = useLocalSearchParams<{
    serviceId: string;
    bookingId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, provider_id, profiles:provider_id(full_name)')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error loading service details:', error);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!service) return;

    try {
      setSubmitting(true);

      // Submit the review
      const { error: reviewError } = await supabase.from('service_reviews').insert({
        service_id: serviceId,
        booking_id: bookingId,
        user_id: authService.getState().user?.id,
        rating,
        comment: review,
        created_at: new Date().toISOString(),
      });

      if (reviewError) throw reviewError;

      // Update service rating
      const { data: reviewsData } = await supabase
        .from('service_reviews')
        .select('rating')
        .eq('service_id', serviceId);

      if (reviewsData) {
        const avgRating =
          reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;

        await supabase
          .from('services')
          .update({
            rating: avgRating,
            review_count: reviewsData.length,
          })
          .eq('id', serviceId);
      }

      // Send notification to provider
      await notificationService.sendNotification(service.provider_id, {
        title: 'New Review',
        body: `${authService.getState().user?.email} left a ${rating}-star review for ${service.title}`,
        type: 'review',
        data: {
          type: 'review',
          serviceId,
          reviewId: bookingId,
        },
        userId: service.provider_id,
        read: false,
      });

      Alert.alert('Success', 'Review submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator style={styles.loader} size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Card style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>{service?.title}</Text>
          <Text style={styles.providerName}>
            by {service?.profiles.full_name}
          </Text>
        </Card>

        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text style={styles.starText}>
                  {star <= rating ? '⭐️' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating} star{rating !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>Write Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this service..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={submitting ? 'Submitting...' : 'Submit Review'}
          onPress={handleSubmit}
          disabled={submitting || !review.trim()}
          style={styles.submitButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    marginBottom: 20,
    padding: 15,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  providerName: {
    fontSize: 14,
    color: '#666666',
  },
  ratingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  starText: {
    fontSize: 30,
  },
  ratingText: {
    fontSize: 16,
    color: '#666666',
  },
  reviewContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    marginBottom: 20,
  },
}); 