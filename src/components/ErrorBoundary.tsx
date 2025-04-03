import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from './Themed';
import { Button } from './Button';
import { router } from 'expo-router';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRestart = () => {
    this.setState({ hasError: false, error: null });
    router.replace('/');
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          
          <ScrollView style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            {__DEV__ && this.state.error?.stack && (
              <Text style={styles.stackTrace}>{this.state.error.stack}</Text>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              title="Try Again"
              onPress={this.handleRetry}
              style={styles.button}
            />
            <Button
              title="Restart App"
              onPress={this.handleRestart}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    maxHeight: 300,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#e74c3c',
  },
  stackTrace: {
    fontSize: 12,
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  button: {
    flex: 1,
  },
}); 