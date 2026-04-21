const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { signToken, authAdmin } = require('../middleware/auth');

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  let r;
  try {
    r = await query(
      'SELECT id, name, username, email, role, is_active, password_hash FROM moderators WHERE username = $1',
      [username.trim().toLowerCase()]
    );
  } catch (dbErr) {
    console.error('LOGIN DB ERROR:', dbErr.message);
    return res.status(500).json({ error: 'Database error.' });
  }

  if (!r.rows.length) {
    console.log(`Login failed: username "${username}" not found`);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const mod = r.rows[0];
  if (!mod.is_active) return res.status(403).json({ error: 'Account deactivated.' });

  const valid = await bcrypt.compare(password, mod.password_hash);
  if (!valid) {
    console.log(`Login failed: wrong password for "${username}"`);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const { password_hash, ...safe } = mod;
  const token = signToken({ id: mod.id, role: 'admin', modRole: mod.role });
  res.json({ token, moderator: safe });
});

// GET /api/admin/auth/me
router.get('/me', authAdmin, async (req, res) => {
  const r = await query(
    'SELECT id, name, username, email, role, created_at FROM moderators WHERE id = $1',
    [req.admin.id]
  );
  if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(r.rows[0]);
});

// GET /api/admin/auth/check — see DB state
router.get('/check', async (req, res) => {
  try {
    const result = await query('SELECT id, username, role, is_active, created_at FROM moderators');
    res.json({
      moderator_count: result.rowCount,
      moderators: result.rows,
      env_username: process.env.ADMIN_USERNAME || 'superadmin',
      env_password_set: !!process.env.ADMIN_PASSWORD,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/auth/reset — DELETES all admins and creates fresh one from env vars
// Visit this URL once: https://your-app.railway.app/api/admin/auth/reset
router.get('/reset', async (req, res) => {
  try {
    const username = process.env.ADMIN_USERNAME || 'superadmin';
    const password = process.env.ADMIN_PASSWORD || 'superadmin123';
    const hash = await bcrypt.hash(password, 12);

    // Delete ALL existing admins then insert fresh
    await query('DELETE FROM moderators');
    await query(
      `INSERT INTO moderators (name, username, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, 'Super Admin', TRUE)`,
      ['System Administrator', username, 'admin@academitrack.edu', hash]
    );

    res.json({
      success: true,
      message: `All old admins deleted. New admin created.`,
      username,
      password,
      login_url: '/admin/',
      next: 'Go to /admin/ and log in with the username and password shown above.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
