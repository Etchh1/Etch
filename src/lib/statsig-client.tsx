'use client'

import React from 'react';
import { StatsigProvider } from '@statsig/react-bindings';
import { StatsigClient } from '@statsig/js-client';

const client = new StatsigClient(
  process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
  { userID: 'anonymous' }
);

export const initializeStatsig = async () => {
  if (typeof window !== 'undefined') {
    try {
      await client.initializeAsync();
      console.log('Statsig initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Statsig:', error);
    }
  }
};

export const StatsigWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    initializeStatsig();
  }, []);

  return (
    <StatsigProvider client={client}>
      {children}
    </StatsigProvider>
  );
};

export const useFeatureFlag = (flagName: string) => {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(client.getFeatureGate(flagName).value);
    }
  }, [flagName]);

  return value;
};

export const useConfigValue = (configName: string) => {
  const [value, setValue] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(client.getDynamicConfig(configName).value);
    }
  }, [configName]);

  return { value };
}; 