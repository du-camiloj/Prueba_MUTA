const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');

// Rutas para recoleccion
router.post('/user', user.createUser);
router.post('/user/login', user.login);

module.exports = router;