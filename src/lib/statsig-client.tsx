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
}

export const StatsigWrapper = ({
  children,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Failed to initialize feature flags</div>,
  userID = 'anonymous',
}: StatsigWrapperProps) => {
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let client: StatsigClient | null = null;

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
        }
      } catch (err) {
        console.error('Failed to initialize Statsig:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize Statsig'));
        }
      }
    };

    initClient();

    return () => {
      mounted = false;
      if (client) {
        client.shutdown();
      }
    };
  }, [userID]);

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