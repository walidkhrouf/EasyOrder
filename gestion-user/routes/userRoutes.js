const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');

// Validation for creating a new user
const validateUserCreate = [
    body('username')
        .notEmpty()
        .withMessage('Le nom d\'utilisateur est obligatoire')
        .trim()
        .escape(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .trim()
        .escape(),
    body('nom')
        .notEmpty()
        .withMessage('Le nom est requis')
        .isLength({ max: 100 })
        .withMessage('Le nom ne doit pas dépasser 100 caractères')
        .trim()
        .escape(),
    body('prenom')
        .notEmpty()
        .withMessage('Le prénom est requis')
        .isLength({ max: 100 })
        .withMessage('Le prénom ne doit pas dépasser 100 caractères')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail(),
    body('telephone')
        .notEmpty()
        .withMessage('Le téléphone est requis')
        .isLength({ min: 8, max: 8 })
        .withMessage('Le téléphone doit contenir exactement 8 chiffres')
        .matches(/^[0-9]{8}$/)
        .withMessage('Le téléphone doit contenir uniquement des chiffres')
        .trim()
        .escape(),
    body('adresse')
        .optional()
        .isLength({ max: 200 })
        .withMessage('L\'adresse ne doit pas dépasser 200 caractères')
        .trim()
        .escape(),
    body('dateNaissance')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Date de naissance doit être au format YYYY-MM-DD')
        .custom((value) => {
            if (value) {
                const date = new Date(value);
                const now = new Date();
                if (date >= now) {
                    throw new Error('La date de naissance doit être dans le passé');
                }
            }
            return true;
        }),
    body('clientId')
        .optional()
        .isInt()
        .withMessage('L\'ID du client doit être un entier'),
];

// Validation for updating a user (unchanged)
const validateUserUpdate = [
    body('username')
        .optional()
        .notEmpty()
        .withMessage('Le nouveau nom d\'utilisateur ne peut pas être vide'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
    body('role')
        .optional()
        .isIn(['client', 'admin'])
        .withMessage('Le rôle doit être "client" ou "admin"'),
    body('clientId')
        .optional()
        .isInt()
        .withMessage('L\'ID du client doit être un entier'),
];

// Validation for login (unchanged)
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Le nom d\'utilisateur est obligatoire'),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est obligatoire'),
];

// Routes
router.post('/', validateUserCreate, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:username', userController.getUser);
router.post('/login', validateLogin, userController.login);
router.get('/validate-token', userController.validateToken);
router.get('/:username/client', userController.getClientDetails);
router.put('/:username', validateUserUpdate, userController.updateUser);
router.delete('/:username', userController.deleteUser);

module.exports = router;