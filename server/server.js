import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { DATABASE_CLOUD, DATABASE_LOCAL } from './config/config.js';
import authRoute from './routes/authRoute.js';
import workerRoute from './routes/workerRoute.js';

const app = express();


// apply middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// test route
app.use("/api/v1", authRoute)
app.use("/api/v1/workers", workerRoute)

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// DB connection
mongoose.connect(DATABASE_CLOUD).then((con) =>
  console.log(`Database connected with ${con.connection.host}`)
).catch((err) => console.log(`Database connection error ${err.message}`));


export default app;