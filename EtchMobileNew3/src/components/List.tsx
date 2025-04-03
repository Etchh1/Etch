import React, { ReactElement, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  ListRenderItem,
  Text,
} from 'react-native';
import { theme } from '@/styles/theme';
import { Loading } from './Loading';
import { Error } from './Error';
import { Empty } from './Empty';
import { colors } from "../config/colors";

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListHeaderComponent?: ReactElement | null;
  ListFooterComponent?: ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  emptyProps?: {
    title?: string;
    message?: string;
    icon?: {
      family?: string;
      name: string;
    };
    action?: {
      label: string;
      onPress: () => void;
    };
  };
  ListEmptyComponent?: ReactElement | null;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loadingMore?: boolean;
  getItemLayout?: (data: ArrayLike<T> | null | undefined, index: number) => { length: number; offset: number; index: number };
  retryButtonText?: string;
  errorTitle?: string;
  errorMessage?: string;
  loadingText?: string;
  emptyText?: string;
  emptyComponent?: ReactElement;
  loadingMoreText?: string;
}

export function List<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading = false,
  error = null,
  onRetry,
  onRefresh,
  isRefreshing = false,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  style,
  emptyProps,
  ListEmptyComponent,
  onEndReached,
  onEndReachedThreshold = 0.5,
  loadingMore = false,
  getItemLayout,
  retryButtonText = 'Try Again',
  errorTitle = 'Error',
  errorMessage = 'Something went wrong',
  loadingText = 'Loading...',
  emptyText = 'No items found',
  emptyComponent,
  loadingMoreText = 'Loading more...',
}: ListProps<T>) {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  if (isLoading && !isRefreshing) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <Error
        title={errorTitle}
        message={errorMessage}
        onRetry={handleRetry}
        style={styles.errorContainer}
      />
    );
  }

  const renderFooter = useCallback(() => {
    if (!loadingMore) return ListFooterComponent;
    
    return (
      <View style={styles.footer}>
        {ListFooterComponent}
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }, [loadingMore, ListFooterComponent]);

  const renderItemWrapper: ListRenderItem<T> = useCallback(({ item }) => renderItem(item), [renderItem]);

  const keyExtractorWrapper = useCallback((item: T) => keyExtractor(item), [keyExtractor]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  const handleEndReached = useCallback(() => {
    if (onEndReached && !loadingMore) {
      onEndReached();
    }
  }, [onEndReached, loadingMore]);

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {emptyComponent || (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );

  const FooterComponent = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>{loadingMoreText}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItemWrapper}
      keyExtractor={keyExtractorWrapper}
      contentContainerStyle={[
        styles.contentContainer,
        !data.length && styles.emptyContainer,
        contentContainerStyle,
      ]}
      style={[styles.list, style]}
      ListEmptyComponent={
        ListEmptyComponent || (!isLoading && !error ? <EmptyComponent /> : null)
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        <>
          {renderFooter()}
          <FooterComponent />
        </>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  footer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  footerContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
}); 