import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from '../DB/dbConnect.js'; 
import authRouter from './rout/authUser.js';
import messageRouter from './rout/messageRout.js';
import userRouter from './rout/userRout.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));

// Call dbConnect to establish the database connection
dbConnect()
  .then(() => console.log("Database connection established"))
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit the process if the DB connection fails
  });

// Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

// Test Route
app.get('/', (req, res) => {
  res.send('hii');
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server", err);
    process.exit(1); // Exit the process if the server fails to start
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});





