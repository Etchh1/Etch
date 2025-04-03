import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { theme } from '@/styles/theme';

interface SafeAreaProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export function SafeArea({
  children,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}: SafeAreaProps) {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView style={[styles.container, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}); 