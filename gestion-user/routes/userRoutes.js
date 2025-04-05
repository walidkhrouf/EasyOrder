const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');


const validateUserCreate = [
    body('username')
        .notEmpty()
        .withMessage('Le nom d\'utilisateur est obligatoire'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role')
        .isIn(['client', 'admin'])
        .withMessage('Le rôle doit être "client" ou "admin"'),
    body('clientId')
        .optional()
        .isInt()
        .withMessage('L\'ID du client doit être un entier')
];


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
        .withMessage('L\'ID du client doit être un entier')
];


const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Le nom d\'utilisateur est obligatoire'),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est obligatoire')
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