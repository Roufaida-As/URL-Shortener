const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const urlRouter = require('./routes/url_router')
const userRouter = require('./routes/user_router')
const path = require('path');
const cors = require('cors');

const allowedOrigins = [
    'https://linky-url-shortener.vercel.app',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/$/, ''));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        // Check if the normalized origin is in the allowed list
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.log('CORS rejected origin:', origin, 'Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

dotenv.config({ path: './.env' })
port = process.env.port

app.use(express.json())

mongoose.connect(process.env.CONN_STR, {}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});

app.use("/api/urls", urlRouter)
app.use('/api/', userRouter)


// //DEBUUG 
// app.get('/debug-cors', (req, res) => {
//     const allowedOrigins = [
//         'https://linkly-psi-five.vercel.app/'
//     ].filter(Boolean).map(url => url.replace(/\/$/, ''));
    
//     res.json({
//         origin: req.headers.origin,
//         allowedOrigins: allowedOrigins,
//         frontendUrl: process.env.FRONTEND_URL,
//         allHeaders: req.headers
//     });
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});