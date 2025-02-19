const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
  res.json(result.rows[0]);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, result.rows[0].password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/add-part', authenticateToken, async (req, res) => {
  const { name, acquisition_date, replacement_date } = req.body;
  const result = await pool.query(
    'INSERT INTO car_parts (name, acquisition_date, replacement_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, acquisition_date, replacement_date, req.user.id]
  );
  res.json(result.rows[0]);
});

module.exports = router;