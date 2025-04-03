import React, { useState, useEffect } from 'react';
import { StatsigProvider, useGateValue, useDynamicConfig } from '@statsig/react-bindings';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { STATSIG_CLIENT_KEY } from '@env';

if (!STATSIG_CLIENT_KEY) {
  throw new Error('Missing Statsig client key');
}

interface StatsigWrapperProps {
  children: React.ReactNode;
}

export const StatsigWrapper = ({ children }: StatsigWrapperProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Give a small delay to allow Statsig to initialize
    const timer = setTimeout(() => setIsInitialized(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <StatsigProvider
        sdkKey={STATSIG_CLIENT_KEY}
        user={{ userID: 'anonymous' }}
        options={{
          environment: { tier: __DEV__ ? 'development' : 'production' },
        }}
      >
        {!isInitialized ? (
          <LoadingScreen message="Initializing Statsig..." />
        ) : (
          children
        )}
      </StatsigProvider>
    </ErrorBoundary>
  );
};

export const useFeatureFlag = (gateName: string): boolean | null => {
  const value = useGateValue(gateName);
  return value === undefined ? null : value;
};

export const useConfigValue = <T,>(configName: string): T | null => {
  const config = useDynamicConfig(configName);
  return config.value as T;
}; 