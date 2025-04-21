const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const axios = require('axios');

// Vérifiez que JWT_SECRET est défini dans les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// URL de l'API Gateway pour router vers gestion-clients
const CLIENTS_API_URL = 'http://api-gateway:8088/clients';

// Liste des rôles valides

exports.createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const { username, password, nom, prenom, email, telephone, adresse, dateNaissance } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un client (role is always 'client')
        let clientId = null;
        try {
            const clientResponse = await axios.post(CLIENTS_API_URL, {
                nom: nom || username, // Use username as fallback
                prenom: prenom || 'DefaultPrenom',
                email: email || `${username}@example.com`,
                telephone: telephone || '12345678',
                adresse: adresse || '',
                dateNaissance: dateNaissance || null,
                commandeIds: [], // Empty array initially
            });
            clientId = clientResponse.data.id;
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la création du client via gestion-clients',
                error: error.response?.data || error.message,
            });
        }

        // Créer et sauvegarder l'utilisateur
        const user = new User({ username, password: hashedPassword, role: 'client', clientId });
        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            data: {
                username: user.username,
                role: user.role,
                clientId: user.clientId,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur', error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }, 'username role clientId createdAt');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({
            message: 'Utilisateur récupéré avec succès',
            data: { username: user.username, role: user.role, clientId: user.clientId, createdAt: user.createdAt },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username role clientId createdAt');
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        res.json({
            message: 'Utilisateurs récupérés avec succès',
            data: users,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        // Validation des données entrantes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
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

        const token = jwt.sign(
            { username: user.username, role: user.role, clientId: user.clientId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Connexion réussie',
            data: { token },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};

exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            message: 'Token valide',
            data: decoded,
        });
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
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Validation des données entrantes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const { username: currentUsername } = req.params;
        const { username: newUsername, password, role, clientId } = req.body;

        // Vérifier que le rôle est valide (si fourni)
        if (role && !VALID_ROLES.includes(role)) {
            return res.status(400).json({ message: `Rôle invalide. Les rôles valides sont : ${VALID_ROLES.join(', ')}` });
        }

        // Trouver l'utilisateur existant
        const user = await User.findOne({ username: currentUsername });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si le nouveau nom d'utilisateur existe déjà (et est différent)
        if (newUsername && newUsername !== currentUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Le nouveau nom d’utilisateur existe déjà' });
            }
            user.username = newUsername;
        }

        // Mettre à jour le mot de passe (si fourni)
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Mettre à jour le rôle (si fourni)
        if (role) {
            user.role = role;
        }

        // Mettre à jour le clientId (si fourni)
        if (clientId) {
            try {
                const clientResponse = await axios.get(`${CLIENTS_API_URL}/${clientId}`);
                if (!clientResponse.data) {
                    return res.status(404).json({ message: 'Client non trouvé' });
                }
                user.clientId = clientId;
            } catch (error) {
                return res.status(404).json({
                    message: 'Client non trouvé',
                    error: error.response?.data || error.message,
                });
            }
        }

        // Sauvegarder les modifications
        await user.save();

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            data: {
                username: user.username,
                role: user.role,
                clientId: user.clientId || null,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l’utilisateur', error: error.message });
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

        const response = await axios.get(`${CLIENTS_API_URL}/${user.clientId}`);
        if (!response.data || !response.data.id) {
            return res.status(404).json({ message: `Client non trouvé avec l'ID : ${user.clientId}` });
        }

        res.json({
            message: 'Détails du client récupérés avec succès',
            data: response.data,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des détails du client',
            error: error.response?.data || error.message,
        });
    }
};