import React from 'react';
import { Screen } from '@/components/Screen';
import { View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { theme } from '@/styles/theme';

export default function ProfileScreen() {
  return (
    <SafeArea>
      <Screen title="Profile" showHeader={true}>
        <View style={{ alignItems: 'center', marginVertical: theme.spacing.lg }}>
          <Avatar
            size={80}
            name="John Doe"
            style={{ marginBottom: theme.spacing.md }}
          />
        </View>

        <Card style={{ marginBottom: theme.spacing.md }}>
          <Button
            variant="outline"
            title="Edit Profile"
            icon={{ name: 'person', family: 'Ionicons' }}
            onPress={() => {}}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Button
            variant="outline"
            title="Settings"
            icon={{ name: 'settings', family: 'Ionicons' }}
            onPress={() => {}}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Button
            variant="outline"
            title="Help & Support"
            icon={{ name: 'help-circle', family: 'Ionicons' }}
            onPress={() => {}}
          />
        </Card>

        <Button
          variant="secondary"
          title="Sign Out"
          icon={{ name: 'log-out', family: 'Ionicons' }}
          onPress={() => {}}
        />
      </Screen>
    </SafeArea>
  );
} 