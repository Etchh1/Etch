import { useState, useCallback } from 'react';
import { ApiError } from '@/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiResult<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        options.onSuccess?.(result);
      } catch (err) {
        const apiError: ApiError = err instanceof Error
          ? {
              message: err.message,
              status: 500,
            }
          : {
              message: 'An unexpected error occurred',
              status: 500,
            };
        setError(apiError);
        options.onError?.(apiError);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
} 