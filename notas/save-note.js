const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'respaldo_json');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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
    .map(line => {
      if (/^\s*#/.test(line)) {
        return `<<REDACTED-SECTION>>${line}<<REDACTED-SECTION>>`;
      }
      return line.replace(/(@[\w-]+|#[\w-]+)/g, match => `<<REDACTED-TAG>>${match}<<REDACTED-TAG>>`);
    })
    .join('\n');
}

function saveNote({ title, content, tags = [] }) {
  if (!title || !content) throw new Error('title and content are required');

  const id = Date.now();
  const baseName = sanitizeTitle(title) || `note-${id}`;
  const fileName = `${baseName}-${id}.json`;
  const filePath = path.join(outputDir, fileName);

  const payload = {
    id,
    title,
    tags,
    createdAt: new Date().toISOString(),
    content,
    redacted: redactContent(content)
  };

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return { filePath, payload };
}

function listSavedNotes() {
  return fs.readdirSync(outputDir)
    .filter(f => f.toLowerCase().endsWith('.json'))
    .map(f => ({ file: f, path: path.join(outputDir, f) }));
}

if (require.main === module) {
  const [title, ...rest] = process.argv.slice(2);
  const content = rest.join(' ');
  if (!title || !content) {
    console.error('Usage: node save-note.js "title" "content"');
    process.exit(1);
  }
  const res = saveNote({ title, content });
  console.log('Saved note to', res.filePath);
}

module.exports = { saveNote, listSavedNotes };
