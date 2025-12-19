import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', 
    credentials: true,
})) 

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import eventRouter from './routes/event.route.js'


app.use("/api/v1/events", eventRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export { app }