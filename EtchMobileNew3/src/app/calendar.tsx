import React from 'react';
import { Screen } from '@/components/Screen';
import { View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { Empty } from '@/components/Empty';
import { theme } from '@/styles/theme';

export default function CalendarScreen() {
  return (
    <SafeArea>
      <Screen title="Calendar" showHeader={true}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Empty
            title="Coming Soon"
            message="Calendar feature will be available in the next update"
            icon={{ name: 'calendar', family: 'Ionicons' }}
          />
        </View>
      </Screen>
    </SafeArea>
  );
} 