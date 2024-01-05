const express = require('express');
const groupController = require('../controller/priceGroup.js');
const router = express.Router();

// Create a new transaction
router.post('/create', groupController.createPriceGroup);

// Get all transactions
router.get('/list', groupController.getAllPriceGroups);

// Get a single transaction by ID
router.get('/:id', groupController.getPriceGroupById);

// Update a transaction by ID
router.put('/:id', groupController.updatePriceGroup);

// Delete a transaction by ID
router.delete('/:id', groupController.deletePriceGroup);

module.exports = router;
