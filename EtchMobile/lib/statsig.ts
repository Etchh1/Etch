import React from 'react';
import { StatsigProvider, useGate, useConfig } from '@statsig/react-native-bindings';
import { STATSIG_CLIENT_KEY } from '@env';

if (!STATSIG_CLIENT_KEY) {
  throw new Error('Missing Statsig client key');
}

interface StatsigWrapperProps {
  children: React.ReactNode;
}

export const StatsigWrapper = ({ children }: StatsigWrapperProps) => {
  return (
    <StatsigProvider
      sdkKey={STATSIG_CLIENT_KEY}
      waitForInitialization={true}
      options={{
        environment: { tier: __DEV__ ? 'development' : 'production' },
      }}
    >
      {children}
    </StatsigProvider>
  );
};

export const useFeatureFlag = (gateName: string) => {
  return useGate(gateName);
};

export const useConfigValue = (configName: string) => {
  return useConfig(configName);
}; 