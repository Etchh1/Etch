'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useFeatureFlag, useConfigValue, StatsigWrapper } from '@/lib/statsig-client'

interface ConnectionStatus {
  status: 'checking' | 'success' | 'error';
  message: string;
  error?: Error;
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Checking connection...'
  });

  const handleStatsigError = (error: Error, errorType: string) => {
    console.error(`Statsig error (${errorType}):`, error);
    // You could send this to your error tracking service here
  };

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkConnection = async () => {
      try {
        await supabase.from('_tables').select('*').limit(1);
        setConnectionStatus({
          status: 'success',
          message: '✅ Successfully connected to Supabase!'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setConnectionStatus({
          status: 'error',
          message: `❌ Connection error: ${errorMessage}`,
          error: error instanceof Error ? error : new Error(errorMessage)
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <StatsigWrapper onError={handleStatsigError}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">
            {useFeatureFlag('welcome_message') 
              ? String(useConfigValue('welcome_text') || 'Welcome to Etch') 
              : 'Welcome to Etch'}
          </h1>
          <div className="text-xl space-y-4">
            <p className={connectionStatus.status === 'error' ? 'text-red-500' : ''}>
              Supabase Status: {connectionStatus.message}
            </p>
            <p>
              Statsig Status: {useFeatureFlag('welcome_message') 
                ? '✅ Feature flag enabled' 
                : '❌ Feature flag disabled'}
            </p>
          </div>
        </div>
      </main>
    </StatsigWrapper>
  );
} 