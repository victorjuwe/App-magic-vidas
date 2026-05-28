const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'engine.js');
const code = fs.readFileSync(filePath, 'utf8');

try {
  new Function(code);
  console.log("✓ engine.js syntax is 100% VALID!");
} catch (e) {
  console.error("✗ engine.js syntax error:", e.message);
  process.exit(1);
}
