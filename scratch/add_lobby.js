const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../contador.html');
let content = fs.readFileSync(file, 'utf8');

const lobbyHTML = `
  <!-- ── PANTALLA DE LOBBY / MAIN MENU ── -->
  <div id="lobby-screen" class="lobby-active">
    <div class="lobby-container">
      <h1 class="lobby-title">MTG <span>PREMIUM</span></h1>
      <p class="lobby-subtitle">Tournament Edition</p>
      
      <div class="lobby-section">
        <h3>MODO DE JUEGO</h3>
        <div class="mode-selector">
          <button class="mode-btn active" id="btnModeBO3">Standard BO3<br><small>20 Vidas</small></button>
          <button class="mode-btn" id="btnModeCommander">Commander<br><small>40 Vidas + Daño</small></button>
        </div>
      </div>

      <div class="lobby-section">
        <h3>TEMA VISUAL</h3>
        <div class="theme-slider" id="lobbyThemeSlider">
          <button class="theme-slide-btn active" data-theme="">OLED Standard</button>
          <button class="theme-slide-btn" data-theme="simpsons">Los Simpsons</button>
          <button class="theme-slide-btn" data-theme="rickmorty">Rick & Morty</button>
          <button class="theme-slide-btn" data-theme="bleach">Bleach</button>
          <button class="theme-slide-btn" data-theme="bttf">Regreso al Futuro</button>
        </div>
      </div>

      <button id="btnStartGame" class="btn-start-massive">INICIAR PARTIDA</button>
    </div>
  </div>

  <div id="game-screen" style="display: none; height: 100%; width: 100%; flex-direction: column;">
`;

// Insert the lobby right before <div id="ui-layer">
if (!content.includes('id="lobby-screen"')) {
    content = content.replace('<div id="ui-layer">', lobbyHTML + '\n  <div id="ui-layer">');
    // We also need to close game-screen before </body>
    content = content.replace('</body>', '  </div>\n</body>');
    fs.writeFileSync(file, content, 'utf8');
    console.log("Lobby inyectado con éxito.");
} else {
    console.log("El Lobby ya estaba inyectado.");
}
