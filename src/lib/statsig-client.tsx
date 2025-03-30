'use client'

import React, { useEffect, useState } from 'react';
import { StatsigProvider, useGateValue, useDynamicConfig } from '@statsig/react-bindings';
import { StatsigClient } from '@statsig/js-client';

let client: StatsigClient | null = null;

export const initializeStatsig = async (userID: string) => {
  if (!client) {
    client = new StatsigClient(
      process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || '',
      { userID }
    );
    await client.initializeAsync();
  }
  return client;
};

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
      const userID = 'test-user'; // Replace with actual user ID logic
      const client = await initializeStatsig(userID);
      setStatsigClient(client);
    };

    initClient();
  }, []);

  if (!statsigClient) {
    return null;
  }

  return (
    <StatsigProvider client={statsigClient}>
      {children}
    </StatsigProvider>
  );
}; 