const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../contador.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Extraer CSS (desde <style> hasta </style>)
const styleRegex = /<style>([\s\S]*?)<\/style>/i;
const styleMatch = content.match(styleRegex);

if (styleMatch) {
    const cssContent = styleMatch[1].trim();
    fs.writeFileSync(path.join(__dirname, '../style.css'), cssContent, 'utf8');
    // Reemplazar todo el bloque con un link
    content = content.replace(styleMatch[0], '<link rel="stylesheet" href="./style.css">');
    console.log("CSS extraído correctamente a style.css");
}

// 2. Extraer JS principal (asumiendo que es el último tag <script> masivo)
const scripts = content.split('<script>');
// El último bloque contiene el código de engine
if (scripts.length > 1) {
    const lastScriptBlock = scripts[scripts.length - 1];
    const scriptClosingIndex = lastScriptBlock.indexOf('</script>');
    if (scriptClosingIndex !== -1) {
        const jsContent = lastScriptBlock.substring(0, scriptClosingIndex).trim();
        fs.writeFileSync(path.join(__dirname, '../engine.js'), jsContent, 'utf8');
        
        // Reconstruir la última etiqueta script con el src
        const beforeScript = scripts.slice(0, scripts.length - 1).join('<script>');
        const afterScript = lastScriptBlock.substring(scriptClosingIndex + 9);
        
        content = beforeScript + '<script src="./engine.js"></script>' + afterScript;
        console.log("JS extraído correctamente a engine.js");
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log("contador.html actualizado.");
