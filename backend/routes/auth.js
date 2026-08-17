const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

const router = express.Router();
const SALT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




function publicUser(row){
  // Never send password_hash to the client.
  return {
    email: row.email,
    name: row.name,
    phone: row.phone,
    address: row.address
  };
}

// ---- CREATE (signup) ----
router.post('/signup', async (req, res) => {
  try {
    const email = (req.body.email || '').toString().trim().toLowerCase();
    const password = (req.body.password || '').toString();
    const name = (req.body.name || '').toString().trim();

    if (!EMAIL_RE.test(email)) {
      return res.json({ result: 'error', message: 'Invalid email address.' });
    }
    if (password.length < 6) {
      return res.json({ result: 'error', message: 'Password must be at least 6 characters.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.json({ result: 'error', message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const inserted = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING email, name, phone, address`,
      [email, passwordHash, name]
    );

    res.json({ result: 'success', user: publicUser(inserted.rows[0]) });
  } catch (err) {
    console.error('signup error:', err);
    res.json({ result: 'error', message: 'Something went wrong. Please try again.' });
  }
});

// ---- READ (login) ----
router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').toString().trim().toLowerCase();
    const password = (req.body.password || '').toString();

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ result: 'error', message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.json({ result: 'error', message: 'Invalid email or password.' });
    }

    res.json({ result: 'success', user: publicUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.json({ result: 'error', message: 'Something went wrong. Please try again.' });
  }
});

// ---- UPDATE (profile / address) ----
router.post('/update_profile', async (req, res) => {
  try {
    const email = (req.body.email || '').toString().trim().toLowerCase();
    const name = (req.body.name || '').toString().trim();
    const phone = (req.body.phone || '').toString().trim();
    const address = req.body.address || null;

    const result = await pool.query(
      `UPDATE users SET name = $2, phone = $3, address = $4
       WHERE email = $1
       RETURNING email, name, phone, address`,
      [email, name, phone, JSON.stringify(address)]
    );

    if (result.rows.length === 0) {
      return res.json({ result: 'error', message: 'User not found.' });
    }

    res.json({ result: 'success', user: publicUser(result.rows[0]) });
  } catch (err) {
    console.error('update_profile error:', err);
    res.json({ result: 'error', message: 'Something went wrong. Please try again.' });
  }
});

// ---- DELETE ----
router.post('/delete_account', async (req, res) => {
  try {
    const email = (req.body.email || '').toString().trim().toLowerCase();
    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    res.json({ result: 'success', message: 'Account deleted.' });
  } catch (err) {
    console.error('delete_account error:', err);
    res.json({ result: 'error', message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
