import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { aiService } from '../lib/ai';
import { Card } from '../components/Card';

export default function AIHelperScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImproveRequest = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter your request');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.improveServiceRequest(input);
      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.data) {
        setResult(response.data);
      }
    } catch (error: unknown) {
      console.error('Failed to process request:', error);
      Alert.alert('Error', 'Failed to process your request');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter your needs');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.getServiceSuggestions(input);
      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.data) {
        setResult(
          response.data
            .map(
              (suggestion) =>
                `${suggestion.category}: ${suggestion.serviceType}`
            )
            .join('\n\n')
        );
      }
    } catch (error: unknown) {
      console.error('Failed to get suggestions:', error);
      Alert.alert('Error', 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>
          Let me help you describe your service needs or get suggestions
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Describe what you're looking for..."
          value={input}
          onChangeText={setInput}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Improve My Request"
            onPress={handleImproveRequest}
            disabled={loading}
            style={styles.button}
          />
          <Button
            title="Get Suggestions"
            onPress={handleGetSuggestions}
            disabled={loading}
            style={styles.button}
          />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Processing your request...</Text>
          </View>
        )}

        {result && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Suggestion</Text>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  resultCard: {
    padding: 15,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 