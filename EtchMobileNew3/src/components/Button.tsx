import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  family?: string;
  size?: number;
  color?: string;
}

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'icon';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: IconProps;
  isLoading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  icon,
  isLoading = false,
}: ButtonProps) {
  const buttonStyles = StyleSheet.flatten([
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'outline' && styles.buttonOutline,
    variant === 'text' && styles.buttonText,
    variant === 'icon' && styles.buttonIcon,
    disabled && styles.buttonDisabled,
    style,
  ]);

  const textStyles = StyleSheet.flatten([
    styles.text,
    variant === 'secondary' && styles.textSecondary,
    variant === 'outline' && styles.textOutline,
    variant === 'text' && styles.textPlain,
    disabled && styles.textDisabled,
    textStyle,
  ]);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : theme.colors.background}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon.name as any}
              size={icon.size || 20}
              color={
                icon.color ||
                (variant === 'primary' || variant === 'secondary'
                  ? theme.colors.background
                  : theme.colors.primary)
              }
              style={title ? { marginRight: 8 } : undefined}
            />
          )}
          {title && <Text style={textStyles}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    minHeight: 48,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: undefined,
  },
  buttonIcon: {
    backgroundColor: 'transparent',
    padding: theme.spacing.xs,
    minHeight: undefined,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: theme.colors.background,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textPlain: {
    color: theme.colors.text,
  },
  textDisabled: {
    opacity: 0.5,
  },
}); 