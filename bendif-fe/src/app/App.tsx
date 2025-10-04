import React, { useEffect } from 'react';
import './style/App.css';
import Router from './routes/Router';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ErrorProvider } from './context/ErrorContext';
import { initializeGlobalErrorHandler } from './utils/globalErrorHandler';
import './utils/apiInterceptor'; // Initialize API interceptor

function App() {
  useEffect(() => {
    // Initialize global error handling
    initializeGlobalErrorHandler();

    // Cleanup on unmount
    return () => {
      // Note: We don't cleanup here as the app should stay mounted
      // cleanupGlobalErrorHandler();
    };
  }, []);

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
