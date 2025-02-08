import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an email in session storage (from login page)
    const savedEmail = sessionStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      // Clear it after use
      sessionStorage.removeItem('resetEmail');
    }
  }, []);

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
      const response = await requestPasswordReset(trimmedEmail);

      setStatus('success');
      setMessage(
        response.message || 'Password reset instructions sent to your email',
      );
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.message ||
          'Failed to send password reset email. Please try again.',
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Reset Your Password
        </Typography>

        {status === 'success' && (
          <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
            {message}
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            disabled={status === 'loading' || status === 'success'}
            error={!!emailError}
            helperText={emailError}
            type="email"
            placeholder="Enter your email address"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              status === 'loading' || status === 'success' || !!emailError
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {status === 'loading' ? (
              <CircularProgress size={24} />
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Button color="primary" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RequestPasswordReset;
