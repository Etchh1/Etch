import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFeatureFlag } from '../lib/statsig';

export const ExampleFeature = () => {
  // Use the feature flag hook
  const isNewFeatureEnabled = useFeatureFlag('new_feature');

  // Handle the loading state
  if (isNewFeatureEnabled === null) {
    return (
      <View style={styles.container}>
        <Text>Loading feature flag...</Text>
      </View>
    );
  }

  // Show different content based on the feature flag
  return (
    <View style={styles.container}>
      {isNewFeatureEnabled ? (
        <Text style={styles.text}>New Feature is Enabled!</Text>
      ) : (
        <Text style={styles.text}>New Feature is Disabled</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 