import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 p-8">
      {/* Page Header */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Privacy Policy
        </h1>
        <p className="text-lg mt-4 text-gray-600">
          Learn how we collect, use, and protect your information.
        </p>
      </section>

      {/* Privacy Policy Content */}
      <section className="space-y-12">
        {/* Introduction */}
        <div>
          <h2 className="text-l font-bold text-gray-800">1. Introduction</h2>
          <p className="text-gray-600 mt-4">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our wallet
            application. By using the app, you consent to the data practices
            described in this policy.
          </p>
        </div>

        {/* Data Collection */}
        <div>
          <h2 className="text-l font-bold text-gray-800">2. Data We Collect</h2>
          <p className="text-gray-600 mt-4">
            We collect the following types of data to provide and improve our
            services:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>
              Personal Information: Name, email address, and login credentials.
            </li>
            <li>
              Financial Data: Linked account details, transaction history, and
              budget preferences.
            </li>
            <li>
              Device Information: IP address, browser type, and operating
              system.
            </li>
            <li>
              Usage Data: How you interact with the app, including clicks and
              time spent on pages.
            </li>
          </ul>
        </div>

        {/* How We Use Your Data */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            3. How We Use Your Data
          </h2>
          <p className="text-gray-600 mt-4">
            Your data is used to enhance your experience and provide essential
            services, including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Customizing your dashboard and preferences.</li>
            <li>
              Providing accurate financial insights, reports, and budget
              tracking.
            </li>
            <li>Improving app functionality and user experience.</li>
            <li>
              Sending important updates, notifications, and promotional content.
            </li>
          </ul>
        </div>

        {/* Data Sharing and Security */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            4. Data Sharing and Security
          </h2>
          <p className="text-gray-600 mt-4">
            We are committed to protecting your data. Here&apos;s how we handle
            it:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>
              Third-Party Sharing: We do not sell or share your personal data
              with third parties, except as required by law or with your
              explicit consent.
            </li>
            <li>
              Security Measures: We use encryption and other security protocols
              to safeguard your information.
            </li>
            <li>
              Service Providers: We may share limited data with trusted
              providers to perform essential services.
            </li>
          </ul>
        </div>

        {/* Your Rights */}
        <div>
          <h2 className="text-l font-bold text-gray-800">5. Your Rights</h2>
          <p className="text-gray-600 mt-4">
            As a user, you have the following rights concerning your data:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Access your personal data and request a copy.</li>
            <li>Request corrections to inaccurate or incomplete data.</li>
            <li>Request the deletion of your personal information.</li>
            <li>
              Opt-out of receiving promotional communications at any time.
            </li>
          </ul>
        </div>

        {/* Updates to the Privacy Policy */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            6. Updates to This Privacy Policy
          </h2>
          <p className="text-gray-600 mt-4">
            We may update this Privacy Policy periodically to reflect changes in
            our practices or legal requirements. All updates will be posted on
            this page, and significant changes will be communicated via email.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            7. Contact Information
          </h2>
          <p className="text-gray-600 mt-4">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{' '}
            <a
              href="mailto:privacy@walletapp.com"
              className="text-blue-500 underline"
            >
              privacy@walletapp.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
