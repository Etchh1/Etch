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
}

interface StatsigState {
  status: 'idle' | 'loading' | 'error' | 'success';
  error: Error | null;
  retryCount: number;
  lastErrorType?: 'network' | 'config' | 'initialization' | 'unknown';
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

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
  userID = 'anonymous',
  maxRetries = 3,
  retryDelay = 1000,
  maxJitter = 1000,
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
          
          // Determine error type
          let errorType: StatsigState['lastErrorType'] = 'unknown';
          if (isNetworkError(error)) {
            errorType = 'network';
          } else if (isConfigError(error)) {
            errorType = 'config';
          } else if (error.message.includes('initialization')) {
            errorType = 'initialization';
          }

          // Only retry for network and initialization errors
          const shouldRetry = (errorType === 'network' || errorType === 'initialization') && 
                            currentRetryCount < maxRetries;

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
              }));
            }, delay);
          } else {
            setState({
              status: 'error',
              error,
              retryCount: currentRetryCount,
              lastErrorType: errorType,
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
  }, [userID, state.retryCount, maxRetries, retryDelay, maxJitter]);

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