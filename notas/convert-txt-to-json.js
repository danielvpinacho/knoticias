const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'respaldo_txt');
const targetDir = path.join(__dirname, 'respaldo_json');

if (!fs.existsSync(sourceDir)) {
  throw new Error('Source directory not found: ' + sourceDir);
}
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function redactContent(content) {
  const lines = content.split(/\r?\n/);
  return lines
    .map(line => {
      if (/^\s*#/.test(line)) {
        return `<<REDACTED-SECTION>>${line}<<REDACTED-SECTION>>`;
      }
      return line.replace(/(@[\w-]+|#[\w-]+)/g, match => `<<REDACTED-TAG>>${match}<<REDACTED-TAG>>`);
    })
    .join('\n');
}

const files = fs.readdirSync(sourceDir).filter(x => x.toLowerCase().endsWith('.txt'));

for (const file of files) {
  const filePath = path.join(sourceDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const title = path.basename(file, '.txt');
  const jsonData = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    sourceFile: file,
    title,
    createdAt: new Date().toISOString(),
    content,
    redacted: redactContent(content)
  };
  const outPath = path.join(targetDir, `${title}.json`);
  fs.writeFileSync(outPath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log('wrote', outPath);
}

console.log('done', files.length, 'notes converted.');
