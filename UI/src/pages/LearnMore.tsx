import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowDown } from 'react-icons/fa';
import backgroundImage from '../assets/images/web1.jpg';

function LearnMore() {
  return (
    <div className="learn-more-page">
      {/* Hero Section */}
      <section
        className="hero-section bg-cover bg-center h-screen flex flex-col justify-center items-center text-white relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.7)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.h1
          className="text-4xl text-white font-bold mb-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Master Your Finances with Confidence
        </motion.h1>
        <motion.p
          className="text-xl text-white mb-8 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Discover tools designed to help you track, budget, and grow your
          financial health.
        </motion.p>
        <Link to="#features">
          <motion.div
            className="text-blue-500 text-4xl relative z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowDown />
          </motion.div>
        </Link>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-xl mb-8">
            Transform the way you manage money with these unique advantages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="benefit-card bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg">
              <i className="icon-simplified text-blue-500 w-10 h-10 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">
                Simplified Money Management
              </h3>
              <p>All your accounts in one dashboard for effortless tracking.</p>
            </div>
            <div className="benefit-card bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg">
              <i className="icon-insights text-blue-500 w-10 h-10 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
              <p>Stay updated with live data and smart notifications.</p>
            </div>
            <div className="benefit-card bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg">
              <i className="icon-budgets text-blue-500 w-10 h-10 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">
                Customizable Budgets
              </h3>
              <p>Create budgets tailored to your lifestyle.</p>
            </div>
            <div className="benefit-card bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg">
              <i className="icon-security text-blue-500 w-10 h-10 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">
                Data Security You Can Trust
              </h3>
              <p>Bank-level encryption ensures your information is safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="how-it-works-section py-16 bg-white"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl mb-8">
            Getting started is easy—just follow these steps.
          </p>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="how-it-works-step flex flex-col items-center">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <i className="icon-signup text-blue-500"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up Instantly</h3>
              <p>Create an account in seconds using your email.</p>
            </div>
            <div className="how-it-works-step flex flex-col items-center">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <i className="icon-link-accounts text-blue-500"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connect Your Accounts
              </h3>
              <p>Link your bank accounts and wallets securely.</p>
            </div>
            <div className="how-it-works-step flex flex-col items-center">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <i className="icon-manage-finances text-blue-500"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Managing</h3>
              <p>Set budgets, track expenses, and generate insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="faq-item p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-medium mb-2">Is my data secure?</h3>
              <p className="text-gray-600 text-sm mt-2">
                Yes, we use end-to-end encryption to ensure your data is always
                safe.
              </p>
            </div>
            <div className="faq-item p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                Can I use multiple accounts?
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Absolutely, our app supports linking multiple accounts for easy
                tracking.
              </p>
            </div>
            <div className="faq-item p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                What happens if I exceed my budget?
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                You’ll receive a real-time notification with suggestions to
                adjust your spending.
              </p>
            </div>
            <div className="faq-item p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-medium mb-2">Is the app free?</h3>
              <p className="text-gray-600 text-sm mt-2">
                We offer a free plan with essential features and premium options
                for advanced tools.
              </p>
            </div>
            <div className="faq-item p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                How do I generate reports?
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Reports can be generated with a single click from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="cta"
        className="cta-section py-16 bg-green-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">
          Take Charge of Your Finances Today
        </h2>
        <p className="text-xl mb-8">
          Join thousands of users who are managing their money better.
        </p>
        <Link to="/register">
          <motion.button
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Sign Up Now
          </motion.button>
        </Link>
      </section>
    </div>
  );
}

export default LearnMore;
