import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  KeyboardAvoidingViewProps,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeArea } from './SafeArea';
import { Header } from './Header';
import { Error } from './Error';
import { colors } from '../config/colors';

interface ScreenProps extends Omit<KeyboardAvoidingViewProps, 'children'> {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBack?: boolean;
  rightAction?: {
    icon: {
      family?: string;
      name: string;
    };
    onPress: () => void;
  };
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  padding?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingText?: string;
  errorTitle?: string;
  errorMessage?: string;
  retryButtonText?: string;
  safeArea?: boolean;
  safeAreaEdges?: ("top" | "right" | "bottom" | "left")[];
  backgroundColor?: string;
}

export function Screen({
  children,
  title,
  showHeader = true,
  showBack = true,
  rightAction,
  scrollable = true,
  style,
  contentContainerStyle,
  padding = true,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 88 : 0,
  isLoading = false,
  error = null,
  onRetry,
  loadingText = "Loading...",
  errorTitle = "Error",
  errorMessage = "Something went wrong",
  retryButtonText = "Try Again",
  safeArea = true,
  safeAreaEdges = ["top", "right", "bottom", "left"],
  backgroundColor = colors.background,
  ...keyboardProps
}: ScreenProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <Error
          title={errorTitle}
          message={errorMessage}
          buttonText={retryButtonText}
          onPress={onRetry}
        />
      );
    }

    return children;
  };

  const content = (
    <View
      style={[
        styles.container,
        { backgroundColor },
        padding && styles.padding,
        style,
      ]}
    >
      {showHeader && (
        <Header
          title={title}
          showBack={showBack}
          rightAction={rightAction}
        />
      )}
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      ) : (
        renderContent()
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.keyboardAvoidingView}
      {...keyboardProps}
    >
      {safeArea ? (
        <SafeArea edges={safeAreaEdges}>{content}</SafeArea>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padding: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
}); 