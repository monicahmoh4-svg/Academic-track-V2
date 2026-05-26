require('dotenv').config();
require('express-async-errors');

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const fs        = require('fs');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy:     false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: true, credentials: true }));
app.use('/api/auth',       rateLimit({ windowMs: 15*60*1000, max: 30,  message: { error: 'Too many requests.' } }));
app.use('/api/admin/auth', rateLimit({ windowMs: 15*60*1000, max: 15,  message: { error: 'Too many login attempts.' } }));
app.use('/api/',           rateLimit({ windowMs:    60*1000, max: 300, message: { error: 'Rate limit exceeded.' } }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/admin/auth',    require('./routes/adminAuth'));
app.use('/api/submissions',   require('./routes/submissions'));
app.use('/api/ai-score',      require('./routes/aiScore'));
app.use('/api/admin',         require('./routes/admin'));
const { notifRouter, msgRouter } = require('./routes/communications');
app.use('/api/notifications', notifRouter);
app.use('/api/messages',      msgRouter);

app.get('/health', (_req, res) => res.json({
  status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV || 'development',
}));

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, 'public', 'client');
  const adminBuild  = path.join(__dirname, 'public', 'admin');
  const clientIndex = path.join(clientBuild, 'index.html');
  const adminIndex  = path.join(adminBuild,  'index.html');

  console.log(`Client build: ${fs.existsSync(clientIndex) ? 'FOUND' : 'MISSING'}`);
  console.log(`Admin  build: ${fs.existsSync(adminIndex)  ? 'FOUND' : 'MISSING'}`);

  app.use('/admin', express.static(adminBuild, { index: 'index.html' }));
  app.get('/admin',   (_req, res) => res.sendFile(adminIndex));
  app.get('/admin/*', (_req, res) => res.sendFile(adminIndex));

  app.use(express.static(clientBuild, { index: false }));
  app.get('/', (_req, res) => res.sendFile(clientIndex));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) return next();
    res.sendFile(clientIndex);
  });
}

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  if (err.code === '23505') return res.status(409).json({ error: 'Duplicate entry.' });
  if (err.code === '23503') return res.status(400).json({ error: 'Referenced record not found.' });
  if (err.code === '22P02') return res.status(400).json({ error: 'Invalid ID format.' });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ─────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Creates ALL tables and seeds admin — retries up to 8x for Render cold boots
async function initDB(attempt) {
  attempt = attempt || 1;
  const MAX = 8;
  try {
    const bcrypt    = require('bcryptjs');
    const { query } = require('./db');

    // ── Extensions ──────────────────────────────────────
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ── Moderators ───────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS moderators (
        id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
        name          VARCHAR(120) NOT NULL,
        username      VARCHAR(60)  UNIQUE NOT NULL,
        email         VARCHAR(160) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role          VARCHAR(60)  DEFAULT 'Moderator',
        is_active     BOOLEAN      DEFAULT TRUE,
        created_at    TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    // ── Students ─────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS students (
        id                    UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name            VARCHAR(80)  NOT NULL,
        last_name             VARCHAR(80)  NOT NULL,
        reg_number            VARCHAR(60)  UNIQUE NOT NULL,
        phone                 VARCHAR(30)  NOT NULL,
        email                 VARCHAR(160) UNIQUE NOT NULL,
        academic_level        VARCHAR(60)  NOT NULL,
        department            VARCHAR(120) NOT NULL,
        research_topic        VARCHAR(255),
        password_hash         VARCHAR(255) NOT NULL,
        assigned_moderator_id UUID         REFERENCES moderators(id) ON DELETE SET NULL,
        is_active             BOOLEAN      DEFAULT TRUE,
        created_at            TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    // ── Submissions ──────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id      UUID         REFERENCES students(id) ON DELETE CASCADE,
        type            VARCHAR(40)  NOT NULL,
        title           VARCHAR(255) NOT NULL,
        content         TEXT         NOT NULL,
        current_level   VARCHAR(60)  DEFAULT 'Department',
        status          VARCHAR(30)  DEFAULT 'Submitted',
        ai_score        INTEGER      DEFAULT 0,
        ai_feedback     TEXT,
        manual_score    INTEGER      DEFAULT 0,
        moderator_notes TEXT,
        submitted_at    TIMESTAMPTZ  DEFAULT NOW(),
        updated_at      TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    // ── Submission history ───────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS submission_history (
        id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
        submission_id UUID        REFERENCES submissions(id) ON DELETE CASCADE,
        level         VARCHAR(60) NOT NULL,
        status        VARCHAR(30) NOT NULL,
        notes         TEXT,
        changed_by    UUID        REFERENCES moderators(id) ON DELETE SET NULL,
        changed_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ── Notifications ────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
        sent_by        UUID         REFERENCES moderators(id) ON DELETE SET NULL,
        recipient_type VARCHAR(20)  DEFAULT 'all',
        recipient_id   UUID         REFERENCES students(id) ON DELETE CASCADE,
        title          VARCHAR(200) NOT NULL,
        message        TEXT         NOT NULL,
        is_read        BOOLEAN      DEFAULT FALSE,
        created_at     TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    // ── Messages ─────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id         UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID         REFERENCES students(id) ON DELETE CASCADE,
        subject    VARCHAR(200) NOT NULL,
        body       TEXT         NOT NULL,
        reply      TEXT,
        replied_by UUID         REFERENCES moderators(id) ON DELETE SET NULL,
        replied_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    // ── Indexes ──────────────────────────────────────────
    await query(`CREATE INDEX IF NOT EXISTS idx_submissions_student   ON submissions(student_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sub_history_sub       ON submission_history(submission_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_notifs_recipient      ON notifications(recipient_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_messages_student      ON messages(student_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_students_moderator    ON students(assigned_moderator_id)`);

    console.log('✅  All tables ready');

    // ── Seed Super Admin ─────────────────────────────────
    const username = process.env.ADMIN_USERNAME || 'superadmin';
    const password = process.env.ADMIN_PASSWORD || 'superadmin123';
    const hash     = await bcrypt.hash(password, 12);

    await query(
      `INSERT INTO moderators (name, username, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, 'Super Admin', TRUE)
       ON CONFLICT (username) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             name          = EXCLUDED.name,
             role          = 'Super Admin',
             is_active     = TRUE`,
      ['System Administrator', username, 'admin@academitrack.edu', hash]
    );

    console.log('=============================');
    console.log('  ADMIN CREDENTIALS READY');
    console.log('=============================');
    console.log(`  Username : ${username}`);
    console.log(`  Password : ${password}`);
    console.log(`  Portal   : /admin/`);
    console.log('=============================\n');

  } catch (err) {
    console.warn(`DB init attempt ${attempt}/${MAX} failed: ${err.message}`);
    if (attempt < MAX) {
      console.log(`  Retrying in 5s...`);
      await sleep(5000);
      await initDB(attempt + 1);
    } else {
      console.error('❌  DB init failed after all retries.');
      console.error('    Verify DATABASE_URL is set in Render environment variables.');
    }
  }
}

// ─────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\nAcademiTrack on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  await initDB();
});
