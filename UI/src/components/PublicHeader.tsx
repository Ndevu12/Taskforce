import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/react.svg';

const PublicHeader = () => {
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
        <nav className="flex space-x-6">
          <a
            href="#features"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Contact Us
          </a>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            About Us
          </Link>
        </nav>
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default PublicHeader;
