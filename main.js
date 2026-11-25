/* ============================================================
   Adventskalender – Camper Hans
   Logik: Türchen sperren/öffnen, Hans' Wanderung, Sammelalbum,
   Konfetti, Schnee, Sound, goldenes Türchen, Finale.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Reine Hilfsfunktionen (auch unter Node testbar) ---------- */

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, seed) {
    const rnd = mulberry32(seed);
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function zielJahr(config, heute) {
    return (config && config.jahr) ? config.jahr : heute.getFullYear();
  }

  function tuerchenDatum(nummer, jahr, monat) {
    return new Date(jahr, (monat || 12) - 1, nummer, 0, 0, 0, 0);
  }

  function istOffen(nummer, config, heute) {
    if (config && config.testmodus === true) return true; /* Testmodus: alles offen */
    const jahr = zielJahr(config, heute);
    return heute >= tuerchenDatum(nummer, jahr, config.monat);
  }

  function tageBis(nummer, config, heute) {
    const jahr = zielJahr(config, heute);
    const start = tuerchenDatum(nummer, jahr, config.monat);
    return Math.max(1, Math.ceil((start - heute) / 86400000));
  }

  function goldenTuerchen(config, fallbackSeed) {
    if (config && config.goldenTuerchen) return config.goldenTuerchen;
    const rnd = mulberry32(fallbackSeed || 1);
    return 1 + Math.floor(rnd() * 24);
  }

  function parseDatumOverride(search) {
    const m = /[?&]datum=(\d{4})-(\d{2})-(\d{2})/.exec(search || '');
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  /* Für Node-Tests exportieren, ohne den Browser-Teil auszuführen */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      mulberry32, shuffle, zielJahr, tuerchenDatum,
      istOffen, tageBis, goldenTuerchen, parseDatumOverride
    };
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /* ---------- Browser-App ---------- */

  const config = window.ADVENT_CONFIG || {};
  const TUEREN_ANZAHL = 24;
  const MONAT = config.monat || 12;

  const heute = parseDatumOverride(window.location.search) || new Date();
  const jahr = zielJahr(config, heute);
  const storageKey = 'ch-advent-' + jahr;

  const state = loadState();

  function loadState() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        return {
          offen: Array.isArray(s.offen) ? s.offen : [],
          sound: s.sound !== false,
          schnee: s.schnee === true,
          finaleGesehen: s.finaleGesehen === true
        };
      }
    } catch (e) { /* Speicher nicht verfügbar – egal, wir merken es im RAM */ }
    return { offen: [], sound: true, schnee: false, finaleGesehen: false };
  }

  function saveState() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) { /* egal */ }
  }

  /* ---------- Config normalisieren ---------- */

  const tuerchen = [];
  const roh = Array.isArray(config.tuerchen) ? config.tuerchen : [];
  for (let i = 0; i < TUEREN_ANZAHL; i++) {
    const t = roh[i] || {};
    tuerchen.push(Object.assign({
      nummer: i + 1, typ: 'witz', titel: 'Türchen ' + (i + 1),
      emoji: '🎁', sticker: '🎁', text: '', url: '', urlText: '',
      frage: '', antwort: '', hansSpruch: '', farbe: '', video: '', spiel: ''
    }, t, { nummer: t.nummer || i + 1 }));
  }
  const byNummer = {};
  tuerchen.forEach(function (t) { byNummer[t.nummer] = t; });

  const order = shuffle(Array.from({ length: TUEREN_ANZAHL }, function (_, i) { return i + 1; }),
    config.shuffleSeed || jahr);
  const golden = goldenTuerchen(config, jahr * 31 + 7);

  const heuteNummer = (heute.getFullYear() === jahr && heute.getMonth() === MONAT - 1 &&
    heute.getDate() >= 1 && heute.getDate() <= TUEREN_ANZAHL) ? heute.getDate() : null;

  /* ---------- Elemente ---------- */

  const el = function (id) { return document.getElementById(id); };
  const grid = el('advent-tueren');
  const stickerGrid = el('advent-sticker');
  const toast = el('advent-toast');

  /* ---------- Sound (WebAudio, keine Dateien nötig) ---------- */

  let audioCtx = null;
  let masterGain = null;

  function audio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.25;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function ton(freqStart, freqEnd, dauer, typ, wann) {
    if (!state.sound) return;
    const ctx = audio();
    if (!ctx) return;
    const t0 = ctx.currentTime + (wann || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = typ || 'triangle';
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), t0 + dauer);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.6, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dauer);
    osc.connect(g); g.connect(masterGain);
    osc.start(t0); osc.stop(t0 + dauer + 0.05);
  }

  const sndPop = function () { ton(500, 1100, 0.14, 'triangle'); ton(900, 1400, 0.1, 'sine', 0.05); };
  const sndNope = function () { ton(180, 90, 0.22, 'sawtooth'); };
  const sndFanfare = function () {
    [523, 659, 784, 1047, 1319].forEach(function (f, i) { ton(f, f, 0.18, 'triangle', i * 0.12); });
  };

  /* ---------- Konfetti & Schnee (Farben kommen aus den CI-Tokens) ---------- */

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ciFarbe(name) {
    return getComputedStyle(document.documentElement).getPropertyValue('--ch-' + name).trim();
  }
  const KONFETTI_FARBEN = ['forest', 'sun', 'campfire', 'sky', 'berry', 'paper']
    .map(ciFarbe).filter(Boolean);

  const konfettiCanvas = el('advent-konfetti');
  const kctx = konfettiCanvas.getContext('2d');
  let konfetti = [];
  let konfettiLaeuft = false;

  function canvasGroesse(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  canvasGroesse(konfettiCanvas);

  function konfettiBurst(x, y, anzahl) {
    if (reducedMotion) return;
    for (let i = 0; i < anzahl; i++) {
      const winkel = Math.random() * Math.PI * 2;
      const geschw = 4 + Math.random() * 9;
      konfetti.push({
        x: x, y: y,
        vx: Math.cos(winkel) * geschw,
        vy: Math.sin(winkel) * geschw - 6,
        groesse: 5 + Math.random() * 6,
        farbe: KONFETTI_FARBEN[Math.floor(Math.random() * KONFETTI_FARBEN.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        leben: 90 + Math.random() * 60
      });
    }
    if (!konfettiLaeuft) { konfettiLaeuft = true; requestAnimationFrame(konfettiTick); }
  }

  function konfettiStorm() {
    for (let i = 0; i < 5; i++) {
      konfettiBurst(window.innerWidth * (0.1 + 0.2 * i), window.innerHeight * 0.2, 60);
    }
  }

  function konfettiTick() {
    kctx.clearRect(0, 0, konfettiCanvas.width, konfettiCanvas.height);
    konfetti = konfetti.filter(function (p) { return p.leben > 0; });
    konfetti.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.vx *= 0.99;
      p.rot += p.vr; p.leben--;
      kctx.save();
      kctx.translate(p.x, p.y);
      kctx.rotate(p.rot);
      kctx.fillStyle = p.farbe;
      kctx.fillRect(-p.groesse / 2, -p.groesse / 2, p.groesse, p.groesse * 0.6);
      kctx.restore();
    });
    if (konfetti.length > 0) {
      requestAnimationFrame(konfettiTick);
    } else {
      konfettiLaeuft = false;
      kctx.clearRect(0, 0, konfettiCanvas.width, konfettiCanvas.height);
    }
  }

  const schneeCanvas = el('advent-schnee');
  const sctx = schneeCanvas.getContext('2d');
  let schnee = [];
  let schneeLaeuft = false;
  const schneeFarbe = ciFarbe('paper') || '#FFFDF5';

  function schneeInit() {
    canvasGroesse(schneeCanvas);
    schnee = [];
    const anzahl = Math.floor(window.innerWidth / 14);
    for (let i = 0; i < anzahl; i++) {
      schnee.push({
        x: Math.random() * schneeCanvas.width,
        y: Math.random() * schneeCanvas.height,
        r: 1.5 + Math.random() * 3,
        vy: 0.5 + Math.random() * 1.2,
        drift: Math.random() * Math.PI * 2
      });
    }
  }

  function schneeTick() {
    sctx.clearRect(0, 0, schneeCanvas.width, schneeCanvas.height);
    sctx.fillStyle = schneeFarbe;
    schnee.forEach(function (f) {
      f.y += f.vy; f.drift += 0.02;
      f.x += Math.sin(f.drift) * 0.6;
      if (f.y > schneeCanvas.height + 4) { f.y = -4; f.x = Math.random() * schneeCanvas.width; }
      sctx.beginPath();
      sctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      sctx.fill();
    });
    if (state.schnee && !reducedMotion) requestAnimationFrame(schneeTick);
    else { schneeLaeuft = false; sctx.clearRect(0, 0, schneeCanvas.width, schneeCanvas.height); }
  }

  function schneeSetzen(an) {
    state.schnee = an;
    saveState();
    el('advent-schnee-btn').textContent = an ? '❄️ Schnee an' : '❄️ Schnee aus';
    if (an && !reducedMotion) {
      if (schnee.length === 0) schneeInit();
      if (!schneeLaeuft) { schneeLaeuft = true; requestAnimationFrame(schneeTick); }
    }
  }

  window.addEventListener('resize', function () {
    canvasGroesse(konfettiCanvas);
    if (schnee.length) { canvasGroesse(schneeCanvas); }
  });

  /* ---------- Toast ---------- */

  let toastTimer = null;
  function zeigeToast(titel, text) {
    el('advent-toast-title').textContent = titel;
    el('advent-toast-text').textContent = text;
    toast.classList.add('advent-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('advent-visible'); }, 3200);
  }

  /* ---------- Rendern ---------- */

  function nameEinsetzen(text) {
    return config.name ? String(text).replace(/\{name\}/g, config.name) : text;
  }

  function renderTueren() {
    grid.innerHTML = '';
    order.forEach(function (nummer) {
      const t = byNummer[nummer];
      const offen = state.offen.indexOf(nummer) !== -1;
      const offenbar = istOffen(nummer, config, heute);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'door';
      btn.dataset.nummer = nummer;
      if (offen) btn.classList.add('door-open');
      else if (!offenbar) btn.classList.add('door-locked');
      if (nummer === heuteNummer && offenbar && !offen) btn.classList.add('door-today');
      if (nummer === golden) btn.classList.add('door-golden');
      if (t.farbe) btn.classList.add('door-tint-' + t.farbe);
      btn.setAttribute('aria-label', 'Türchen ' + nummer + ': ' + t.titel +
        (offenbar ? '' : ' (noch verschlossen)'));

      const num = document.createElement('span');
      num.className = 'door-num';
      num.textContent = nummer;
      const icon = document.createElement('span');
      icon.className = offen ? 'door-emoji' : 'door-lock';
      icon.textContent = offen ? (t.sticker || t.emoji) : (offenbar ? t.emoji : '🔒');
      btn.appendChild(num);
      btn.appendChild(icon);

      btn.addEventListener('click', function () { tuerchenKlick(nummer, btn); });
      grid.appendChild(btn);
    });
  }

  function renderFortschritt() {
    const count = state.offen.length;
    el('advent-offen').textContent = count + ' / 24';
    const f = count / TUEREN_ANZAHL;
    const hans = el('advent-hans');
    const label = el('advent-trail-label');
    hans.style.left = (f * 100) + '%';
    label.style.left = (f * 100) + '%';
    label.textContent = count === 0 ? 'Start' : (count === TUEREN_ANZAHL ? 'Lagerfeuer! 🔥' : 'Türchen ' + count + ' / 24');

    el('advent-finale-zone').style.display = count === TUEREN_ANZAHL ? 'block' : 'none';
  }

  function renderAlbum() {
    stickerGrid.innerHTML = '';
    for (let n = 1; n <= TUEREN_ANZAHL; n++) {
      const slot = document.createElement('div');
      const got = state.offen.indexOf(n) !== -1;
      slot.className = 'sticker-slot' + (got ? ' sticker-got' : '');
      slot.textContent = got ? (byNummer[n].sticker || '⭐') : String(n);
      slot.title = got ? ('Türchen ' + n + ': ' + byNummer[n].titel) : ('Türchen ' + n + ' – noch zu sammeln');
      stickerGrid.appendChild(slot);
    }
  }

  function renderKopf() {
    document.title = (config.titel || 'Adventskalender') + ' – Camper Hans';
    el('advent-titel').innerHTML = nameEinsetzen((config.titel || 'Advent im <em>Camper</em>!'));
    el('advent-untertitel').textContent = nameEinsetzen(config.untertitel || '');
    const gruss = el('advent-gruss');
    gruss.textContent = config.name
      ? 'Hallo ' + config.name + '! Hans sagt: Vorfreude ist die schönste Freude!'
      : 'Hans sagt: Vorfreude ist die schönste Freude!';
    el('advent-sound').textContent = state.sound ? '🔊 Ton an' : '🔇 Ton aus';
    el('advent-schnee-btn').textContent = state.schnee ? '❄️ Schnee an' : '❄️ Schnee aus';
  }

  function renderAll() {
    renderKopf();
    renderTueren();
    renderFortschritt();
    renderAlbum();
  }

  /* ---------- Türchen öffnen ---------- */

  function tuerchenKlick(nummer, btn) {
    const t = byNummer[nummer];
    const schonOffen = state.offen.indexOf(nummer) !== -1;

    if (!schonOffen && !istOffen(nummer, config, heute)) {
      sndNope();
      btn.classList.remove('ch-shake');
      void btn.offsetWidth; /* Animation neu starten */
      btn.classList.add('ch-shake');
      const tage = tageBis(nummer, config, heute);
      zeigeToast('Noch nicht! ⏳',
        'Türchen ' + nummer + ' öffnet sich in ' + tage + (tage === 1 ? ' Tag' : ' Tagen') +
        '. Hans sagt: Vorfreude ist die schönste Freude!');
      return;
    }

    if (!schonOffen) {
      state.offen.push(nummer);
      saveState();
      const rect = btn.getBoundingClientRect();
      konfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
      sndPop();
      renderAll();
      if (state.offen.length === TUEREN_ANZAHL) {
        setTimeout(function () { zeigeFinale(); }, 600);
      }
    }
    zeigeModal(t);
  }

  /* ---------- Modal ---------- */

  const overlay = el('advent-modal-overlay');

  function zeigeModal(t) {
    el('advent-modal-emoji').textContent = t.emoji || '🎁';
    el('advent-modal-titel').textContent = 'Türchen ' + t.nummer + ': ' + t.titel;
    const badge = el('advent-modal-badge');
    badge.textContent = (t.nummer === golden ? '⭐ Goldenes Türchen' : 'Türchen ' + t.nummer);
    el('advent-modal-text').textContent = nameEinsetzen(t.text || '');

    /* Lokales Video (z. B. assets/...) direkt im Modal abspielen */
    const videoWrap = el('advent-modal-video-wrap');
    const video = el('advent-modal-video');
    if (t.typ === 'video' && t.video) {
      videoWrap.style.display = '';
      if (video.getAttribute('src') !== t.video) video.src = t.video;
      const p = video.play();
      if (p && p.catch) p.catch(function () { /* Autoplay blockiert – Nutzer klickt Play */ });
    } else {
      videoWrap.style.display = 'none';
      video.pause();
    }

    const link = el('advent-modal-link');
    if (t.typ === 'spiel' && t.spiel) {
      /* Eingebettetes Spiel: Button öffnet das Spiel-Overlay (iframe) statt zu verlinken */
      link.href = t.spiel;
      link.textContent = (t.urlText || '▶ Jetzt spielen');
      link.style.display = '';
      link.onclick = function (e) { e.preventDefault(); spielOeffnen(t); };
    } else if (t.url) {
      link.href = t.url;
      link.textContent = (t.urlText || 'Auf geht\'s!') + ' ↗';
      link.style.display = '';
      link.onclick = null;
    } else {
      link.style.display = 'none';
      link.onclick = null;
    }

    const raetsel = el('advent-modal-raetsel');
    if (t.typ === 'raetsel' && t.frage) {
      raetsel.style.display = '';
      el('advent-modal-frage').textContent = t.frage;
      const loesung = el('advent-modal-loesung');
      loesung.textContent = '💡 ' + (t.antwort || '…');
      loesung.classList.remove('raetsel-visible');
      el('advent-modal-loesung-btn').textContent = 'Lösung anzeigen';
    } else {
      raetsel.style.display = 'none';
    }

    const sprueche = config.hansSprueche || [];
    el('advent-modal-spruch').textContent =
      'Hans sagt: „' + (t.hansSpruch || sprueche[Math.floor(Math.random() * sprueche.length)] || 'Guter Tag!') + '“';

    overlay.classList.add('advent-visible');
  }

  function modalSchliessen() {
    overlay.classList.remove('advent-visible');
    const video = el('advent-modal-video');
    if (video) video.pause();
  }

  el('advent-modal-close').addEventListener('click', modalSchliessen);
  el('advent-modal-ok').addEventListener('click', modalSchliessen);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) modalSchliessen(); });
  el('advent-modal-loesung-btn').addEventListener('click', function () {
    const loesung = el('advent-modal-loesung');
    const sichtbar = loesung.classList.toggle('raetsel-visible');
    this.textContent = sichtbar ? 'Lösung verstecken' : 'Lösung anzeigen';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { spielSchliessen(); modalSchliessen(); finaleSchliessen(); }
  });

  /* ---------- Spiel-Overlay (eingebettete Spiele, z. B. games/hans-and-run) ---------- */

  const gameOverlay = el('advent-game-overlay');
  const gameIframe = el('advent-game-iframe');

  function spielOeffnen(t) {
    el('advent-game-titel').textContent = (t.emoji || '🎮') + ' ' + (t.titel || 'Spiel');
    gameIframe.src = t.spiel;
    gameOverlay.classList.add('advent-visible');
  }

  function spielSchliessen() {
    if (!gameOverlay.classList.contains('advent-visible')) return;
    gameOverlay.classList.remove('advent-visible');
    gameIframe.src = 'about:blank'; /* lädt das Spiel neu und stoppt Sound */
  }

  el('advent-game-close').addEventListener('click', spielSchliessen);
  gameOverlay.addEventListener('click', function (e) { if (e.target === gameOverlay) spielSchliessen(); });

  /* ---------- Finale ---------- */

  const finaleOverlay = el('advent-finale-overlay');

  function zeigeFinale() {
    const f = config.finale || {};
    el('advent-finale-titel').textContent = nameEinsetzen(f.titel || 'Geschafft – alle 24 Türchen!');
    el('advent-finale-nachricht').textContent = nameEinsetzen(f.nachricht || '');
    const link = el('advent-finale-link');
    if (f.url) { link.href = f.url; link.textContent = '🎁 ' + (f.urlText || 'Zum Finale-Geschenk') + ' ↗'; link.style.display = ''; }
    else { link.style.display = 'none'; }
    finaleOverlay.classList.add('advent-visible');
    state.finaleGesehen = true;
    saveState();
    konfettiStorm();
    sndFanfare();
  }

  function finaleSchliessen() { finaleOverlay.classList.remove('advent-visible'); }

  el('advent-finale-close').addEventListener('click', finaleSchliessen);
  el('advent-finale-btn').addEventListener('click', zeigeFinale);
  finaleOverlay.addEventListener('click', function (e) { if (e.target === finaleOverlay) finaleSchliessen(); });

  /* ---------- Header-Buttons ---------- */

  el('advent-sound').addEventListener('click', function () {
    state.sound = !state.sound;
    saveState();
    this.textContent = state.sound ? '🔊 Ton an' : '🔇 Ton aus';
    if (state.sound) sndPop();
  });
  el('advent-schnee-btn').addEventListener('click', function () {
    schneeSetzen(!state.schnee);
  });

  /* ---------- Start ---------- */

  if (!Array.isArray(config.tuerchen) || config.tuerchen.length !== TUEREN_ANZAHL) {
    zeigeToast('Ups, da ist ein Ast im Weg! 🪵',
      'In config/advent.config.js müssen genau 24 Türchen stehen. Schau bitte nochmal rein!');
  }

  renderAll();
  if (state.schnee) schneeSetzen(true);
  if (config.testmodus === true) {
    zeigeToast('🧪 Testmodus aktiv',
      'Alle 24 Türchen sind gerade zum Testen offen – vor dem 1. Dezember in der Config wieder ausschalten!');
  }
})();
