import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEmailVerificationError, setIsEmailVerificationError] =
    useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsEmailVerificationError(false);
    setLoading(true);
    try {
      await login(email, password, navigate);
      // After successful login logic
      const redirectPath =
        sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
      sessionStorage.removeItem('redirectAfterAuth'); // Clear it after use
      navigate(redirectPath);
    } catch (error: any) {
      if (error.message === 'Please verify your email before logging in.') {
        setIsEmailVerificationError(true);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    navigate('/resend-verification');
  };

  const handleForgotPassword = () => {
    navigate('/request-password-reset');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">
          Login
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
            {isEmailVerificationError && (
              <>
                <p className="bg-blue-100 text-blue-700 p-2 rounded mt-2">
                  Please, consider checking sparm folder for verification email.
                </p>
                <button
                  onClick={handleResendVerification}
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                >
                  Resend Verification Email
                </button>
              </>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300"
              required
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
