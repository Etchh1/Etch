import { StatsigProvider, useConfig, useGate } from '@statsig/react-bindings';
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

export const StatsigWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StatsigProvider>
      <SessionReplay />
      <WebAnalytics />
      {children}
    </StatsigProvider>
  );
};

export const useFeatureFlag = (flagName: string) => {
  return useGate(flagName);
};

export const useConfigValue = (configName: string) => {
  return useConfig(configName);
}; 