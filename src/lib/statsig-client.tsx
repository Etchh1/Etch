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
}

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
}: StatsigWrapperProps) => {
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY) {
          throw new Error('Statsig client key is not configured');
        }

        const client = new StatsigClient(
          process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY,
          { userID: 'test-user' } // Replace with actual user ID logic
        );
        await client.initializeAsync();
        setStatsigClient(client);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Statsig:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Statsig'));
      }
    };

    initClient();
  }, []);

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