// Only 4 packages: express, mongoose, jsonwebtoken, cors
// Password hashing uses Node's built-in "crypto" (no extra package).
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');

const SECRET = process.env.JWT_SECRET || 'change-this-secret';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/finance_tracker';

// ---------- Models ----------
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored as "salt:hash"
}));

const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  note: String,
  date: { type: Date, default: Date.now },
}));

// ---------- Helpers ----------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'));
}

// Auth middleware: reads "Authorization: Bearer <token>"
function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  try {
    req.userId = jwt.verify(token, SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: 'Please log in again' });
  }
}

// ---------- App ----------
const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    await User.create({ name, email, password: hashPassword(password) });
    res.status(201).json({ message: 'Account created' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !checkPassword(password, user.password))
      return res.status(400).json({ message: 'Wrong email or password' });
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Only the logged-in user's own data is ever returned
app.get('/transactions', auth, async (req, res) => {
  res.json(await Transaction.find({ userId: req.userId }).sort({ date: -1 }));
});

app.post('/transactions', auth, async (req, res) => {
  try {
    const { type, amount, category, note } = req.body;
    const t = await Transaction.create({ userId: req.userId, type, amount, category, note });
    res.status(201).json(t);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

app.delete('/transactions/:id', auth, async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Deleted' });
});

mongoose.connect(MONGO_URL).then(() => {
  app.listen(5000, () => console.log('API running on http://localhost:5000'));
});
