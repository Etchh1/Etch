import React from 'react';
import { StatsigProvider } from '@statsig/react-bindings';
import { SessionReplay } from '@statsig/session-replay';
import { WebAnalytics } from '@statsig/web-analytics';

export const initializeStatsig = async () => {
  try {
    await StatsigProvider.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!);
    console.log('Statsig initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Statsig:', error);
  }
};

export const StatsigWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StatsigProvider>
      <SessionReplay />
      <WebAnalytics />
      {children}
    </StatsigProvider>
  );
};

export const useFeatureFlag = (flagName: string) => {
  const [value] = React.useState(false);
  return value;
};

export const useConfigValue = (configName: string) => {
  const [value] = React.useState({ value: null });
  return value;
}; 