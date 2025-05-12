import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;