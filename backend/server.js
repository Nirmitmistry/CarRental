import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configuration/db.js';

import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

dotenv.config();

const app = express();


await connectDB();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                
}));


app.use(express.json());


app.get('/', (req, res) => res.send("Server is running"));


app.use('/api/user', userRouter);       //api/user/login
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);


const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(` Server running on port: ${PORT}`));

