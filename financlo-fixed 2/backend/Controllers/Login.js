const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');

const isBcryptHash = (value) => /^\$2[aby]\$/.test(value);

router.post('/login', async (req, res) => {
    const { user_name, password } = req.body || {};

    if (!user_name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ user_name });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        let passwordOk;
        if (isBcryptHash(user.password)) {
            passwordOk = await bcrypt.compare(password, user.password);
        } else {
            // Legacy account created before hashing was added: compare plain text once,
            // then upgrade the stored password to a hash.
            passwordOk = password === user.password;
            if (passwordOk) {
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if (!passwordOk) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.user_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'User found', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
