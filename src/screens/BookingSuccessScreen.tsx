import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { Button } from '../components/Button';
import bookingSuccessImage from '../../assets/images/booking-success.png';

export default function BookingSuccessScreen() {
  const handleViewBookings = () => {
    router.push('/seeker/bookings');
  };

  const handleBrowseMore = () => {
    router.push('/seeker/browse');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={bookingSuccessImage}
          style={styles.image}
        />
        
        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.message}>
          Your booking request has been sent to the service provider. You&apos;ll
          receive a notification once they confirm your booking.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="View My Bookings"
            onPress={handleViewBookings}
            style={styles.button}
          />
          <Button
            title="Browse More Services"
            onPress={handleBrowseMore}
            style={[styles.button, styles.secondaryButton]}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#E8E8E8',
  },
}); 