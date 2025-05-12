import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './services/db.js';
import fortniteRoutes from './routes/fortnite.js';
import historyRoutes from './routes/history.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/fortnite', fortniteRoutes);
app.use('/history', historyRoutes);

// DB Connection & Server Start
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
  );
});