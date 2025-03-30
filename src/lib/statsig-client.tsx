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

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
  userID = 'anonymous',
  maxRetries = 3,
  retryDelay = 1000,
}: StatsigWrapperProps) => {
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    let client: StatsigClient | null = null;
    let retryTimeout: NodeJS.Timeout;

    const initClient = async () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('Statsig client key is not configured');
        }

        client = new StatsigClient(clientKey, { userID });
        await client.initializeAsync();

        if (mounted) {
          setStatsigClient(client);
          setError(null);
          setRetryCount(0);
        }
      } catch (err) {
        console.error('Failed to initialize Statsig:', err);
        
        if (mounted) {
          if (retryCount < maxRetries) {
            // Exponential backoff for retries
            const delay = retryDelay * Math.pow(2, retryCount);
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, delay);
          } else {
            setError(err instanceof Error ? err : new Error('Failed to initialize Statsig after multiple attempts'));
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
  }, [userID, retryCount, maxRetries, retryDelay]);

  if (error) {
    return errorComponent;
  }

  if (!statsigClient) {
    return loadingComponent;
  }

  return (
    <StatsigProvider client={statsigClient}>
      {children}
    </StatsigProvider>
  );
}; 