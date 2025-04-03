import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import { notificationService } from '../lib/notifications';
import { Ionicons } from '@expo/vector-icons';

interface BookingDetails {
  id: string;
  service_id: string;
  user_id: string;
  provider_id: string;
  status: string;
  date: string;
  time: string;
  duration: number;
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  services: {
    title: string;
    description: string;
    price: number;
    location: string;
  };
  profiles: {
    full_name: string;
    phone: string;
    avatar_url?: string;
  };
}

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role } = authService.getState();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `*,
          services:service_id(title, description, price, location),
          profiles:${role === 'SERVICE_PROVIDER' ? 'user_id' : 'provider_id'}(full_name, phone, avatar_url)`
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Send notification to the other party
      const recipientId =
        role === 'SERVICE_PROVIDER' ? booking?.user_id : booking?.provider_id;

      if (recipientId) {
        await notificationService.sendNotification(recipientId, {
          title: 'Booking Update',
          body: `Your booking for ${booking?.services.title} has been ${newStatus}`,
          type: 'booking',
          data: {
            type: 'booking',
            bookingId: id,
          },
          userId: recipientId,
          read: false,
        });
      }

      Alert.alert('Success', 'Booking status updated successfully');
      loadBookingDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status');
    }
  };

  const handleCall = () => {
    if (booking?.profiles.phone) {
      Linking.openURL(`tel:${booking.profiles.phone}`);
    }
  };

  const handleMessage = () => {
    // Navigate to chat with the other party
    const otherPartyId =
      role === 'SERVICE_PROVIDER' ? booking?.user_id : booking?.provider_id;
    router.push(`/messages/${otherPartyId}`);
  };

  const renderStatusBadge = (status: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      pending: { bg: '#FFF3CD', text: '#856404' },
      confirmed: { bg: '#D4EDDA', text: '#155724' },
      completed: { bg: '#CCE5FF', text: '#004085' },
      cancelled: { bg: '#F8D7DA', text: '#721C24' },
    };

    return (
      <View
        style={[styles.statusBadge, { backgroundColor: colors[status].bg }]}
      >
        <Text style={[styles.statusText, { color: colors[status].text }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  if (loading || !booking) {
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
          <Text style={styles.serviceTitle}>{booking.services.title}</Text>
          <Text style={styles.serviceLocation}>
            📍 {booking.services.location}
          </Text>
          <Text style={styles.serviceDescription}>
            {booking.services.description}
          </Text>
        </Card>

        <Card style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            {renderStatusBadge(booking.status)}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailText}>
              {new Date(booking.date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailText}>{booking.duration} hours</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Price:</Text>
            <Text style={styles.detailText}>
              ${booking.total_price.toFixed(2)}
            </Text>
          </View>

          {booking.notes && (
            <View style={styles.notes}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
          )}
        </Card>

        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>
            {role === 'SERVICE_PROVIDER' ? 'Client' : 'Provider'} Information
          </Text>
          <Text style={styles.contactName}>{booking.profiles.full_name}</Text>

          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleCall}
            >
              <Ionicons name="call" size={24} color="#007AFF" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleMessage}
            >
              <Ionicons name="chatbubbles" size={24} color="#007AFF" />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {role === 'SERVICE_PROVIDER' && booking.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              title="Confirm Booking"
              onPress={() => handleStatusChange('confirmed')}
              style={[styles.actionButton, styles.confirmButton]}
            />
            <Button
              title="Cancel Booking"
              onPress={() => handleStatusChange('cancelled')}
              style={[styles.actionButton, styles.cancelButton]}
            />
          </View>
        )}

        {role === 'SERVICE_PROVIDER' && booking.status === 'confirmed' && (
          <Button
            title="Mark as Completed"
            onPress={() => handleStatusChange('completed')}
            style={styles.completeButton}
          />
        )}

        {role === 'SERVICE_SEEKER' && booking.status === 'pending' && (
          <Button
            title="Cancel Booking"
            onPress={() => handleStatusChange('cancelled')}
            style={styles.cancelButton}
          />
        )}
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
  serviceLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },
  bookingCard: {
    marginBottom: 20,
    padding: 15,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notes: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    marginTop: 5,
  },
  contactCard: {
    marginBottom: 20,
    padding: 15,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
  },
  contactActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  contactButtonText: {
    color: '#007AFF',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#28A745',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
  },
  completeButton: {
    backgroundColor: '#17A2B8',
    marginBottom: 20,
  },
}); 