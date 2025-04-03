import React, { useState } from 'react';
import { Screen } from '@/components/Screen';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { Card } from '@/components/Card';
import { Empty } from '@/components/Empty';
import { Avatar } from '@/components/Avatar';
import { theme } from '@/styles/theme';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function MessagesScreen() {
  // Sample data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        id: '101',
        name: 'John\'s Salon',
      },
      lastMessage: 'Your appointment has been confirmed',
      timestamp: '10:30 AM',
      unread: true,
    },
    {
      id: '2',
      sender: {
        id: '102',
        name: 'Wellness Spa',
      },
      lastMessage: 'Would you like to reschedule?',
      timestamp: 'Yesterday',
      unread: false,
    },
  ]);

  return (
    <SafeArea>
      <Screen title="Messages" showHeader={true}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}}>
              <Card style={{ marginBottom: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar
                    size={50}
                    name={item.sender.name}
                    source={item.sender.avatar}
                    style={{ marginRight: theme.spacing.sm }}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 16, fontWeight: '600' }}>
                        {item.sender.name}
                      </Text>
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                        {item.timestamp}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          flex: 1,
                          color: item.unread ? theme.colors.text : theme.colors.textSecondary,
                          fontWeight: item.unread ? '500' : 'normal',
                        }}
                        numberOfLines={1}
                      >
                        {item.lastMessage}
                      </Text>
                      {item.unread && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.colors.primary,
                            marginLeft: theme.spacing.sm,
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Empty
              title="No messages"
              message="Your messages will appear here"
              icon={{ name: 'chatbubbles', family: 'Ionicons' }}
            />
          }
        />
      </Screen>
    </SafeArea>
  );
} 