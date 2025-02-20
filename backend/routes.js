const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).send('User registered');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user.rows.length || !(await bcrypt.compare(password, user.rows[0].password))) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET_KEY);
    res.json({ token });
});

module.exports = router;