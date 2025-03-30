'use client'

import React, { useEffect, useState } from 'react';
import { StatsigProvider, useGateValue, useDynamicConfig } from '@statsig/react-bindings';
import { StatsigClient } from '@statsig/js-client';

export const useFeatureFlag = (flagName: string) => {
  return useGateValue(flagName);
};

export const useConfigValue = (configName: string) => {
  const config = useDynamicConfig(configName);
  return config.value;
};

interface StatsigWrapperProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  userID?: string;
  maxRetries?: number;
  retryDelay?: number;
  maxJitter?: number;
  onError?: (error: Error, errorType: StatsigErrorType) => void;
}

type StatsigErrorType = 
  | 'network'
  | 'config'
  | 'initialization'
  | 'timeout'
  | 'rate_limit'
  | 'server_error'
  | 'unknown';

interface StatsigState {
  status: 'idle' | 'loading' | 'error' | 'success';
  error: Error | null;
  retryCount: number;
  lastErrorType?: StatsigErrorType;
  lastErrorTime?: number;
}

const isNetworkError = (error: Error): boolean => {
  return error.message.includes('network') || 
         error.message.includes('timeout') ||
         error.message.includes('fetch');
};

const isConfigError = (error: Error): boolean => {
  return error.message.includes('client key') || 
         error.message.includes('configuration');
};

const isRateLimitError = (error: Error): boolean => {
  return error.message.includes('rate limit') || 
         error.message.includes('429') ||
         error.message.includes('too many requests');
};

const isServerError = (error: Error): boolean => {
  return error.message.includes('500') || 
         error.message.includes('server error') ||
         error.message.includes('internal server error');
};

const categorizeError = (error: Error): StatsigErrorType => {
  if (isNetworkError(error)) {
    return error.message.includes('timeout') ? 'timeout' : 'network';
  }
  if (isConfigError(error)) {
    return 'config';
  }
  if (isRateLimitError(error)) {
    return 'rate_limit';
  }
  if (isServerError(error)) {
    return 'server_error';
  }
  if (error.message.includes('initialization')) {
    return 'initialization';
  }
  return 'unknown';
};

const shouldRetryError = (errorType: StatsigErrorType): boolean => {
  // Retry on network issues, timeouts, rate limits, and server errors
  return ['network', 'timeout', 'rate_limit', 'server_error', 'initialization'].includes(errorType);
};

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
  userID = 'anonymous',
  maxRetries = 3,
  retryDelay = 1000,
  maxJitter = 1000,
  onError,
}: StatsigWrapperProps) => {
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null);
  const [state, setState] = useState<StatsigState>({
    status: 'idle',
    error: null,
    retryCount: 0,
  });

  useEffect(() => {
    let mounted = true;
    let client: StatsigClient | null = null;
    let retryTimeout: NodeJS.Timeout;

    const initClient = async () => {
      try {
        setState(prev => ({ ...prev, status: 'loading' }));
        
        const clientKey = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('Statsig client key is not configured');
        }

        client = new StatsigClient(clientKey, { userID });
        await client.initializeAsync();

        if (mounted) {
          setStatsigClient(client);
          setState({
            status: 'success',
            error: null,
            retryCount: 0,
          });
        }
      } catch (err) {
        console.error('Failed to initialize Statsig:', err);
        
        if (mounted) {
          const error = err instanceof Error ? err : new Error('Failed to initialize Statsig');
          const currentRetryCount = state.retryCount;
          const errorType = categorizeError(error);
          const now = Date.now();
          
          // Notify error handler if provided
          onError?.(error, errorType);

          // Check if we should retry based on error type and retry count
          const shouldRetry = shouldRetryError(errorType) && currentRetryCount < maxRetries;

          if (shouldRetry) {
            // Exponential backoff with jitter
            const baseDelay = retryDelay * Math.pow(2, currentRetryCount);
            const jitter = Math.random() * maxJitter;
            const delay = Math.min(baseDelay + jitter, 30000); // Cap at 30 seconds
            
            retryTimeout = setTimeout(() => {
              setState(prev => ({
                ...prev,
                retryCount: prev.retryCount + 1,
                status: 'loading',
                lastErrorType: errorType,
                lastErrorTime: now,
              }));
            }, delay);
          } else {
            setState({
              status: 'error',
              error,
              retryCount: currentRetryCount,
              lastErrorType: errorType,
              lastErrorTime: now,
            });
          }
        }
      }
    };

    initClient();

    return () => {
      mounted = false;
      if (client) {
        client.shutdown();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [userID, state.retryCount, maxRetries, retryDelay, maxJitter, onError]);

  if (state.status === 'error') {
    return errorComponent;
  }

  if (state.status === 'loading' || !statsigClient) {
    return loadingComponent;
  }

  return (
    <StatsigProvider client={statsigClient}>
      {children}
    </StatsigProvider>
  );
}; 