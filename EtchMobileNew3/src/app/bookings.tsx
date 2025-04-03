import React, { useState } from 'react';
import { Screen } from '@/components/Screen';
import { View, FlatList, Text } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Empty } from '@/components/Empty';
import { BottomSheet } from '@/components/BottomSheet';
import { TextInput } from '@/components/TextInput';
import { theme } from '@/styles/theme';

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function BookingsScreen() {
  // Sample data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      serviceName: 'Hair Cut',
      providerName: 'John\'s Salon',
      date: '2024-03-30',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: '2',
      serviceName: 'Massage',
      providerName: 'Wellness Spa',
      date: '2024-04-01',
      time: '15:30',
      status: 'pending'
    }
  ]);
  const [isAddBookingVisible, setIsAddBookingVisible] = useState(false);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };

  return (
    <SafeArea>
      <Screen
        title="Bookings"
        showHeader={true}
        rightAction={{
          icon: { name: 'add', family: 'Ionicons' },
          onPress: () => setIsAddBookingVisible(true),
        }}
      >
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: theme.spacing.md }}>
              <View style={{ marginBottom: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
                  <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.serviceName}</Text>
                  <Text style={{ color: getStatusColor(item.status), fontWeight: '500' }}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
                <Text style={{ color: theme.colors.textSecondary }}>{item.providerName}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>
                  {item.date} at {item.time}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  title="Cancel"
                  onPress={() => {}}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Button
                  title="Reschedule"
                  onPress={() => {}}
                />
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <Empty
              title="No bookings yet"
              message="Book your first service by tapping the + button"
              icon={{ name: 'calendar', family: 'Ionicons' }}
            />
          }
        />

        <BottomSheet
          isVisible={isAddBookingVisible}
          onClose={() => setIsAddBookingVisible(false)}
        >
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: theme.spacing.md }}>
              New Booking
            </Text>
            {/* Add booking form here */}
            <Button
              title="Create Booking"
              onPress={() => setIsAddBookingVisible(false)}
              style={{ marginTop: theme.spacing.md }}
            />
          </View>
        </BottomSheet>
      </Screen>
    </SafeArea>
  );
} 