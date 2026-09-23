const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const JwtBearerMiddleware = require('../Auth/JwtBearer');

const jwtMiddleware = new JwtBearerMiddleware(process.env.JWT_SECRET);

// Never send the password hash back to the client
const toSafeUser = (userDoc) => {
  const obj = userDoc.toObject();
  delete obj.password;
  return obj;
};

router.post('/user/', async (req, res) => {
  try {
    const { full_name, user_name, email, password, phoneNumber } = req.body || {};

    if (!full_name || !user_name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUsername = await User.findOne({ user_name });
    if (existingUsername) {
      return res.status(400).json({ message: 'An account already exists with this username.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'An account already exists with the provided email or phone number.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ full_name, user_name, email, password: hashedPassword, phoneNumber });
    const newUser = await user.save();

    res.status(201).json(toSafeUser(newUser));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Now protected: you can only read your OWN profile.
router.get('/myInfo/:id/', jwtMiddleware.authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You can only view your own profile' });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/protected/', jwtMiddleware.authenticate, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

module.exports = router;
