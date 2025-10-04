import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaPaperPlane,
  FaHistory,
  FaCheck,
  FaComment,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import {
  submitFeedback,
  getUserFeedback,
  FeedbackResponse,
} from '../../actions/feedbackActions';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { FeedbackCategory } from '../../types/enums/FeedbackCategory';
import { FeedbackSentiment } from '../../types/enums/FeedbackSentiment';
import ErrorDisplay from '../../components/UI/ErrorDisplay';
import { formatDate } from '../../utils/formatDate';

const Feedback: React.FC = () => {
  // Form state
  const [feedbackText, setFeedbackText] = useState('');
  const [sentiment, setSentiment] = useState<FeedbackSentiment | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>(
    FeedbackCategory.GENERAL,
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreviousFeedback, setShowPreviousFeedback] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackResponse[]>(
    [],
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Category options mapped from backend enum
  const categoryOptions = [
    { value: FeedbackCategory.GENERAL, label: 'General Feedback' },
    { value: FeedbackCategory.UI, label: 'User Interface' },
    { value: FeedbackCategory.FEATURES, label: 'Features' },
    { value: FeedbackCategory.BUGS, label: 'Bug Reports' },
    { value: FeedbackCategory.SUGGESTIONS, label: 'Suggestions' },
  ];

  // Sentiment options mapped from backend enum
  const sentimentOptions = [
    {
      value: FeedbackSentiment.POSITIVE,
      icon: <FaSmile className="text-2xl" />,
      label: 'Positive',
      colorClass: 'text-green-500',
    },
    {
      value: FeedbackSentiment.NEUTRAL,
      icon: <FaMeh className="text-2xl" />,
      label: 'Neutral',
      colorClass: 'text-yellow-500',
    },
    {
      value: FeedbackSentiment.NEGATIVE,
      icon: <FaFrown className="text-2xl" />,
      label: 'Negative',
      colorClass: 'text-red-500',
    },
  ];

  // Load user's previous feedback
  const loadPreviousFeedback = async () => {
    if (
      showPreviousFeedback &&
      previousFeedback.length === 0 &&
      !historyError
    ) {
      setIsLoadingHistory(true);
      setHistoryError(null);

      const response = await getUserFeedback();

      if (response.success && response.data) {
        setPreviousFeedback(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      } else {
        setHistoryError(
          response.error || 'Failed to load your feedback history',
        );
      }

      setIsLoadingHistory(false);
    }
  };

  // Load feedback history when toggled
  useEffect(() => {
    loadPreviousFeedback();
  }, [showPreviousFeedback]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setSubmitError(null);
    setIsSuccess(false);

    // Form validation
    if (!feedbackText.trim()) {
      setSubmitError('Please provide some feedback text');
      return;
    }

    if (!sentiment) {
      setSubmitError('Please select how you feel about the platform');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        text: feedbackText,
        sentiment: sentiment,
        category: category,
      });

      if (result.success) {
        setIsSuccess(true);
        resetForm();

        // If the user had already loaded their feedback history, add the new one
        if (
          previousFeedback.length > 0 &&
          result.data &&
          !Array.isArray(result.data)
        ) {
          setPreviousFeedback([result.data, ...previousFeedback]);
        }
      } else {
        setSubmitError(
          result.error || 'Failed to submit feedback. Please try again.',
        );
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFeedbackText('');
    setSentiment(null);
    setCategory(FeedbackCategory.GENERAL);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary dark:text-white">
            We Value Your Feedback
          </h1>
          <button
            onClick={() => setShowPreviousFeedback(!showPreviousFeedback)}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-2 rounded-md transition-colors"
          >
            <FaHistory className="mr-2" />
            {showPreviousFeedback
              ? 'Hide History'
              : 'View Your Feedback History'}
          </button>
        </div>

        {/* Main content area with conditional rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feedback Form */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isSuccess ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4"
                >
                  <FaCheck className="text-green-500 text-2xl" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your feedback has been received. We appreciate your input!
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    resetForm();
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your opinions help us improve Money Tasky. Please share your
                  thoughts, suggestions, or report any issues you&apos;ve
                  encountered.
                </p>

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How do you feel about Money Tasky?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {sentimentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSentiment(option.value)}
                          className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                            sentiment === option.value
                              ? `border-primary bg-primary/10 dark:bg-primary/20 ${option.colorClass}`
                              : 'border-gray-200 hover:border-primary/50 dark:border-gray-700'
                          }`}
                        >
                          <span
                            className={`mb-1 ${sentiment === option.value ? option.colorClass : ''}`}
                          >
                            {option.icon}
                          </span>
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Feedback Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as FeedbackCategory)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={5}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please share your thoughts, suggestions or report issues..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="small" color="white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Feedback History */}
          <AnimatePresence>
            {showPreviousFeedback && (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Your Previous Feedback
                </h2>

                {isLoadingHistory && (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="medium" />
                  </div>
                )}

                {historyError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 mb-3">{historyError}</p>
                    <button
                      onClick={() => {
                        setHistoryError(null);
                        loadPreviousFeedback();
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!isLoadingHistory &&
                  !historyError &&
                  previousFeedback.length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      <p>You haven&apos;t submitted any feedback yet.</p>
                    </div>
                  )}

                {!isLoadingHistory &&
                  !historyError &&
                  previousFeedback.length > 0 && (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {previousFeedback.map((item) => (
                        <div
                          key={item._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <span
                                className={`inline-block mr-2 ${
                                  item.sentiment === FeedbackSentiment.POSITIVE
                                    ? 'text-green-500'
                                    : item.sentiment ===
                                        FeedbackSentiment.NEGATIVE
                                      ? 'text-red-500'
                                      : 'text-yellow-500'
                                }`}
                              >
                                {item.sentiment ===
                                FeedbackSentiment.POSITIVE ? (
                                  <FaSmile />
                                ) : item.sentiment ===
                                  FeedbackSentiment.NEGATIVE ? (
                                  <FaFrown />
                                ) : (
                                  <FaMeh />
                                )}
                              </span>
                              <span className="font-medium">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {/* Status badge */}
                              <span
                                className={`text-xs px-2 py-1 rounded-full flex items-center mr-2 ${
                                  item.resolved
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                }`}
                              >
                                {item.resolved ? (
                                  <>
                                    <FaCheckCircle className="mr-1" /> Resolved
                                  </>
                                ) : (
                                  <>
                                    <FaClock className="mr-1" /> Pending
                                  </>
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            {item.text}
                          </p>

                          {item.response && (
                            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center mb-1 text-xs text-gray-500">
                                <FaComment className="mr-1" />
                                <span>Response from admin:</span>
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                {item.response}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;
