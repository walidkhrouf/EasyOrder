const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Le nom d\'utilisateur est obligatoire'],
            unique: true,
            trim: true,
            minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
        },
        password: {
            type: String,
            required: [true, 'Le mot de passe est obligatoire'],
            minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        },
        role: {
            type: String,
            enum: {
                values: ['client', 'admin'],
                message: 'Le rôle doit être "client" ou "admin"',
            },
            default: 'client',
        },
        clientId: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;