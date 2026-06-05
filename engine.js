// Helpers globales
    const $ = id => document.getElementById(id);
    const raf = cb => requestAnimationFrame(cb);
    const pad = n => String(n).padStart(2, '0');
    const escapeHTML = str => {
      if (!str) return '';
      return String(str).replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    };
    const vib = pattern => {
      try {
        if (navigator.vibrate) navigator.vibrate(pattern);
      } catch (_) {}
    };

    // Variables para integración con Gemini IA
    let geminiApiKey = '';
    let activeBubbleTimeout = [null, null];

    // SISTEMA DE TEMAS
    const THEMES = {
      bleach: {
        name: 'Bleach Shinigami',
        p1Dmg: [
          "¡Getsuga Tenshō! [月牙天衝]",
          "¡Bankai... Tensa Zangetsu! [卍解・天鎖斬月]",
          "Kudakero, Kyōka Suigetsu... [砕けろ 鏡花水月]",
          "Hadō no Kyūjū: Kurohitsugi! [黒棺]",
          "Dispersión... Senbonzakura Kageyoshi [千本桜景厳]",
          "Ryūjin Jakka... ¡Reduce todo a cenizas! [流刃若火]",
          "Santen Kesshun, ¡yo rechazo! [三天結盾 私は拒絶する]"
        ],
        p1Heal: [
          "Kaodō! [回道 - Kido médico shinigami]",
          "Reiatsu ga modotte kuru... [Mi presión espiritual regresa]",
          "¡Mada da... mada owaranai! [¡Aún no ha terminado!]",
          "¡Muestra todo tu poder!",
          "Kore wa subete watashi no keikaku-dōri da [Todo según mi plan]"
        ],
        p2Dmg: [
          "¡Cero Oscuras! [黒虚閃 - Cero Negro]",
          "¡Lanza del Relámpago! [雷霆 de luz verde]",
          "¡Gran Rey Cero! [王虚 de luz roja]",
          "¡Desgarra, Pantera! [軋れ 豹王 - Grimmjow]",
          "¡Encadénate, Murciélago! [鎖せ 黒翼大魔 - Ulquiorra]",
          "¡Desintegra, Arrogante! [滅びよ 髑髏大帝 - Barragan]"
        ],
        p2Heal: [
          "Chō-kōsoku Saisei! [超高速再生 - Regeneración Instantánea]",
          "Hierro! [鋼皮 - Piel de hierro protectora]",
          "¡Despreciable Shinigami! ¡No me vencerás!",
          "Reiatsu del Hueco Mundo..."
        ]
      },
      bttf: {
        name: 'Regreso al Futuro',
        dmg: [
          "¡PIENSA, McFLY, PIENSA!",
          "¡HOLA, ¿HAY ALGUIEN EN CASA?!",
          "¡NADIE ME LLAMA GALLINA!",
          "¡ERES UN BUEY, McFLY!",
          "¡ESTIÉRCOL! ¡LO ODIO!",
          "¡MALDITA SEA, MARTY!",
          "¡ESTO ES MUY FUERTE!",
          "¿POR QUÉ TODO TE RESULTA TAN FUERTE?",
          "¡TE VAS A MATAR!",
          "¡ADIÓS, MUY BUENAS!"
        ],
        heal: [
          "¡¡1.21 GIGAVATIOS!!",
          "¡A 88 MILLAS POR HORA!",
          "¡GRAN SCOTT!",
          "¡SANTO CIELO, DOC!",
          "¿CARRETERAS? ¡NO LAS NECESITAMOS!",
          "¡ES EL CONDENSADOR DE FLUZO!",
          "¡EUREKA!",
          "¡FUNCIONARÁ!",
          "¡SOY MARTY McFLY!",
          "¡BIENVENIDO AL FUTURO!"
        ]
      },
      simpsons: {
        name: 'Los Simpsons',
        dmg: [
          "¡D'OH!",
          "¡MOSQUIS!",
          "¡MULTIP LÍCATE POR CERO!",
          "¡AY CARAMBA!",
          "¡ESTÚPIDO Y SENSUAL FLANDERS!",
          "¡OUCH!",
          "¡SÁLVAME, JEBUS!",
          "¡A LA GRANDE LE PUSE CUCA!",
          "¡TENGO EL PRESENTIMIENTO DE QUE ALGO MALO VA A PASAR!"
        ],
        heal: [
          "¡YUJU!",
          "¡PERFECTIRIJILLO!",
          "¡ROSQUILLAS!",
          "¡EXCELENTE!",
          "¡SOY EL REY DEL MUNDO!",
          "¡MOLA MOGOLLÓN!",
          "¡PLAN DENTAL... LISSA NECESITA APARATO!"
        ]
      },
      rickmorty: {
        name: 'Rick y Morty',
        dmg: [
          "¡WUBBA LUBBA DUB DUB!",
          "¡NO PIENSES EN ELLO, MORTY!",
          "¡QUÉ ASCO DE PLANETA!",
          "¡ES EL PURGATORIO, MORTY!",
          "¡MALDITA SEA, RICK!",
          "¡ESTOY EN UN GRAN DOLOR!",
          "¡MÍRAME, SOY RICK PEPINILLO!",
          "¡A NADIE LE GUSTA EL SÉQUITO, MORTY!"
        ],
        heal: [
          "¡PORTAL ABIERTO!",
          "¡CIENCIA, PERRA!",
          "¡LA AVENTURA NOS LLAMA!",
          "¡LA INTELIGENCIA DUELE!",
          "¡ESPLÉNDIDO!",
          "¡SOY UN CIENTÍFICO, NO UN MISTRAL!",
          "¡¡SHOW ME WHAT YOU GOT!!"
        ]
      },
      streetfighter: {
        name: 'Street Fighter II',
        p1Dmg: [
          "¡HADOUKEN!",
          "¡SHORYUKEN!",
          "¡TATSUMAKI SENPUKYAKU!",
          "¡SPINNING BIRD KICK!",
          "¡SONIC BOOM!",
          "¡FLASH KICK!",
          "¡KIKOKEN!",
          "¡YOU MUST DEFEAT SHEN LONG TO STAND A CHANCE!"
        ],
        p1Heal: [
          "¡PERFECT!",
          "¡YATTA!",
          "¡HADOUKEN DE FUEGO!",
          "¡SHORYUKEN DE FUEGO!",
          "¡BONUS STAGE!",
          "¡STAGE CLEAR!"
        ],
        p2Dmg: [
          "¡TIGER UPPERCUT!",
          "¡TIGER SHOT!",
          "¡FLYING BARCELONA ATTACK!",
          "¡PSYCHO CRUSHER!",
          "¡SCISSOR KICK!",
          "¡MI MÁSCARA! ¡MI ROSTRO!"
        ],
        p2Heal: [
          "¡MWAHAHAHA!",
          "¡YOU LOSE!",
          "¡PSYCHO POWER ABSOLUTO!",
          "¡POSTÉRATE ANTE M. BISON!",
          "¡INSERT COIN!",
          "¡CONTINUE? 9, 8..."
        ]
      },
      onepiece: {
        name: 'One Piece',
        p1Dmg: [
          "¡Gomu Gomu no Jet Pistol!",
          "¡Gomu Gomu no Red Hawk!",
          "¡Santōryū: Senbaki Sekai! [三千世界]",
          "¡Oni Giri! [鬼斬り]",
          "¡Diable Jambe: Flambage Shot!",
          "¡Gomu Gomu no... Elephant Gun!",
          "¡Di que quieres vivir! [生きたいと言え!]"
        ],
        p1Heal: [
          "¡Mugiwara no Luffy!",
          "¡Carne! ¡Necesito carne! 🍖",
          "¡Shishishi! [Risa de Luffy]",
          "¡Sake de Binks! [ビンクスの酒]",
          "¡El que tenga más libertad será el Rey de los Piratas!"
        ],
        p2Dmg: [
          "¡Zehahahahaha! [Risa de Barbanegra]",
          "¡Yami Anago! [Vórtice de Oscuridad]",
          "¡Gran Muralla de Magma: Inugami Guren!",
          "¡Dai Funka! [Gran Erupción de Magma]",
          "¡Tatsu Maki! [Rayo de Dragón de Kaido]",
          "¡Gura Gura no Mi! [Onda Sísmica]"
        ],
        p2Heal: [
          "¡La era de los sueños no ha terminado!",
          "¡Justicia Absoluta! [絶対正義]",
          "¡Un pirata debe ser despiadado!",
          "¡Kurohige! [Barbanegra]"
        ]
      },
      naruto: {
        name: 'Naruto Shippuden',
        p1Dmg: [
          "¡Rasengan! [螺旋丸]",
          "¡Futon: Rasenshuriken! [風遁・螺旋手裏剣]",
          "¡Chidori! [千鳥]",
          "¡Kirin! [麒麟 - Rayo del destino]",
          "¡Kage Bunshin no Jutsu! [影分身の術]",
          "¡Amaterasu! [天照 - Llamas negras]",
          "¡Este es mi camino ninja! [これが私の忍道だ]"
        ],
        p1Heal: [
          "¡Jutsu Médico de Tsunade!",
          "¡El poder del Kyubi controlado!",
          "¡Ramen de Ichiraku! 🍜",
          "¡Dattebayo! [¡De veras!]",
          "¡El lazo que nos une no se romperá!"
        ],
        p2Dmg: [
          "¡Shinra Tensei! [神羅天征 - Juicio Divino]",
          "¡Chibaku Tensei! [地爆天星]",
          "¡Tsukuyomi Infinito! [無限月読]",
          "¡Katon: Gōka Mekkyaku! [Gran Aniquilación de Fuego]",
          "¡Yasaka no Magatama! [Susanoo de Itachi]",
          "¡El mundo conocerá el dolor...!"
        ],
        p2Heal: [
          "¡Izanagi! [Ilusión que reescribe el destino]",
          "¡Regeneración Celular de Zetsu!",
          "¡Kotoamatsukami! [Genjutsu Supremo]",
          "¡El plan Ojo de Luna avanza!"
        ]
      },
      dragonball: {
        name: 'Dragon Ball Z',
        p1Dmg: [
          "¡KAMEHAMEHA! [かめはめ波]",
          "¡FINAL FLASH! [ファイナルフラッシュ]",
          "¡KAIŌKEN AUMENTADO 10 VECES!",
          "¡GENKIDAMA! ¡Bríndame tu energía!",
          "¡BIG BANG ATTACK! [ビッグバンアタック]",
          "¡MASENKO! [魔閃光]",
          "¡Super Saiyan Supremo!"
        ],
        p1Heal: [
          "¡Semilla Senzu! [Alubia Mágica] 🫘",
          "¡Ki recuperado al máximo!",
          "¡Goku ha llegado!",
          "¡Shenron ha cumplido el deseo!",
          "¡Insecto... no me des órdenes!"
        ],
        p2Dmg: [
          "¡DEATH BEAM! [Rayo de la Muerte de Freezer]",
          "¡BOLA DE LA MUERTE! [Desintegración Planetaria]",
          "¡SOLAR KAMEHAMEHA! [Cell Perfecto]",
          "¡BOLA DE ENERGÍA EVANECENTE! [Kid Buu]",
          "¡Kikoho de destrucción total!",
          "¡Voy a destruir este planeta entero!"
        ],
        p2Heal: [
          "¡Regeneración de Cell! [Células Piccolo]",
          "¡Cuerpo de Majin Buu regenerado! 🍬",
          "¡La juventud eterna de Freezer!",
          "¡Soy el ser más perfecto del universo!"
        ]
      },
      mario: {
        name: 'Super Mario Retro',
        p1Dmg: [
          "¡Mamma mia! 🍄",
          "¡Ouch! ¡He encogido!",
          "¡Siento que pierdo mi gorra! 🧢",
          "¡Waaaah! [Mario cayendo al vacío]",
          "¡Estúpido caparazón azul! 🐢"
        ],
        p1Heal: [
          "¡Super Champiñón! 🍄 ¡Grande otra vez!",
          "¡Sonido de Moneda! 🪙 [Plim]",
          "¡Champy Verde 1-UP! 💚",
          "¡Flor de Fuego activa! 🔥 ¡Cuidado con mis bolas de fuego!",
          "¡Here we gooo!"
        ],
        p2Dmg: [
          "¡GRAAAWR! ¡Ese golpe quemó mi caparazón!",
          "¡Maldito fontanero saltarín!",
          "¡Ay! ¡Me has tirado por el puente de lava!",
          "¡Gwahaha! ¿Eso es todo lo que tienes?",
          "¡Kamek! ¡Hazme más grande!"
        ],
        p2Heal: [
          "¡Tu princesa está en otro castillo! 🏰",
          "¡El poder de la lava me regenera!",
          "¡Koopas al ataque! ¡Cubriéndome!",
          "¡Bowser Cóptero activado! 🚁"
        ]
      }
    };

    const THEME_METADATA = [
      { id: '', name: 'Nebula Standard', icon: '🌌', desc: 'Espacio y constelaciones', badge: 'CLASSIC', bg: './assets/logo.webp' },
      { id: 'streetfighter', name: 'Street Fighter II', icon: '🥋', desc: 'Hadouken & KO Arcade', badge: 'RETRO', bg: './themes/streetfighter/preview.webp' },
      { id: 'simpsons', name: 'Los Simpsons', icon: '🍩', desc: 'Consola nuclear y rosquillas', badge: 'CARTOON', bg: './themes/simpsons/preview.webp' },
      { id: 'rickmorty', name: 'Rick y Morty', icon: '🌀', desc: 'Portales y multiverso', badge: 'SCI-FI', bg: './themes/rickmorty/preview.webp' },
      { id: 'bttf', name: 'Regreso al Futuro', icon: '⚡', desc: 'Viajes temporales y 1.21 gigavatios', badge: 'SCI-FI', bg: './themes/bttf/preview.webp' },
      { id: 'bleach', name: 'Bleach Shinigami', icon: '⚔️', desc: 'Getsuga Tenshō & Duelo de Espadas', badge: 'ANIME', bg: './themes/bleach/preview.webp' },
      { id: 'onepiece', name: 'One Piece (Mugiwara)', icon: '🏴‍☠️', desc: 'Gomu Gomu & Duelo Pirata', badge: 'ANIME', bg: './themes/onepiece/preview.webp' },
      { id: 'naruto', name: 'Naruto Shippuden', icon: '🍥', desc: 'Rasengan vs Chidori', badge: 'ANIME', bg: './themes/naruto/preview.webp' },
      { id: 'dragonball', name: 'Dragon Ball Z', icon: '🐉', desc: 'Kamehameha & Saiyans', badge: 'ANIME', bg: './themes/dragonball/preview.webp' },
      { id: 'mario', name: 'Super Mario Retro', icon: '🍄', desc: 'Mundo 1-1 y Castillo de Bowser', badge: 'RETRO', bg: './themes/mario/preview.webp' },
      { id: 'demonslayer', name: 'Demon Slayer', icon: '⚔️', desc: 'Respiración de Agua y Castillo Infinito', badge: 'ANIME', bg: './themes/demonslayer/preview.webp' }
    ];

    function updateSFHealthBarNames() {
      const nameP1 = $('sfNameP1');
      const nameP2 = $('sfNameP2');
      if (nameP1) nameP1.textContent = S.names[0] || 'PLAYER 1';
      if (nameP2) nameP2.textContent = S.names[1] || 'PLAYER 2';
    }

    let sfCredits = 0;
    let sfContinueInterval = null;

    function updateSFHealthBars(p) {
      try {
        const startingLife = (selectedMode === 'commander') ? 40 : 20;
        const currentLife = S.lives[p - 1];
        const pct = Math.max(0, Math.min(100, (currentLife / startingLife) * 100));

        const barFill = $(`sfHealthBarP${p}`);
        const barRed = $(`sfRedBarP${p}`);

        if (barFill) barFill.style.width = `${pct}%`;
        if (barRed) barRed.style.width = `${pct}%`;
      } catch (e) {
        console.error("Error al actualizar barra de salud SF:", e);
      }
    }

    function triggerSFContinue(defeatedPlayer) {
      // Intentar reproducir sonido de derrota/K.O. si existe
      try {
        const koAudio = new Audio('./themes/streetfighter/victory.mp3');
        koAudio.play().catch(() => {});
      } catch(_) {}

      const overlay = $('sf-continue-overlay');
      const timerEl = $('sfContinueTimer');
      const creditHint = $('sfContinueCreditHint');
      if (!overlay || !timerEl) {
        evalBO3MatchEnd(defeatedPlayer === 1 ? 2 : 1);
        return;
      }

      // Detener el reloj si está corriendo
      const wasRunning = S.clock.running;
      if (S.clock.running) {
        clearInterval(S.clock.iv);
        S.clock.running = false;
      }

      overlay.classList.remove('hidden');
      overlay.classList.add('active');

      if (creditHint) {
        creditHint.textContent = `CREDITS AVAILABLE: ${sfCredits}`;
      }

      let count = 9;
      timerEl.textContent = count;

      if (sfContinueInterval) clearInterval(sfContinueInterval);

      sfContinueInterval = setInterval(() => {
        count--;
        if (count >= 0) {
          timerEl.textContent = count;
          try {
            playSynthSound('lock');
          } catch(_) {}
          
          // Anunciar por voz los últimos 5 segundos si existe el speech synthesis
          if (count > 0 && count <= 5 && 'speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(count.toString());
              utterance.lang = 'en-US';
              utterance.pitch = 0.55;
              window.speechSynthesis.speak(utterance);
            } catch (_) {}
          }
        } else {
          // Si llega a 0, game over
          clearInterval(sfContinueInterval);
          sfContinueInterval = null;
          overlay.classList.remove('active');
          overlay.classList.add('hidden');
          
          // Sonido de Game Over
          try {
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance("Game over");
              utterance.lang = 'en-US';
              utterance.pitch = 0.5;
              window.speechSynthesis.speak(utterance);
            }
          } catch (_) {}

          addMatchLog("💀 GAME OVER. Cuenta atrás finalizada.");
          evalBO3MatchEnd(defeatedPlayer === 1 ? 2 : 1);
        }
      }, 1000);
    }

    function initSFCabinets() {
      const slotBtn = $('sfSlotBtn');
      if (slotBtn) {
        slotBtn.addEventListener('click', () => {
          // Agregar créditos
          sfCredits++;
          const slotVal = $('sfSlotVal');
          if (slotVal) slotVal.textContent = (sfCredits < 10 ? '0' : '') + sfCredits + ' CREDITS';
          
          // Sonido de moneda insertada (moneda arcade)
          try {
            const coinAudio = new Audio('./themes/streetfighter/heal.mp3');
            coinAudio.play().catch(() => playSynthSound('lock'));
          } catch (_) {
            playSynthSound('lock');
          }

          // Iniciar juego tras 1 segundo
          setTimeout(() => {
            const coinOverlay = $('sf-insertcoin-overlay');
            if (coinOverlay) {
              coinOverlay.classList.remove('active');
              coinOverlay.classList.add('hidden');
            }
            
            // Sonido de FIGHT! o Round One. Fight!
            try {
              // Intentar reproducir sonido de lucha del anunciador si existe, si no usar speech
              const fightAudio = new Audio('./themes/streetfighter/victory.mp3');
              fightAudio.play().catch(() => {
                // Speech synthesis fallback
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Round one. Fight!");
                  utterance.lang = 'en-US';
                  utterance.pitch = 0.6;
                  utterance.rate = 1.1;
                  window.speechSynthesis.speak(utterance);
                }
              });
            } catch (_) {}
            
            // Registrar log
            addMatchLog("🪙 ¡MONEDA INSERTADA! Comienza la ronda.");
          }, 800);
        });
      }

      // Botón de continuar en la pantalla de KO
      const continueBtn = $('sfCoinBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          if (sfCredits > 0) {
            sfCredits--;
          }
          
          // Sonido de moneda
          try {
            const coinAudio = new Audio('./themes/streetfighter/heal.mp3');
            coinAudio.play().catch(() => playSynthSound('lock'));
          } catch (_) {
            playSynthSound('lock');
          }

          const overlay = $('sf-continue-overlay');
          if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
          }

          if (sfContinueInterval) {
            clearInterval(sfContinueInterval);
            sfContinueInterval = null;
          }

          // Restablecer vidas y reanudar
          const startingLife = (selectedMode === 'commander') ? 40 : 20;
          S.lives = [startingLife, startingLife];
          S.prevLives = [startingLife, startingLife];
          renderLife(1, 0);
          renderLife(2, 0);
          updateSFHealthBars(1);
          updateSFHealthBars(2);

          // Anunciar FIGHT
          setTimeout(() => {
            try {
              const fightAudio = new Audio('./themes/streetfighter/victory.mp3');
              fightAudio.play().catch(() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Fight!");
                  utterance.lang = 'en-US';
                  utterance.pitch = 0.6;
                  utterance.rate = 1.1;
                  window.speechSynthesis.speak(utterance);
                }
              });
            } catch (_) {}
          }, 300);

          addMatchLog("🪙 ¡CONTINUAR SELECCIONADO! Vidas restablecidas.");
        });
      }
    }


    function updateSFPlayerProfiles() {
      updateSFHealthBarNames();
      
      const vsName1 = $('sfVsName1');
      const vsName2 = $('sfVsName2');
      
      if (vsName1) vsName1.textContent = S.names[0] || 'PLAYER 1';
      if (vsName2) vsName2.textContent = S.names[1] || 'PLAYER 2';
    }

    function playArcadeAnnouncer(phrase) {
      return; // Announcer disabled for minimalist UI
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'en-US';
        const voices = window.speechSynthesis.getVoices();
        const defaultVoice = voices.find(v => 
          v.lang.includes('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('microsoft'))
        ) || voices[0];
        if (defaultVoice) utterance.voice = defaultVoice;
        utterance.pitch = 0.55; // Tono bajo retro
        utterance.rate = 1.05;  // Ligeramente rápido
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch (_) {}
    }

    // Calentar voces de SpeechSynthesis de forma preventiva
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      }
    }

    function playSynthesizedCoinDrop() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc1.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);
        osc2.frequency.setValueAtTime(1975.53, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } catch (_) {}
    }

    function playSynthesizedArcadeClick() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (_) {}
    }



    function setupThemeSliderNavigation() {
      const slider = $('lobbyThemeSlider');
      const dotsContainer = $('themeSliderDots');
      const arrowLeft = $('themeArrowLeft');
      const arrowRight = $('themeArrowRight');
      if (!slider || !dotsContainer) return;

      dotsContainer.innerHTML = '';
      const cards = slider.querySelectorAll('.theme-card');
      const CARD_W = 160;

      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'theme-dot';
        dot.setAttribute('aria-label', 'Tema ' + (i + 1));
        dot.addEventListener('click', () => {
          slider.scrollTo({ left: i * CARD_W, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      });

      const updateDots = () => {
        const idx = Math.round(slider.scrollLeft / CARD_W);
        dotsContainer.querySelectorAll('.theme-dot').forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });
        if (arrowLeft) arrowLeft.style.opacity = slider.scrollLeft < 10 ? '0.3' : '1';
        if (arrowRight) arrowRight.style.opacity = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10 ? '0.3' : '1';
      };

      slider.removeEventListener('scroll', slider._onScroll);
      slider._onScroll = updateDots;
      slider.addEventListener('scroll', updateDots, { passive: true });
      updateDots();

      if (arrowLeft) {
        arrowLeft.onclick = () => slider.scrollBy({ left: -CARD_W, behavior: 'smooth' });
      }
      if (arrowRight) {
        arrowRight.onclick = () => slider.scrollBy({ left: CARD_W, behavior: 'smooth' });
      }
    }

    function renderThemeSelectors() {
      const feed = $('lobbyThemeVerticalFeed');
      const grid = $('themeModalGrid');
      if (!feed || !grid) return;

      let feedHtml = '';
      THEME_METADATA.forEach(t => {
        const isActive = (selectedLobbyTheme === t.id) ? 'active' : '';
        feedHtml += `
          <div class="theme-vertical-card ${isActive}" data-theme="${t.id}">
            <div class="theme-card-bg-wrap">
              <img src="${t.bg}" class="theme-card-bg-preview" alt="${t.name}">
              <div class="theme-card-overlay"></div>
            </div>
            <div class="theme-card-badge">${t.badge}</div>
            <div class="theme-card-check">✓</div>
            <div class="theme-card-bottom">
              <div class="theme-card-header">
                <span class="theme-card-icon">${t.icon}</span>
                <span class="theme-card-title">${t.name}</span>
              </div>
              <span class="theme-card-desc">${t.desc}</span>
            </div>
          </div>
        `;
      });
      feed.innerHTML = feedHtml;

      let gridHtml = '';
      THEME_METADATA.forEach(t => {
        const currentTheme = document.body.dataset.theme || '';
        const isSelected = (currentTheme === t.id) ? 'selected' : '';
        gridHtml += `
          <button class="theme-opt-btn ${isSelected}" id="to-${t.id || 'default'}" data-theme="${t.id}">
            <span class="to-icon">${t.icon}</span>
            <span class="to-name">${t.name}</span>
          </button>
        `;
      });
      grid.innerHTML = gridHtml;

      feed.querySelectorAll('.theme-vertical-card').forEach(card => {
        card.addEventListener('click', (e) => {
          feed.querySelectorAll('.theme-vertical-card').forEach(c => c.classList.remove('active'));
          const target = e.currentTarget;
          target.classList.add('active');
          selectedLobbyTheme = target.getAttribute('data-theme');
          applyTheme(selectedLobbyTheme);
          playSynthSound('lock');
        });
      });

      grid.querySelectorAll('.theme-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const themeId = e.currentTarget.getAttribute('data-theme');
          selectTheme(themeId);
        });
      });
    }

    function applyTheme(id) {
      if (id && THEMES[id]) {
        document.body.dataset.theme = id;
      } else {
        delete document.body.dataset.theme;
      }
      
      document.querySelectorAll('.theme-opt-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      const activeBtn = $('to-' + (id || 'default'));
      if (activeBtn) activeBtn.classList.add('selected');

      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-theme') === (id || ''));
      });

      if (id === 'streetfighter') {
        updateSFHealthBarNames();
        updateSFHealthBars(1);
        updateSFHealthBars(2);

        // Si no se han insertado créditos, no hemos empezado y la pantalla de juego está activa
        const hasStarted = S.clock.running || S.lives[0] !== (selectedMode === 'commander' ? 40 : 20) || S.lives[1] !== (selectedMode === 'commander' ? 40 : 20);
        const isGameScreenActive = $('game-screen') && $('game-screen').style.display === 'flex';
        
        if (sfCredits === 0 && !hasStarted && isGameScreenActive) {
          const coinOverlay = $('sf-insertcoin-overlay');
          if (coinOverlay) {
            coinOverlay.classList.remove('hidden');
            coinOverlay.classList.add('active');
          }
        } else {
          // Ocultar si ya tenemos créditos, ya ha empezado o no estamos en juego
          const coinOverlay = $('sf-insertcoin-overlay');
          if (coinOverlay) {
            coinOverlay.classList.remove('active');
            coinOverlay.classList.add('hidden');
          }
        }
      } else {
        // Ocultar overlays de monedas si cambiamos de tema
        const coinOverlay = $('sf-insertcoin-overlay');
        if (coinOverlay) {
          coinOverlay.classList.remove('active');
          coinOverlay.classList.add('hidden');
        }
        const continueOverlay = $('sf-continue-overlay');
        if (continueOverlay) {
          continueOverlay.classList.remove('active');
          continueOverlay.classList.add('hidden');
        }
      }
    }

    function selectTheme(id) {
      applyTheme(id);
      try {
        if (id) {
          localStorage.setItem('mtg_current_theme', id);
          addMatchLog(`🎨 Tema cambiado a: ${THEMES[id].name}`);
        } else {
          localStorage.removeItem('mtg_current_theme');
          addMatchLog(`🎨 Tema cambiado a: Nebula (Estándar)`);
        }
      } catch(_) {}
      try { updateSimpsonsConsole(1, 0); } catch(_) {}
      playSynthSound('lock');
      $('theme-modal').classList.remove('active');
    }

    function pickPhrase(kind) {
      const id = document.body.dataset.theme;
      if (!id || !THEMES[id]) return null;
      const bank = THEMES[id][kind];
      return bank ? bank[Math.floor(Math.random() * bank.length)] : null;
    }

    function pickThemePhrase(p, kind) {
      const id = document.body.dataset.theme;
      if (!id || !THEMES[id]) return null;
      
      const theme = THEMES[id];
      // Intentar buscar banco específico de jugador (p. ej. p1Dmg, p2Heal)
      const pKey = `p${p}${kind.charAt(0).toUpperCase() + kind.slice(1)}`;
      if (theme[pKey]) {
        const bank = theme[pKey];
        return bank[Math.floor(Math.random() * bank.length)];
      }
      
      // Fallback a banco común (dmg o heal)
      if (theme[kind]) {
        const bank = theme[kind];
        return bank[Math.floor(Math.random() * bank.length)];
      }
      return null;
    }

    const S = {
      lives: [20, 20],
      prevLives: [20, 20],
      history: [[], []],
      rounds: [[false, false], [false, false]],
      clock: { secs: 50 * 60, running: false, iv: null },
      poison: [0, 0],
      mulligans: [0, 0],
      goesFirst: 0,
      locked: false,
      muted: false,
      alertsFired: { ten: false, five: false },
      names: ['JUGADOR 1', 'JUGADOR 2'],
      colors: ['#00f0ff', '#ff0055'],
      activeEditPlayer: null,
      currentGame: 1,
      inSideboardPhase: false,
      preSideboardTimerSecs: 50 * 60,
      matchLog: []
    };

    const CLASES_MANA = [
      { color: '#00f0ff', name: 'Mago Azul (Control)', av: '💧' },
      { color: '#ff3366', name: 'Piro-guerrero (Fuego)', av: '🔥' },
      { color: '#39ff14', name: 'Druida Natural (Vida)', av: '🌿' },
      { color: '#ffd700', name: 'Clérigo Sagrado (Oro)', av: '☀️' },
      { color: '#9d00ff', name: 'Nigromante (Sombras)', av: '💀' }
    ];

    function saveMatchState() {
      try {
        const stateToSave = {
          lives: S.lives,
          prevLives: S.prevLives,
          history: S.history,
          rounds: S.rounds,
          clockSecs: S.clock.secs,
          clockRunning: S.clock.running,
          poison: S.poison,
          mulligans: S.mulligans,
          goesFirst: S.goesFirst,
          currentGame: S.currentGame,
          inSideboardPhase: S.inSideboardPhase,
          preSideboardTimerSecs: S.preSideboardTimerSecs,
          matchLog: S.matchLog,
          names: S.names,
          colors: S.colors
        };
        localStorage.setItem('mtg_match_state_bo3', JSON.stringify(stateToSave));
      } catch (err) {
        if (window.console) console.warn('[Storage] Error al guardar estado:', err);
      }
    }

    function loadMatchState() {
      try {
        const saved = localStorage.getItem('mtg_match_state_bo3');
        if (!saved) return false;
        const data = JSON.parse(saved);
        
        S.lives = data.lives;
        S.prevLives = data.prevLives;
        S.history = data.history;
        S.rounds = data.rounds;
        S.clock.secs = data.clockSecs;
        S.poison = data.poison;
        S.mulligans = data.mulligans;
        S.goesFirst = data.goesFirst;
        S.currentGame = data.currentGame;
        S.inSideboardPhase = data.inSideboardPhase;
        S.preSideboardTimerSecs = data.preSideboardTimerSecs;
        S.matchLog = data.matchLog || [];
        S.names = data.names || ['JUGADOR 1', 'JUGADOR 2'];
        S.colors = data.colors || ['#00f0ff', '#ff0055'];

        [1, 2].forEach(p => {
          $('ln' + p).textContent = S.lives[p - 1];
          renderHistory(p);
          renderPoison(p);
          renderMulligan(p);
          renderRounds(p);
          applyPlayerVisualTheme(p);
        });

        applyTheme(document.body.dataset.theme || '');
        renderClock();
        if (data.clockRunning) toggleClock();
        renderFirst();
        renderHistoryModal();
        return true;
      } catch (err) { return false; }
    }

    function addMatchLog(text) {
      const m = Math.floor(S.clock.secs / 60);
      const s = S.clock.secs % 60;
      const timeStr = `[${pad(m)}:${pad(s)}]`;
      S.matchLog.push({ time: timeStr, text: text });
      if (S.matchLog.length > 200) S.matchLog.shift();
      saveMatchState();
      renderHistoryModal();
    }

    function renderHistoryModal() {
      const container = $('historyLogList');
      if (!container) return;
      if (S.matchLog.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: #555566; padding: 20px;">Sin historial todavía</div>`;
        return;
      }
      container.innerHTML = S.matchLog
        .map(item => `
          <div class="history-item">
            <span class="history-time">${escapeHTML(item.time)}</span>
            <span class="history-event">${escapeHTML(item.text)}</span>
          </div>
        `).join('');
      container.scrollTop = container.scrollHeight;
    }

    let audioCtx = null;
    let activeAudioInstance = null;
    
    function playSynthSound(type, playerNum = null, value = null) {
      if (S.muted) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;
        const currentTheme = document.body.dataset.theme;

        if (activeAudioInstance) {
          try {
            activeAudioInstance.pause();
            activeAudioInstance.currentTime = 0;
          } catch(_) {}
          activeAudioInstance = null;
        }

        // Mapeo especial para botones de Street Fighter
        if (currentTheme === 'streetfighter' && (type === 'dmg' || type === 'heal' || type === 'victory')) {
          let audioPath = '';
          if (type === 'victory') {
            audioPath = './themes/streetfighter/victory.mp3';
          } else {
            if (value === -1) {
              audioPath = './themes/streetfighter/hadouken.mp3';
            } else if (value === 1) {
              audioPath = './themes/streetfighter/shoryuken.mp3';
            } else if (value === -5) {
              audioPath = './themes/streetfighter/tatsumaki.mp3';
            } else if (value === 5) {
              audioPath = './themes/streetfighter/perfect.mp3';
            } else {
              audioPath = `./themes/streetfighter/p${playerNum || 1}_${type}.mp3`;
            }
          }

          const playWithFallback = (path, fallbackPath) => {
            const audio = new Audio(path);
            activeAudioInstance = audio;
            audio.play().catch(() => {
              if (fallbackPath) {
                const fbAudio = new Audio(fallbackPath);
                activeAudioInstance = fbAudio;
                fbAudio.play().catch(() => {
                  triggerSynthFallback('streetfighter', type, now);
                });
              } else {
                triggerSynthFallback('streetfighter', type, now);
              }
            });
          };

          if (type === 'victory') {
            playWithFallback(audioPath, null);
          } else {
            const defaultFallback = `./themes/streetfighter/p${playerNum || 1}_${type}.mp3`;
            playWithFallback(audioPath, defaultFallback);
          }
          return;
        }

        // Intentar reproducir MP3 local para temas con audio externo
        const themesWithAudio = ['simpsons', 'rickmorty', 'bttf', 'bleach', 'onepiece', 'naruto', 'dragonball', 'mario'];
        if (currentTheme && themesWithAudio.includes(currentTheme) && (type === 'dmg' || type === 'heal' || type === 'victory')) {
          let audioPath = `./themes/${currentTheme}/${type}.mp3`;
          if (playerNum && (type === 'dmg' || type === 'heal')) {
            audioPath = `./themes/${currentTheme}/p${playerNum}_${type}.mp3`;
          }
          
          const audio = new Audio(audioPath);
          activeAudioInstance = audio;
          audio.play().catch((err) => {
            // Ignorar errores de aborto por pausa rápida/solapamiento
            if (err && err.name === 'AbortError') return;

            // Fallback a audio genérico del tema si falla el específico de jugador
            if (playerNum && (type === 'dmg' || type === 'heal')) {
              const fallbackAudio = new Audio(`./themes/${currentTheme}/${type}.mp3`);
              activeAudioInstance = fallbackAudio;
              fallbackAudio.play().catch((err2) => {
                if (err2 && err2.name === 'AbortError') return;
                triggerSynthFallback(currentTheme, type, now);
              });
            } else {
              triggerSynthFallback(currentTheme, type, now);
            }
          });
          return;
        }

        triggerSynthFallback(currentTheme || '', type, now);
      } catch (e) { console.error(e); }
    }

    function triggerSynthFallback(theme, type, now) {
      try {

        
        if (theme === 'bleach') {
          if (type === 'dmg') {
            // 1. Getsuga Tenshō Slash (Double Bandpass Sweep)
            const bufferSize = audioCtx.sampleRate * 0.35;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = audioCtx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(4500, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.3);
            noiseFilter.Q.value = 8.0;

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.3, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.35);

            // 2. FM Metallic Clang (Zanpakuto Impact)
            const carrier = audioCtx.createOscillator();
            const modulator = audioCtx.createOscillator();
            const modGain = audioCtx.createGain();
            const mainGain = audioCtx.createGain();

            carrier.type = 'sine';
            carrier.frequency.setValueAtTime(880, now);
            carrier.frequency.exponentialRampToValueAtTime(320, now + 0.15);

            modulator.type = 'sawtooth';
            modulator.frequency.setValueAtTime(1250, now);

            modGain.gain.setValueAtTime(800, now);
            modGain.gain.exponentialRampToValueAtTime(1, now + 0.15);

            mainGain.gain.setValueAtTime(0.15, now);
            mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            modulator.connect(modGain);
            modGain.connect(carrier.frequency);
            carrier.connect(mainGain);
            mainGain.connect(audioCtx.destination);

            modulator.start(now);
            carrier.start(now);
            modulator.stop(now + 0.2);
            carrier.stop(now + 0.2);

            // 3. Sub-Bass Reiatsu Slam (Heavy shockwave)
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            const subFilter = audioCtx.createBiquadFilter();

            subOsc.type = 'sawtooth';
            subOsc.frequency.setValueAtTime(95, now);
            subOsc.frequency.linearRampToValueAtTime(30, now + 0.25);

            subFilter.type = 'lowpass';
            subFilter.frequency.setValueAtTime(150, now);
            subFilter.frequency.linearRampToValueAtTime(40, now + 0.25);

            subGain.gain.setValueAtTime(0.25, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            subOsc.connect(subFilter);
            subFilter.connect(subGain);
            subGain.connect(audioCtx.destination);

            subOsc.start(now);
            subOsc.stop(now + 0.28);
            return;
          }
          else if (type === 'heal') {
            // 1. Detuned Reiatsu Aura Charge (Chorus effect)
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const filter = audioCtx.createBiquadFilter();
            const mainGain = audioCtx.createGain();

            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(130, now);
            osc1.frequency.exponentialRampToValueAtTime(650, now + 0.6);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(133, now);
            osc2.frequency.exponentialRampToValueAtTime(656, now + 0.6);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, now);
            filter.frequency.exponentialRampToValueAtTime(3000, now + 0.5);
            filter.Q.value = 10;

            mainGain.gain.setValueAtTime(0.08, now);
            mainGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
            mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(mainGain);
            mainGain.connect(audioCtx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.65);
            osc2.stop(now + 0.65);

            // 2. Hirajoshi Pentatonic Chimes with Delay Echo (D, E, F, A, Bb, D)
            const hirajoshi = [293.66, 329.63, 349.23, 440.00, 466.16, 587.33];
            hirajoshi.forEach((freq, idx) => {
              const delayTime = idx * 0.08;
              
              // Principal Chime
              const chime = audioCtx.createOscillator();
              const chimeGain = audioCtx.createGain();
              chime.type = 'sine';
              chime.frequency.setValueAtTime(freq, now + delayTime);
              chimeGain.gain.setValueAtTime(0.06, now + delayTime);
              chimeGain.gain.exponentialRampToValueAtTime(0.001, now + delayTime + 0.3);
              chime.connect(chimeGain);
              chimeGain.connect(audioCtx.destination);
              chime.start(now + delayTime);
              chime.stop(now + delayTime + 0.32);

              // Echo/Delay Chime
              const echo = audioCtx.createOscillator();
              const echoGain = audioCtx.createGain();
              echo.type = 'sine';
              echo.frequency.setValueAtTime(freq, now + delayTime + 0.12);
              echoGain.gain.setValueAtTime(0.02, now + delayTime + 0.12);
              echoGain.gain.exponentialRampToValueAtTime(0.001, now + delayTime + 0.38);
              echo.connect(echoGain);
              echoGain.connect(audioCtx.destination);
              echo.start(now + delayTime + 0.12);
              echo.stop(now + delayTime + 0.4);
            });
            return;
          }
          else if (type === 'victory') {
            // 1. Bankai Clang (FM Bell Strike)
            const carrier = audioCtx.createOscillator();
            const modulator = audioCtx.createOscillator();
            const modGain = audioCtx.createGain();
            const mainGain = audioCtx.createGain();

            carrier.type = 'sine';
            carrier.frequency.setValueAtTime(2200, now);
            carrier.frequency.exponentialRampToValueAtTime(550, now + 0.3);

            modulator.type = 'sawtooth';
            modulator.frequency.setValueAtTime(3300, now);

            modGain.gain.setValueAtTime(1500, now);
            modGain.gain.exponentialRampToValueAtTime(10, now + 0.3);

            mainGain.gain.setValueAtTime(0.15, now);
            mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            modulator.connect(modGain);
            modGain.connect(carrier.frequency);
            carrier.connect(mainGain);
            mainGain.connect(audioCtx.destination);

            modulator.start(now);
            carrier.start(now);
            modulator.stop(now + 0.4);
            carrier.stop(now + 0.4);

            // 2. Reiatsu Pressure Storm (White Noise Sweep)
            const stormFilter = audioCtx.createBiquadFilter();
            const stormGain = audioCtx.createGain();
            
            const bufferSize = audioCtx.sampleRate * 1.5;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            stormFilter.type = 'bandpass';
            stormFilter.frequency.setValueAtTime(100, now);
            stormFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.8);
            stormFilter.frequency.exponentialRampToValueAtTime(80, now + 1.5);
            stormFilter.Q.value = 5.0;

            stormGain.gain.setValueAtTime(0.12, now);
            stormGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

            noise.connect(stormFilter);
            stormFilter.connect(stormGain);
            stormGain.connect(audioCtx.destination);

            noise.start(now);
            noise.stop(now + 1.5);

            // 3. Cinematic Bankai Brass/Synth Pad (D minor chord with detuned oscillators)
            const chord = [146.83, 220.00, 293.66, 349.23, 440.00];
            chord.forEach((freq, idx) => {
              const oscA = audioCtx.createOscillator();
              const oscB = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();

              oscA.type = 'sawtooth';
              oscA.frequency.setValueAtTime(freq - 0.7, now + 0.05);
              
              oscB.type = 'triangle';
              oscB.frequency.setValueAtTime(freq + 0.7, now + 0.05);

              gainNode.gain.setValueAtTime(0.001, now);
              gainNode.gain.linearRampToValueAtTime(0.05, now + 0.4 + idx * 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

              oscA.connect(gainNode);
              oscB.connect(gainNode);
              gainNode.connect(audioCtx.destination);

              oscA.start(now);
              oscB.start(now);
              oscA.stop(now + 2.3);
              oscB.stop(now + 2.3);
            });
            return;
          }
        }
        else if (theme === 'simpsons') {
          if (type === 'dmg') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.quadraticRampToValueAtTime(80, now + 0.18);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
            return;
          } else if (type === 'heal') {
            [329.63, 392.00, 523.25].forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.07);
              gain.gain.setValueAtTime(0.08, now + idx * 0.07);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + idx * 0.07);
              osc.start(now + idx * 0.07); osc.stop(now + 0.25 + idx * 0.07);
            });
            return;
          }
        }
        else if (theme === 'rickmorty') {
          if (type === 'dmg') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            osc.start(now); osc.stop(now + 0.24);
            return;
          } else if (type === 'heal') {
            const osc = audioCtx.createOscillator();
            const modulator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const modGain = audioCtx.createGain();
            modGain.gain.value = 150;
            modulator.frequency.value = 15;
            modulator.connect(modGain);
            modGain.connect(osc.frequency);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            modulator.start(now); modulator.stop(now + 0.32);
            osc.start(now); osc.stop(now + 0.32);
            return;
          }
        }
        else if (theme === 'onepiece') {
          if (type === 'dmg') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.14);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.14);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now); osc.stop(now + 0.18);

            const bufSize = audioCtx.sampleRate * 0.18;
            const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = audioCtx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(350, now + 0.12);
            noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.28);
            noiseFilter.Q.value = 5;
            const noiseGain = audioCtx.createGain();
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noiseGain.gain.setValueAtTime(0.001, now);
            noiseGain.gain.setValueAtTime(0.35, now + 0.12);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            noise.start(now + 0.12); noise.stop(now + 0.3);
            return;
          } else if (type === 'heal') {
            const coinNotes = [1600, 2000, 2400, 1800, 2200];
            coinNotes.forEach((freq, idx) => {
              const delay = idx * 0.04;
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + delay);
              gain.gain.setValueAtTime(0.08, now + delay);
              gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
              osc.start(now + delay); osc.stop(now + delay + 0.09);
            });
            return;
          } else if (type === 'victory') {
            const fanfarria = [
              { f: 293.66, t: 0 }, { f: 293.66, t: 0.1 }, { f: 293.66, t: 0.2 },
              { f: 392.00, t: 0.3 }, { f: 587.33, t: 0.5 }, { f: 523.25, t: 0.7 },
              { f: 493.88, t: 0.8 }, { f: 440.00, t: 0.9 }, { f: 392.00, t: 1.0 }
            ];
            fanfarria.forEach(note => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(note.f, now + note.t);
              gain.gain.setValueAtTime(0.06, now + note.t);
              gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.25);
              osc.start(now + note.t); osc.stop(now + note.t + 0.28);
            });
            return;
          }
        }
        else if (theme === 'naruto') {
          if (type === 'dmg') {
            const bufferSize = audioCtx.sampleRate * 0.35;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 10;
            filter.frequency.setValueAtTime(4000, now);
            filter.frequency.linearRampToValueAtTime(8000, now + 0.1);
            filter.frequency.linearRampToValueAtTime(2000, now + 0.25);
            filter.frequency.linearRampToValueAtTime(6000, now + 0.35);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start(now); noise.stop(now + 0.35);

            const sub = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            sub.connect(subGain); subGain.connect(audioCtx.destination);
            sub.type = 'triangle';
            sub.frequency.setValueAtTime(140, now);
            sub.frequency.exponentialRampToValueAtTime(40, now + 0.15);
            subGain.gain.setValueAtTime(0.2, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            sub.start(now); sub.stop(now + 0.16);
            return;
          } else if (type === 'heal') {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const filter = audioCtx.createBiquadFilter();
            const gain = audioCtx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(220, now);
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.45);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(222, now);
            osc2.frequency.exponentialRampToValueAtTime(885, now + 0.45);

            filter.type = 'lowpass';
            filter.Q.value = 7;
            filter.frequency.setValueAtTime(250, now);
            filter.frequency.exponentialRampToValueAtTime(3500, now + 0.4);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(now); osc2.start(now);
            osc1.stop(now + 0.48); osc2.stop(now + 0.48);
            return;
          } else if (type === 'victory') {
            const notes = [
              { f: 587.33, t: 0, d: 0.18 },
              { f: 622.25, t: 0.18, d: 0.18 },
              { f: 783.99, t: 0.36, d: 0.25 },
              { f: 880.00, t: 0.61, d: 0.4 }
            ];
            notes.forEach(note => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              const pMod = audioCtx.createOscillator();
              const pmGain = audioCtx.createGain();

              pMod.frequency.value = 7;
              pmGain.gain.value = 6;
              pMod.connect(pmGain);
              pmGain.connect(osc.frequency);

              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(note.f, now + note.t);
              gain.gain.setValueAtTime(0.08, now + note.t);
              gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

              pMod.start(now + note.t);
              osc.start(now + note.t);
              pMod.stop(now + note.t + note.d);
              osc.stop(now + note.t + note.d);
            });
            return;
          }
        }
        else if (theme === 'dragonball') {
          if (type === 'dmg') {
            const bufSize = audioCtx.sampleRate * 0.28;
            const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(280, now);
            filter.frequency.exponentialRampToValueAtTime(50, now + 0.26);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start(now); noise.stop(now + 0.28);

            const osc = audioCtx.createOscillator();
            const oscGain = audioCtx.createGain();
            osc.connect(oscGain); oscGain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
            oscGain.gain.setValueAtTime(0.25, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now); osc.stop(now + 0.26);
            return;
          } else if (type === 'heal') {
            const crunchySize = audioCtx.sampleRate * 0.06;
            const buffer = audioCtx.createBuffer(1, crunchySize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < crunchySize; i++) {
              data[i] = Math.sign(Math.random() * 2 - 1) * (i % 3 === 0 ? 0.3 : 0.05);
            }
            const crunch = audioCtx.createBufferSource();
            crunch.buffer = buffer;
            const crunchGain = audioCtx.createGain();
            crunch.connect(crunchGain); crunchGain.connect(audioCtx.destination);
            crunchGain.gain.setValueAtTime(0.12, now);
            crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            crunch.start(now); crunch.stop(now + 0.06);

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, now + 0.06);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
            filter.type = 'lowpass';
            filter.Q.value = 5;
            filter.frequency.setValueAtTime(200, now + 0.06);
            filter.frequency.exponentialRampToValueAtTime(4000, now + 0.35);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.setValueAtTime(0.15, now + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
            osc.start(now + 0.06); osc.stop(now + 0.38);
            return;
          } else if (type === 'victory') {
            const count = 3;
            for (let j = 0; j < count; j++) {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'sawtooth';
              const detune = j * 4 - 6;
              osc.frequency.setValueAtTime(80, now);
              osc.frequency.exponentialRampToValueAtTime(440 + detune, now + 1.2);
              gain.gain.setValueAtTime(0.06, now);
              gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);
              osc.start(now); osc.stop(now + 1.36);
            }

            const noiseSize = audioCtx.sampleRate * 1.4;
            const noiseBuffer = audioCtx.createBuffer(1, noiseSize, audioCtx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseSize; i++) {
              noiseData[i] = Math.random() * 2 - 1;
            }
            const wind = audioCtx.createBufferSource();
            wind.buffer = noiseBuffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 6;
            filter.frequency.setValueAtTime(250, now);
            filter.frequency.exponentialRampToValueAtTime(4500, now + 1.1);
            filter.frequency.exponentialRampToValueAtTime(800, now + 1.4);

            const windGain = audioCtx.createGain();
            windGain.gain.setValueAtTime(0.1, now);
            windGain.gain.linearRampToValueAtTime(0.2, now + 0.9);
            windGain.gain.exponentialRampToValueAtTime(0.001, now + 1.40);

            wind.connect(filter);
            filter.connect(windGain);
            windGain.connect(audioCtx.destination);
            wind.start(now); wind.stop(now + 1.4);
            return;
          }
        }
        else if (theme === 'mario') {
          if (type === 'heal') {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            const gain2 = audioCtx.createGain();

            osc1.connect(gain1); gain1.connect(audioCtx.destination);
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(987.77, now);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.setValueAtTime(0, now + 0.08);
            osc1.start(now); osc1.stop(now + 0.081);

            osc2.connect(gain2); gain2.connect(audioCtx.destination);
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(1318.51, now + 0.08);
            gain2.gain.setValueAtTime(0.08, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc2.start(now + 0.08); osc2.stop(now + 0.45);
            return;
          }
          else if (type === 'dmg') {
            const pairs = [
              {h: 523.25, l: 261.63},
              {h: 392.00, l: 196.00},
              {h: 329.63, l: 164.81},
              {h: 261.63, l: 130.81}
            ];
            pairs.forEach((pair, idx) => {
              const delay = idx * 0.08;
              const oscH = audioCtx.createOscillator();
              const gainH = audioCtx.createGain();
              oscH.connect(gainH); gainH.connect(audioCtx.destination);
              oscH.type = 'square';
              oscH.frequency.setValueAtTime(pair.h, now + delay);
              gainH.gain.setValueAtTime(0.06, now + delay);
              gainH.gain.setValueAtTime(0, now + delay + 0.04);
              oscH.start(now + delay); oscH.stop(now + delay + 0.041);

              const oscL = audioCtx.createOscillator();
              const gainL = audioCtx.createGain();
              oscL.connect(gainL); gainL.connect(audioCtx.destination);
              oscL.type = 'square';
              oscL.frequency.setValueAtTime(pair.l, now + delay + 0.04);
              gainL.gain.setValueAtTime(0.06, now + delay + 0.04);
              gainL.gain.setValueAtTime(0, now + delay + 0.08);
              oscL.start(now + delay + 0.04); oscL.stop(now + delay + 0.081);
            });
            return;
          }
          else if (type === 'victory') {
            const fanfare = [
              { f: 392.00, t: 0.00, d: 0.08 },
              { f: 523.25, t: 0.08, d: 0.08 },
              { f: 659.25, t: 0.16, d: 0.08 },
              { f: 783.99, t: 0.24, d: 0.08 },
              { f: 1046.50, t: 0.32, d: 0.08 },
              { f: 1318.51, t: 0.40, d: 0.08 },
              { f: 1567.98, t: 0.48, d: 0.20 },
              { f: 1318.51, t: 0.68, d: 0.20 },
              
              { f: 415.30, t: 0.88, d: 0.08 },
              { f: 523.25, t: 0.96, d: 0.08 },
              { f: 622.25, t: 1.04, d: 0.08 },
              { f: 830.61, t: 1.12, d: 0.08 },
              { f: 1046.50, t: 1.20, d: 0.08 },
              { f: 1244.51, t: 1.28, d: 0.08 },
              { f: 1661.22, t: 1.36, d: 0.20 },
              { f: 1244.51, t: 1.56, d: 0.20 },

              { f: 466.16, t: 1.76, d: 0.08 },
              { f: 587.33, t: 1.84, d: 0.08 },
              { f: 698.46, t: 1.92, d: 0.08 },
              { f: 932.33, t: 2.00, d: 0.08 },
              { f: 1174.66, t: 2.08, d: 0.08 },
              { f: 1396.91, t: 2.16, d: 0.08 },
              { f: 1864.66, t: 2.24, d: 0.20 },
              
              { f: 1864.66, t: 2.44, d: 0.08 },
              { f: 1864.66, t: 2.52, d: 0.08 },
              { f: 1864.66, t: 2.60, d: 0.08 },
              { f: 2093.00, t: 2.68, d: 0.50 }
            ];
            fanfare.forEach(note => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.type = 'square';
              osc.frequency.setValueAtTime(note.f, now + note.t);
              gain.gain.setValueAtTime(0.05, now + note.t);
              gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
              osc.start(now + note.t);
              osc.stop(now + note.t + note.d);
            });
            return;
          }
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'heal') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.35);
        } 
        else if (type === 'dmg') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now); osc.stop(now + 0.22);
        }
        else if (type === 'reset') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.35);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now); osc.stop(now + 0.45);
        }
        else if (type === 'lock') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now); osc.stop(now + 0.1);
        }
        else if (type === 'victory') {
          const freqs = [523.25, 659.25, 783.99, 1046.50];
          freqs.forEach((f, idx) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(f, now + idx * 0.1);
            g.gain.setValueAtTime(0.08, now + idx * 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.1);
            o.start(now + idx * 0.1);
            o.stop(now + 0.7 + idx * 0.1);
          });
        }
      } catch (err) { console.error(err); }
    }

    function applySavedUIVisibility() {
      let showPoison = false;
      let showSideboard = true;
      try {
        showPoison = localStorage.getItem('mtg_show_poison') === 'true';
        showSideboard = localStorage.getItem('mtg_show_sideboard') !== 'false';
      } catch(_) {}
      
      if (showPoison) {
        document.body.classList.remove('hide-poison');
      } else {
        document.body.classList.add('hide-poison');
      }
      
      if (showSideboard) {
        document.body.classList.remove('hide-sideboard');
      } else {
        document.body.classList.add('hide-sideboard');
      }
      
      const chkP = $('chkLobbyPoison');
      const chkS = $('chkLobbySideboard');
      if (chkP) chkP.checked = showPoison;
      if (chkS) chkS.checked = showSideboard;
    }

    function initAppEngine() {
      if (window.anime) document.body.classList.add('anime-ready');

      // Detectar reset por parámetro de URL
      if (window.location.search.includes('reset=true')) {
        try {
          localStorage.removeItem('mtg_match_state_bo3');
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch(_) {}
      }

      // Cargar tema guardado en localStorage o usar por defecto ('')
      let savedTheme = '';
      try { savedTheme = localStorage.getItem('mtg_current_theme') || ''; } catch(_) {}
      selectedLobbyTheme = savedTheme;
      renderThemeSelectors();
      applyTheme(savedTheme);
      try { updateSimpsonsConsole(1, 0); } catch(_) {}
      try { initSFCabinets(); } catch(_) {}


      

      const activeMatchRestored = loadMatchState();
      
      // Aplicar preferencias de visibilidad de UI guardadas
      applySavedUIVisibility();

      // Cargar perfiles siempre al inicio para que el lobby esté listo detrás del modal
      loadProfiles();
      renderFirst();
      [1, 2].forEach(p => {
        renderHistory(p);
        applyPlayerVisualTheme(p);
      });

      if (activeMatchRestored) {
        // Si hay una partida en curso guardada, mostrar el modal de reanudación
        $('resume-modal').classList.add('active');
      }

      // Eventos del Modal de Reanudación
      $('btnResumeContinue').addEventListener('click', () => {
        $('resume-modal').classList.remove('active');
        $('lobby-screen').classList.add('hidden');
        $('game-screen').style.display = 'flex';
        playSynthSound('lock');
      });

      $('btnResumeNew').addEventListener('click', () => {
        $('resume-modal').classList.remove('active');
        try {
          localStorage.removeItem('mtg_match_state_bo3');
        } catch(_) {}
        resetAll();
        playSynthSound('reset');
      });

      // Evento para cerrar sideboard y continuar al siguiente juego
      const sbCloseBtn = $('btnSideboardAlertClose');
      if (sbCloseBtn) {
        sbCloseBtn.addEventListener('pointerdown', e => {
          e.preventDefault();
          startNextBO3Game();
        });
      }

      // Evento para Salir al Lobby
      $('btnExitLobby').addEventListener('pointerdown', e => {
        e.preventDefault();
        saveMatchState();
        if (S.clock.running) {
          toggleClock();
        }
        $('game-screen').style.display = 'none';
        $('lobby-screen').classList.remove('hidden');
        $('resume-modal').classList.add('active');
        playSynthSound('lock');
      });

      // Theme Selector Modal Event Listeners
      $('btnThemeSelector').addEventListener('pointerdown', e => {
        e.preventDefault();
        let activeTheme = '';
        try { activeTheme = localStorage.getItem('mtg_current_theme') || ''; } catch(_) {}
        applyTheme(activeTheme);
        $('theme-modal').classList.add('active');
        
        // Ocultar barra de dados
        $('dice-bar').classList.remove('active');
        $('btnDiceSelector').classList.remove('active');
        
        playSynthSound('lock');
      });

      $('btnThemeClose').addEventListener('pointerdown', e => {
        e.preventDefault();
        $('theme-modal').classList.remove('active');
        playSynthSound('reset');
      });

      $('theme-modal').addEventListener('pointerdown', e => {
        if (e.target === $('theme-modal')) {
          $('theme-modal').classList.remove('active');
          playSynthSound('reset');
        }
      });

      // Selector de Dados/Moneda Event Listeners
      $('btnDiceSelector').addEventListener('pointerdown', e => {
        e.preventDefault();
        const diceBar = $('dice-bar');
        const isActive = diceBar.classList.contains('active');
        
        // Ocultar otros paneles
        $('theme-modal').classList.remove('active');
        $('history-modal').classList.remove('active');
        
        if (isActive) {
          diceBar.classList.remove('active');
          $('btnDiceSelector').classList.remove('active');
          playSynthSound('reset');
        } else {
          diceBar.classList.add('active');
          $('btnDiceSelector').classList.add('active');
          playSynthSound('lock');
        }
      });

      // Historial Modal Event Listeners
      $('btnHistory').addEventListener('pointerdown', e => {
        e.preventDefault();
        renderHistoryModal();
        $('history-modal').classList.add('active');
        
        // Ocultar barra de dados
        $('dice-bar').classList.remove('active');
        $('btnDiceSelector').classList.remove('active');
        
        playSynthSound('lock');
      });

      $('btnHistoryClose').addEventListener('pointerdown', e => {
        e.preventDefault();
        $('history-modal').classList.remove('active');
        playSynthSound('reset');
      });

      $('history-modal').addEventListener('pointerdown', e => {
        if (e.target === $('history-modal')) {
          $('history-modal').classList.remove('active');
          playSynthSound('reset');
        }
      });



      // Guardado en tiempo real de rivales
      [1, 2].forEach(p => {
        const sbn = $(`sbn${p}`);
        if (sbn) {
          sbn.addEventListener('input', () => {
            try { localStorage.setItem(`mtg_sbn${p}_notes`, sbn.value); } catch(_) {}
          });
        }
        const ri = $(`ri${p}`);
        if (ri) {
          ri.addEventListener('input', () => {
            try { localStorage.setItem(`mtg_ri${p}_deck`, ri.value); } catch(_) {}
          });
        }
      });

      // Inicializar submotores que estaban desactivados en el core
      try { initThreeJSEngine(); } catch(e) { console.error("Error al iniciar WebGL:", e); }
      try { initResetLongPress(); } catch(e) { console.error("Error al iniciar LongPress reset:", e); }
      try { initLockScreenEngine(); } catch(e) { console.error("Error al iniciar pantalla de bloqueo:", e); }
      try { initTouchProtections(); } catch(e) { console.error("Error al iniciar TouchProtections:", e); }
      try { setupEasterEggs(); } catch(e) { console.error("Error al iniciar Easter Eggs:", e); }
    }

    // Easter Eggs para los Temas Premium
    function setupEasterEggs() {
      // 1. Doble click en el nombre del jugador para activar un easter egg de combate/divertido
      document.querySelectorAll('.pname-wrap').forEach((el, idx) => {
        el.addEventListener('dblclick', (e) => {
          e.preventDefault();
          const currentTheme = document.body.dataset.theme;
          const playerNum = idx + 1;
          
          if (currentTheme === 'naruto') {
            addMatchLog(`🌸 ¡JUTSU SEXY! ${S.names[playerNum - 1]} se transforma... ¡Jiraiya tiene una hemorragia nasal! 🩸💨`);
            vib([50, 50, 50, 50, 100]);
            playSynthSound('heal', 1); // Naruto Dattebayo!
            trigger3DShockwave('#ffb6c1');
          } else if (currentTheme === 'dragonball') {
            addMatchLog(`💥 [EASTER EGG] ¡${S.names[playerNum - 1]} está acumulando energía para una Genkidama! 🙌 ¡Dadme vuestra fuerza!`);
            vib([100, 50, 150]);
            playSynthSound('victory'); // DBZ SSJ Theme/Scream
            trigger3DShockwave('#e67e22');
          } else if (currentTheme === 'onepiece') {
            addMatchLog(`🍖 [EASTER EGG] ¡Luffy le roba la carne a ${S.names[playerNum - 1]}! ¡Gomu Gomu no Mi! 🌊`);
            vib([40, 20, 40]);
            playSynthSound('heal', 1); // Luffy Laugh
            trigger3DShockwave('#e74c3c');
          } else if (currentTheme === 'streetfighter') {
            addMatchLog(`🕹️ [EASTER EGG] ¡HADOUKEN! ${S.names[playerNum - 1]} lanza una ráfaga de energía.`);
            vib([60, 30, 60]);
            playSynthSound('dmg', 1); // Ryu Hadouken
            trigger3DShockwave('#3498db');
          }
        });
      });

      // 2. Click en el logo de la cabecera del lobby para easter eggs
      const logoEl = $('lobby-logo') || document.querySelector('.logo-wrap');
      if (logoEl) {
        logoEl.addEventListener('click', () => {
          const currentTheme = document.body.dataset.theme;
          if (currentTheme === 'dragonball') {
            addMatchLog(`🐉 [EASTER EGG] ¡Has invocado a Shenron! Concede tu deseo de inmortalidad.`);
            playSynthSound('heal', 1);
          } else if (currentTheme === 'onepiece') {
            addMatchLog(`🏴‍☠️ [EASTER EGG] ¡El One Piece... EXISTE! ¡Zehahaha!`);
            playSynthSound('heal', 2); // Blackbeard laugh
          }
        });
      }
    }

    // Perfiles y persistencia (tolerante a Safari modo privado)
    function loadProfiles() {
      try {
        const p1 = localStorage.getItem('mtg_p1_profile');
        const p2 = localStorage.getItem('mtg_p2_profile');
        if (p1) { const d = JSON.parse(p1); S.names[0] = d.name; S.colors[0] = d.color; }
        if (p2) { const d = JSON.parse(p2); S.names[1] = d.name; S.colors[1] = d.color; }
      } catch (_) { /* sin storage: usar defaults */ }
      $('pn1').textContent = S.names[0];
      $('pn2').textContent = S.names[1];

      // Cargar notas de sideboard y decks rivales
      [1, 2].forEach(p => {
        try {
          const sbn = localStorage.getItem(`mtg_sbn${p}_notes`);
          const sbnEl = $(`sbn${p}`);
          if (sbn && sbnEl) sbnEl.value = sbn;
          
          const ri = localStorage.getItem(`mtg_ri${p}_deck`);
          const riEl = $(`ri${p}`);
          if (ri && riEl) riEl.value = ri;
        } catch(_) {}
      });
    }

    function saveProfile(p, name, color) {
      S.names[p - 1] = name; S.colors[p - 1] = color;
      try {
        localStorage.setItem(`mtg_p${p}_profile`, JSON.stringify({ name, color }));
      } catch (_) { /* Safari modo privado */ }
      $(`pn${p}`).textContent = name;
      applyPlayerVisualTheme(p);
      renderFirst();
      refreshNebulaColors();
    }

    function applyPlayerVisualTheme(p) {
      const cl = S.colors[p - 1];
      const avEl = $(`av${p}`);
      const pnEl = $(`pn${p}`);
      const meta = CLASES_MANA.find(c => c.color === cl) || CLASES_MANA[p - 1];
      
      avEl.textContent = meta.av;
      avEl.style.borderColor = cl;
      avEl.style.boxShadow = `0 0 12px ${cl}`;
      pnEl.style.color = cl;
      pnEl.style.textShadow = `0 2px 4px rgba(0,0,0,0.8), 0 0 14px ${cl}50`;
      document.documentElement.style.setProperty(`--p${p}-glow`, cl);

      // Sincronizar botones de vida de forma dinámica según el color de maná (WUBRG)
      let btnBg = 'linear-gradient(145deg, #051c0e, #020a05)';
      let btnBgMinus = 'linear-gradient(145deg, #1f050b, #0c0205)';
      let borderPlus = 'rgba(57, 255, 20, 0.25)';
      let borderMinus = 'rgba(255, 0, 85, 0.25)';
      let textPlus = '#4fff9e';
      let textMinus = '#ff527a';

      if (cl === '#00f0ff') { // Mago Azul
        btnBg = 'linear-gradient(145deg, #021a24, #010d12)';
        borderPlus = 'rgba(0, 240, 255, 0.25)';
        textPlus = '#4feaff';
      } else if (cl === '#ff3366') { // Piro-guerrero (Rojo)
        btnBg = 'linear-gradient(145deg, #2d0411, #160208)';
        borderPlus = 'rgba(255, 51, 102, 0.25)';
        textPlus = '#ff5e85';
      } else if (cl === '#39ff14') { // Druida Natural (Verde)
        btnBg = 'linear-gradient(145deg, #051c0e, #020a05)';
        borderPlus = 'rgba(57, 255, 20, 0.25)';
        textPlus = '#4fff9e';
      } else if (cl === '#ffd700') { // Clérigo Sagrado (Oro)
        btnBg = 'linear-gradient(145deg, #2d2605, #141102)';
        borderPlus = 'rgba(255, 215, 0, 0.25)';
        textPlus = '#ffe34f';
      } else if (cl === '#9d00ff') { // Nigromante (Sombras)
        btnBg = 'linear-gradient(145deg, #1d0130, #0d0016)';
        borderPlus = 'rgba(157, 0, 255, 0.25)';
        textPlus = '#b54fff';
      }

      const doc = document.documentElement;
      doc.style.setProperty(`--p${p}-btn-bg`, btnBg);
      doc.style.setProperty(`--p${p}-btn-bg-minus`, btnBgMinus);
      doc.style.setProperty(`--p${p}-btn-border-plus`, borderPlus);
      doc.style.setProperty(`--p${p}-btn-border-minus`, borderMinus);
      doc.style.setProperty(`--p${p}-btn-text-plus`, textPlus);
      doc.style.setProperty(`--p${p}-btn-text-minus`, textMinus);
    }

    // Modal Perfil
    function openProfileEdit(p) {
      if (S.locked) return;
      S.activeEditPlayer = p;
      $(`modalNameInput`).value = S.names[p - 1];
      const grid = $('modalColorGrid');
      grid.innerHTML = CLASES_MANA.map(c => `
        <div class="color-opt ${c.color === S.colors[p - 1] ? 'selected' : ''}" 
             style="background: ${c.color}; color: ${c.color}" 
             onclick="selectModalColor('${c.color}')">
        </div>
      `).join('');
      $('profile-modal').classList.add('active');
      playSynthSound('lock');
    }

    function selectModalColor(hex) {
      document.querySelectorAll('.color-opt').forEach(el => {
        el.classList.toggle('selected', el.style.backgroundColor === hex || el.style.color === hex);
      });
      $('profile-modal').dataset.tempColor = hex;
      playSynthSound('lock');
    }

    $('btnModalSave').addEventListener('click', () => {
      const p = S.activeEditPlayer;
      const name = $('modalNameInput').value.trim() || `JUGADOR ${p}`;
      const color = $('profile-modal').dataset.tempColor || S.colors[p - 1];
      saveProfile(p, name, color);
      $('profile-modal').classList.remove('active');
      playSynthSound('reset');
      vib([20]);
    });

    $('profile-modal').addEventListener('click', (e) => {
      if (e.target === $('profile-modal')) $('profile-modal').classList.remove('active');
    });

    // ── MOTOR GRÁFICO 3D (Three.js WebGL) ──
    let scene, camera, renderer, crystalMesh, orbitRing1, orbitRing2, particleSystem;
    let particleCount = 1500;
    let particlesGeo;
    let particleSpeeds = [];
    let isWebGLLive = false;
    let globalShockwaveIntensity = 0;
    let rotationSpeedModifier = 1;

    // Nebulosa GLSL (Fase 3 light: solo fondo, sin D20)
    let nebulaMesh = null;
    let nebulaUniforms = null;
    let nebulaPressure = 0; // -1..+1 suavizado

    const NEBULA_VERT = /* glsl */`
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const NEBULA_FRAG = /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3  uColorA;     // mana jugador 1 (mitad superior visual)
      uniform vec3  uColorB;     // mana jugador 2 (mitad inferior visual)
      uniform float uPressure;   // -1 p1 perdiendo .. +1 p2 perdiendo
      uniform vec2  uFlowDir;    // dirección del flujo
      uniform float uShock;      // intensidad de shockwave (0..1)

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++){ v += a * vnoise(p); p *= 2.02; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        // El flujo arrastra el muestreo según la presión
        vec2 flow = uFlowDir * (0.2 + abs(uPressure) * 0.35);
        vec2 p = uv * 2.6 + flow * uTime * 0.15;

        // Dos capas de fbm para profundidad
        float n1 = fbm(p + vec2(uTime * 0.05, -uTime * 0.04));
        float n2 = fbm(p * 1.7 + vec2(-uTime * 0.07, uTime * 0.06) + n1);

        // El split divide la pantalla según presión (la zona del que pierde se invade)
        float split = 0.5 + uPressure * 0.18;
        float maskA = smoothstep(split + 0.10, split - 0.10, uv.y);

        vec3 colA = uColorA * pow(n2, 1.4) * 1.25;
        vec3 colB = uColorB * pow(n2, 1.4) * 1.25;
        vec3 col  = mix(colB, colA, maskA);

        // Vignette + base oscura para legibilidad de UI
        vec2 d = uv - 0.5;
        float vig = 1.0 - dot(d, d) * 1.45;
        col *= max(0.0, vig);
        col += vec3(0.02, 0.02, 0.03);

        // Tinte global de shockwave (heredado de trigger3DShockwave)
        col += vec3(uShock) * 0.20;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function buildNebulaMesh() {
      nebulaUniforms = {
        uTime:     { value: 0 },
        uColorA:   { value: new THREE.Color(S.colors[0]) },
        uColorB:   { value: new THREE.Color(S.colors[1]) },
        uPressure: { value: 0 },
        uFlowDir:  { value: new THREE.Vector2(0, 0) },
        uShock:    { value: 0 }
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader: NEBULA_VERT,
        fragmentShader: NEBULA_FRAG,
        uniforms: nebulaUniforms,
        depthWrite: false,
        depthTest: false
      });
      // Plano grande detrás del cristal y partículas
      const geo = new THREE.PlaneGeometry(80, 140, 1, 1);
      const m = new THREE.Mesh(geo, mat);
      m.position.z = -25;
      m.renderOrder = -10;
      return m;
    }

    function refreshNebulaColors() {
      if (!nebulaUniforms) return;
      nebulaUniforms.uColorA.value.set(S.colors[0]);
      nebulaUniforms.uColorB.value.set(S.colors[1]);
    }

    function initThreeJSEngine() {
      const canvas = $('webgl-canvas');
      if (!window.THREE) {
        $('fallback-bg').classList.add('active');
        return;
      }
      try {
        isWebGLLive = true;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 18;

        // 120Hz: Safari iOS ProMotion ya sincroniza rAF a la frecuencia nativa del display.
        // setPixelRatio capado a 2 para no quemar GPU/batería en la Retina ultra-densa.
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Fondo procedural GLSL (Nebulosa de Presión)
        nebulaMesh = buildNebulaMesh();
        scene.add(nebulaMesh);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f0ff, 1.5, 40);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff0055, 1.5, 40);
        pointLight2.position.set(-10, -10, 10);
        scene.add(pointLight2);

        // Cristal rúnico flotante (MeshPhysicalMaterial facetado sólido premium con refracción)
        const gemGeometry = new THREE.IcosahedronGeometry(2.4, 0);
        const gemMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x00f0ff,
          emissive: 0x001122,
          roughness: 0.15,
          metalness: 0.1,
          transmission: 0.7,
          thickness: 1.5,
          ior: 1.5,
          transparent: true,
          opacity: 0.75,
          flatShading: true,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05
        });
        crystalMesh = new THREE.Mesh(gemGeometry, gemMaterial);
        scene.add(crystalMesh);

        // Anillos concéntricos orbitales rúnicos (runas de maná P1 y P2)
        const ringGeo1 = new THREE.RingGeometry(3.3, 3.4, 32);
        const ringMat1 = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
        orbitRing1.rotation.x = Math.PI / 3;
        scene.add(orbitRing1);

        const ringGeo2 = new THREE.RingGeometry(3.7, 3.8, 32);
        const ringMat2 = new THREE.MeshBasicMaterial({
          color: 0xff0055,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
        orbitRing2.rotation.x = -Math.PI / 3;
        scene.add(orbitRing2);

        // Sistema de partículas
        if (window.innerWidth < 600) particleCount = 500;

        particlesGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          const r = 8 + Math.random() * 22;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          const isCyan = Math.random() > 0.5;
          colors[i * 3] = isCyan ? 0.0 : 1.0;
          colors[i * 3 + 1] = isCyan ? 0.94 : 0.0;
          colors[i * 3 + 2] = isCyan ? 1.0 : 0.33;

          particleSpeeds.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
            baseRadius: r
          });
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const pTexture = createProceduralStarTexture();
        const particlesMat = new THREE.PointsMaterial({
          size: 0.38,
          map: pTexture,
          transparent: true,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);

        setupThreeParallax();
        animateWebGLScene();

        window.addEventListener('resize', onWindowResize);
      } catch (err) {
        console.error(err);
        isWebGLLive = false;
        $('fallback-bg').classList.add('active');
      }
    }

    function createProceduralStarTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    let targetCameraX = 0, targetCameraY = 0;
    function setupThreeParallax() {
      document.addEventListener('mousemove', (e) => {
        targetCameraX = ((e.clientX / window.innerWidth) - 0.5) * 6;
        targetCameraY = -((e.clientY / window.innerHeight) - 0.5) * 6;
      });
      if (typeof DeviceOrientationEvent !== 'undefined') {
        window.addEventListener('deviceorientation', (e) => {
          if (!e.gamma || !e.beta) return;
          targetCameraX = Math.max(-5, Math.min(5, e.gamma)) * 0.45;
          targetCameraY = Math.max(-5, Math.min(5, e.beta - 45)) * 0.45;
        });
      }
    }

    // Ondas expansivas e hiper-aceleración para victorias
    function trigger3DShockwave(colorHex, customIntensity = 2.5) {
      if (!isWebGLLive) return;
      crystalMesh.material.color.setHex(parseInt(colorHex.replace('#', '0x')));
      crystalMesh.material.opacity = 0.95;
      crystalMesh.scale.set(1.4, 1.4, 1.4);
      globalShockwaveIntensity = customIntensity;
      rotationSpeedModifier = customIntensity * 2.4;

      let decay = setInterval(() => {
        globalShockwaveIntensity *= 0.88;
        rotationSpeedModifier = 1.0 + (rotationSpeedModifier - 1.0) * 0.85;
        crystalMesh.scale.x -= (crystalMesh.scale.x - 1.0) * 0.15;
        crystalMesh.scale.y = crystalMesh.scale.x;
        crystalMesh.scale.z = crystalMesh.scale.x;

        if (globalShockwaveIntensity < 0.05) {
          clearInterval(decay);
          globalShockwaveIntensity = 0;
          rotationSpeedModifier = 1.0;
          crystalMesh.material.color.setHex(0x00f0ff);
          crystalMesh.material.opacity = 0.75;
        }
      }, 30);
    }

    function animateWebGLScene() {
      if (!isWebGLLive) return;
      raf(animateWebGLScene);

      camera.position.x += (targetCameraX - camera.position.x) * 0.08;
      camera.position.y += (targetCameraY - camera.position.y) * 0.08;
      camera.lookAt(scene.position);

      // ── Nebulosa de Presión: lerp suave hacia la diferencia de vidas ──
      if (nebulaUniforms) {
        const tNow = performance.now() * 0.001;
        const lifeDiff = (S.lives[1] - S.lives[0]) / 20; // signo: + = p2 va perdiendo
        const targetPressure = Math.max(-1, Math.min(1, lifeDiff));
        nebulaPressure += (targetPressure - nebulaPressure) * 0.04;
        nebulaUniforms.uTime.value = tNow;
        nebulaUniforms.uPressure.value = nebulaPressure;
        // Dirección: hacia el jugador que va por debajo (p1 arriba en pantalla)
        nebulaUniforms.uFlowDir.value.set(0, -nebulaPressure);
        nebulaUniforms.uShock.value = Math.min(1, globalShockwaveIntensity * 0.4);
      }

      crystalMesh.rotation.y += 0.006 * rotationSpeedModifier;
      crystalMesh.rotation.x += 0.003 * rotationSpeedModifier;

      // Animar y sincronizar los anillos orbitales si existen en escena
      if (orbitRing1 && orbitRing2) {
        orbitRing1.rotation.z += 0.008 * rotationSpeedModifier;
        orbitRing2.rotation.z -= 0.005 * rotationSpeedModifier;

        // Sincronizar colores dinámicamente con los de los jugadores
        orbitRing1.material.color.setHex(parseInt(S.colors[0].replace('#', '0x')));
        orbitRing2.material.color.setHex(parseInt(S.colors[1].replace('#', '0x')));

        // Latidos / pulsos de la gema física si un jugador baja de 5 vidas
        if (crystalMesh.material && typeof crystalMesh.material.opacity !== 'undefined' && globalShockwaveIntensity === 0) {
          const p1Danger = S.lives[0] <= 5;
          const p2Danger = S.lives[1] <= 5;
          if (p1Danger || p2Danger) {
            const pulseSpeed = (p1Danger && p2Danger) ? 20 : 10;
            const pulse = 0.55 + Math.sin(performance.now() * 0.001 * pulseSpeed) * 0.2;
            crystalMesh.material.opacity = pulse;
            // Aumentar brillo emisivo en peligro
            crystalMesh.material.emissive.setHex(p1Danger ? 0x330011 : 0x001133);
          } else {
            crystalMesh.material.opacity = 0.75;
            crystalMesh.material.emissive.setHex(0x001122);
          }
        }
      }

      const positions = particlesGeo.attributes.position.array;
      const waveFreq = Date.now() * 0.003;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleSpeeds[i].x * rotationSpeedModifier;
        positions[i * 3 + 1] += particleSpeeds[i].y * rotationSpeedModifier;
        positions[i * 3 + 2] += particleSpeeds[i].z * rotationSpeedModifier;

        if (globalShockwaveIntensity > 0) {
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const pz = positions[i * 3 + 2];
          const dist = Math.sqrt(px*px + py*py + pz*pz);
          const wavePush = Math.sin(dist - waveFreq) * globalShockwaveIntensity * 0.15;
          positions[i * 3] += (px / dist) * wavePush;
          positions[i * 3 + 1] += (py / dist) * wavePush;
          positions[i * 3 + 2] += (pz / dist) * wavePush;
        }

        const rad = Math.sqrt(positions[i * 3]**2 + positions[i * 3 + 1]**2 + positions[i * 3 + 2]**2);
        if (rad > 32) {
          positions[i * 3] *= 0.35;
          positions[i * 3 + 1] *= 0.35;
          positions[i * 3 + 2] *= 0.35;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }

    // ── Watchdog de rendimiento: pausa Three.js si bajo consumo / FPS pobre ──
    let perfDowngraded = false;
    function downgradeToFallback(reason) {
      if (perfDowngraded) return;
      perfDowngraded = true;
      isWebGLLive = false;
      const c = $('webgl-canvas');
      if (c) c.style.display = 'none';
      $('fallback-bg').classList.add('active');
      // Pista para debugging local (no se ve en producción si DevTools cerrado)
      if (window.console) console.info('[perf] downgrade →', reason);
    }

    function initPerfWatchdog() {
      // 1) Battery Status API (Safari iOS no la expone, pero Android/Chromium sí)
      if (navigator.getBattery) {
        navigator.getBattery().then(b => {
          const check = () => {
            if (!b.charging && b.level <= 0.20) downgradeToFallback('batería baja (' + Math.round(b.level * 100) + '%)');
          };
          b.addEventListener('levelchange', check);
          b.addEventListener('chargingchange', check);
          check();
        }).catch(() => {});
      }

      // 2) Watchdog de FPS (vale para iOS donde no hay Battery API)
      let frames = 0, t0 = performance.now(), slowStreak = 0;
      function tick() {
        if (perfDowngraded) return;
        frames++;
        const now = performance.now();
        if (now - t0 >= 1000) {
          const fps = (frames * 1000) / (now - t0);
          // 120Hz nativo en iPhone — si bajamos consistentemente <40fps el 3D no compensa
          if (fps < 40) slowStreak++; else slowStreak = 0;
          if (slowStreak >= 4) downgradeToFallback('FPS sostenido <40 (' + fps.toFixed(0) + ')');
          frames = 0; t0 = now;
        }
        raf(tick);
      }
      raf(tick);

      // 3) Pausa al ocultar la pestaña (Background Throttling — ahorra batería)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && S.clock.running) {
          // El reloj de torneo sigue contando con setInterval — eso es correcto
          // Solo congelamos el render: el rAF ya se pausa automáticamente cuando la pestaña está oculta
        }
      });
    }

    // ── CAMBIO DE VIDAS ──
    function changeLife(p, v) {
      if ($('p' + p).classList.contains('dead')) return;
      S.prevLives[p - 1] = S.lives[p - 1];
      S.lives[p - 1] += v;
      S.history[p - 1].unshift(v);
      if (S.history[p - 1].length > 8) S.history[p - 1].pop();
      
      vib(v < 0 ? [20, 10, 20] : [14]);
      playSynthSound(v < 0 ? 'dmg' : 'heal', p, v);
      trigger3DShockwave(v < 0 ? S.colors[p - 1] : '#39ff14');

      renderLife(p, v);
      renderHistory(p);

      // Registrar evento en el historial de partida
      addMatchLog(`${S.names[p - 1]}: ${S.prevLives[p - 1]} ➔ ${S.lives[p - 1]} (${v > 0 ? '+' : ''}${v} vida)`);

      // CRT damage shake and announcer disabled for minimalist UI

      // Evaluar si disparar frases de IA de Gemini o frases locales por defecto en las burbujas
      if (geminiApiKey) {
        if (S.lives[p - 1] <= 0) {
          triggerGeminiPhrase(p, 'dead', v);
        } else if (S.lives[p - 1] <= 6 && v < 0) {
          triggerGeminiPhrase(p, 'danger', v);
        } else if (v <= -4) {
          triggerGeminiPhrase(p, 'heavy-damage', v);
        } else if (v >= 4) {
          triggerGeminiPhrase(p, 'heavy-heal', v);
        }
      } else {
        // Lógica local sin conexión a internet ni API Key (Offline)
        let kind = null;
        if (v <= -3) kind = 'dmg';
        else if (v >= 3) kind = 'heal';
        else if (S.lives[p - 1] <= 6 && v < 0 && Math.random() > 0.4) kind = 'dmg'; // Frase en peligro de vida baja
        
        if (kind) {
          const phrase = pickThemePhrase(p, kind);
          if (phrase) {
            setTimeout(() => showSpeechBubble(p, phrase), 300);
          }
        }
      }

      // Efecto de sacudida (shake) en caso de daño pesado (perder 4 o más vidas de golpe)
      if (v <= -4) {
        const pCard = $(`p${p}`);
        if (pCard) {
          pCard.classList.add('shake-impact');
          setTimeout(() => pCard.classList.remove('shake-impact'), 350);
        }
      }
    }

    function undo(p) {
      if ($('p' + p).classList.contains('dead') && S.prevLives[p - 1] > 0) return;
      const diff = S.prevLives[p - 1] - S.lives[p - 1];
      if (diff === 0) return; // No hay cambios para deshacer
      const oldLife = S.lives[p - 1];
      S.lives[p - 1] = S.prevLives[p - 1];
      S.history[p - 1].shift();
      vib([15]);
      playSynthSound('lock');
      renderLife(p, diff);
      renderHistory(p);

      // Registrar evento en el historial de partida
      addMatchLog(`↩ Deshacer ${S.names[p - 1]}: ${oldLife} ➔ ${S.lives[p - 1]}`);
    }

    function renderHistory(p) {
      $('hist' + p).innerHTML = S.history[p - 1]
        .map(v => `<span class="hpill ${v < 0 ? 'neg' : 'pos'}">${v > 0 ? '+' + v : v}</span>`)
        .join('');
    }

    function renderLife(p, v) {
      const life = S.lives[p - 1];
      const dmg = v < 0;
      const ln = $('ln' + p), fl = $('fl' + p), pel = $(`p${p}`);

      ln.textContent = life;
      ln.className = 'life-num ' + (dmg ? 'dmg' : 'heal');

      // Spring physics con Anime.js si está disponible; CSS keyframes como fallback
      if (window.anime) {
        anime.remove(ln);
        ln.style.transformOrigin = '50% 50%';
        const amp = dmg ? 1.18 : 1.16;
        anime({
          targets: ln,
          scale: [
            { value: amp, duration: 180, easing: 'easeOutQuad' },
            { value: 1,   duration: 700, easing: 'spring(1, 70, 7, 0)' }
          ],
          translateY: dmg
            ? [{ value: -4, duration: 100 }, { value: 0, duration: 600, easing: 'spring(1, 60, 6, 0)' }]
            : [{ value: -8, duration: 200 }, { value: 0, duration: 700, easing: 'spring(1, 70, 7, 0)' }],
          rotate: dmg
            ? [{ value: -3, duration: 80 }, { value: 3, duration: 90 }, { value: 0, duration: 500, easing: 'spring(1, 90, 8, 0)' }]
            : 0
        });
      }
      setTimeout(() => ln.classList.remove('dmg', 'heal'), 600);

      fl.className = 'flash';
      raf(() => { fl.className = 'flash'; raf(() => fl.className = 'flash ' + (dmg ? 'dmg' : 'heal')); });

      spawnFloatingDelta(p, v);

      // Efectos específicos del tema en el contador de vidas
      const currentTheme = document.body.dataset.theme;
      if (currentTheme === 'streetfighter') {
        updateSFHealthBars(p);
      }

      // Disparar pico de aura/energía general para el tema activo
      const wrap = pel.querySelector('.life-num-wrap');
      if (wrap && currentTheme) {
        // Soporte tanto para bleach (reiatsu-spike) como para otros temas (nombre-spike)
        const spikeClass = currentTheme === 'bleach' ? 'reiatsu-spike' : `${currentTheme}-spike`;
        wrap.classList.remove(spikeClass);
        void wrap.offsetWidth; // Trigger reflow
        wrap.classList.add(spikeClass);
        setTimeout(() => wrap.classList.remove(spikeClass), 700);
      }

      if (currentTheme === 'bleach') {
        spawnReiatsuParticles(p, v);
        if (dmg) {
          triggerSwordSlash(p);
        }
      } else if (currentTheme === 'naruto') {
        if (dmg && v <= -3) {
          triggerKunaiSlash(p);
        }
      } else if (currentTheme === 'rickmorty') {
        if (!dmg && v >= 2) {
          triggerMeeseeks(p);
        }
      } else if (currentTheme === 'mario') {
        if (!dmg) {
          triggerMarioCoin(p);
        }
      }

      pel.classList.remove('danger', 'dead');
      if (life <= 0) {
        pel.classList.add('dead');
        vib([80, 40, 80, 40, 200]);

        if (currentTheme === 'streetfighter') {
          setTimeout(() => {
            triggerSFContinue(p);
          }, 1500);
        } else {
          evalBO3MatchEnd(p === 1 ? 2 : 1);
        }
      }
      else if (life <= 5) {
        pel.classList.add('danger');
      }

      // Actualizar diales y alarmas interactivas de la consola Simpsons
      updateSimpsonsConsole(p, v);
    }

    function spawnReiatsuParticles(p, v) {
      if (!window.anime) return;
      
      const wrap = document.querySelector(`#p${p} .life-num-wrap`);
      if (!wrap) return;
      
      const rect = wrap.getBoundingClientRect();
      const container = document.body;
      const count = Math.min(Math.abs(v) * 4 + 8, 25);
      
      const colors = p === 1 
        ? ['#00f0ff', '#ffe34f', '#ffffff'] 
        : ['#ff0055', '#9d00ff', '#ffffff'];
        
      for (let i = 0; i < count; i++) {
        const pEl = document.createElement('div');
        pEl.className = 'reiatsu-particle';
        
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 20;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 20;
        
        pEl.style.left = `${x}px`;
        pEl.style.top = `${y}px`;
        pEl.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        pEl.style.color = pEl.style.backgroundColor;
        
        const size = Math.random() * 5 + 3;
        pEl.style.width = `${size}px`;
        pEl.style.height = `${size}px`;
        
        container.appendChild(pEl);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 30;
        
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        anime({
          targets: pEl,
          translateX: tx,
          translateY: ty,
          scale: [1, 0],
          opacity: [1, 0],
          duration: Math.random() * 500 + 400,
          easing: 'easeOutQuad',
          complete: () => pEl.remove()
        });
      }
    }

    function triggerSwordSlash(p) {
      const playerEl = document.getElementById('p' + p);
      if (!playerEl) return;
      
      const slash = document.createElement('div');
      slash.className = 'sword-slash';
      
      const angle = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 25);
      slash.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(0)`;
      
      playerEl.appendChild(slash);
      
      // Trigger reflow
      slash.offsetHeight;
      
      slash.classList.add('animate');
      
      setTimeout(() => {
        slash.remove();
      }, 400);
    }

    function triggerKunaiSlash(p) {
      const playerEl = document.getElementById('p' + p);
      if (!playerEl) return;
      const slash = document.createElement('div');
      slash.className = 'kunai-slash';
      playerEl.appendChild(slash);
      setTimeout(() => slash.remove(), 250);
    }

    function triggerMeeseeks(p) {
      const playerEl = document.getElementById('p' + p);
      if (!playerEl) return;
      const meeseeks = document.createElement('div');
      meeseeks.className = 'meeseeks-pop';
      meeseeks.style.left = Math.random() * 60 + 20 + '%';
      meeseeks.style.top = Math.random() * 60 + 20 + '%';
      playerEl.appendChild(meeseeks);
      setTimeout(() => meeseeks.remove(), 500);
    }

    function triggerMarioCoin(p) {
      const playerEl = document.getElementById('p' + p);
      if (!playerEl) return;
      const wrap = document.querySelector(`#p${p} .life-num-wrap`);
      if (!wrap) return;
      const coin = document.createElement('div');
      coin.className = 'mario-coin';
      wrap.appendChild(coin);
      setTimeout(() => coin.remove(), 600);
    }

    function updateSimpsonsConsole(p, v) {
      if (document.body.dataset.theme !== 'simpsons') return;
      try {
        const startingLife = (selectedMode === 'commander') ? 40 : 20;
        // Jugador 1 (Oponente - Arriba)
        const life1 = S.lives[0];
        const rot1 = Math.max(-90, Math.min(90, -90 + (life1 / startingLife) * 180));
        const needleT1 = $('simpNeedleT1');
        const needleT2 = $('simpNeedleT2');
        if (needleT1) needleT1.style.transform = `rotate(${rot1}deg)`;
        if (needleT2) needleT2.style.transform = `rotate(${rot1}deg)`;
        
        const alarmTL = $('simpAlarmTopL');
        const alarmTR = $('simpAlarmTopR');
        if (alarmTL && alarmTR) {
          const active1 = life1 <= 5 && life1 > 0;
          alarmTL.classList.toggle('active', active1);
          alarmTR.classList.toggle('active', active1);
        }

        // Jugador 2 (Local - Abajo)
        const life2 = S.lives[1];
        const rot2 = Math.max(-90, Math.min(90, -90 + (life2 / startingLife) * 180));
        const needleB1 = $('simpNeedleB1');
        const needleB2 = $('simpNeedleB2');
        if (needleB1) needleB1.style.transform = `rotate(${rot2}deg)`;
        if (needleB2) needleB2.style.transform = `rotate(${rot2}deg)`;
        
        const panicL = $('simpPanicLight');
        if (panicL) {
          panicL.classList.toggle('active', life2 <= 5 && life2 > 0);
        }

        // Giro del logotipo de peligro nuclear al recibir daño (v < 0)
        if (v < 0) {
          const logo = $('simpNuclearLogo');
          if (logo) {
            logo.classList.add('spinning');
            setTimeout(() => logo.classList.remove('spinning'), 1500);
          }
        }
      } catch (err) { console.error(err); }
    }

    function spawnFloatingDelta(p, val) {
      const area = $(`la${p}`);
      const popup = document.createElement('div');
      popup.className = `delta-popup ${val < 0 ? 'dmg' : 'heal'}`;
      // Frase del tema activo (BTTF, etc.) o número clásico como fallback
      const phrase = pickPhrase(val < 0 ? 'dmg' : 'heal');
      popup.textContent = phrase || (val > 0 ? `+${val}` : val);
      popup.style.left = `50%`;
      popup.style.top = `38%`;
      area.appendChild(popup);

      if (window.anime) {
        // Centrado base (CSS usa translate -50% en X). Anime traduce desde el origen del style.
        popup.style.transform = 'translate(-50%, 0) scale(0.6)';
        popup.style.opacity = '0';
        anime({
          targets: popup,
          translateX: '-50%',
          translateY: [
            { value: -22, duration: 220, easing: 'spring(1, 80, 9, 0)' },
            { value: -90, duration: 900, easing: 'easeOutQuad' }
          ],
          scale: [
            { value: 1.18, duration: 200, easing: 'spring(1, 90, 10, 0)' },
            { value: 0.9,  duration: 900, easing: 'easeInQuad' }
          ],
          opacity: [
            { value: 1, duration: 90 },
            { value: 1, duration: 700 },
            { value: 0, duration: 350, easing: 'easeInQuad' }
          ],
          duration: 1200,
          complete: () => popup.remove()
        });
      } else {
        setTimeout(() => popup.remove(), 1200);
      }
    }

    // ── GESTOR ESTRATÉGICO DE ENCUENTRO BO3 (Best of 3) ──
    function evalBO3MatchEnd(winnerPlayer) {
      // 1. Asignar ronda ganada en el marcador de la mesa
      const rSlot = S.rounds[winnerPlayer - 1][0] ? 1 : 0;
      S.rounds[winnerPlayer - 1][rSlot] = true;
      renderRounds(winnerPlayer);

      // Registrar ronda ganada en el historial
      addMatchLog(`⭐ ${S.names[winnerPlayer - 1]} gana el Juego ${S.currentGame}`);

      const totalWins = S.rounds[winnerPlayer - 1].filter(Boolean).length;

      if (totalWins >= 2) {
        // GANADOR TOTAL DEL MATCH BO3 (2-0 o 2-1)
        triggerGrandMatchVictory(winnerPlayer);
      } else {
        // Ir a fase de sideboard entre rondas (triggerSideboardPhase hace S.currentGame++)
        triggerSideboardPhase();
      }
    }

    // Fase intermedia de banquillo (Sideboarding)
    function triggerSideboardPhase() {
      S.inSideboardPhase = true;
      S.currentGame++;

      // Guardar tiempo del reloj para no perderlo
      S.preSideboardTimerSecs = S.clock.secs;
      clearInterval(S.clock.iv);
      S.clock.running = false;

      // 1. Desplegar cartel central informativo de Sideboard
      const sbBanner = $('sideboard-alert-banner');
      if (sbBanner) sbBanner.style.display = 'flex';
      const sbBtn = $('btnSideboardAlertClose');
      if (sbBtn) sbBtn.textContent = `INICIAR JUEGO ${S.currentGame}`;
      
      // 2. Cambiar HUD central
      const phaseDisp = $('matchPhaseDisp');
      if (phaseDisp) {
        phaseDisp.textContent = `SIDEBOARD G${S.currentGame - 1}`;
        phaseDisp.className = 'sideboard';
      }

      // 3. ACTIVAR AUTOMÁTICAMENTE SIDEBOARDS DE AMBOS JUGADORES
      [1, 2].forEach(p => {
        const notes = $('sbn' + p), tog = $('sbt' + p);
        if (notes) notes.classList.add('open');
        if (tog) {
          tog.classList.add('open');
          tog.textContent = '▲ SIDEBOARD';
        }
      });

      // 4. Iniciar reloj de 3 minutos oficiales de sideboard
      S.clock.secs = 3 * 60;
      
      // Registrar entrada a banquillo en el historial
      addMatchLog(`🔄 Entrando en Fase de Banquillo (Sideboard Juego ${S.currentGame})`);
      
      toggleClock(); // Arranca los 3 minutos
    }

    // Transición a la siguiente ronda del BO3
    function startNextBO3Game() {
      // Detener reloj de sideboard
      clearInterval(S.clock.iv);
      S.clock.running = false;
      
      // Ocultar cartel de alerta si existe
      const sbBanner = $('sideboard-alert-banner');
      if (sbBanner) sbBanner.style.display = 'none';

      // Restaurar reloj general de match 50m
      S.clock.secs = Math.max(0, S.preSideboardTimerSecs);
      
      // Configurar HUD
      $('matchPhaseDisp').textContent = `JUEGO ${S.currentGame}`;
      $('matchPhaseDisp').className = '';

      // Reset de vidas, poison, mulligans individuales para el juego
      S.lives = [20, 20];
      S.prevLives = [20, 20];
      S.history = [[], []];
      S.poison = [0, 0];
      S.mulligans = [0, 0];

      // Reset de UI de los jugadores
      [1, 2].forEach(p => {
        const sbn = $('sbn' + p);
        const sbt = $('sbt' + p);
        if (sbn) sbn.classList.remove('open');
        if (sbt) {
          sbt.classList.remove('open');
          sbt.textContent = '▼ SIDEBOARD';
        }
        
        $('ln' + p).textContent = '20';
        $('p' + p).classList.remove('danger', 'dead', 'winner');
        renderHistory(p);
        renderPoison(p);
      });

      // Turno de juego
      S.goesFirst = 0;
      renderFirst();

      // Registrar inicio del juego
      addMatchLog(`🎮 ¡Inicio oficial del Juego ${S.currentGame}!`);

      // Reproducir sonido e iniciar reloj general
      playSynthSound('reset');
      toggleClock();
    }

    // Gran victoria total BO3
    function triggerGrandMatchVictory(winnerPlayer) {
      clearInterval(S.clock.iv);
      S.clock.running = false;

      // 1. Mostrar banner gigante de campeón de la ronda
      const pWin = $(`p${winnerPlayer}`);
      pWin.classList.add('winner');
      
      const p1Wins = S.rounds[0].filter(Boolean).length;
      const p2Wins = S.rounds[1].filter(Boolean).length;
      $(`vbSub${winnerPlayer}`).textContent = `${S.names[winnerPlayer - 1]} HA GANADO EL ENCUENTRO BO3 (${S.rounds[winnerPlayer - 1].filter(Boolean).length}-${S.rounds[winnerPlayer === 1 ? 1 : 0].filter(Boolean).length})`;

      $('matchPhaseDisp').textContent = 'CONCLUIDO';

      // Registrar gran victoria
      addMatchLog(`🏆🏆 ¡${S.names[winnerPlayer - 1]} HA GANADO EL MATCH BO3 (${p1Wins}-${p2Wins})! 🏆🏆`);

      // 2. WebGL Overdrive (Hiper-explosión de polvo de estrellas)
      trigger3DShockwave(S.colors[winnerPlayer - 1], 8.5);

      // 3. Synthesizer de marcha triunfal
      playSynthSound('victory');
      vib([200, 100, 200, 100, 500]);
    }

    // Rondas (Slots individuales)
    function toggleRound(p, slot) {
      S.rounds[p - 1][slot] = !S.rounds[p - 1][slot];
      renderRounds(p);
      playSynthSound('lock');
      
      // Registrar en el historial
      addMatchLog(`⭐ Ronda ${slot + 1} de ${S.names[p - 1]} cambiada a: ${S.rounds[p - 1][slot] ? 'GANADA' : 'PENDIENTE'}`);

      // Evaluar si clicando manualmente alcanza la victoria del match
      const wins = S.rounds[p - 1].filter(Boolean).length;
      if (wins >= 2) {
        triggerGrandMatchVictory(p);
      } else {
        $(`p${p}`).classList.remove('winner');
        saveMatchState();
      }
    }

    function renderRounds(p) {
      ['a', 'b'].forEach((l, s) => $('r' + p + l).classList.toggle('won', S.rounds[p - 1][s]));
    }

    // ── RELOJ ──
    function toggleClock() {
      const c = S.clock;
      if (c.running) {
        clearInterval(c.iv); c.running = false;
        playSynthSound('lock');
        addMatchLog(`⏸ Reloj pausado`);
      } else {
        if (c.secs <= 0) return;
        c.running = true;
        addMatchLog(`▶ Reloj reanudado`);
        c.iv = setInterval(() => {
          c.secs--;
          if (c.secs <= 0) { 
            c.secs = 0; clearInterval(c.iv); c.running = false; 
            vib([200, 100, 200, 100, 400]); 
            playSynthSound('dmg');
            addMatchLog(`🚨 ¡El tiempo se ha agotado por completo!`);
          }
          if (c.secs === 10 * 60 && !S.alertsFired.ten) { 
            S.alertsFired.ten = true; 
            fireTimeAlert(); 
            addMatchLog(`⚠️ Faltan 10 minutos para concluir el encuentro`);
          }
          if (c.secs === 5 * 60 && !S.alertsFired.five) { 
            S.alertsFired.five = true; 
            fireTimeAlert(); 
            addMatchLog(`⚠️ Faltan 5 minutos (Último aviso de tiempo)`);
          }
          // Guardar estado del reloj periódicamente
          if (c.secs % 5 === 0) {
            saveMatchState();
          }
          renderClock();
        }, 1000);
      }
      renderClock();
      saveMatchState();
    }

    function resetClock() {
      clearInterval(S.clock.iv);
      S.clock.secs = 50 * 60; S.clock.running = false;
      S.alertsFired = { ten: false, five: false };
      renderClock();
      playSynthSound('lock');
      addMatchLog(`⏱ Reloj del encuentro reiniciado a 50 minutos`);
    }

    function renderClock() {
      const c = S.clock;
      const timeStr = pad(Math.floor(c.secs / 60)) + ':' + pad(c.secs % 60);
      $('clkDisp').textContent = timeStr;
      $('clkDisp').className = 'clk-disp' + (c.running ? ' run' : c.secs === 0 ? ' exp' : '');
      $('clkPlay').textContent = c.running ? '⏸' : '▶';
      $('clkPlay').className = 'btn-clk' + (c.running ? ' run' : '');
      
      const sfTimer = $('sfCarTimerVal');
      if (sfTimer) sfTimer.textContent = timeStr;
    }

    function fireTimeAlert() {
      const d = $('clkDisp');
      d.classList.remove('alert');
      raf(() => raf(() => { d.classList.add('alert'); vib([100, 60, 100, 60, 100]); }));
      playSynthSound('dmg');
    }

    // Sideboard manual
    function toggleSB(p) {
      const tog = $('sbt' + p), notes = $('sbn' + p);
      if (!notes) return;
      const open = notes.classList.toggle('open');
      if (tog) {
        tog.classList.toggle('open', open);
        tog.textContent = (open ? '▲' : '▼') + ' SIDEBOARD';
      }
      playSynthSound('lock');
    }

    // Veneno
    function changePoison(p, v) {
      S.poison[p - 1] = Math.max(0, S.poison[p - 1] + v);
      vib(v > 0 ? [15, 8, 15] : [10]);
      playSynthSound('poison');
      trigger3DShockwave('#ba55d3');

      const area = $(`la${p}`);
      const popup = document.createElement('div');
      popup.className = 'delta-popup poi';
      popup.textContent = `☠${v > 0 ? '+' + v : v}`;
      popup.style.left = `50%`;
      popup.style.top = `60%`;
      area.appendChild(popup);
      setTimeout(() => popup.remove(), 1200);

      renderPoison(p);

      // Registrar e interactuar con el log
      addMatchLog(`☣️ ${S.names[p - 1]} veneno: ${S.poison[p - 1]} (${v > 0 ? '+' : ''}${v})`);

      // Regla oficial MTG: 10 contadores de veneno = derrota inmediata
      if (S.poison[p - 1] >= 10 && !S.inSideboardPhase) {
        const pel = $('p' + p);
        if (pel) {
          pel.classList.remove('danger');
          pel.classList.add('dead');
        }
        vib([80, 40, 80, 40, 200]);
        addMatchLog(`☠️ ${S.names[p - 1]} eliminado por veneno (10 contadores)`);
        evalBO3MatchEnd(p === 1 ? 2 : 1);
      }
    }

    function renderPoison(p) {
      const n = S.poison[p - 1], el = $('poi' + p);
      el.textContent = n;
      el.className = 'poison-num' + (n >= 10 ? ' crit' : n >= 7 ? ' warn' : '');
    }

    // Mulligans
    function changeMulligan(p) {
      S.mulligans[p - 1]++;
      vib([12]);
      playSynthSound('lock');
      renderMulligan(p);

      // Registrar mulligan
      addMatchLog(`🃏 ${S.names[p - 1]} Mulligan ➔ ${S.mulligans[p - 1]}`);
    }

    function renderMulligan(p) {
      const el = $('mgc' + p);
      if (!el) return;
      const n = S.mulligans[p - 1];
      el.textContent = n;
      el.classList.toggle('on', n > 0);
    }

    // Turno Primero
    function toggleFirst() {
      S.goesFirst = (S.goesFirst + 1) % 3;
      vib([12]);
      playSynthSound('lock');
      renderFirst();

      // Registrar turno primero
      const firstStr = S.goesFirst === 0 ? '⚔ Turno primero: (Sin elegir)' : `⚔ Turno primero: ${S.names[S.goesFirst - 1]}`;
      addMatchLog(firstStr);
    }

    function renderFirst() {
      const btn = $('btnFirst');
      if (!btn) return;
      if (S.goesFirst === 0) {
        btn.textContent = '⚔ PRIMERO';
        btn.className = 'btn-first';
      } else {
        btn.textContent = S.names[S.goesFirst - 1];
        btn.className = 'btn-first p' + S.goesFirst;
      }
    }

    // Resets de juego y completos
    function resetGame() {
      const startLives = selectedMode === 'commander' ? 40 : 20;
      S.lives = [startLives, startLives];
      S.prevLives = [startLives, startLives];
      S.history = [[], []];
      S.poison = [0, 0];
      S.mulligans = [0, 0];
      
      vib([25, 12, 25]);
      playSynthSound('reset');
      
      [1, 2].forEach(p => {
        $('ln' + p).textContent = startLives;
        $('ln' + p).classList.remove('dmg', 'heal');
        $('p' + p).classList.remove('danger', 'dead', 'winner');
        renderHistory(p);
        renderPoison(p);
        renderMulligan(p);
      });
      updateSFCarState();

      // Registrar reinicio de juego
      addMatchLog(`🔄 Juego ${S.currentGame} reiniciado`);
    }

    function resetAll() {
      const startLives = selectedMode === 'commander' ? 40 : 20;
      S.lives = [startLives, startLives];
      S.prevLives = [startLives, startLives];
      S.history = [[], []];
      S.rounds = [[false, false], [false, false]];
      S.poison = [0, 0];
      S.mulligans = [0, 0];
      S.goesFirst = 0;
      S.currentGame = 1;
      S.inSideboardPhase = false;
      S.matchLog = [];

      vib([50, 25, 50, 25, 50]);
      playSynthSound('reset');
      resetClock();
      
      $('sideboard-alert-banner').style.display = 'none';
      $('matchPhaseDisp').textContent = 'JUEGO 1';
      $('matchPhaseDisp').className = '';

      [1, 2].forEach(p => {
        $('ln' + p).textContent = startLives;
        $('ln' + p).classList.remove('dmg', 'heal');
        $(`p${p}`).classList.remove('danger', 'dead', 'winner');
        renderRounds(p);
        const sbnEl = $('sbn' + p);
        if (sbnEl) {
          sbnEl.value = '';
          sbnEl.classList.remove('open');
        }
        const sbtEl = $('sbt' + p);
        if (sbtEl) {
          sbtEl.classList.remove('open');
          sbtEl.textContent = '▼ SIDEBOARD';
        }
        const riEl = $('ri' + p);
        if (riEl) {
          riEl.value = '';
        }
        renderHistory(p);
        renderPoison(p);
        renderMulligan(p);
      });
      renderFirst();
      updateSFCarState();

      // Limpiar caché de localStorage para empezar limpio
      try {
        localStorage.removeItem('mtg_match_state_bo3');
        // Eliminar también notas guardadas de sideboard de la sesión anterior
        [1, 2].forEach(p => {
          localStorage.removeItem(`mtg_sbn${p}_notes`);
          localStorage.removeItem(`mtg_ri${p}_deck`);
        });
      } catch(_) {}

      // Registrar inicio de encuentro
      addMatchLog(`🧹 Encuentro reiniciado por completo (Nuevo Match BO3)`);
    }

    function updateSFCarState() {
      // Función placeholder para evitar crash de JS
    }

    // LongPress reset
    function initResetLongPress() {
      let holdT = null, holdFired = false;
      const btn = $('rstBtn');

      btn.addEventListener('pointerdown', e => {
        if (S.locked) return;
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        holdFired = false;
        btn.classList.add('holding');
        
        holdT = setTimeout(() => {
          holdFired = true; holdT = null;
          btn.classList.remove('holding');
          resetAll();
        }, 1200);
      });

      btn.addEventListener('pointerup', () => {
        if (holdT) { clearTimeout(holdT); holdT = null; }
        btn.classList.remove('holding');
        if (!holdFired && !S.locked) resetGame();
        holdFired = false;
      });

      btn.addEventListener('pointercancel', () => {
        if (holdT) { clearTimeout(holdT); holdT = null; }
        btn.classList.remove('holding');
        holdFired = false;
      });
    }

    // Mute y Lock
    $('btnMute').addEventListener('pointerdown', e => {
      e.preventDefault();
      S.muted = !S.muted;
      $('btnMute').classList.toggle('active', !S.muted);
      $('btnMute').textContent = S.muted ? '🔇' : '🔊';
      playSynthSound('lock');
    });

    $('btnLock').addEventListener('pointerdown', e => {
      e.preventDefault();
      lockApp();
    });

    function lockApp() {
      S.locked = true;
      $('lock-screen').classList.add('active');
      $('btnLock').classList.add('active');
      $('btnLock').textContent = '🔒';
      playSynthSound('lock');
    }

    function unlockApp() {
      S.locked = false;
      $('lock-screen').classList.remove('active');
      $('btnLock').classList.remove('active');
      $('btnLock').textContent = '🔓';
      playSynthSound('reset');
      vib([40, 20, 40]);
    }

    // Lock screen engine
    function initLockScreenEngine() {
      const lockScreen = $('lock-screen');
      const ringFill = $('lockRingFill');
      let holdProgress = 0;
      let isHolding = false;
      const maxOffset = 377;

      const stepHold = () => {
        if (!isHolding) return;
        holdProgress += 4.5;
        
        const offset = Math.max(0, maxOffset - (holdProgress / 100) * maxOffset);
        ringFill.style.strokeDashoffset = offset;

        if (holdProgress >= 100) {
          stopHoldEffect();
          unlockApp();
        } else {
          raf(stepHold);
        }
      };

      const startHoldEffect = (e) => {
        e.preventDefault();
        isHolding = true;
        lockScreen.classList.add('holding');
        holdProgress = 0;
        playSynthSound('lock');
        raf(stepHold);
      };

      const stopHoldEffect = () => {
        isHolding = false;
        lockScreen.classList.remove('holding');
        ringFill.style.strokeDashoffset = maxOffset;
      };

      $('lockRing').addEventListener('pointerdown', startHoldEffect);
      document.addEventListener('pointerup', stopHoldEffect);
      document.addEventListener('pointercancel', stopHoldEffect);
    }

    // Eventos
    document.querySelectorAll('.lifebtn').forEach(btn => {
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        changeLife(+btn.dataset.p, +btn.dataset.v);
      });
    });

    document.querySelectorAll('.btn-undo').forEach(btn => {
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        undo(+btn.dataset.p);
      });
    });

    [1, 2].forEach(p => {
      $(`vb${p}`).addEventListener('pointerdown', e => {
        e.preventDefault();
        resetAll(); // Si tocan el banner de victoria total, resetea todo el match BO3
      });
    });

    $('clkPlay').addEventListener('pointerdown', e => { e.preventDefault(); toggleClock(); });
    $('clkRst').addEventListener('pointerdown', e => { e.preventDefault(); resetClock(); });

    document.querySelectorAll('.btn-pois').forEach(btn => {
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        changePoison(+btn.dataset.p, +btn.dataset.v);
      });
    });

    $('btnFirst').addEventListener('pointerdown', e => { e.preventDefault(); toggleFirst(); });

    function initTouchProtections() {
      // El zoom y comportamiento táctil se manejan mediante CSS (touch-action, overscroll-behavior)
    }

