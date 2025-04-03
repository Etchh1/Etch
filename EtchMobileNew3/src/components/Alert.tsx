import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { theme } from '@/styles/theme';
import { Icon } from './Icon';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

const alertConfig = {
  info: {
    icon: 'information-circle-outline',
    color: theme.colors.info,
  },
  success: {
    icon: 'checkmark-circle-outline',
    color: theme.colors.success,
  },
  warning: {
    icon: 'warning-outline',
    color: theme.colors.warning,
  },
  error: {
    icon: 'alert-circle-outline',
    color: theme.colors.error,
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  style,
}: AlertProps) {
  const config = alertConfig[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${config.color}10`,
          borderColor: config.color,
        },
        style,
      ]}
    >
      <Icon
        family="Ionicons"
        name={config.icon}
        size={24}
        color={config.color}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title && <Text style={[styles.title, { color: config.color }]}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
}); 