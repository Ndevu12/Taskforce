import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Wifi, Server, Shield, AlertCircle } from 'lucide-react';
import { ErrorDetails } from '../../utils/errorHandler';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  error?: Error;
  errorDetails?: ErrorDetails;
  isFullScreen?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  onGoHome,
  showDetails = false,
  error,
  errorDetails,
  isFullScreen = false,
}) => {
  // Get error type specific content
  const getErrorContent = () => {
    if (errorDetails) {
      switch (errorDetails.type) {
        case 'network':
          return {
            title: 'Connection Problem',
            message: 'Please check your internet connection and try again.',
            icon: Wifi,
            iconColor: 'text-warning-200',
          };
        case 'server':
          return {
            title: 'Server Error',
            message: 'Our servers are experiencing issues. Please try again in a few moments.',
            icon: Server,
            iconColor: 'text-error-200',
          };
        case 'auth':
          return {
            title: 'Authentication Required',
            message: 'Please log in again to continue.',
            icon: Shield,
            iconColor: 'text-warning-200',
          };
        case 'validation':
          return {
            title: 'Invalid Input',
            message: errorDetails.message || 'Please check your input and try again.',
            icon: AlertCircle,
            iconColor: 'text-warning-200',
          };
        case 'client':
          return {
            title: 'Request Error',
            message: errorDetails.message || 'There was an issue with your request.',
            icon: AlertTriangle,
            iconColor: 'text-error-200',
          };
        default:
          return {
            title: title || "Oops! Something went wrong",
            message: message || "We're sorry, but something unexpected happened. Our team has been notified and is working to fix it.",
            icon: AlertTriangle,
            iconColor: 'text-error-200',
          };
      }
    }

    return {
      title: title || "Oops! Something went wrong",
      message: message || "We're sorry, but something unexpected happened. Our team has been notified and is working to fix it.",
      icon: AlertTriangle,
      iconColor: 'text-error-200',
    };
  };

  const errorContent = getErrorContent();
  const IconComponent = errorContent.icon;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const containerClass = isFullScreen 
    ? "min-h-screen bg-neutral-50 flex items-center justify-center px-4"
    : "w-full h-full flex items-center justify-center px-4";

  return (
    <div className={containerClass}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="relative">
            <IconComponent className={`w-16 h-16 ${errorContent.iconColor} mx-auto mb-4`} />
            <div className="absolute -top-2 -right-2 bg-error-100 rounded-full p-1">
              <Bug className="w-4 h-4 text-error-300" />
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {errorContent.title}
          </h1>
          <p className="text-neutral-600 leading-relaxed">
            {errorContent.message}
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-neutral-100 rounded-lg text-left">
            <h3 className="font-semibold text-sm text-neutral-800 mb-2 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Error Details:
            </h3>
            
            {errorDetails && (
              <div className="mb-2">
                <p className="text-xs text-neutral-600 mb-1">
                  <strong>Type:</strong> {errorDetails.type}
                </p>
                <p className="text-xs text-neutral-600 mb-1">
                  <strong>Status:</strong> {errorDetails.status}
                </p>
                {errorDetails.code && (
                  <p className="text-xs text-neutral-600 mb-1">
                    <strong>Code:</strong> {errorDetails.code}
                  </p>
                )}
              </div>
            )}
            
            {(error || errorDetails) && (
              <p className="text-xs text-error-300 font-mono break-all mb-2">
                {error?.message || errorDetails?.message}
              </p>
            )}
            
            {error?.stack && (
              <details className="mt-2">
                <summary className="text-xs text-neutral-600 cursor-pointer hover:text-neutral-800">
                  Stack Trace
                </summary>
                <pre className="text-xs text-neutral-600 mt-2 whitespace-pre-wrap overflow-auto max-h-32 bg-white p-2 rounded border">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Support Message */}
        <p className="text-xs text-neutral-500 mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;