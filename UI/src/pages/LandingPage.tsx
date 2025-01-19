import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/web1.jpg';
import { createMessage } from '../actions/messageActions';

function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMessage(formData);
      alert('Message sent successfully!');
      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
      setFormStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section
        id="hero"
        className="hero-section bg-cover bg-center h-screen flex flex-col justify-center items-center text-white relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.7)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.h1
          className="text-5xl text-white font-bold mb-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Wallet App
        </motion.h1>
        <motion.p
          className="text-xl text-white mb-8 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Manage your finances effortlessly
        </motion.p>
        <div className="flex space-x-4 relative z-10">
          <motion.button
            className="bg-blue-500 text-white py-2 px-4 rounded animate-pulse"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRegisterClick}
          >
            Register Now
          </motion.button>
          <Link to="/learn-more">
            <motion.button
              className="bg-gray-500 text-white py-2 px-4 rounded animate-pulse"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="feature-card p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:translate-y-[-10px]"
              whileHover={{ scale: 1.05 }}
            >
              <i className="icon-transactions text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Track Transactions</h3>
              <p>Keep track of all your transactions in one place.</p>
            </motion.div>
            <motion.div
              className="feature-card p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:translate-y-[-10px]"
              whileHover={{ scale: 1.05 }}
            >
              <i className="icon-budget text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
              <p>Set and manage your budgets effectively.</p>
            </motion.div>
            <motion.div
              className="feature-card p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:translate-y-[-10px]"
              whileHover={{ scale: 1.05 }}
            >
              <i className="icon-reports text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Generate Reports</h3>
              <p>Generate detailed financial reports.</p>
            </motion.div>
            <motion.div
              className="feature-card p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:translate-y-[-10px]"
              whileHover={{ scale: 1.05 }}
            >
              <i className="icon-visualize text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Visualize Finances</h3>
              <p>Visualize your finances with interactive charts.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="testimonials-section py-16 bg-white"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="testimonial-card p-6 bg-gray-50 shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <p className="mb-4">
                &quot;This app has transformed the way I manage my
                finances!&quot;
              </p>
              <h4 className="font-semibold">- User A</h4>
            </motion.div>
            <motion.div
              className="testimonial-card p-6 bg-gray-50 shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <p className="mb-4">
                &quot;I love the budgeting feature. It&apos;s so easy to
                use!&quot;
              </p>
              <h4 className="font-semibold">- User B</h4>
            </motion.div>
            <motion.div
              className="testimonial-card p-6 bg-gray-50 shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <p className="mb-4">
                &quot;The best financial app I&apos;ve ever used.&quot;
              </p>
              <h4 className="font-semibold">- User C</h4>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="contact-section py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <p className="mb-8">
            We would love to hear from you! Please fill out the form below to
            get in touch with us.
          </p>
          <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Send Message
            </button>
          </form>
          {formStatus && <p className="mt-4">{formStatus}</p>}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="cta"
        className="cta-section py-16 bg-blue-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
        <p className="mb-8">
          Join thousands of users managing their finances better with Wallet
          App.
        </p>
        <motion.button
          className="bg-blue-500 text-white py-2 px-4 rounded animate-pulse"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRegisterClick}
        >
          Sign Up Now
        </motion.button>
      </section>
    </div>
  );
}

export default LandingPage;
