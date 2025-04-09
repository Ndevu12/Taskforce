import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/money taksy.png';

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation links data
  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact Us' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-white/90 py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <motion.img
            src={logo}
            alt="Web Wallet"
            className="h-10 sm:h-12"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-8 mr-4">
            {navLinks.map((link, index) =>
              link.to ? (
                <Link
                  key={index}
                  to={link.to}
                  className="relative px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base group"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={false}
                    animate={{ scaleX: location.pathname === link.to ? 1 : 0 }}
                  />
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  className="relative px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base group"
                >
                  {link.label}
                  <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <motion.button
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors duration-300 text-sm font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Log In
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-md text-sm font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Register
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-primary focus:outline-none p-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div
              animate={isOpen ? 'open' : 'closed'}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 7 },
                }}
                className="w-6 h-0.5 bg-current block mb-1.5 transform origin-center transition-transform"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="w-6 h-0.5 bg-current block mb-1.5"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -7 },
                }}
                className="w-6 h-0.5 bg-current block transform origin-center transition-transform"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-3 py-4">
                {navLinks.map((link, index) =>
                  link.to ? (
                    <Link
                      key={index}
                      to={link.to}
                      className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={index}
                      href={link.href}
                      className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </nav>
              <div className="flex flex-col space-y-3 py-4 border-t border-gray-100">
                <Link to="/login" className="w-full">
                  <button className="w-full px-4 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors duration-200">
                    Log In
                  </button>
                </Link>
                <Link to="/register" className="w-full">
                  <button className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-md">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default PublicHeader;
