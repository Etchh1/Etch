import React, { useState } from 'react';
import { StatsigProvider } from '@statsig/react-bindings';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { STATSIG_CLIENT_KEY } from '@env';
import { useGate, useDynamicConfig } from '@statsig/react-bindings';

if (!STATSIG_CLIENT_KEY) {
  throw new Error('Missing Statsig client key');
}

interface StatsigWrapperProps {
  children: React.ReactNode;
}

export const StatsigWrapper = ({ children }: StatsigWrapperProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <ErrorBoundary>
      <StatsigProvider
        sdkKey={STATSIG_CLIENT_KEY}
        waitForInitialization={true}
        options={{
          environment: { tier: __DEV__ ? 'development' : 'production' },
        }}
        onInitialized={() => setIsInitialized(true)}
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

export const useFeatureFlag = (gateName: string): boolean => {
  const { isLoading, value } = useGate(gateName);
  return !isLoading && value;
};

export const useConfigValue = <T,>(configName: string): T | null => {
  const { isLoading, value } = useDynamicConfig(configName);
  return !isLoading ? value as T : null;
}; 