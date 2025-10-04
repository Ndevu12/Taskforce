import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');

      const BASE_URL = import.meta.env.VITE_BASE_URL as string;
      const response = await axios.post(
        `${BASE_URL}/auth/resend-verification`,
        { email: trimmedEmail },
      );

      setStatus('success');
      setMessage(
        response.data.message || 'Verification email sent successfully',
      );
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.response?.data?.error ||
          'Failed to send verification email. Please try again.',
      );
    }
  };

  return (
    <div className="bg-white mt-14 p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Resend Verification Email
      </h2>

      {status === 'success' && (
        <Alert severity="success" className="mb-4">
          {message}
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" className="mb-4">
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          disabled={status === 'loading'}
          error={!!emailError}
          helperText={emailError}
          type="email"
          placeholder="your@email.com"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={status === 'loading' || !!emailError}
          className="mt-4 py-3"
        >
          {status === 'loading' ? (
            <CircularProgress size={24} />
          ) : (
            'Resend Verification Email'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <a href="/login" className="text-blue-500 hover:underline">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResendVerification;
