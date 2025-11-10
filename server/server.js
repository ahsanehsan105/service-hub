import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoute from './routes/authRoute.js';
import workerRoute from './routes/workerRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


// apply middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// test route
app.use("/api/v1", authRoute)
app.use("/api/v1/workers", workerRoute)

app.get("/", (req, res) => {
  res.send("Service Hub API is running");
});

// Configure mongoose
mongoose.set('strictQuery', false);

// DB connection with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of 10s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
};

// Start server only after successful DB connection
const startServer = async () => {
  let isConnected = false;
  
  // Try to connect to DB with retries
  while (!isConnected) {
    isConnected = await connectDB();
    if (!isConnected) {
      
console.log("CLOUD DB URL:", process.env.DATABASE_CLOUD);
      console.log('Retrying database connection in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Start the server after successful DB connection
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

// Start the application
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;