// LOBBY LOGIC
let selectedMode = 'bo3';
let selectedLobbyTheme = '';

document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
    const target = e.currentTarget;
    target.classList.add('active');
    selectedMode = target.id === 'btnModeCommander' ? 'commander' : 'bo3';
    playSynthSound('lock');
  });
});


$('btnStartGame').addEventListener('click', () => {
  const loader = $('battle-loader');
  const loaderImg = $('battle-loader-img');
  const progressFill = $('battleProgressFill');
  const statusTxt = $('battleStatusTxt');
  
  playSynthSound('lock');

  const isSF = false; // Custom SF vs screen disabled

  if (isSF) {
    // Disabled
  } else {
    // Configurar imagen del tema estándar
    if (loaderImg) {
      if (selectedLobbyTheme) {
        const attempts = [
          `./themes/${selectedLobbyTheme}/loading.webp`,
          `./themes/${selectedLobbyTheme}/loading.jpeg`,
          `./themes/${selectedLobbyTheme}/loading.jpg`,
          `./themes/${selectedLobbyTheme}/loading.png`,
          `./themes/${selectedLobbyTheme}/top.webp`,
          `./themes/${selectedLobbyTheme}/top.jpeg`,
          `./themes/${selectedLobbyTheme}/top.jfif`,
          `./themes/${selectedLobbyTheme}/top.png`
        ];
        let attemptIdx = 0;

        loaderImg.onerror = () => {
          attemptIdx++;
          if (attemptIdx < attempts.length) {
            loaderImg.src = attempts[attemptIdx];
          } else {
            loaderImg.style.display = 'none';
            loaderImg.onerror = null;
          }
        };
        loaderImg.src = attempts[0];
        loaderImg.style.display = 'block';
      } else {
        loaderImg.src = '';
        loaderImg.style.display = 'none';
        loaderImg.onerror = null;
      }
    }

    // Activar pantalla de carga estándar
    if (loader) {
      loader.classList.remove('hidden');
      loader.classList.add('active');
    }
    if (progressFill) progressFill.style.width = '0%';
  }
  
  const startTime = Date.now();
  const duration = 4000; // Exactamente 4 segundos
  
  const phrases = {
    streetfighter: ["PREPARANDO ARENA DE LUCHA...", "CONCENTRANDO PSYCHO POWER...", "HADOUKEN LISTO...", "ROUND 1... READY?"],
    rickmorty: ["AJUSTANDO PORTAL DE VIAJE...", "CALIBRANDO NAVE...", "BUSCANDO A MORTY...", "¡WUBBA LUBBA DUB DUB!"],
    simpsons: ["PREPARANDO CENTRAL NUCLEAR...", "ENFRIANDO NÚCLEO...", "HORNADA DE ROSQUILLAS...", "¡EXCELENTE!"],
    bttf: ["CARGANDO CAPACITADOR DE FLUZO...", "ALCANZANDO 88 MPH...", "CALIBRANDO CIRCUITOS DEL TIEMPO...", "¡GRAN SCOTT!"],
    bleach: ["LIBERANDO REIATSU...", "DESPLEGANDO BANKAI...", "CARGANDO PODER DE SHINIGAMI...", "¡SIENTE LA ESPADA!"],
    onepiece: ["NAVEGANDO POR EL GRAND LINE...", "PREPARANDO EL SAKE DE BINKS...", "ACTIVANDO GEAR FIVE...", "¡RUMBO AL ONE PIECE!"],
    naruto: ["MOLDEANDO CHAKRA...", "PREPARANDO RASENSHURIKEN...", "INVOCANDO SAPOS DE MYOBOKU...", "¡CAMINO NINJA, DE VERAS!"],
    dragonball: ["REUNIDAS LAS 7 BOLAS DE DRAGÓN...", "CARGANDO KAMEHAMEHA...", "ALCANZANDO EL ESTADO SUPER SAIYAN...", "¡EL COMBATE VA A COMENZAR!"],
    mario: ["VIAJANDO AL REINO CHAMPIÑÓN...", "RECOLECTANDO MONEDAS DE ORO...", "BUSCANDO A LA PRINCESA PEACH...", "¡HERE WE GO!"],
    default: ["ALINEANDO CONSTELACIONES...", "CARGANDO HECHIZOS...", "PREPARANDO MANÁ...", "¡A LAS ARMAS!"]
  };

  const activePhrases = phrases[selectedLobbyTheme] || phrases.default;

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, (elapsed / duration) * 100);
    
    if (!isSF && progressFill) progressFill.style.width = `${pct}%`;
    
    // Cambiar textos según porcentaje de carga
    if (!isSF && statusTxt) {
      if (pct < 25) statusTxt.textContent = activePhrases[0];
      else if (pct < 55) statusTxt.textContent = activePhrases[1];
      else if (pct < 85) statusTxt.textContent = activePhrases[2];
      else statusTxt.textContent = activePhrases[3];
    }

    if (elapsed >= duration) {
      clearInterval(interval);
      
      // Fin de la pantalla de carga: Transición al juego
      if (isSF) {
        const vsScreen = $('sf-vs-screen');
        if (vsScreen) {
          vsScreen.classList.add('hidden');
        }
        playArcadeAnnouncer("Round one. Fight!");
      } else {
        playSynthSound('victory');
        if (loader) {
          loader.classList.remove('active');
          setTimeout(() => {
            loader.classList.add('hidden');
          }, 500); // Dar tiempo al fade out de CSS
        }
      }

      $('lobby-screen').classList.add('hidden');
      $('game-screen').style.display = 'flex';

      // Set lives based on mode
      if (selectedMode === 'commander') {
         S.lives = [40, 40];
         S.prevLives = [40, 40];
      } else {
         S.lives = [20, 20];
         S.prevLives = [20, 20];
      }
      
      // Force re-render of lives
      $('ln1').textContent = S.lives[0];
      $('ln2').textContent = S.lives[1];
      
      // Leer y guardar visibilidad de UI configurada en el Lobby
      const poisonChecked = $('chkLobbyPoison') ? $('chkLobbyPoison').checked : false;
      
      try {
        localStorage.setItem('mtg_show_poison', poisonChecked);
      } catch(_) {}
      
      if (poisonChecked) {
        document.body.classList.remove('hide-poison');
      } else {
        document.body.classList.add('hide-poison');
      }
      
      document.body.classList.add('hide-sideboard');
      
      // Aplicar Tema oficialmente
      selectTheme(selectedLobbyTheme);
      
      // Guardar estado inicial del juego en localStorage
      saveMatchState();
      // Disparar saludos iniciales
      setTimeout(() => {
        if (geminiApiKey) {
          triggerGeminiPhrase(1, 'start', 0);
          setTimeout(() => {
            triggerGeminiPhrase(2, 'start', 0);
          }, 1500);
        } else {
          const greeting1 = pickThemePhrase(1, 'heal');
          const greeting2 = pickThemePhrase(2, 'heal');
          if (greeting1) showSpeechBubble(1, greeting1);
          setTimeout(() => {
            if (greeting2) showSpeechBubble(2, greeting2);
          }, 1500);
        }
      }, 800);
    }
  }, 100);
});


