const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


exports.createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let clientId = null;

        if (role === 'client') {
            const clientResponse = await axios.post('http://gestion-clients:8082/api/clients', {
                nom: username,
                email: `${username}@example.com`
            });
            clientId = clientResponse.data.id;
        }

        const user = new User({ username, password: hashedPassword, role, clientId });
        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé',
            user: {
                username: user.username,
                role: user.role,
                clientId: user.clientId !== undefined ? user.clientId : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
    }
};


exports.getUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ username: user.username, role: user.role, clientId: user.clientId, createdAt: user.createdAt });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username role clientId createdAt');
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const token = jwt.sign({ username: user.username, role: user.role, clientId: user.clientId }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};


exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const tokenValue = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenValue, JWT_SECRET);
        res.json({ message: 'Token valide', user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide', error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username: currentUsername } = req.params;
        const { username: newUsername, password, role, clientId } = req.body;


        const user = await User.findOne({ username: currentUsername });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (newUsername && newUsername !== currentUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Le nouveau nom d’utilisateur existe déjà' });
            }
            user.username = newUsername;
        }


        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }


        if (role) {
            user.role = role;
        }


        if (clientId) {
            try {
                const clientResponse = await axios.get(`http://gestion-clients:8082/api/clients/${clientId}`);
                if (!clientResponse.data) {
                    return res.status(404).json({ message: 'Client non trouvé' });
                }
                user.clientId = clientId;
            } catch (error) {
                return res.status(404).json({ message: 'Client non trouvé', error: error.message });
            }
        }


        await user.save();

        res.json({
            message: 'Utilisateur mis à jour',
            user: {
                username: user.username,
                role: user.role,
                clientId: user.clientId || null,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
};


exports.getClientDetails = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (!user.clientId) {
            return res.status(404).json({ message: 'Aucun client associé à cet utilisateur' });
        }

        const response = await axios.get(`http://gestion-clients:8082/api/clients/${user.clientId}`);
        if (!response.data || !response.data.id) {
            return res.status(404).json({ message: `Client non trouvé avec l'ID : ${user.clientId}` });
        }

        res.json({ client: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des détails du client', error: error.message });
    }
};