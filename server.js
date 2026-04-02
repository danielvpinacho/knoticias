const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Static site content
app.use(express.static(path.join(__dirname)));

// Postgres pool, optional
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.POSTGRES_DB || 'knoticias',
  user: process.env.POSTGRES_USER || 'knoticias',
  password: process.env.POSTGRES_PASSWORD || 'knoticias',
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ status: 'ok', db: result.rows[0] });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
