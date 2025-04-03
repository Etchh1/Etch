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
import { theme } from '@/styles/theme';
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
    const contentStyle = [
      styles.content,
      padding && styles.padding,
      style,
    ];

    const contentContainerStyleWithPadding = [
      styles.contentContainer,
      padding && styles.padding,
      contentContainerStyle,
    ];

    if (isLoading) {
      return (
        <View style={[styles.loadingContainer, contentStyle]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.errorContainer, contentStyle]}>
          <Error
            title={errorTitle}
            message={errorMessage}
            onRetry={onRetry}
            retryButtonText={retryButtonText}
          />
        </View>
      );
    }

    if (scrollable) {
      return (
        <ScrollView
          style={contentStyle}
          contentContainerStyle={contentContainerStyleWithPadding}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[contentStyle, contentContainerStyleWithPadding]}>
        {children}
      </View>
    );
  };

  const Container = safeArea ? SafeArea : View;

  return (
    <Container
      style={[
        styles.screen,
        { backgroundColor },
        style,
      ]}
      edges={safeAreaEdges}
    >
      {showHeader && title && (
        <Header
          title={title}
          showBack={showBack}
          rightAction={rightAction}
        />
      )}
      {renderContent()}
    </Container>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing.md,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
}); 