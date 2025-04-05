const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur de connexion MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;