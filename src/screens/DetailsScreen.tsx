import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  
  // Check for missing parameters
  const hasValidParams = route.params && 'id' in route.params;
  const id = hasValidParams ? (route.params as { id: string }).id : null;

  useEffect(() => {
    if (!hasValidParams) {
      // Automatically navigate back after 3 seconds if params are missing
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasValidParams, navigation]);

  const renderButton = (testID: string, label: string, onPress: () => void) => (
    <TouchableOpacity
      testID={testID}
      style={styles.button}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!hasValidParams) {
    return (
      <View 
        testID="details-container"
        style={styles.container}
        accessible={true}
        accessibilityLabel="Details Screen Error State"
        accessibilityRole="none"
      >
        <Text 
          testID="error-message" 
          style={styles.errorText}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel="Error: Missing ID parameter"
        >
          Error: Missing ID parameter
        </Text>
        {renderButton(
          'back-button',
          'Go Back',
          () => navigation.goBack()
        )}
      </View>
    );
  }

  return (
    <View 
      testID="details-container"
      style={styles.container}
      accessible={true}
      accessibilityLabel="Details Screen"
      accessibilityRole="none"
    >
      <Text 
        testID="details-title" 
        style={styles.title}
        accessible={true}
        accessibilityRole="header"
      >
        Details Screen
      </Text>
      <Text 
        testID="details-id" 
        style={styles.text}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Item ID: ${id}`}
      >
        ID: {id}
      </Text>
      
      {renderButton(
        'back-button',
        'Go Back',
        () => navigation.goBack()
      )}

      {renderButton(
        'settings-button',
        'Go to Settings',
        () => navigation.navigate('Settings')
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 