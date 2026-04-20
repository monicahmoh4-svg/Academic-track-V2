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
    return res.status(500).json({
      error: 'Database error — the moderators table may not exist. Check Railway logs.',
    });
  }

  if (!r.rows.length) {
    console.log(`Login failed: username "${username}" not found in DB`);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const mod = r.rows[0];

  if (!mod.is_active) {
    return res.status(403).json({ error: 'Account deactivated.' });
  }

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

// GET /api/admin/auth/check  — verify DB state from browser, no auth needed
// Visit: https://your-app.railway.app/api/admin/auth/check
router.get('/check', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, username, role, is_active, created_at FROM moderators'
    );
    res.json({
      moderator_count: result.rowCount,
      moderators: result.rows,
      env_username: process.env.ADMIN_USERNAME || '(not set — using default: superadmin)',
      env_password_set: !!process.env.ADMIN_PASSWORD,
      message: result.rowCount === 0
        ? 'No admins found. Server seed may have failed. Check Railway deploy logs.'
        : 'Admin exists. Use the username shown above to log in.',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: 'DB error — moderators table may not exist. schema.sql may not have been run.',
    });
  }
});

module.exports = router;
