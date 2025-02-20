const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  res.status(201).send('User registered');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user.rows.length || !(await bcrypt.compare(password, user.rows[0].password))) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET_KEY);
  res.json({ token });
});

// CRUD for Car Parts
router.post('/parts', auth, async (req, res) => {
  const { name, date_acquired, replacement_date } = req.body;
  const user_id = req.user.id;
  await db.query(
    'INSERT INTO car_parts (name, date_acquired, replacement_date, user_id) VALUES ($1, $2, $3, $4)',
    [name, date_acquired, replacement_date, user_id]
  );
  res.status(201).send('Part added');
});

router.get('/parts', auth, async (req, res) => {
  const user_id = req.user.id;
  const parts = await db.query('SELECT * FROM car_parts WHERE user_id = $1', [user_id]);
  res.json(parts.rows);
});

router.put('/parts/:id', auth, async (req, res) => {
  const { name, date_acquired, replacement_date } = req.body;
  const part_id = req.params.id;
  const user_id = req.user.id;
  await db.query(
    'UPDATE car_parts SET name = $1, date_acquired = $2, replacement_date = $3 WHERE id = $4 AND user_id = $5',
    [name, date_acquired, replacement_date, part_id, user_id]
  );
  res.send('Part updated');
});

router.delete('/parts/:id', auth, async (req, res) => {
  const part_id = req.params.id;
  const user_id = req.user.id;
  await db.query('DELETE FROM car_parts WHERE id = $1 AND user_id = $2', [part_id, user_id]);
  res.send('Part deleted');
});

module.exports = router;