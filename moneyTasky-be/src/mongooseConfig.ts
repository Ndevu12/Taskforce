import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) {
      logger.warn('MONGO_URI not provided, running without database connection');
      return false;
    }
    
    const conn = await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    logger.warn(`MongoDB connection failed, continuing without database: ${error.message}`);
    return false;
  }
};

export default connectDB;