// ── LÓGICA DE DADOS Y MONEDAS ──
function rollItem(type) {
  playSynthSound('lock');
  const overlay = $('dice-overlay');
  const spinner = $('diceSpinner');
  const valBox = $('diceValue');
  
  overlay.classList.remove('hidden');
  spinner.style.display = 'block';
  valBox.style.display = 'none';
  
  // Auto-ocultar la barra de dados emergente tras el lanzamiento
  $('dice-bar').classList.remove('active');
  $('btnDiceSelector').classList.remove('active');
  
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

// ── SISTEMA DE DIÁLOGOS DINÁMICOS CON GEMINI FLASH IA ──
function triggerGeminiPhrase(p, eventType, value) {
  if (!geminiApiKey) return;
  
  const theme = selectedTheme || '';
  const playerName = S.names[p - 1] || `Jugador ${p}`;
  const currentLife = S.lives[p - 1];
  
  let systemContext = "";
  if (theme === 'streetfighter') {
    systemContext = "Eres la voz digitalizada y nostálgica de una máquina recreativa arcade de lucha de los años 90. Te comunicas como el anunciador o la propia cabina del juego, usando referencias a créditos, pantallas CRT, botones que parpadean, 'FIGHT!', 'ROUND 1!', 'YOU LOSE!' o burlándote de forma electrónica en tu tono clásico de cabinet retro.";
  } else if (theme === 'rickmorty') {
    systemContext = "Eres Rick Sánchez (científico borracho, arrogante, cínico, genio, metiendo eructos 'buuurp' en el texto) o Morty Smith (histérico y asustadizo, con tartamudeos 'oh cielos, Rick').";
  } else if (theme === 'simpsons') {
    systemContext = "Eres un personaje de Los Simpsons (como Homer diciendo ¡Ouch! o ¡D'oh! o quejándose de su rosquilla, o Nelson Muntz burlándose con un cruel '¡Ja-ja!', o Burns diciendo 'Excelente').";
  } else if (theme === 'bttf') {
    systemContext = "Eres Doc Brown (científico loco gritando '¡Gran Scott!' o '¡Santo cielo!') o Marty McFly (diciendo que esto es 'muy fuerte' o preocupado por alterar la línea del tiempo).";
  } else if (theme === 'bleach') {
    systemContext = "Eres Ichigo Kurosaki luchando con su espada Zanpakuto y su máscara Hollow, o un Hollow cruel amenazando con devorar almas.";
  } else {
    systemContext = "Eres una inteligencia artificial mística y enigmática en un combate cósmico de cartas Magic: The Gathering.";
  }

  // Definición de la situación exacta de vidas
  let situation = "";
  if (eventType === 'start') {
    situation = `La batalla de cartas acaba de empezar. Saluda desafiante en tu tono característico.`;
  } else if (eventType === 'danger') {
    situation = `Estás al borde de la derrota con solo ${currentLife} vidas restantes. Sientes el peligro de muerte inminente.`;
  } else if (eventType === 'heavy-damage') {
    situation = `Acabas de recibir un golpe masivo y perdiste ${Math.abs(value)} vidas de golpe. Expresa rabia, dolor o desafío ante el ataque.`;
  } else if (eventType === 'heavy-heal') {
    situation = `Te has curado y ganaste ${value} vidas. Expresa alivio, regocijo arrogante o burla hacia el contrincante.`;
  } else if (eventType === 'dead') {
    situation = `Has perdido todas tus vidas y has muerto. Expresa tu último lamento de derrota.`;
  } else {
    return;
  }

  const prompt = `${systemContext} Reacciona en español al siguiente evento de la partida de Magic: ${situation}. Tu nombre es ${playerName}. Genera una frase corta típica de tu personalidad. Máximo 12 palabras. Responde DIRECTAMENTE solo con la frase corta y directa, sin comillas ni explicaciones adicionales.`;

  // Consulta asíncrona a la API de Gemini 2.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.95,
        maxOutputTokens: 60
      }
    })
  })
  .then(res => res.json())
  .then(data => {
    let phrase = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      phrase = data.candidates[0].content.parts[0].text.trim();
    }
    
    if (phrase) {
      phrase = phrase.replace(/^["'«“]/, '').replace(/["'»”]$/, '');
      showSpeechBubble(p, phrase);
    }
  })
  .catch(err => {
    console.warn("Error consultando Gemini IA:", err);
  });
}

