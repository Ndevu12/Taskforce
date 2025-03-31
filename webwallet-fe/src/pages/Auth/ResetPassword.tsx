import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and userId from URL params
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlUserId = params.get('userId');

    if (!urlToken || !urlUserId) {
      setStatus('error');
      setMessage('Invalid password reset link');
      return;
    }

    setToken(urlToken);
    setUserId(urlUserId);
  }, [location.search]);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(validatePassword(value));

    // Check if confirm password also needs to be updated
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setMessage('');

    // Validate inputs
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (!userId || !token) {
      setStatus('error');
      setMessage('Invalid password reset parameters');
      return;
    }

    try {
      setStatus('loading');
      const response = await resetPassword(userId, token, newPassword);

      setStatus('success');
      setMessage(response.message || 'Password has been reset successfully');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.message || 'Failed to reset password. Please try again.',
      );
    }
  };

  if (status === 'error' && (!userId || !token)) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <Alert severity="error" className="mb-4">
            {message ||
              'Invalid password reset link. Please request a new one.'}
          </Alert>
          <div className="text-center mt-4">
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate('/request-password-reset')}
            >
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create New Password
        </h2>

        {status === 'success' && (
          <Alert severity="success" className="mb-4">
            {message}
            <p className="mt-2">Redirecting to login page...</p>
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" className="mb-4">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={handlePasswordChange}
            disabled={status === 'loading' || status === 'success'}
            error={!!passwordError}
            helperText={passwordError}
            type="password"
            className="mb-4"
          />

          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={status === 'loading' || status === 'success'}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            type="password"
            className="mb-4"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              status === 'loading' ||
              status === 'success' ||
              !!passwordError ||
              !!confirmPasswordError ||
              !newPassword ||
              !confirmPassword
            }
            className="mt-4 py-3"
          >
            {status === 'loading' ? (
              <CircularProgress size={24} />
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
