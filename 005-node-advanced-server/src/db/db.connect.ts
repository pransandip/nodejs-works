import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/logger';

// open the MongoDB connection
const connectDB = async () => {
  const dbUrl = config.get<string>('MONGO_URL');
  try {
    await mongoose.connect(dbUrl || 'mongodb://127.0.0.1:27017/newAuthDB');

    logger.info('Successfully connected to the MongoDB database.');
  } catch (error) {
    logger.error('MongoDB connection FAIL');
    process.exit(1);
  }
};

export default connectDB;