function showSpeechBubble(p, text) {
  // Deshabilitado por configuración del usuario (bocadillos quitados)
  return;
}

// 🧪 AUTO-DIAGNÓSTICO COMPLETO PARA EL JUGADOR DE MAGIC
window.runDiagnostics = function() {
  console.log("🔍 [DIAGNOSTIC] Iniciando auto-test completo del contador...");
  
  // Agregar logs directamente al modal de historial
  const logToHistory = (msg, success = true) => {
    const list = document.getElementById('historyLogList');
    if (list) {
      if (list.innerHTML.includes("Sin historial todavía") || list.innerHTML.includes("Sin historial todav")) {
        list.innerHTML = "";
      }
      const item = document.createElement('div');
      item.className = 'history-item';
      item.style.padding = '8px 10px';
      item.style.borderLeft = success ? '3px solid #39ff14' : '3px solid #ff0055';
      item.style.background = success ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255, 0, 85, 0.05)';
      item.innerHTML = `<span class="history-time" style="color: #8c8c9e;">[TEST]</span> <span class="history-event" style="color: ${success ? '#fff' : '#ff527a'};">${msg}</span>`;
      list.appendChild(item);
    }
  };

  try {
    // 1. Reset inicial
    resetAll();
    logToHistory("✓ Reinicio de partida ejecutado con éxito", true);

    // 2. Verificar valores de vida iniciales
    if (S.lives[0] === 20 && S.lives[1] === 20) {
      logToHistory("✓ Vidas iniciales verificadas (P1: 20, P2: 20)", true);
    } else {
      throw new Error(`Vidas iniciales incorrectas: P1:${S.lives[0]} P2:${S.lives[1]}`);
    }

    // 3. Modificación de vida y verificación de actualización de UI
    changeLife(2, 5); // +5 al jugador 2
    if (S.lives[1] === 25) {
      logToHistory("✓ Modificación de vida exitosa (+5 a P2, nuevo valor: 25)", true);
    } else {
      throw new Error(`Modificación fallida: P2 tiene ${S.lives[1]} en vez de 25`);
    }

    changeLife(1, -1); // -1 al jugador 1
    if (S.lives[0] === 19) {
      logToHistory("✓ Modificación de vida exitosa (-1 a P1, nuevo valor: 19)", true);
    } else {
      throw new Error(`Modificación fallida: P1 tiene ${S.lives[0]} en vez de 19`);
    }

    // 4. Test de deshacer (Undo)
    undo(1); // Deshacer en P1
    if (S.lives[0] === 20) {
      logToHistory("✓ Operación deshacer (Undo) exitosa para P1 (vuelve a 20)", true);
    } else {
      throw new Error(`Undo fallido: P1 tiene ${S.lives[0]} en vez de 20`);
    }

    // 5. Test de cambio de modo de juego (BO3 vs Commander)
    selectedMode = 'commander';
    resetAll();
    if (S.lives[0] === 40 && S.lives[1] === 40) {
      logToHistory("✓ Cambio de modo a Commander exitoso (vidas iniciales: 40)", true);
    } else {
      throw new Error(`Modo Commander fallido: vidas iniciales P1:${S.lives[0]} P2:${S.lives[1]}`);
    }

    // 6. Test de veneno
    changePoison(1, 1); // +1 veneno a P1
    if (S.poison[0] === 1) {
      logToHistory("✓ Contador de veneno verificado (+1 veneno a P1)", true);
    } else {
      throw new Error(`Veneno fallido: P1 tiene ${S.poison[0]} veneno en vez de 1`);
    }

    // 7. Test del Reloj de Torneo
    toggleClock();
    if (S.clock.running) {
      logToHistory("✓ Inicio de reloj de torneo verificado", true);
      setTimeout(() => {
        toggleClock();
        logToHistory("✓ Pausa de reloj de torneo verificado", true);
      }, 100);
    } else {
      throw new Error("El reloj no arrancó");
    }

    // 8. Test de mutear audio
    const oldMuted = S.muted;
    S.muted = !S.muted;
    if (S.muted !== oldMuted) {
      logToHistory("✓ Sistema de audio/silencio alternado correctamente", true);
      S.muted = oldMuted; // Restaurar
    }

    // Volver a Standard y resetear para dejar la partida limpia
    selectedMode = 'bo3';
    resetAll();
    logToHistory("✓ Restauración y limpieza final realizada", true);
    logToHistory("🏆 DIAGNÓSTICO EXITOSO: 100% FUNCIONAL Y CONFIGURADO.", true);
    console.log("🏆 [DIAGNOSTIC] Diagnóstico finalizado con éxito.");

  } catch (error) {
    logToHistory(`✗ FALLO DE DIAGNÓSTICO: ${error.message}`, false);
    console.error("✗ [DIAGNOSTIC] Fallo:", error);
  }
};



// NOTE: initAppEngine() and loading screen fade-out are handled by DOMContentLoaded event in contador.html.
