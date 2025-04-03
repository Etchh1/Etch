import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@/styles/theme';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined';
  onPress?: TouchableOpacityProps['onPress'];
}

export function Card({
  children,
  variant = 'elevated',
  style,
  onPress,
  ...props
}: CardProps) {
  const cardStyles = [
    styles.card,
    variant === 'elevated' && styles.cardElevated,
    variant === 'outlined' && styles.cardOutlined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  cardElevated: {
    ...theme.shadows.medium,
  },
  cardOutlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}); 