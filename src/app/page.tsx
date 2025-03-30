'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState, useCallback } from 'react'
import { useFeatureFlag, useConfigValue, StatsigWrapper } from '@/lib/statsig-client'

interface ConnectionStatus {
  status: 'checking' | 'success' | 'error';
  message: string;
  error?: Error;
  timestamp?: number;
}

interface ErrorReport {
  type: 'supabase' | 'statsig';
  error: Error;
  errorType?: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Checking connection...'
  });

  const [errors, setErrors] = useState<ErrorReport[]>([]);

  const reportError = useCallback((report: ErrorReport) => {
    console.error(`[${report.type.toUpperCase()}] Error:`, report.error);
    setErrors(prev => [...prev, report]);
    
    // Here you could send the error to your error tracking service
    // Example: sendToErrorTrackingService(report);
  }, []);

  const handleStatsigError = useCallback((error: Error, errorType: string) => {
    reportError({
      type: 'statsig',
      error,
      errorType,
      timestamp: Date.now(),
      context: {
        featureFlags: {
          welcome_message: useFeatureFlag('welcome_message'),
          welcome_text: useConfigValue('welcome_text')
        }
      }
    });
  }, [reportError]);

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
          message: '✅ Successfully connected to Supabase!',
          timestamp: Date.now()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorObj = error instanceof Error ? error : new Error(errorMessage);
        
        setConnectionStatus({
          status: 'error',
          message: `❌ Connection error: ${errorMessage}`,
          error: errorObj,
          timestamp: Date.now()
        });

        reportError({
          type: 'supabase',
          error: errorObj,
          timestamp: Date.now(),
          context: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            table: '_tables'
          }
        });
      }
    };

    checkConnection();
  }, [reportError]);

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
            {errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <h2 className="text-red-700 font-semibold mb-2">Recent Errors:</h2>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.slice(-3).map((error, index) => (
                    <li key={index}>
                      {error.type.toUpperCase()}: {error.error.message}
                      {error.errorType && ` (${error.errorType})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </StatsigWrapper>
  );
} 