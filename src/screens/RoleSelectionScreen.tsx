import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { Text } from '../components/Themed';
import { authService, UserRole } from '../lib/auth';

export default function RoleSelectionScreen() {
  const [loading, setLoading] = React.useState(false);

  const handleRoleSelection = async (role: UserRole) => {
    try {
      setLoading(true);
      await authService.selectRole(role);
    } catch (error) {
      Alert.alert('Error', 'Failed to set user role. Please try again.');
      console.error('Role selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Etch!</Text>
        <Text style={styles.subtitle}>Please select your role:</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="I'm looking for services"
            onPress={() => handleRoleSelection('SERVICE_SEEKER')}
            disabled={loading}
            style={styles.button}
          />
          
          <Button
            title="I want to provide services"
            onPress={() => handleRoleSelection('SERVICE_PROVIDER')}
            disabled={loading}
            style={styles.button}
          />
        </View>
      </View>
    </Screen>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    width: '100%',
  },
}); 