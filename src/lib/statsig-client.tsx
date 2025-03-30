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

export const StatsigWrapper = ({ children }: { children: React.ReactNode }) => {
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const client = new StatsigClient(
          process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || '',
          { userID: 'test-user' } // Replace with actual user ID logic
        );
        await client.initializeAsync();
        setStatsigClient(client);
      } catch (error) {
        console.error('Failed to initialize Statsig:', error);
      }
    };

    initClient();
  }, []);

  if (!statsigClient) {
    return null; // Or a loading component
  }

  return (
    <StatsigProvider client={statsigClient}>
      {children}
    </StatsigProvider>
  );
}; 