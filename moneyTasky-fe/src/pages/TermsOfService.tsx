import React from 'react';

function TermsOfService() {
  return (
    <div className="bg-gray-50 p-8">
      {/* Page Header */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Terms of Service
        </h1>
        <p className="text-lg mt-4 text-gray-600">
          Please read these terms carefully before using our wallet application.
        </p>
      </section>

      {/* Terms Content */}
      <section className="space-y-12">
        {/* Introduction */}
        <div>
          <h2 className="text-l font-bold text-gray-800">1. Introduction</h2>
          <p className="text-gray-600 mt-4">
            Welcome to our wallet application. By accessing or using this
            application, you agree to be bound by these Terms of Service and our
            Privacy Policy. If you do not agree, please discontinue use
            immediately.
          </p>
        </div>

        {/* User Responsibilities */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            2. User Responsibilities
          </h2>
          <p className="text-gray-600 mt-4">
            As a user of this application, you agree to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>
              Provide accurate and truthful information during registration and
              use of the app.
            </li>
            <li>
              Keep your login credentials secure and not share them with anyone.
            </li>
            <li>
              Use the application only for lawful purposes and not engage in any
              fraudulent or malicious activities.
            </li>
          </ul>
        </div>

        {/* Account and Usage Policies */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            3. Account and Usage Policies
          </h2>
          <p className="text-gray-600 mt-4">
            We reserve the right to suspend or terminate your account if we
            detect any suspicious or unauthorized activities. Additionally, you
            must be at least 18 years old to use this application.
          </p>
        </div>

        {/* Data and Privacy */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            4. Data and Privacy
          </h2>
          <p className="text-gray-600 mt-4">
            Your privacy is important to us. We collect, use, and protect your
            data in accordance with our Privacy Policy. By using this
            application, you consent to our data practices.
          </p>
        </div>

        {/* Limitations of Liability */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            5. Limitations of Liability
          </h2>
          <p className="text-gray-600 mt-4">
            We are not responsible for any financial losses, data breaches, or
            other damages resulting from the use of this application. You use
            the app at your own risk.
          </p>
        </div>

        {/* Modifications to the Terms */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            6. Modifications to the Terms
          </h2>
          <p className="text-gray-600 mt-4">
            We may update these Terms of Service from time to time. Any changes
            will be effective immediately upon posting. Please review these
            terms periodically for updates.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-l font-bold text-gray-800">
            7. Contact Information
          </h2>
          <p className="text-gray-600 mt-4">
            If you have any questions about these Terms of Service, please
            contact us at{' '}
            <a
              href="mailto:support@walletapp.com"
              className="text-blue-500 underline"
            >
              support@walletapp.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default TermsOfService;
