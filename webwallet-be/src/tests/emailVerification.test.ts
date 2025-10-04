import { createUser } from '../services/UserService';
import { verifyEmail, resendVerificationEmail } from '../services/AuthService';
import User from '../models/User';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const testEmailVerification = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('Connected to MongoDB');

    // 2. Create test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'USER',
      verificationExpires: new Date(),
      verificationToken: 'test-verification-token',
      isVerified: false,
      lastLogin: null,
      preferences: {
        defaultCurrency: 'USD',
        notificationSettings: {
          email: true,
          push: true,
          budgetAlerts: true,
        },
        theme: 'light',
      },
      _id: new mongoose.Types.ObjectId(),
    };

    // 3. Delete any existing test user
    await User.deleteMany({ email: testUser.email });
    
    // 4. Create the user (this will send a verification email)
    const user = new User(testUser);
    const savedUser = await user.save();

    logger.info(`User created with ID: ${user._id}`);
    
    // 5. Fetch the user to get the verification token
    if (!savedUser || !savedUser.verificationToken) {
      throw new Error('User not found or verification token not set');
    }

    // 6. Simulate verification
    const verificationResult = await verifyEmail(
      (savedUser._id as string).toString(),
      savedUser.verificationToken
    );
    
    logger.info(`Verification result: ${JSON.stringify(verificationResult)}`);

    // 7. Simulate resending verification
    const resendResult = await resendVerificationEmail(testUser.email);
    logger.info(`Resend verification result: ${JSON.stringify(resendResult)}`);

    // 8. Clean up
    // await User.deleteMany({ email: testUser.email });
    
    logger.info('Test completed successfully');
  } catch (error) {
    logger.error('Test failed:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
  }
};

// Run the test
testEmailVerification();
