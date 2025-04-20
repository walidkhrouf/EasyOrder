require('dotenv').config();
const express = require('express');
const { Eureka } = require('eureka-js-client');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();


// Configurer CORS
app.use(cors({
    origin: 'http://localhost:8088', // Allow only from API Gateway
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Start the server and connect to MongoDB
const startServer = async () => {
    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if connection fails
    }

    // Routes
    app.use('/api/users', userRoutes);

    // Configuration Eureka
    const client = new Eureka({
        instance: {
            app: 'gestion-users', // Mise à jour du nom de l'application
            hostName: 'gestion-users',
            ipAddr: '127.0.0.1',
            port: {
                '$': process.env.PORT || 8086,
                '@enabled': true,
            },
            vipAddress: 'gestion-users', // Mise à jour du vipAddress
            statusPageUrl: `http://localhost:${process.env.PORT || 8086}/info`,
            healthCheckUrl: `http://localhost:${process.env.PORT || 8086}/health`,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: process.env.EUREKA_HOST || 'localhost',
            port: process.env.EUREKA_PORT || 8761,
            servicePath: '/eureka/apps/',
        },
    });

    client.start((error) => {
        if (error) {
            console.error('Error starting Eureka client:', error);
        } else {
            console.log('Eureka client started');
        }
    });

    // Routes for Eureka
    app.get('/info', (req, res) => res.json({ status: 'UP' }));
    app.get('/health', (req, res) => res.json({ status: 'UP' }));

    // Start the server
    const PORT = process.env.PORT || 8086;
    app.listen(PORT, () => {
        console.log(`Gestion Users running on port ${PORT}`);
    });
};

startServer();