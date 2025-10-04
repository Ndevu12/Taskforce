import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="footer-section py-8 bg-gray-800 text-white text-center">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/learn-more" className="hover:underline">
            Learn More
          </Link>
          <Link to="/feedback" className="hover:underline text-accent">
            Provide Feedback
          </Link>
          <a href="#contact" className="hover:underline">
            Contact Us
          </a>
          <Link to="/learn-more#faq" className="hover:underline">
            FAQ
          </Link>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Money Tasky. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;
