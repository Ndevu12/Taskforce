import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowDown } from 'react-icons/fa';
import moneyTaskyImage from '../assets/images/Web wallet.png';

function LearnMore() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle background image loading and responsive adjustments
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundLoaded(true);
    img.src = moneyTaskyImage;
  }, []);

  // Handle window resize for responsive image sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic image sizing based on screen size and aspect ratio
  const getImageStyle = () => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    
    // Calculate maximum width based on screen size
    const maxWidth = isMobile ? '90%' : isTablet ? '85%' : '80%';
    const maxHeight = isMobile ? '80%' : isTablet ? '85%' : '90%';
    
    // Calculate aspect ratio to prevent stretching
    const aspectRatio = windowSize.width / windowSize.height;
    const isWideScreen = aspectRatio > 1.5;
    
    return {
      width: 'auto',
      height: 'auto',
      maxWidth: isWideScreen ? '70%' : maxWidth,
      maxHeight: isWideScreen ? '95%' : maxHeight,
      objectFit: 'contain' as const,
      objectPosition: 'center center',
      transform: isMobile ? 'scale(1.05)' : isTablet ? 'scale(1.02)' : 'scale(1)',
    };
  };

  return (
    <div className="bg-background font-poppins">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full h-full">
          {/* Main Background Image */}
          <motion.div
            className="absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-out"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: backgroundLoaded ? 1 : 0,
              scale: backgroundLoaded ? 1 : 1.2
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Image Container with controlled width */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={moneyTaskyImage}
                alt="Money Tasky Web Wallet"
                className="object-contain filter brightness-80 saturate-110 contrast-105"
                style={getImageStyle()}
              />
            </div>
          </motion.div>
          
          {/* Parallax Overlay Layer */}
          <motion.div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: backgroundLoaded ? 0.6 : 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={moneyTaskyImage}
                alt="Money Tasky Web Wallet Overlay"
                className="object-contain filter brightness-30 blur-sm"
                style={{
                  ...getImageStyle(),
                  transform: `${getImageStyle().transform} translateY(5px)`,
                  mixBlendMode: 'multiply' as const,
                }}
              />
            </div>
          </motion.div>
          
          {/* Dynamic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Animated Overlay Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`,
            }}
          />
          
          {/* Loading State */}
          {!backgroundLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>
        {/* Content Container with Enhanced Positioning */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Background Text Glow Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-8xl sm:text-9xl md:text-[12rem] font-black text-white/5 select-none">
              LEARN MORE
            </div>
          </div>
          
          <motion.div
            className="mb-4 relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-white font-medium text-sm backdrop-blur-sm border border-white/30">
              Learn More About Our Platform
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold mb-6 drop-shadow-2xl relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
            }}
          >
            Master Your Finances with Confidence
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-lg relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            Discover tools designed to help you track, budget, and grow your
            financial health with ease and precision.
          </motion.p>
          <Link to="#benefits" className="relative z-10">
            <motion.div
              className="inline-block bg-white/10 backdrop-blur-md text-white p-4 rounded-full cursor-pointer shadow-2xl border border-white/30 transition-all duration-300"
              whileHover={{ 
                y: 5, 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              <FaArrowDown className="text-2xl" />
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Why Choose Our Wallet?
            </motion.h2>
            <motion.div
              className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform the way you manage money with these unique advantages
              designed for your financial success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Simplified Money Management
              </h3>
              <p className="text-gray-600">
                All your accounts in one intuitive dashboard for effortless
                tracking. See your complete financial picture at a glance with
                our unified interface.
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Real-Time Insights
              </h3>
              <p className="text-gray-600">
                Stay updated with live data and smart notifications that help
                you make informed decisions about your finances immediately when
                it matters most.
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-success-100/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-success-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Customizable Budgets
              </h3>
              <p className="text-gray-600">
                Create budgets tailored to your lifestyle with flexible
                categories, spending limits, and personalized goals that adapt
                to your unique financial journey.
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-warning-100/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-warning-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Data Security You Can Trust
              </h3>
              <p className="text-gray-600">
                Bank-level encryption ensures your information is always safe.
                We prioritize your privacy with industry-leading security
                protocols and regular audits.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.div
              className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy—just follow these simple steps to begin
              your journey toward financial clarity.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-1/2 left-[calc(33%-60px)] right-[calc(33%-60px)] h-1 bg-accent/30 -z-10"></div>

            <motion.div
              className="flex-1 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Sign Up Instantly
              </h3>
              <p className="text-gray-600">
                Create an account in seconds using your email. Our streamlined
                registration process gets you started without delay.
              </p>
            </motion.div>

            <motion.div
              className="flex-1 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Create Your Accounts
              </h3>
              <p className="text-gray-600">
                Create financial accounts securely. Our encrypted connection
                ensures your financial data remains private.
              </p>
            </motion.div>

            <motion.div
              className="flex-1 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="bg-success-100/30 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-success-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Start Managing
              </h3>
              <p className="text-gray-600">
                Set budgets, track expenses, and generate insights. Begin your
                journey toward financial freedom with our powerful tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes, we use end-to-end encryption to ensure your data is always
                safe. Our security protocols meet industry standards and we
                regularly undergo security audits to protect your information.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                Can I use multiple accounts?
              </h3>
              <p className="text-gray-600">
                Absolutely, our app supports creating multiple accounts for easy
                tracking. You can manage money on various accounts such bank,
                credit, savings, debt, cash, and investment portfolios for a
                complete financial overview.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                What happens if I exceed my budget?
              </h3>
              <p className="text-gray-600">
                You&apos;ll receive a real-time notification with suggestions to
                adjust your spending. Our platform helps you stay on track with
                gentle reminders and practical advice for managing your finances
                better.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                Is the app free?
              </h3>
              <p className="text-gray-600">
                We offer a free plan with essential features and premium options
                for advanced tools. You can start with our free tier and upgrade
                anytime as your financial management needs grow. But for now, we
                are offering free plan only.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                How do I generate reports?
              </h3>
              <p className="text-gray-600">
                You receive Finacial reports on Weekly and Monthly basis, We are
                planing to let you be able to generate it with a single click
                from the dashboard. But currently, Our platform offers various
                visualization options including charts, graphs, and we want to
                enable downloadable PDFs for comprehensive financial analysis in
                near future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Take Charge of Your Finances Today
          </motion.h2>
          <motion.p
            className="text-xl mb-10 max-w-3xl mx-auto text-white/80"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of users who are managing their money better and
            building a secure financial future.
          </motion.p>

          <Link to="/register">
            <motion.button
              className="px-10 py-4 bg-white text-primary rounded-full text-lg font-medium shadow-xl hover:bg-white/90 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Sign Up Now — It&apos;s Free
            </motion.button>
          </Link>
          <div className="mt-4 text-sm text-white/60">
            No credit card required
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearnMore;
