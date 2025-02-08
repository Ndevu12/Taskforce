import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token and userId from URL query params
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');

        if (!token || !userId) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        // Make API call to verify email
        const BASE_URL = import.meta.env.VITE_BASE_URL as string;
        const response = await axios.get(`${BASE_URL}/auth/verify-email`, {
          params: { token, userId },
        });

        if (response.data && response.data.message) {
          setStatus('success');
          setMessage(response.data.message);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
            'Failed to verify email. Please try again.',
        );
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Email Verification
        </h1>

        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <CircularProgress />
            <p>Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-600 font-semibold mt-2">{message}</p>
            <p className="mt-4">Redirecting you to login in 3 seconds...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-red-600 font-semibold mt-2">{message}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
