import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/react.svg';

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.header
      className="sticky top-0 bg-white shadow-md z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`md:flex ${isOpen ? 'block' : 'hidden'} gap-4 md:block`}
        >
          <nav className="md:flex space-x-6 text-left">
            <a
              href="#features"
              className="block text-gray-700 text-left hover:text-blue-500 transition w-full md:w-auto"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block text-gray-700 text-left hover:text-blue-500 transition w-full md:w-auto"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="block text-gray-700 text-left hover:text-blue-500 transition w-full md:w-auto"
            >
              Contact Us
            </a>
            <Link
              to="/about"
              className="block text-gray-700 text-left hover:text-blue-500 transition w-full md:w-auto"
            >
              About Us
            </Link>
          </nav>
          <div className="mt-4 md:mt-0 md:flex md:space-x-4 text-left">
            <Link to="/login">
              <button className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition mt-2 md:mt-0">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default PublicHeader;
