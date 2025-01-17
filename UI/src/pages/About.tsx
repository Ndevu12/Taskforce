import React from 'react';
import backgroundImage from '../assets/images/web1.jpg';

function About() {
  return (
    <div className="bg-gray-50 p-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Empowering Your Financial Journey
        </h1>
        <p className="text-lg mt-4 text-gray-600">
          Discover how a single developer’s dedication and innovative tools can
          help you achieve financial clarity and control.
        </p>
        <div className="mt-8">
          <img
            src={backgroundImage}
            alt="Empower your finances"
            className="rounded-lg shadow-lg mx-auto w-full max-w-4xl"
          />
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          My Mission and Vision
        </h2>
        <div className="flex flex-col md:flex-row gap-7 mt-8 items-center">
          <div className="md:w-1/2 p-6 bg-white rounded-lg shadow-md mb-6 md:mb-0">
            <h3 className="text-2xl font-semibold text-blue-600">Mission</h3>
            <p className="text-gray-600 mt-4">
              My mission is to simplify financial management for individuals by
              providing tools that enable smarter decisions, better budgeting,
              and greater financial freedom.
            </p>
          </div>
          <div className="md:w-1/2 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Vision</h3>
            <p className="text-gray-600 mt-4">
              To empower every user to take full control of their finances and
              become a global leader in personal finance tools built with
              dedication and care.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          Core Values Driving This Application
        </h2>
        <p className="text-center text-gray-600 mt-4">
          These principles guide every decision I make in crafting this app.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Integrity</h3>
            <p className="text-gray-600 mt-2">
              Transparency and trust are the foundation of this project.
            </p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Innovation</h3>
            <p className="text-gray-600 mt-2">
              Constantly improving and adding features that make managing your
              finances intuitive.
            </p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">
              Personal Connection
            </h3>
            <p className="text-gray-600 mt-2">
              Built by someone who understands financial challenges and strives
              to make a difference.
            </p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Simplicity</h3>
            <p className="text-gray-600 mt-2">
              Every feature is designed to be easy to use and impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">
          Take the First Step Toward Financial Freedom
        </h2>
        <p className="mt-4 text-gray-600">
          This app is the result of my dedication to helping people manage their
          finances with ease. Join me on this journey to a brighter financial
          future.
        </p>
        <button className="mt-8 px-8 py-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600">
          Get Started Now
        </button>
      </section>
    </div>
  );
}

export default About;
