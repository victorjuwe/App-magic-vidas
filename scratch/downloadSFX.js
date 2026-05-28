const fs = require('fs');
const path = require('path');
const https = require('https');

const themeDir = path.join(__dirname, '..', 'themes', 'streetfighter');
if (!fs.existsSync(themeDir)) {
  fs.mkdirSync(themeDir, { recursive: true });
}

const sounds = {
  'dmg.mp3': 'https://www.soundfxcenter.com/video-games/street-fighter/8d82b5_Street_Fighter_Big_Punch_Sound_Effect.mp3',
  'heal.mp3': 'https://www.soundfxcenter.com/video-games/street-fighter/8d82b5_Street_Fighter_Hadouken_Sound_Effect.mp3',
  'victory.mp3': 'https://www.soundfxcenter.com/video-games/street-fighter/8d82b5_Street_Fighter_Shoryuken_Sound_Effect.mp3'
};

console.log("Iniciando descarga de efectos de sonido de Street Fighter II...");

Object.entries(sounds).forEach(([filename, url]) => {
  const dest = path.join(themeDir, filename);
  const file = fs.createWriteStream(dest);

  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Descargado con éxito: ${filename}`);
      });
    } else {
      console.error(`✗ Error al descargar ${filename} (Código: ${response.statusCode})`);
      file.close();
      try { fs.unlinkSync(dest); } catch(_) {}
    }
  }).on('error', (err) => {
    console.error(`✗ Error de conexión en ${filename}:`, err.message);
    file.close();
    try { fs.unlinkSync(dest); } catch(_) {}
  });
});
