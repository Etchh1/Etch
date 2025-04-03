import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DarkModeFeature } from '../components/DarkModeFeature';

export const MainScreen = () => {
  return (
    <View style={styles.container}>
      <DarkModeFeature />
      {/* Other components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 