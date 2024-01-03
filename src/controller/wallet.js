const { MyWallet } = require("../model/wallet");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { title, amount } = req.body;
    const transaction = new MyWallet({ title, amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await MyWallet.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await MyWallet.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
  try {
    const { title, amount } = req.body;
    const updatedTransaction = await MyWallet.findByIdAndUpdate(
      req.params.id,
      { title, amount },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await MyWallet.findByIdAndRemove(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(deletedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
