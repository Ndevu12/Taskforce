import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorDisplayProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 ${className}`}
    >
      <div className="flex items-start">
        <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p>{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
