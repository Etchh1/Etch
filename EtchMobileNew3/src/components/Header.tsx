import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';
import { Icon } from './Icon';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: {
      family?: string;
      name: string;
    };
    onPress: () => void;
  };
  style?: StyleProp<ViewStyle>;
}

export function Header({
  title,
  showBack = true,
  rightAction,
  style,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon
            family="Ionicons"
            name="chevron-back"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightAction ? (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightAction.onPress}
        >
          <Icon
            family={rightAction.icon.family}
            name={rightAction.icon.name}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  title: {
    flex: 1,
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
  },
  rightButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  rightPlaceholder: {
    width: 40,
    marginLeft: theme.spacing.sm,
  },
}); 