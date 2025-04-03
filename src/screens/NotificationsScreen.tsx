import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { notificationService, Notification } from '../lib/notifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }

      if (notification.data) {
        switch (notification.data.type) {
          case 'booking':
            if (notification.data.bookingId) {
              router.push(`/bookings/${notification.data.bookingId}`);
            }
            break;
          case 'message':
            if (notification.data.messageId) {
              router.push(`/messages/${notification.data.messageId}`);
            }
            break;
          case 'review':
            if (notification.data.serviceId) {
              router.push(`/services/${notification.data.serviceId}`);
            }
            break;
          default:
            // Handle other notification types
            break;
        }
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Card
        style={[
          styles.notificationCard,
          !item.read && styles.unreadNotification,
        ]}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.notificationMeta}>
            <Text style={styles.notificationType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text style={styles.notificationTime}>
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteNotification(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator style={styles.loader} size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          {notifications.some((n) => !n.read) && (
            <Button
              title="Mark All as Read"
              onPress={handleMarkAllAsRead}
              style={styles.markAllButton}
            />
          )}
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No notifications to display.
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllButton: {
    paddingHorizontal: 15,
    height: 36,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    flexGrow: 1,
  },
  notificationCard: {
    marginBottom: 15,
    padding: 15,
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notificationMeta: {
    flex: 1,
  },
  notificationType: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666666',
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
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