const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'unzipped_gems_veo', 'word', 'document.xml');
const outPath = path.join(__dirname, 'gems_veo_text.txt');

try {
  if (!fs.existsSync(xmlPath)) {
    console.error('No se encuentra word/document.xml en el archivo descomprimido.');
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  // Buscar todos los bloques de texto <w:t>...</w:t> envueltos en párrafos <w:p>
  const matches = xmlContent.matchAll(/<w:p[^>]*>(.*?)<\/w:p>/g);
  let outputLines = [];
  for (const m of matches) {
    let pContent = m[1];
    let tMatches = pContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
    let pText = tMatches.map(t => {
      let inner = t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
      return inner
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
    }).join('');
    outputLines.push(pText);
  }

  fs.writeFileSync(outPath, outputLines.join('\n'), 'utf8');
  console.log('¡Texto de Veo extraído con éxito en scratch/gems_veo_text.txt!');
} catch (err) {
  console.error('Error al procesar el documento:', err);
}
