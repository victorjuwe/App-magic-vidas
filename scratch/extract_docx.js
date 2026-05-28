const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'unzipped_gems', 'word', 'document.xml');
const outPath = path.join(__dirname, 'gems_text.txt');

try {
  if (!fs.existsSync(xmlPath)) {
    console.error('No se encuentra word/document.xml en el archivo descomprimido.');
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  // Buscar todos los bloques de texto <w:t>...</w:t> y <w:t xml:space="preserve">...</w:t>
  const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  let match;
  let textArray = [];

  while ((match = regex.exec(xmlContent)) !== null) {
    // Decodificar entidades XML básicas como &amp;, &lt;, &gt;, &quot;, &apos;
    let text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
    textArray.push(text);
  }

  // Agrupar texto con saltos de línea donde se detecten párrafos
  // En docx, los párrafos están envueltos en <w:p>...</w:p>
  // Vamos a hacer una extracción más inteligente: reemplazar </w:p> por saltos de línea
  let formattedXml = xmlContent.replace(/<\/w:p>/g, '\n');
  let cleanTextArray = [];
  let formattedMatch;
  const regexFormatted = /<w:t[^>]*>(.*?)<\/w:t>|<\/w:p>/g;
  
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
  console.log('¡Texto extraído con éxito en scratch/gems_text.txt!');
} catch (err) {
  console.error('Error al procesar el documento:', err);
}
