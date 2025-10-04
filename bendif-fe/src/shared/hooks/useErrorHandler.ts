import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    let errorMessage = fallbackMessage;
    let errorCode: string | undefined;

    // Extract error information
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
      errorCode = (error as any).code;
    }

    // Log error using our logger
    if (logError) {
      logger.error('Error handled by useErrorHandler', error);
    }

    // Show user-friendly toast notification
    if (showToast) {
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right',
      });
    }

    return {
      message: errorMessage,
      code: errorCode,
      originalError: error,
    };
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};
