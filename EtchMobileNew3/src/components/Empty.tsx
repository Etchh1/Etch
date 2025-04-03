import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { theme } from '@/styles/theme';
import { Button } from './Button';
import { Icon } from './Icon';

interface EmptyProps {
  title?: string;
  message?: string;
  icon?: {
    family?: string;
    name: string;
  };
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: StyleProp<ViewStyle>;
}

export function Empty({
  title = 'Nothing Here',
  message = 'No items to display at the moment.',
  icon = {
    family: 'MaterialCommunityIcons',
    name: 'inbox-outline',
  },
  action,
  style,
}: EmptyProps) {
  return (
    <View style={[styles.container, style]}>
      <Icon
        family={icon.family as any}
        name={icon.name}
        size={64}
        color={theme.colors.textSecondary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    minWidth: 200,
  },
}); 