const fs = require('fs');
const path = require('path');

// 1. CSS
const cssFile = path.join(__dirname, '../style.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const lobbyCSS = `
/* ── PANTALLA LOBBY (PREMIUM) ── */
#lobby-screen {
  position: fixed;
  inset: 0;
  background: var(--void);
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.8s ease, transform 0.8s ease, visibility 0.8s;
  background-image: 
    radial-gradient(circle at 50% -20%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 120%, rgba(255, 0, 85, 0.15) 0%, transparent 50%);
}
#lobby-screen.hidden {
  opacity: 0;
  visibility: hidden;
  transform: scale(1.05);
  pointer-events: none;
}
.lobby-container {
  width: 90%;
  max-width: 400px;
  background: rgba(15, 15, 25, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
}
.lobby-title {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  margin-bottom: 5px;
  color: var(--text);
}
.lobby-title span { color: var(--gold); }
.lobby-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  letter-spacing: 2px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 30px;
}
.lobby-section {
  margin-bottom: 25px;
  text-align: left;
}
.lobby-section h3 {
  font-size: 12px;
  letter-spacing: 1px;
  color: #666;
  margin-bottom: 10px;
  padding-left: 5px;
}
.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.mode-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 15px 10px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
}
.mode-btn small {
  font-weight: 300;
  color: #888;
  font-size: 11px;
}
.mode-btn.active {
  background: rgba(0, 240, 255, 0.1);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 15px rgba(0,240,255,0.2);
}
.theme-slider {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding-bottom: 10px;
  scrollbar-width: none;
}
.theme-slider::-webkit-scrollbar { display: none; }
.theme-slide-btn {
  flex: 0 0 140px;
  padding: 15px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #aaa;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}
.theme-slide-btn.active {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 0 15px rgba(255,215,0,0.15);
}
.btn-start-massive {
  width: 100%;
  padding: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--gold-dim), var(--gold));
  color: #000;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 2px;
  border: none;
  margin-top: 15px;
  transition: transform 0.1s;
}
.btn-start-massive:active { transform: scale(0.96); }
`;
if (!cssContent.includes('#lobby-screen')) {
    fs.writeFileSync(cssFile, cssContent + '\n' + lobbyCSS, 'utf8');
    console.log("CSS del lobby inyectado.");
}

// 2. JS
const jsFile = path.join(__dirname, '../engine.js');
let jsContent = fs.readFileSync(jsFile, 'utf8');

const lobbyJS = `
// LOBBY LOGIC
let selectedMode = 'bo3';
let selectedLobbyTheme = '';

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const target = e.currentTarget;
    target.classList.add('active');
    selectedMode = target.id === 'btnModeCommander' ? 'commander' : 'bo3';
    playSynthSound('lock');
  });
});

document.querySelectorAll('.theme-slide-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.theme-slide-btn').forEach(b => b.classList.remove('active'));
    const target = e.currentTarget;
    target.classList.add('active');
    selectedLobbyTheme = target.getAttribute('data-theme');
    
    // Preview theme instantly in background
    applyTheme(selectedLobbyTheme);
    playSynthSound('lock');
  });
});

$('btnStartGame').addEventListener('click', () => {
  playSynthSound('victory');
  $('lobby-screen').classList.add('hidden');
  $('game-screen').style.display = 'flex';
  
  // Set lives based on mode
  if (selectedMode === 'commander') {
     S.lives = [40, 40];
     S.prevLives = [40, 40];
     // Commander Damage will be integrated later
  } else {
     S.lives = [20, 20];
     S.prevLives = [20, 20];
  }
  
  // Force re-render of lives
  $('ln1').textContent = S.lives[0];
  $('ln2').textContent = S.lives[1];
  
  // Apply Theme officially
  selectTheme(selectedLobbyTheme);
});
`;

if (!jsContent.includes('// LOBBY LOGIC')) {
    jsContent = jsContent + '\n' + lobbyJS;
    
    // Modificar initAppEngine para no auto-cargar el match inmediatamente si el lobby está activo.
    // Solo mostramos el lobby.
    fs.writeFileSync(jsFile, jsContent, 'utf8');
    console.log("JS del lobby inyectado.");
}
