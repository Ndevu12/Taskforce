import toast from 'react-hot-toast';
import { logger } from './logger';

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  type: 'unhandledRejection' | 'error' | 'uncaughtException';
}

class GlobalErrorHandler {
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) {
      logger.warn('GlobalErrorHandler already initialized');
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    // Handle uncaught JavaScript errors
    window.addEventListener('error', this.handleError);

    // Handle uncaught exceptions (less common in browsers)
    window.addEventListener('uncaughtexception', this.handleError);

    this.isInitialized = true;
    logger.info('GlobalErrorHandler initialized');
  }

  public cleanup() {
    if (!this.isInitialized) {
      return;
    }

    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('uncaughtexception', this.handleError);

    this.isInitialized = false;
    logger.info('GlobalErrorHandler cleaned up');
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault(); // Prevent the default browser behavior

    const error = event.reason;
    const errorReport = this.createErrorReport(
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined,
      'unhandledRejection'
    );

    this.logError(errorReport);
    this.showUserNotification('An unexpected error occurred. Please try again.');
  };

  private handleError = (event: ErrorEvent) => {
    event.preventDefault(); // Prevent the default browser behavior

    const errorReport = this.createErrorReport(
      event.message,
      undefined, // Browser doesn't provide stack trace in ErrorEvent
      'error'
    );

    this.logError(errorReport);
    this.showUserNotification('An unexpected error occurred. Please refresh the page.');
  };

  private createErrorReport(
    message: string,
    stack?: string,
    type: ErrorReport['type'] = 'error'
  ): ErrorReport {
    return {
      message,
      stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      type,
    };
  }

  private logError(errorReport: ErrorReport) {
    logger.error('Global Error Report', errorReport);
    this.sendToErrorReportingService(errorReport);
  }

  private sendToErrorReportingService(errorReport: ErrorReport) {
    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your backend API
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      }).catch((err) => {
        logger.error('Failed to send error report', err);
      });
    }
  }

  private showUserNotification(message: string) {
    // Show a user-friendly notification
    try {
      toast.error(message, {
        duration: 6000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
    } catch (error) {
      // Fallback if toast is not available
      console.error('Toast notification failed:', error);
      // Show a simple alert as fallback
      alert(message);
    }
  }
}

// Create a singleton instance
export const globalErrorHandler = new GlobalErrorHandler();

// Export for easy initialization
export const initializeGlobalErrorHandler = () => {
  globalErrorHandler.initialize();
};

export const cleanupGlobalErrorHandler = () => {
  globalErrorHandler.cleanup();
};
