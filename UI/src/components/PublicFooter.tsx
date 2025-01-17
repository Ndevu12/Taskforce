import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="footer-section py-8 bg-gray-800 text-white text-center">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/learn-more#faq" className="hover:underline">
            FAQ
          </a>
        </div>
        <p>&copy; 2025 Wallet App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PublicFooter;
