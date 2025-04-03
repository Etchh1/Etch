import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { authService } from './auth';

export interface NotificationData {
  type: 'booking' | 'message' | 'review' | 'system';
  bookingId?: string;
  messageId?: string;
  serviceId?: string;
  reviewId?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationData['type'];
  data?: NotificationData;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private pushToken: string | null = null;

  async initialize() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const token = await this.registerForPushNotifications();
      if (token) {
        await this.updatePushToken(token);
      }

      // Listen for incoming notifications
      Notifications.addNotificationReceivedListener(this.handleNotification);
      Notifications.addNotificationResponseReceivedListener(
        this.handleNotificationResponse
      );
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async registerForPushNotifications() {
    try {
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });
      this.pushToken = token;
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  private async updatePushToken(token: string) {
    try {
      const { user } = authService.getState();
      if (!user) return;

      const { error } = await supabase
        .from('user_push_tokens')
        .upsert({
          user_id: user.id,
          token,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating push token:', error);
    }
  }

  private handleNotification = (notification: Notifications.Notification) => {
    // Handle incoming notification while app is foregrounded
    console.log('Received notification:', notification);
  };

  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    // Handle notification tap/interaction
    const data = response.notification.request.content.data;
    this.handleNotificationAction(data);
  };

  private handleNotificationAction(data: NotificationData) {
    // Handle different notification types and navigate accordingly
    switch (data.type) {
      case 'booking':
        // Navigate to booking details
        break;
      case 'message':
        // Navigate to chat
        break;
      case 'review':
        // Navigate to service details
        break;
      default:
        // Default action
        break;
    }
  }

  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      // Save notification to database
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data,
          read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Get user's push token
      const { data: tokenData } = await supabase
        .from('user_push_tokens')
        .select('token')
        .eq('user_id', userId)
        .single();

      if (tokenData?.token) {
        // Send push notification
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: tokenData.token,
            title: notification.title,
            body: notification.body,
            data: notification.data,
          }),
        });
      }

      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async getNotifications(limit = 20, offset = 0) {
    try {
      const { user } = authService.getState();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const { user } = authService.getState();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const { user } = authService.getState();
      if (!user) throw new Error('User not authenticated');

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService(); 