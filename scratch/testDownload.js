const fs = require('fs');
const path = require('path');
const https = require('https');

const url = 'https://www.soundfxcenter.com/video-games/final-fantasy-xi/8d82b5_Final_Fantasy_XI_Holy_Sound_Effect.mp3';
const dest = path.join(__dirname, 'test_holy.mp3');

const file = fs.createWriteStream(dest);

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.soundfxcenter.com/'
  }
};

console.log("Downloading test file...");
https.get(url, options, (response) => {
  console.log(`Response status code: ${response.statusCode}`);
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("✓ Done!");
      console.log(`File size: ${fs.statSync(dest).size} bytes`);
    });
  } else {
    console.error("✗ Failed");
    file.close();
    try { fs.unlinkSync(dest); } catch(_) {}
  }
}).on('error', (err) => {
  console.error("✗ Error:", err.message);
  file.close();
  try { fs.unlinkSync(dest); } catch(_) {}
});
