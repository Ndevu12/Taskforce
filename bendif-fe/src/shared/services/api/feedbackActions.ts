import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from './APIHeader';
import { FeedbackSentiment } from '../types/enums/FeedbackSentiment';
import { FeedbackCategory } from '../types/enums/FeedbackCategory';

const API_URL = import.meta.env.VITE_BASE_URL;

export interface FeedbackSubmission {
  text: string;
  sentiment: FeedbackSentiment;
  category: FeedbackCategory;
}

export interface FeedbackResponse {
  _id: string;
  user: string;
  text: string;
  sentiment: FeedbackSentiment;
  category: FeedbackCategory;
  resolved: boolean;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResult {
  success: boolean;
  data?: FeedbackResponse | FeedbackResponse[];
  error?: string;
}

/**
 * Submit new feedback
 */
export const submitFeedback = async (
  feedback: FeedbackSubmission
): Promise<FeedbackResult> => {
  try {
    const response = await axios.post(
      `${API_URL}/feedback`,
      feedback,
      getAuthHeaders()
    );
    return {
      success: true,
      data: response.data.feedback
    };
  } catch (error) {
    const err = error as AxiosError<any>;
    
    // Handle auth errors
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?redirect=/dashboard/feedback';
      return { 
        success: false, 
        error: 'Your session has expired. Please log in again.' 
      };
    }
    
    // Extract error message from response if available
    const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Failed to submit feedback. Please try again later.';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Get all feedback for the current user
 */
export const getUserFeedback = async (): Promise<FeedbackResult> => {
  try {
    const response = await axios.get(
      `${API_URL}/feedback/me`,
      getAuthHeaders()
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const err = error as AxiosError<any>;
    
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?redirect=/dashboard/feedback';
      return { 
        success: false, 
        error: 'Your session has expired. Please log in again.' 
      };
    }
    
    return {
      success: false,
      error: 'Failed to retrieve your feedback submissions'
    };
  }
};

/**
 * Get a specific feedback item by ID
 */
export const getFeedbackById = async (
  feedbackId: string
): Promise<{ success: boolean; data?: FeedbackResponse; error?: string }> => {
  try {
    const response = await axios.get(
      `${API_URL}/feedback/${feedbackId}`,
      getAuthHeaders()
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const err = error as AxiosError;
    
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return { 
        success: false, 
        error: 'Your session has expired. Please log in again.' 
      };
    }
    
    if (err.response?.status === 404) {
      return {
        success: false,
        error: 'Feedback not found'
      };
    }
    
    return {
      success: false,
      error: 'Failed to retrieve feedback details'
    };
  }
};

/**
 * Delete a feedback submission
 */
export const deleteFeedback = async (
  feedbackId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axios.delete(
      `${API_URL}/feedback/${feedbackId}`,
      getAuthHeaders()
    );
    
    return {
      success: true
    };
  } catch (error) {
    const err = error as AxiosError;
    
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return { 
        success: false, 
        error: 'Your session has expired. Please log in again.' 
      };
    }
    
    return {
      success: false,
      error: 'Failed to delete feedback'
    };
  }
};
