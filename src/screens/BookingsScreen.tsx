import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';

interface Booking {
  id: string;
  service_id: string;
  user_id: string;
  provider_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: number;
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  services: {
    title: string;
    price: number;
  };
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function BookingsScreen() {
  const { user, role } = authService.getState();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, [activeTab, selectedStatus]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const isProvider = role === 'SERVICE_PROVIDER';
      const userId = user?.id;

      let query = supabase
        .from('bookings')
        .select(
          `*,
          services:service_id(title, price),
          profiles:${isProvider ? 'user_id' : 'provider_id'}(full_name, avatar_url)`
        )
        .eq(isProvider ? 'provider_id' : 'user_id', userId);

      if (activeTab === 'upcoming') {
        query = query.gte('date', new Date().toISOString().split('T')[0]);
      } else {
        query = query.lt('date', new Date().toISOString().split('T')[0]);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      query = query.order('date', { ascending: activeTab === 'upcoming' });

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      Alert.alert('Success', 'Booking status updated successfully');
      loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status');
    }
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

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <Card style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.serviceTitle}>{item.services.title}</Text>
        {renderStatusBadge(item.status)}
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.detailLabel}>
          {role === 'SERVICE_PROVIDER' ? 'Client' : 'Provider'}:
        </Text>
        <Text style={styles.detailText}>{item.profiles.full_name}</Text>

        <Text style={styles.detailLabel}>Date & Time:</Text>
        <Text style={styles.detailText}>
          {new Date(item.date).toLocaleDateString()} at {item.time}
        </Text>

        <Text style={styles.detailLabel}>Duration:</Text>
        <Text style={styles.detailText}>{item.duration} hours</Text>

        <Text style={styles.detailLabel}>Total Price:</Text>
        <Text style={styles.detailText}>${item.total_price.toFixed(2)}</Text>

        {item.notes && (
          <>
            <Text style={styles.detailLabel}>Notes:</Text>
            <Text style={styles.detailText}>{item.notes}</Text>
          </>
        )}
      </View>

      {role === 'SERVICE_PROVIDER' && item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <Button
            title="Confirm"
            onPress={() => handleStatusChange(item.id, 'confirmed')}
            style={[styles.actionButton, styles.confirmButton]}
          />
          <Button
            title="Cancel"
            onPress={() => handleStatusChange(item.id, 'cancelled')}
            style={[styles.actionButton, styles.cancelButton]}
          />
        </View>
      )}

      {role === 'SERVICE_PROVIDER' && item.status === 'confirmed' && (
        <Button
          title="Mark as Completed"
          onPress={() => handleStatusChange(item.id, 'completed')}
          style={styles.completeButton}
        />
      )}

      {role === 'SERVICE_SEEKER' && item.status === 'pending' && (
        <Button
          title="Cancel Booking"
          onPress={() => handleStatusChange(item.id, 'cancelled')}
          style={styles.cancelButton}
        />
      )}
    </Card>
  );

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.activeTabText,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by status:</Text>
          <View style={styles.statusFilter}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    selectedStatus === status && styles.activeFilterButton,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedStatus === status &&
                        styles.activeFilterButtonText,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bookingsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No bookings found for the selected filters.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666666',
  },
  statusFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsList: {
    paddingBottom: 20,
  },
  bookingCard: {
    marginBottom: 15,
    padding: 15,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
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
  bookingDetails: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
}); 