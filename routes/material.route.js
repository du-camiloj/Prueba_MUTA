const express = require('express');
const router = express.Router();
const material = require('../controllers/material.controller');
const authorization = require('../middleware/authorization.middleware');

// Rutas para materiales
router.post('/materials', authorization.auth , material.createMaterial);
router.get('/materials', authorization.auth , material.getAllMaterials);
router.get('/materials/:id', authorization.auth , material.getMaterialById);
router.put('/materials/:id', authorization.auth , material.updateMaterial);
router.delete('/materials/:id', authorization.auth , material.deleteMaterial);

module.exports = router;
