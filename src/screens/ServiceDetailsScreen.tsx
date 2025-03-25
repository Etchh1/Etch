import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  review_count: number;
  provider: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};

export default function ServiceDetailsScreen({ route, navigation }: any) {
  const { serviceId } = route.params;
  const { session } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:profiles(id, full_name, avatar_url)
        `)
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!session || !service) return;

    try {
      const { error } = await supabase.from('bookings').insert({
        service_id: service.id,
        customer_id: session.user.id,
        provider_id: service.provider.id,
        status: 'pending',
        booking_date: bookingDate.toISOString(),
        total_price: service.price,
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Booking request sent! The provider will confirm shortly.',
        [{ text: 'OK', onPress: () => navigation.navigate('Bookings') }]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: service.images[0] || 'https://via.placeholder.com/400x300' }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{service.title}</Text>
        
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: service.provider.avatar_url || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <Text style={styles.providerName}>{service.provider.full_name}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{service.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({service.review_count} reviews)</Text>
        </View>

        <Text style={styles.price}>${service.price}</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{service.description}</Text>

        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.category}>{service.category}</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>Select Date: {bookingDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBookingDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          disabled={!session}
        >
          <Text style={styles.bookButtonText}>
            {session ? 'Book Now' : 'Sign in to Book'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
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
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  providerName: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
  },
  reviewCount: {
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 