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
}

interface StatsigState {
  status: 'idle' | 'loading' | 'error' | 'success';
  error: Error | null;
  retryCount: number;
}

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
  userID = 'anonymous',
  maxRetries = 3,
  retryDelay = 1000,
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
          const currentRetryCount = state.retryCount;
          if (currentRetryCount < maxRetries) {
            // Exponential backoff for retries with jitter
            const baseDelay = retryDelay * Math.pow(2, currentRetryCount);
            const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
            const delay = baseDelay + jitter;
            
            retryTimeout = setTimeout(() => {
              setState(prev => ({
                ...prev,
                retryCount: prev.retryCount + 1,
                status: 'loading',
              }));
            }, delay);
          } else {
            setState({
              status: 'error',
              error: err instanceof Error ? err : new Error('Failed to initialize Statsig after multiple attempts'),
              retryCount: currentRetryCount,
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
  }, [userID, state.retryCount, maxRetries, retryDelay]);

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