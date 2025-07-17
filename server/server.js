const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const urlRouter = require('./routes/url_router')
const userRouter = require('./routes/user_router')
const path = require('path');
// server.js
const cors = require('cors');

// Define allowed origins
const allowedOrigins = [
    'https://linkly-psi-five.vercel.app',
    'http://localhost:5173', // for local development
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in the allowed list
        if (allowedOrigins.some(allowedOrigin => 
            origin === allowedOrigin || 
            origin === allowedOrigin.replace(/\/$/, '') || // Remove trailing slash
            allowedOrigin.replace(/\/$/, '') === origin // Remove trailing slash from allowed
        )) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

dotenv.config({ path: './.env' })
port = process.env.port

//add request body to request object(middleware)
app.use(express.json())


// Serve static files from the "img" folder
//in order to access those images from the frontend
//app.use('/img', express.static(path.join(__dirname, 'img')));



mongoose.connect(process.env.CONN_STR, {}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});

app.use("/api/urls", urlRouter)
app.use('/api/', userRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});