import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCommentDots, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const PublicFeedback: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect them directly to the feedback form
    if (isAuthenticated) {
      navigate('/dashboard/feedback');
    }

    // Save the intended destination in session storage
    sessionStorage.setItem('redirectAfterAuth', '/dashboard/feedback');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-8 px-6 shadow-lg rounded-2xl text-center"
        >
          <FaCommentDots className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Your Feedback Matters
          </h2>
          <p className="mt-4 text-gray-600">
            To submit feedback, please log in or create an account. Your
            insights help us improve Money Tasky for everyone.
          </p>
          <div className="mt-8 space-y-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center bg-blue-500 text-white py-3 px-4 rounded-lg font-medium"
            >
              <FaSignInAlt className="mr-2" />
              Login to Submit Feedback
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="w-full flex justify-center items-center border border-primary text-primary py-3 px-4 rounded-lg font-medium"
            >
              <FaUserPlus className="mr-2" />
              Register an Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicFeedback;
