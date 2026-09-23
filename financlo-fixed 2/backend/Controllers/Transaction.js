const express = require('express');
const router = express.Router();

const Transaction = require('../Models/Transaction');
const User = require('../Models/User');
const JwtBearerMiddleware = require('../Auth/JwtBearer');

const jwtMiddleware = new JwtBearerMiddleware(process.env.JWT_SECRET);

// Create a transaction for the logged-in user
router.post('/transaction/', jwtMiddleware.authenticate, async (req, res) => {
  try {
    const { id: uid, username: owner } = req.user;
    const { amount, category, description, paymentMethod } = req.body || {};

    const transaction = new Transaction({
      amount,
      category,
      owner,
      description,
      paymentMethod,
      ownerId: uid,
    });

    const savedTransaction = await transaction.save();

    // Keep the user's `expenses` array in sync
    await User.findByIdAndUpdate(uid, { $push: { expenses: savedTransaction._id } });

    res.status(201).json(savedTransaction);
  } catch (err) {
    // Validation errors (missing amount, category, ...) are the client's fault -> 400
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// List a user's transactions (only your own). Newest first.
router.get('/myTransactions/:id/', jwtMiddleware.authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You can only view your own transactions' });
    }

    const documents = await Transaction.find({ ownerId: id }).sort({ time: -1 });

    // An empty list is a valid answer, not an error, so return 200 with []
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Find the owner of a transaction (protected, and never leaks the password)
router.get('/getUserBytransaction/:id', jwtMiddleware.authenticate, async (req, res) => {
  try {
    const transactionDocument = await Transaction.findById(req.params.id);

    if (!transactionDocument) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (String(transactionDocument.ownerId) !== req.user.id) {
      return res.status(403).json({ message: 'Not your transaction' });
    }

    const user = await User.findById(transactionDocument.ownerId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching documents', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
