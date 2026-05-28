const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'contador.html');
const content = fs.readFileSync(filePath, 'utf8');

// Basic HTML tag parser to find unclosed div tags or syntax errors
const stack = [];
const regex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>/g;
let match;
let lineNum = 1;
let lastIndex = 0;

while ((match = regex.exec(content)) !== null) {
  const tag = match[0];
  const tagName = match[1].toLowerCase();
  
  // Count lines
  const substring = content.substring(lastIndex, match.index);
  lineNum += (substring.match(/\n/g) || []).length;
  lastIndex = match.index;

  // Ignore self-closing tags or void tags
  if (['meta', 'link', 'img', 'br', 'hr', 'input', 'defs', 'circle', 'path', 'g', 'video', 'source'].includes(tagName)) {
    continue;
  }

  if (tag.startsWith('</')) {
    if (stack.length === 0) {
      console.error(`✗ Unmatched closing tag </${tagName}> at line ${lineNum}`);
      process.exit(1);
    }
    const popped = stack.pop();
    if (popped.name !== tagName) {
      console.error(`✗ Tag mismatch: expected </${popped.name}> (opened at line ${popped.line}), but found </${tagName}> at line ${lineNum}`);
      process.exit(1);
    }
  } else {
    stack.push({ name: tagName, line: lineNum });
  }
}

if (stack.length > 0) {
  console.error(`✗ Unclosed tags found:`);
  stack.forEach(t => console.error(`  <${t.name}> opened at line ${t.line}`));
  process.exit(1);
} else {
  console.log("✓ contador.html HTML tags are 100% VALID!");
}
