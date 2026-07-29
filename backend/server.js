import express from 'express';
import cors from 'cors';
import 'dotenv/config' ;

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import resultRoute from './routes/result.js'

const app=express();
const PORT=process.env.PORT;

//MIDDLEWARES
app.use(clerkMiddleware());
app.use(cors());//as the user will be found first then we use the json
app.use("/api/users", userRoutes);
app.use(express.json());

//DB
connectDB();

//ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/result", resultRoute)

app.get("/",(req,res)=>{
    res.send("API WORKING");
});

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`)
});