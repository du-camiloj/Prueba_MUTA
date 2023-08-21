const express = require('express');
const router = express.Router();
const collection = require('../controllers/collection.controller');
const authorization = require('../middleware/authorization.middleware');

// Rutas para recoleccion
router.post('/collections', authorization.auth ,collection.createCollection);
router.get('/collections', authorization.auth , collection.getAllCollections);
router.get('/collections/:id', authorization.auth , collection.getCollectionById);
router.put('/collections/:id', authorization.auth , collection.updateCollection);
router.delete('/collections/:id', authorization.auth , collection.deleteCollection);
router.post('/optimalRoute', authorization.auth , collection.optimalRoute);

module.exports = router;
