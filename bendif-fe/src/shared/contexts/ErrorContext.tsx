import React, { createContext, useContext, ReactNode } from 'react';
import { ErrorDetails } from '../utils/errorHandler';

interface ErrorContextType {
  showError: (errorDetails: ErrorDetails | Error) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const showError = (error: ErrorDetails | Error) => {
    // Log error for debugging
    console.error('Error caught by context:', error);
    
    // You can add additional error reporting here
    // For now, the ErrorBoundary will handle the UI display
  };

  const contextValue: ErrorContextType = {
    showError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
