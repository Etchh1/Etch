import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../config/colors';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: {
    icon: {
      family?: string;
      name: string;
    };
    onPress: () => void;
  };
}

export function Header({ title, showBack = true, rightAction }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightAction && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightAction.onPress}
        >
          <Text style={styles.rightButtonText}>{rightAction.icon.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  rightButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  rightButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
}); 