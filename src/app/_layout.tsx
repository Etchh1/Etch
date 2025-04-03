import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { authService } from '../lib/auth';
import { notificationService } from '../lib/notifications';
import { NotificationBadge } from '../components/NotificationBadge';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingScreen from '../components/LoadingScreen';
import { ReviewProvider } from '../context/ReviewContext';

export default function RootLayout() {
  const { loading, role } = authService.getState();

  useEffect(() => {
    // Initialize auth service
    authService.getInstance();
    // Initialize notifications when the app starts
    notificationService.initialize();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!role) {
    return null; // Or show authentication screens
  }

  return (
    <ErrorBoundary>
      <ReviewProvider>
        <Stack>
          {/* Auth Group */}
          <Stack.Screen
            name="auth/login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="role-selection"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          {/* Service Provider Screens */}
          <Stack.Screen
            name="provider-dashboard"
            options={{
              headerTitle: 'Dashboard',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="provider/services"
            options={{ headerTitle: 'My Services' }}
          />
          <Stack.Screen
            name="provider/service-editor"
            options={{ headerTitle: 'Edit Service' }}
          />
          <Stack.Screen
            name="provider/bookings"
            options={{ headerTitle: 'My Bookings' }}
          />
          <Stack.Screen
            name="provider/profile"
            options={{ headerTitle: 'Profile' }}
          />

          {/* Service Seeker Screens */}
          <Stack.Screen
            name="seeker-dashboard"
            options={{
              headerTitle: 'Find Services',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="seeker/service-details/[id]"
            options={{ headerTitle: 'Service Details' }}
          />
          <Stack.Screen
            name="seeker/booking/[serviceId]"
            options={{ headerTitle: 'Book Service' }}
          />
          <Stack.Screen
            name="seeker/booking-success"
            options={{
              headerTitle: 'Booking Confirmed',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="seeker/profile"
            options={{ headerTitle: 'Profile' }}
          />

          {/* Common Screens */}
          <Stack.Screen
            name="messages"
            options={{ headerTitle: 'Messages' }}
          />
          <Stack.Screen
            name="chat/[roomId]"
            options={{ headerTitle: 'Chat' }}
          />
          <Stack.Screen
            name="ai-helper"
            options={{ headerTitle: 'AI Assistant' }}
          />
        </Stack>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E5EA',
            },
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#000000',
          }}
        >
          {role === 'SERVICE_SEEKER' ? (
            <>
              <Tabs.Screen
                name="home"
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="services"
                options={{
                  title: 'Services',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="search" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="bookings"
                options={{
                  title: 'Bookings',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar" size={size} color={color} />
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Tabs.Screen
                name="dashboard"
                options={{
                  title: 'Dashboard',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="grid" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="services"
                options={{
                  title: 'Services',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="briefcase" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="bookings"
                options={{
                  title: 'Bookings',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar" size={size} color={color} />
                  ),
                }}
              />
            </>
          )}

          {/* Common tabs for both roles */}
          <Tabs.Screen
            name="messages"
            options={{
              title: 'Messages',
              tabBarIcon: ({ color, size }) => (
                <View>
                  <Ionicons name="chatbubbles" size={size} color={color} />
                  <NotificationBadge type="messages" />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              title: 'Notifications',
              tabBarIcon: ({ color, size }) => (
                <View>
                  <Ionicons name="notifications" size={size} color={color} />
                  <NotificationBadge type="notifications" />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </ReviewProvider>
    </ErrorBoundary>
  );
} 