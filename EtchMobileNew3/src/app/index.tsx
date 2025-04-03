import React from 'react';
import { Screen } from '@/components/Screen';
import { View, Text, ScrollView } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const quickActions = [
    {
      title: 'Book Service',
      icon: { name: 'calendar', family: 'Ionicons' },
      onPress: () => router.push('/bookings'),
    },
    {
      title: 'Messages',
      icon: { name: 'chatbubbles', family: 'Ionicons' },
      onPress: () => router.push('/messages'),
    },
    {
      title: 'My Profile',
      icon: { name: 'person', family: 'Ionicons' },
      onPress: () => router.push('/profile'),
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      service: 'Hair Cut',
      provider: 'John\'s Salon',
      date: 'Today',
      time: '14:00',
    },
    {
      id: '2',
      service: 'Massage',
      provider: 'Wellness Spa',
      date: 'Tomorrow',
      time: '15:30',
    },
  ];

  return (
    <SafeArea>
      <Screen title="Home" showHeader={true}>
        <ScrollView>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: theme.spacing.md }}>
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.lg,
            }}
          >
            {quickActions.map((action, index) => (
              <Card
                key={action.title}
                style={{
                  flex: 1,
                  marginRight: index < quickActions.length - 1 ? theme.spacing.sm : 0,
                  alignItems: 'center',
                  padding: theme.spacing.md,
                }}
                onPress={action.onPress}
              >
                <Button
                  variant="icon"
                  icon={action.icon}
                  onPress={action.onPress}
                  style={{ marginBottom: theme.spacing.xs }}
                />
                <Text style={{ textAlign: 'center' }}>{action.title}</Text>
              </Card>
            ))}
          </View>

          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: theme.spacing.md }}>
            Upcoming Appointments
          </Text>
          {upcomingAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              style={{ marginBottom: theme.spacing.sm }}
              onPress={() => router.push('/bookings')}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: theme.spacing.xs }}>
                  {appointment.service}
                </Text>
                <Text style={{ color: theme.colors.textSecondary }}>
                  {appointment.provider}
                </Text>
                <Text style={{ color: theme.colors.primary, marginTop: theme.spacing.xs }}>
                  {appointment.date} at {appointment.time}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      </Screen>
    </SafeArea>
  );
}
