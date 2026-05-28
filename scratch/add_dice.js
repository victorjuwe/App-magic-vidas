const fs = require('fs');
const path = require('path');

// 1. HTML Injection (Dice Bar and Overlay)
const htmlFile = path.join(__dirname, '../contador.html');
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

const diceHTML = `
  <!-- ── BARRA INFERIOR DE DADOS (PRO FEATURES) ── -->
  <div id="dice-bar">
    <button class="dice-btn" onclick="rollItem('coin')">🪙 Moneda</button>
    <button class="dice-btn" onclick="rollItem('d6')">🎲 D6</button>
    <button class="dice-btn" onclick="rollItem('d20')">icosaedro D20</button>
  </div>

  <!-- ── OVERLAY DE RESULTADO DE DADO ── -->
  <div id="dice-overlay" class="hidden">
    <div class="dice-result-box" id="diceResultBox">
      <div id="diceSpinner">🎲</div>
      <div id="diceValue">--</div>
    </div>
  </div>
`;

if (!htmlContent.includes('id="dice-bar"')) {
    htmlContent = htmlContent.replace('<!-- ── Capa de Interfaz Principal ── -->', '<!-- ── Capa de Interfaz Principal ── -->\n' + diceHTML);
    fs.writeFileSync(htmlFile, htmlContent, 'utf8');
    console.log("HTML Dados inyectado.");
}

// 2. CSS Injection
const cssFile = path.join(__dirname, '../style.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const diceCSS = `
/* ── DADOS Y MONEDAS ── */
#dice-bar {
  position: absolute;
  bottom: calc(var(--safe-bottom) + 20px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 10px 20px;
  border-radius: 30px;
  z-index: 2000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}
.dice-btn {
  background: none;
  border: none;
  color: #ccc;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  transition: all 0.2s;
}
.dice-btn:active {
  color: var(--gold);
  transform: scale(0.9);
}
#dice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 6000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
}
#dice-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
.dice-result-box {
  background: rgba(20,20,30,0.95);
  border: 2px solid var(--gold);
  box-shadow: 0 0 40px rgba(255,215,0,0.3);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
#dice-overlay:not(.hidden) .dice-result-box {
  transform: scale(1);
}
#diceSpinner {
  font-size: 60px;
  margin-bottom: 20px;
  animation: spin 0.5s linear infinite;
}
#diceValue {
  font-family: 'Cinzel', serif;
  font-size: 70px;
  font-weight: 900;
  color: var(--gold);
  text-shadow: 0 0 20px rgba(255,215,0,0.5);
}
@keyframes spin { 100% { transform: rotate(360deg); } }
`;

if (!cssContent.includes('#dice-bar')) {
    fs.writeFileSync(cssFile, cssContent + '\n' + diceCSS, 'utf8');
    console.log("CSS Dados inyectado.");
}

// 3. JS Injection
const jsFile = path.join(__dirname, '../engine.js');
let jsContent = fs.readFileSync(jsFile, 'utf8');

const diceJS = `
// ── LÓGICA DE DADOS Y MONEDAS ──
function rollItem(type) {
  playSynthSound('lock');
  const overlay = $('dice-overlay');
  const spinner = $('diceSpinner');
  const valBox = $('diceValue');
  
  overlay.classList.remove('hidden');
  spinner.style.display = 'block';
  valBox.style.display = 'none';
  
  if (type === 'coin') spinner.textContent = '🪙';
  else if (type === 'd6') spinner.textContent = '🎲';
  else spinner.textContent = '🔮'; // D20
  
  setTimeout(() => {
    spinner.style.display = 'none';
    valBox.style.display = 'block';
    playSynthSound('victory');
    
    let result = '';
    if (type === 'coin') result = Math.random() > 0.5 ? 'CARA' : 'CRUZ';
    else if (type === 'd6') result = Math.floor(Math.random() * 6) + 1;
    else if (type === 'd20') result = Math.floor(Math.random() * 20) + 1;
    
    valBox.textContent = result;
    
    // Auto-cerrar después de 2.5s
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 2500);
  }, 1000);
}
`;

if (!jsContent.includes('rollItem(')) {
    fs.writeFileSync(jsFile, jsContent + '\n' + diceJS, 'utf8');
    console.log("JS Dados inyectado.");
}
