const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.NOTES_API_PORT || 4000;

const OUTPUT_DIR = path.join(__dirname, 'respaldo_json');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function sanitizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function redactContent(content) {
  return content
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*#/.test(line)) {
        return `<<REDACTED-SECTION>>${line}<<REDACTED-SECTION>>`;
      }
      return line.replace(/(@[\w-]+|#[\w-]+)/g, (match) =>
        `<<REDACTED-TAG>>${match}<<REDACTED-TAG>>`
      );
    })
    .join('\n');
}

function saveNote({ title, content, tags = [] }) {
  if (!title || !content) throw new Error('title and content are required');

  const id = Date.now();
  const baseName = sanitizeTitle(title) || `note-${id}`;
  const filename = `${baseName}-${id}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const note = {
    id,
    title,
    tags,
    createdAt: new Date().toISOString(),
    content,
    redacted: redactContent(content),
  };

  fs.writeFileSync(filepath, JSON.stringify(note, null, 2), 'utf8');
  return note;
}

function loadNotes() {
  return fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8');
      return JSON.parse(raw);
    });
}

app.use(express.json());

app.get('/notes', (req, res) => {
  res.json(loadNotes());
});

app.post('/notes', (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = saveNote({ title, content, tags });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/notes/:id', (req, res) => {
  const notes = loadNotes();
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'note not found' });
  res.json(note);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Notes API running at http://localhost:${port}`);
  });
}

module.exports = { saveNote, loadNotes, app };
