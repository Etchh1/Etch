import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFeatureFlag } from '../lib/statsig';

export const DarkModeFeature = () => {
  // Use the feature flag hook with your specific feature name
  const isDarkModeEnabled = useFeatureFlag('dark_mode_feature');

  // Handle the loading state
  if (isDarkModeEnabled === null) {
    return (
      <View style={styles.container}>
        <Text>Loading dark mode settings...</Text>
      </View>
    );
  }

  // Show different content based on the feature flag
  return (
    <View style={[styles.container, isDarkModeEnabled && styles.darkContainer]}>
      <Text style={[styles.text, isDarkModeEnabled && styles.darkText]}>
        {isDarkModeEnabled ? 'Dark Mode is Active' : 'Light Mode is Active'}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, isDarkModeEnabled && styles.darkButton]}
        onPress={() => {
          // Your button action here
        }}
      >
        <Text style={[styles.buttonText, isDarkModeEnabled && styles.darkButtonText]}>
          Toggle Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
  button: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  darkButton: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#ffffff',
  },
}); 