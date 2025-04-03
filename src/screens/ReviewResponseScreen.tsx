import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { notificationService } from '../lib/notifications';

interface ReviewDetails {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  };
  services: {
    title: string;
  };
}

export default function ReviewResponseScreen() {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState<ReviewDetails | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    loadReviewDetails();
  }, [reviewId]);

  const loadReviewDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*, profiles:user_id(full_name), services:service_id(title)')
        .eq('id', reviewId)
        .single();

      if (error) throw error;
      setReview(data);
    } catch (error) {
      console.error('Error loading review details:', error);
      Alert.alert('Error', 'Failed to load review details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!review) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('service_reviews')
        .update({
          provider_response: response,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Send notification to the reviewer
      await notificationService.sendNotification(review.user_id, {
        title: 'Response to Your Review',
        body: `The provider has responded to your review for ${review.services.title}`,
        type: 'review_response',
        data: {
          type: 'review_response',
          reviewId,
          serviceId: review.services.id,
        },
        userId: review.user_id,
        read: false,
      });

      Alert.alert('Success', 'Response submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert('Error', 'Failed to submit response');
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
        <Card style={styles.reviewCard}>
          <Text style={styles.serviceTitle}>{review?.services.title}</Text>
          <Text style={styles.reviewerName}>
            Review by {review?.profiles.full_name}
          </Text>
          <Text style={styles.rating}>
            {'⭐️'.repeat(review?.rating || 0)}
            {'☆'.repeat(5 - (review?.rating || 0))}
          </Text>
          <Text style={styles.date}>
            {review?.created_at
              ? new Date(review.created_at).toLocaleDateString()
              : ''}
          </Text>
          <Text style={styles.comment}>{review?.comment}</Text>
        </Card>

        <View style={styles.responseContainer}>
          <Text style={styles.sectionTitle}>Your Response</Text>
          <TextInput
            style={styles.responseInput}
            placeholder="Write your response to this review..."
            value={response}
            onChangeText={setResponse}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={submitting ? 'Submitting...' : 'Submit Response'}
          onPress={handleSubmit}
          disabled={submitting || !response.trim()}
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
  reviewCard: {
    marginBottom: 20,
    padding: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
  responseContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  responseInput: {
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