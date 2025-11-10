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

// CORS configuration
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 200
}));

// Handle OPTIONS preflight requests
app.options('*', cors());


// test route
app.use("/api/v1", authRoute)
app.use("/api/v1/workers", workerRoute)

app.get("/", (req, res) => {
  res.send("Service Hub API is running");
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// DB connection
mongoose.connect(process.env.DATABASE_CLOUD).then((con) =>
  console.log(`Database connected with ${con.connection.host}`)
).catch((err) => console.log(`Database connection error ${err.message}`));


export default app;