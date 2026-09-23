// Entry point of the backend. This file was missing in the original project,
// which is why the API could never start.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set it.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI. Copy .env.example to .env and set it.');
  process.exit(1);
}

// Controllers are required AFTER dotenv has loaded, because they read JWT_SECRET.
const loginRoutes = require('./Controllers/Login');
const userRoutes = require('./Controllers/User');
const transactionRoutes = require('./Controllers/Transaction');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json()); // without this, req.body is undefined in every route

app.use('/', loginRoutes);
app.use('/', userRoutes);
app.use('/', transactionRoutes);

app.get('/', (req, res) => res.json({ message: 'Financlo API is running' }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
