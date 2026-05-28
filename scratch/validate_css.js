const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'style.css');
const content = fs.readFileSync(filePath, 'utf8');

const stack = [];
let lineNum = 1;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') {
    lineNum++;
  } else if (char === '{') {
    stack.push(lineNum);
  } else if (char === '}') {
    if (stack.length === 0) {
      console.error(`✗ Unmatched closing brace '}' at line ${lineNum}`);
      process.exit(1);
    }
    stack.pop();
  }
}

if (stack.length > 0) {
  console.error(`✗ Unmatched opening braces found at lines: ${stack.join(', ')}`);
  process.exit(1);
} else {
  console.log("✓ style.css brace matching is 100% VALID!");
}
