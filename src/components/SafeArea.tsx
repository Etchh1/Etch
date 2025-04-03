import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: React.ReactNode;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  style?: ViewStyle;
}

export function SafeArea({ children, edges = ['top', 'right', 'bottom', 'left'], style }: SafeAreaProps) {
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
  };

  return <View style={[styles.container, padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 