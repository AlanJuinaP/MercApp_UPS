const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.render('login', { error: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if(!valid) return res.render('login' , { error: 'Contraseña incorrecta' });
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;
    res.redirect('/products');
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ username, passwordHash: hash, role: 'admin' });
    await u.save();
    res.redirect('/login');
});

module.exports = router;