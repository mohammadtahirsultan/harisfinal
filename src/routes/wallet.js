const express = require('express');
const walletController = require('../controller/wallet');
const router = express.Router();

// Create a new transaction
router.post('/create', walletController.createTransaction);

// Get all transactions
router.get('/list', walletController.getAllTransactions);

// Get a single transaction by ID
router.get('/:id', walletController.getTransactionById);

// Update a transaction by ID
router.put('/:id', walletController.updateTransaction);

// Delete a transaction by ID
router.delete('/:id', walletController.deleteTransaction);

module.exports = router;
