import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import { Service, ServiceReview } from '../types/services';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, role } = authService.getState();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState(new Date());
  const [bookingDuration, setBookingDuration] = useState('1');
  const [bookingNotes, setBookingNotes] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadServiceDetails();
    loadReviews();
  }, [id]);

  const loadServiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, profiles:provider_id(*)')
        .eq('id', id)
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

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('service_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleBookingSubmit = async () => {
    try {
      if (!user || !service) return;

      const bookingData = {
        service_id: id,
        user_id: user.id,
        provider_id: service.providerId,
        date: bookingDate.toISOString().split('T')[0],
        time: bookingTime.toLocaleTimeString(),
        duration: parseInt(bookingDuration),
        total_price: service.price * parseInt(bookingDuration),
        notes: bookingNotes,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('bookings').insert(bookingData);

      if (error) throw error;

      Alert.alert('Success', 'Booking request sent successfully');
      setShowBooking(false);
      router.push('/seeker/booking-success');
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      if (!user || !service) return;

      const reviewData = {
        service_id: id,
        user_id: user.id,
        rating: reviewRating,
        comment: reviewText,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('service_reviews').insert(reviewData);

      if (error) throw error;

      // Update service rating
      const { data: reviewsData } = await supabase
        .from('service_reviews')
        .select('rating')
        .eq('service_id', id);

      if (reviewsData) {
        const avgRating =
          reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;

        await supabase
          .from('services')
          .update({
            rating: avgRating,
            review_count: reviewsData.length,
          })
          .eq('id', id);
      }

      Alert.alert('Success', 'Review submitted successfully');
      setShowReviewForm(false);
      loadReviews();
      loadServiceDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  if (loading || !service) {
    return (
      <Screen>
        <ActivityIndicator style={styles.loader} size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <ScrollView horizontal style={styles.imageGallery}>
          {service.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>

        <View style={styles.header}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.providerInfo}>
            <Image
              source={{
                uri: service.profiles?.avatar_url || 'https://via.placeholder.com/40',
              }}
              style={styles.providerAvatar}
            />
            <View>
              <Text style={styles.providerName}>
                by {service.profiles?.full_name}
              </Text>
              <Text style={styles.location}>{service.location}</Text>
            </View>
          </View>
        </View>

        <Card style={styles.detailsCard}>
          <Text style={styles.price}>${service.price}/hr</Text>
          {service.rating && (
            <Text style={styles.rating}>
              ⭐️ {service.rating.toFixed(1)} ({service.reviewCount} reviews)
            </Text>
          )}
          <Text style={styles.category}>Category: {service.category}</Text>
          <Text style={styles.availability}>
            Available: {service.availability.join(', ')}
          </Text>
        </Card>

        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{service.description}</Text>
        </Card>

        {role === 'SERVICE_SEEKER' && (
          <Button
            title="Book Now"
            onPress={() => setShowBooking(true)}
            style={styles.bookButton}
          />
        )}

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {role === 'SERVICE_SEEKER' && (
              <Button
                title="Write Review"
                onPress={() => setShowReviewForm(true)}
                style={styles.reviewButton}
              />
            )}
          </View>

          {reviews.map((review) => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{
                    uri: review.profiles?.avatar_url || 'https://via.placeholder.com/30',
                  }}
                  style={styles.reviewerAvatar}
                />
                <View>
                  <Text style={styles.reviewerName}>
                    {review.profiles?.full_name}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewRating}>{'⭐️'.repeat(review.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </Card>
          ))}
        </View>

        {/* Booking Modal */}
        <Modal visible={showBooking} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Card style={styles.modalContent}>
              <Text style={styles.modalTitle}>Book Service</Text>
              
              <Text style={styles.inputLabel}>Date</Text>
              <DateTimePicker
                value={bookingDate}
                mode="date"
                onChange={(_, date) => date && setBookingDate(date)}
                minimumDate={new Date()}
              />

              <Text style={styles.inputLabel}>Time</Text>
              <DateTimePicker
                value={bookingTime}
                mode="time"
                onChange={(_, time) => time && setBookingTime(time)}
              />

              <Text style={styles.inputLabel}>Duration (hours)</Text>
              <TextInput
                style={styles.input}
                value={bookingDuration}
                onChangeText={setBookingDuration}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={bookingNotes}
                onChangeText={setBookingNotes}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.totalPrice}>
                Total: ${(service.price * parseInt(bookingDuration || '0')).toFixed(2)}
              </Text>

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowBooking(false)}
                  style={styles.modalButton}
                />
                <Button
                  title="Confirm Booking"
                  onPress={handleBookingSubmit}
                  style={styles.modalButton}
                />
              </View>
            </Card>
          </View>
        </Modal>

        {/* Review Modal */}
        <Modal visible={showReviewForm} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Card style={styles.modalContent}>
              <Text style={styles.modalTitle}>Write a Review</Text>

              <View style={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    onPress={() => setReviewRating(rating)}
                  >
                    <Text style={styles.star}>
                      {rating <= reviewRating ? '⭐️' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, styles.reviewInput]}
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Write your review..."
                multiline
                numberOfLines={4}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowReviewForm(false)}
                  style={styles.modalButton}
                />
                <Button
                  title="Submit Review"
                  onPress={handleReviewSubmit}
                  style={styles.modalButton}
                />
              </View>
            </Card>
          </View>
        </Modal>
      </ScrollView>
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
  imageGallery: {
    height: 250,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'cover',
    marginRight: 10,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  providerName: {
    fontSize: 16,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  detailsCard: {
    margin: 20,
    padding: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  availability: {
    fontSize: 14,
    color: '#666',
  },
  descriptionCard: {
    margin: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  bookButton: {
    marginHorizontal: 20,
  },
  reviewsSection: {
    padding: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewButton: {
    width: 120,
  },
  reviewCard: {
    marginBottom: 15,
    padding: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewRating: {
    marginLeft: 'auto',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  reviewInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
}); 