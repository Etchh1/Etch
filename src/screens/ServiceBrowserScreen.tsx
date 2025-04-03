import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { Service, ServiceFilter } from '../types/services';
import * as Location from 'expo-location';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔍' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'repair', name: 'Repair', icon: '🔧' },
  { id: 'moving', name: 'Moving', icon: '📦' },
  { id: 'gardening', name: 'Gardening', icon: '🌱' },
  { id: 'tutoring', name: 'Tutoring', icon: '📚' },
  { id: 'beauty', name: 'Beauty', icon: '💅' },
  { id: 'other', name: 'Other', icon: '📌' },
];

export default function ServiceBrowserScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filter, setFilter] = useState<ServiceFilter>({});
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
    requestLocationPermission();
  }, [selectedCategory, filter]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address[0]) {
          const { city, region } = address[0];
          setUserLocation(`${city}, ${region}`);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('services')
        .select('*, profiles:provider_id(full_name, avatar_url)');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (filter.location) {
        query = query.ilike('location', `%${filter.location}%`);
      }

      if (filter.minPrice) {
        query = query.gte('price', filter.minPrice);
      }

      if (filter.maxPrice) {
        query = query.lte('price', filter.maxPrice);
      }

      if (filter.rating) {
        query = query.gte('rating', filter.rating);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (filter.sortBy) {
        query = query.order(filter.sortBy, {
          ascending: filter.sortOrder === 'asc',
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleServicePress = (serviceId: string) => {
    router.push(`/seeker/service-details/${serviceId}`);
  };

  const handleSearch = () => {
    loadServices();
  };

  const handleFilter = () => {
    // Show filter modal or navigate to filter screen
    // For now, we'll just set some example filters
    setFilter({
      ...filter,
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity onPress={() => handleServicePress(item.id)}>
      <Card style={styles.serviceCard}>
        {item.images?.[0] && (
          <Image source={{ uri: item.images[0] }} style={styles.serviceImage} />
        )}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{item.title}</Text>
          <Text style={styles.serviceProvider}>
            by {item.profiles?.full_name}
          </Text>
          <Text style={styles.serviceLocation}>{item.location}</Text>
          <View style={styles.serviceFooter}>
            <Text style={styles.servicePrice}>${item.price}/hr</Text>
            {item.rating && (
              <Text style={styles.serviceRating}>
                ⭐️ {item.rating.toFixed(1)} ({item.reviewCount})
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <Button
            title="Filter"
            onPress={handleFilter}
            style={styles.filterButton}
          />
        </View>

        {userLocation && (
          <Text style={styles.locationText}>📍 Near {userLocation}</Text>
        )}

        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonSelected,
              ]}
              onPress={() => handleCategoryPress(item.id)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextSelected,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : (
          <FlatList
            data={services}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.servicesList}
            showsVerticalScrollIndicator={false}
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterButton: {
    width: 80,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  categoriesList: {
    marginBottom: 15,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 10,
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceCard: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceProvider: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  serviceRating: {
    fontSize: 14,
    color: '#666',
  },
}); 