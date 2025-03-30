'use client'

import React from 'react';
import * as Statsig from '@statsig/js-client';

export const initializeStatsig = async () => {
  if (typeof window !== 'undefined') {
    try {
      await Statsig.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!);
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

  return <>{children}</>;
};

export const useFeatureFlag = (flagName: string) => {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(Statsig.checkGate(flagName));
    }
  }, [flagName]);

  return value;
};

export const useConfigValue = (configName: string) => {
  const [value, setValue] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(Statsig.getConfig(configName).value);
    }
  }, [configName]);

  return { value };
}; 