const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, '../style.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const rickmortyCSS = `
/* ── Tema: RICK Y MORTY (rickmorty) ── */
body[data-theme="rickmorty"] {
  --void: #0a0a0a;
  --bg-fallback:
    radial-gradient(circle at 20% 20%, rgba(57, 255, 20, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(0, 240, 255, 0.10) 0%, transparent 60%),
    #0a0a0a;
}
body[data-theme="rickmorty"] #theme-frame {
  background-image: url('./themes/rickmorty/frame.png');
  background-size: cover;
  background-position: center;
  opacity: 1;
}
body[data-theme="rickmorty"] .lifebtn {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(20px, 6vw, 26px);
  border-radius: 12px;
  border: 2px solid #39ff14;
  background: rgba(10, 20, 10, 0.85);
  backdrop-filter: blur(5px);
  transition: transform 75ms ease, box-shadow 75ms ease;
  will-change: transform, box-shadow;
}
body[data-theme="rickmorty"] .lifebtn.lplus {
  color: #39ff14;                              /* Neon Green */
  box-shadow: 0 4px 0 0 #0f300f, 0 0 0 1px rgba(57, 255, 20, 0.15) inset, 0 0 15px rgba(57, 255, 20, 0.3);
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.8);
}
body[data-theme="rickmorty"] .lifebtn.lminus {
  color: #00f0ff;                              /* Cyan portal secondary */
  border-color: #008b99;
  box-shadow: 0 4px 0 0 #002233, 0 0 0 1px rgba(0, 240, 255, 0.15) inset, 0 0 15px rgba(0, 240, 255, 0.3);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.8);
}
body[data-theme="rickmorty"] .lifebtn.lplus:active,
body[data-theme="rickmorty"] .lifebtn.lminus:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 transparent, 0 0 10px rgba(57, 255, 20, 0.5) inset;
}

body[data-theme="rickmorty"] .delta-popup {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: clamp(15px, 4.5vw, 22px);
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  animation: floatUpAndFade 1100ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
body[data-theme="rickmorty"] .delta-popup.dmg {
  color: #00f0ff;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.8), 0 0 24px rgba(0, 240, 255, 0.45), 0 2px 4px rgba(0, 0, 0, 0.95);
}
body[data-theme="rickmorty"] .delta-popup.heal {
  color: #39ff14;
  text-shadow: 0 0 12px rgba(57, 255, 20, 0.8), 0 0 24px rgba(57, 255, 20, 0.45), 0 2px 4px rgba(0, 0, 0, 0.95);
}
`;

if (!cssContent.includes('data-theme="rickmorty"')) {
    fs.writeFileSync(cssFile, cssContent + '\n' + rickmortyCSS, 'utf8');
    console.log("CSS de Rick y Morty inyectado.");
}
