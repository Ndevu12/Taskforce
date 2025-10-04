import React from 'react';
import { useLocation } from 'react-router-dom';
import ErrorDisplay from '../components/UI/ErrorDisplay';

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as any;

  // Get error details from navigation state or create default
  const errorDetails = state?.errorDetails || {
    type: 'unknown' as const,
    message: 'An unexpected error occurred.',
    status: 500,
  };

  return (
    <ErrorDisplay
      errorDetails={errorDetails}
      isFullScreen={true}
      showDetails={process.env.NODE_ENV === 'development'}
    />
  );
};

export default ErrorPage;
