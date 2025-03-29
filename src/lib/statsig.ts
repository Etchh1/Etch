import { Statsig } from 'statsig-js';

export const initializeStatsig = async () => {
  try {
    await Statsig.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!);
    console.log('Statsig initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Statsig:', error);
  }
};

export const getFeatureFlag = (flagName: string) => {
  return Statsig.checkGate(flagName);
};

export const getConfigValue = (configName: string, defaultValue: any = null) => {
  return Statsig.getConfig(configName).value || defaultValue;
}; 