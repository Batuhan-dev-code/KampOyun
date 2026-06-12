// ====== GEÇİCİ TEST KODU ======
// Altın hilesini açmak için aşağıdaki satırın başındaki "//" işaretlerini sil.
// localStorage.setItem("campfireGoldenWood", 5000);
// =======================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tintCanvas = document.createElement("canvas");
const tintCtx = tintCanvas.getContext("2d"); 

const hudEl = document.querySelector(".hud");

const tentStyle = document.createElement('style');
tentStyle.innerHTML = `
  #tentMenu { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); border: 2px solid #a0522d; border-radius: 12px; padding: 12px; display: flex; gap: 20px; pointer-events: auto; z-index: 100; transition: opacity 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
  .tent-item { color: white; font-size: 18px; font-weight: bold; cursor: pointer; text-align: center; padding: 8px 15px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: background 0.2s; user-select: none; }
  .tent-item:active { background: rgba(255,255,255,0.3); }
  .hidden-fade { opacity: 0; pointer-events: none !important; }
`;
document.head.appendChild(tentStyle);

const tentMenu = document.createElement("div");
tentMenu.id = "tentMenu";
tentMenu.className = "hidden-fade";
tentMenu.addEventListener("pointerdown", e => e.stopPropagation());
document.querySelector(".game-shell").appendChild(tentMenu);

if (!document.getElementById("pauseUI")) {
    const pUI = document.createElement("div");
    pUI.id = "pauseUI";
    pUI.className = "hidden";
    pUI.innerHTML = `
        <div class="pause-box">
            <h2>PAUSED</h2>
            <p>Are you sure you want to quit?<br><small style="color: #bbb;">(Your progress will be lost)</small></p>
            <div class="menu-buttons pause-btns">
                <button id="resumeBtn" class="menu-btn primary">RESUME</button>
                <button id="quitBtn" class="menu-btn secondary">MAIN MENU</button>
            </div>
        </div>
    `;
    document.querySelector(".game-shell").appendChild(pUI);
}

if (!document.getElementById("upgradesMenu")) {
    const uMenu = document.createElement("div");
    uMenu.id = "upgradesMenu";
    uMenu.className = "hidden";
    document.querySelector(".game-shell").appendChild(uMenu);
}

const sounds = {
  fire: new Audio("assets/fire.mp3"),
  day: new Audio("assets/day.mp3"),
  night: new Audio("assets/night.mp3"),
  wood: new Audio("assets/wood.mp3"),
  feed: new Audio("assets/feed.mp3"),
  wind: new Audio("assets/wind.mp3"),
  rain: new Audio("assets/rain.mp3"),
  bloodmoon: new Audio("assets/bloodmoon.mp3"),
  howl: new Audio("assets/howl.mp3")
};
sounds.fire.loop = true; sounds.day.loop = true; sounds.night.loop = true;
sounds.wind.loop = true; sounds.rain.loop = true; sounds.bloodmoon.loop = true;
let audioStarted = false;

const state = {
  status: "MENU", player: { x: 100, y: 100, r: 14, speed: 170, dir: "down" },
  pet: { x: 120, y: 120, r: 8, targetX: 120, targetY: 120, speed: 155, isSitting: true, isSleeping: false, angle: 0, fetchTimer: 15, isFetching: false, hasWood: false },
  fire: { x: 0, y: 0, r: 22, level: 100, currentFrame: 0, animationTimer: 0 }, tent: { x: 0, y: 0, r: 40 },
  woods: [], mushrooms: [], blueMushroom: null, enemies: [], trees: [], smokeParticles: [], sparks: [], floatingTexts: [], playerTrails: [], raccoons: [], windParticles: [], rainDrops: [],
  pendingWoodRespawns: 0, woodRespawnTimer: 0, targetWoodCount: 7, pendingMushroomRespawns: 0, mushroomRespawnTimer: 0, targetMushroomCount: 2, blueMushroomTimer: 30 + Math.random() * 30, superModeTimer: 0, raccoonSpawnTimer: 15, windTimer: 20 + Math.random() * 30, windDuration: 0, rainTimer: 30 + Math.random() * 40, rainDuration: 0,
  maxWood: 5, sessionGoldenWood: 0, 
  
  isMuted: localStorage.getItem("campfireMuted") === "true",
  bloodMoonActive: false, bloodMoonHowlTimer: 0, bloodMoonMessageTimer: 0, survivedBloodMoonMessageTimer: 0, fireEaterSpawnTimer: 0,
  bagWood: 0, score: 0, health: 100, dayNightTimer: 0, lastTs: 0, gameOver: false, deathAnimDone: false, damageFlash: 0, currentDay: 1, dayMessageTimer: 0,
  
  inventory: { apple: 0, mushroom: 0, fish: 0, cooked_mushroom: 0, cooked_fish: 0 },
  equippedFood: null,
  equippedCount: 0,
  apples: [],
  pond: { x: 0, y: 0, r: 55, fishProgress: 0 },
  cookTimer: 0
};

window.equipFood = function(type) {
  if (state.equippedFood && state.equippedFood !== type) {
      state.inventory[state.equippedFood] += state.equippedCount;
      state.equippedFood = null;
      state.equippedCount = 0;
  }
  
  if (state.inventory[type] > 0) {
      state.equippedFood = type;
      if (!state.equippedCount) state.equippedCount = 0;
      state.equippedCount++;
      state.inventory[type]--;
      state.cookTimer = 0; 
      playSound(sounds.wood);
      updateHud(); 
  }
};

function initAudio() {
  if (audioStarted) return;
  audioStarted = true;
  sounds.day.volume = 0; sounds.night.volume = 0; sounds.fire.volume = 0;
  sounds.wind.volume = 0; sounds.rain.volume = 0; sounds.bloodmoon.volume = 0;
  Object.values(sounds).forEach(snd => {
    snd.muted = state.isMuted;
    if (snd.loop) snd.play().catch(() => console.log("Audio file not added yet."));
  });
}

function playSound(snd) {
  if (!audioStarted) return;
  snd.currentTime = 0; snd.play().catch(() => {});
}

function stopAudio() {
  audioStarted = false;
  Object.values(sounds).forEach(snd => { snd.pause(); snd.currentTime = 0; });
}
function pauseAudio() { Object.values(sounds).forEach(snd => { if (snd.loop) snd.pause(); }); }
function resumeAudio() { if (!audioStarted) return; Object.values(sounds).forEach(snd => { if (snd.loop) snd.play().catch(()=>{}); }); }

hudEl.innerHTML = "";
hudEl.style.display = "flex";
hudEl.style.flexDirection = "column"; 
hudEl.style.justifyContent = "center"; hudEl.style.alignItems = "center";
hudEl.style.gap = "8px"; hudEl.style.padding = "10px";
hudEl.style.width = "100%";
hudEl.style.boxSizing = "border-box";

const style = document.createElement('style');
style.innerHTML = `
  .hud-row { display: flex; justify-content: center; align-items: center; gap: 15px; width: 100%; }
  .bars-group { display: flex; justify-content: center; align-items: center; gap: 8px; }
  .bar-wrapper { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 11px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px #000; }
  .bar-container { width: 55px; height: 12px; background: rgba(0, 0, 0, 0.7); border: 2px solid #4a5568; border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8); }
  .bar-fill { height: 100%; transition: width 0.2s ease-out; }
  .health-fill { background: linear-gradient(90deg, #c53030, #fc8181); }
  .fire-fill { background: linear-gradient(90deg, #ff4500, #ff8c00); }
  .wood-container { display: flex; align-items: center; justify-content: center; gap: 3px; background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 6px; border: 1px solid #4a5568; min-width: 185px; }
  .wood-label { color: #fff; font-size: 12px; font-weight: bold; text-shadow: 1px 1px 2px #000; margin-right: 6px; }
  .wood-icon { width: 14px; height: 8px; fill: #d2b48c; opacity: 0.2; transition: opacity 0.2s; }
  .wood-icon.active { opacity: 1; fill: #a0522d; }
  .time-container { position: relative; width: 26px; height: 26px; display: flex; justify-content: center; align-items: center; }
  .time-icon { position: absolute; width: 24px; height: 24px; transition: opacity 0.5s; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.8)); }
  .score-text { font-size: 13px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px #000; background: rgba(0,0,0,0.4); padding: 6px 12px; border-radius: 6px; border: 1px solid #4a5568; margin-top: 6px; text-align: center; line-height: 1.4; }
  .shop-container { display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; padding-right: 5px; }
  .shop-container::-webkit-scrollbar { width: 4px; }
  .shop-container::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
`;
document.head.appendChild(style);

const SVG_WOOD = '<svg class="wood-icon" viewBox="0 0 100 60"><rect x="10" y="20" width="80" height="20" rx="10"/></svg>';
const SVG_SUN = '<svg class="time-icon sun-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="yellow"/><path d="M50 0 V10 M50 90 V100 M0 50 H10 M90 50 H100 M15 15 L22 22 M78 78 L85 85 M15 85 L22 78 M78 15 L85 22" stroke="yellow" stroke-width="5"/></svg>';
const SVG_MOON = '<svg class="time-icon moon-icon" viewBox="0 0 100 100"><path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill="white"/></svg>';
const SVG_BLOOD_MOON = '<svg class="time-icon blood-moon-icon" viewBox="0 0 100 100"><path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill="#ff2a2a" filter="drop-shadow(0px 0px 5px rgba(255,0,0,0.8))"/></svg>';

const topRow = document.createElement("div"); topRow.className = "hud-row";
const bottomRow = document.createElement("div"); bottomRow.className = "hud-row";

const UPGRADE_DATA = {
  backpack: [{ level: 1, capacity: 10, cost: 150 }, { level: 2, capacity: 15, cost: 450 }, { level: 3, capacity: 20, cost: 1200 }],
  pet: [{ level: 1, speed: 190, cost: 300 }, { level: 2, speed: 230, cost: 700 }],
  fireShield: [{ level: 1, cost: 200 }, { level: 2, cost: 500 }, { level: 3, cost: 1000 }]
};

let currentBackpackTier = parseInt(localStorage.getItem("backpackTier")) || 0;
let currentPetTier = parseInt(localStorage.getItem("campfirePetTier")) || 0;
let currentFireShieldTier = parseInt(localStorage.getItem("campfireFireShieldTier")) || 0;

function updateMaxWoodCapacity() { if (currentBackpackTier === 0) { state.maxWood = 5; } else { state.maxWood = UPGRADE_DATA.backpack[currentBackpackTier - 1].capacity; } }
function updatePetStats() { if (currentPetTier === 0) { state.pet.speed = 155; } else if (currentPetTier === 1) { state.pet.speed = 190; } else if (currentPetTier === 2) { state.pet.speed = 230; } }

updateMaxWoodCapacity(); updatePetStats();

function renderWoodIcons() { let html = '<span class="wood-label">Wood</span>'; for(let i=0; i<state.maxWood; i++) html += SVG_WOOD; return html; }
const woodWrap = document.createElement("div"); woodWrap.className = "wood-container"; woodWrap.id = "woodIconsWrapper"; woodWrap.innerHTML = renderWoodIcons(); topRow.appendChild(woodWrap);
const timeWrap = document.createElement("div"); timeWrap.className = "time-container"; timeWrap.innerHTML = SVG_SUN + SVG_MOON + SVG_BLOOD_MOON; topRow.appendChild(timeWrap);

const pauseBtnWrap = document.createElement("div"); pauseBtnWrap.className = "pause-btn"; pauseBtnWrap.innerHTML = "⏸"; pauseBtnWrap.id = "hudPauseBtn"; topRow.appendChild(pauseBtnWrap);

const muteBtnWrap = document.createElement("div"); 
muteBtnWrap.className = "pause-btn"; 
muteBtnWrap.id = "hudMuteBtn"; 
muteBtnWrap.style.cursor = "pointer";
muteBtnWrap.innerHTML = state.isMuted ? "🔇" : "🔊"; 

muteBtnWrap.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    state.isMuted = !state.isMuted; 
    localStorage.setItem("campfireMuted", state.isMuted); 
    Object.values(sounds).forEach(snd => snd.muted = state.isMuted); 
    muteBtnWrap.innerHTML = state.isMuted ? "🔇" : "🔊"; 
});
topRow.appendChild(muteBtnWrap);

const barsGroup = document.createElement("div"); barsGroup.className = "bars-group";
const fireWrap = document.createElement("div"); fireWrap.className = "bar-wrapper";
fireWrap.innerHTML = 'Fire <div class="bar-container"><div id="fireBar" class="bar-fill fire-fill"></div></div>'; barsGroup.appendChild(fireWrap);
const healthWrap = document.createElement("div"); healthWrap.className = "bar-wrapper";
healthWrap.innerHTML = 'Health <div class="bar-container"><div id="healthBar" class="bar-fill health-fill"></div></div>'; barsGroup.appendChild(healthWrap);
bottomRow.appendChild(barsGroup);
const scoreWrap = document.createElement("div"); scoreWrap.className = "score-text";
scoreWrap.innerHTML = `Day <span id="dayText">1</span> | Score: <span id="scoreText">0</span> | <span style="color:#ffd700;">🟡 <span id="goldenWoodText">0</span></span>`; bottomRow.appendChild(scoreWrap);
hudEl.appendChild(topRow); hudEl.appendChild(bottomRow);

const walkIdleSprite = new Image(); walkIdleSprite.src = "assets/walk and idle.png";
const dieSprite = new Image(); dieSprite.src = "assets/attack and die.png";
const fireSprite = new Image(); fireSprite.src = "assets/yeni_ates.png";
const spriteFrames = { walk: { w: 32, h: 32 }, die: { w: 32, h: 32 } };
walkIdleSprite.onload = () => { const inferred = inferSpriteFrameSize({ img: walkIdleSprite, preferred: 32, min: 16, max: 64, rowsHint: 4 }); if (inferred) { spriteFrames.walk.w = inferred.w; spriteFrames.walk.h = inferred.h; } };
dieSprite.onload = () => { const inferred = inferSpriteFrameSize({ img: dieSprite, preferred: 32, min: 16, max: 96, rowsHint: 1 }); if (inferred) { spriteFrames.die.w = inferred.w; spriteFrames.die.h = inferred.h; } configureDeathClip(); };
const fireAnim = { frameWidth: 64, frameHeight: 64, cols: 10, rows: 6, frameCount: 60, frameTimer: 0 };
fireSprite.onload = () => { const fullW = fireSprite.width || 0; const fullH = fireSprite.height || 0; if (fullW > 0 && fullH > 0) { fireAnim.frameWidth = fullW / fireAnim.cols; fireAnim.frameHeight = fullH / fireAnim.rows; fireAnim.frameCount = fireAnim.cols * fireAnim.rows; } };

const controls = { up: false, down: false, left: false, right: false };
const anim = { walkFrame: 0, walkTimer: 0, deathFrame: 0, deathTimer: 0 };
const deathClip = { row: 0, startCol: 0, frameCount: 1 };
const DAY_SECONDS = 120; const NIGHT_SECONDS = 60;
const CYCLE_SECONDS = DAY_SECONDS + NIGHT_SECONDS;
const WALK_FPS = 10; const DEATH_FPS = 8; const FIRE_FPS_MIN = 10;
const FIRE_FPS_MAX = 12; const PLAYER_SCALE = 2.2; const WALK_START_COL = 0; const WALK_MAX_FRAMES = 4;

function getPlayerDrawSize() { return spriteFrames.walk.w * PLAYER_SCALE; }
function configureDeathClip() { const fw = spriteFrames.die.w; const fh = spriteFrames.die.h;
const cols = Math.max(1, Math.floor((dieSprite.naturalWidth || fw) / fw)); const rows = Math.max(1, Math.floor((dieSprite.naturalHeight || fh) / fh));
deathClip.row = Math.max(0, rows - 1); deathClip.startCol = rows > 1 ? Math.floor(cols * 0.5) : Math.floor(cols * 0.6);
if (deathClip.startCol >= cols) deathClip.startCol = Math.max(0, cols - 1); deathClip.frameCount = Math.max(1, cols - deathClip.startCol);
}
function inferSpriteFrameSize({ img, preferred, min, max, rowsHint }) { const w = img.naturalWidth || 0; const h = img.naturalHeight || 0; if (!w || !h) return null; const candidates = [];
const tryAdd = (fw, fh, cols, rows) => { if (fw >= min && fw <= max && fh >= min && fh <= max) { candidates.push({ w: fw, h: fh, score: Math.abs(fw - fh) * 100 + Math.abs(fw - preferred) + Math.abs(fh - preferred) });
} }; if (rowsHint >= 1 && h % rowsHint === 0) { const fh = h / rowsHint;
if (w % fh === 0) tryAdd(w / fh, fh, w / fh, rowsHint);
for (let cols = 1; cols <= Math.min(20, Math.floor(w / min)); cols += 1) { if (w % cols === 0) tryAdd(w / cols, fh, cols, rowsHint);
} } const common = [16, 24, 32, 48, 64, 96];
common.forEach((fw) => { if (w % fw === 0) common.forEach((fh) => { if (h % fh === 0) tryAdd(fw, fh, w / fw, h / fh); }); });
if (!candidates.length) return null; candidates.sort((a, b) => a.score - b.score); return candidates[0]; }

function generateTrees() { state.trees = [];
const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
for (let i = 0; i < 70; i++) { let tx = Math.random() * w;
let ty = Math.random() * h; if (dist({ x: tx, y: ty }, state.fire) > 230 && !isPointInPond(tx, ty)) { state.trees.push({ x: tx, y: ty, r: 15 + Math.random() * 25, color: Math.random() > 0.5 ? "#142e12" : "#1a3a17" });
} } }

function resizeCanvas() { 
  const ratio = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect(); canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.imageSmoothingEnabled = false; state.fire.x = rect.width * 0.5;
  state.fire.y = rect.height * 0.5 + 40; state.tent.x = state.fire.x; state.tent.y = state.fire.y - 85; 
  state.pond.x = 0; state.pond.y = rect.height; state.pond.r = rect.width * 0.35; // Ekranın %35'i kadar büyür, merkeze asla ulaşmaz!
  if (state.trees.length === 0) generateTrees();
}

function dist(a, b) { let d = Math.hypot(a.x - b.x, a.y - b.y); return isNaN(d) ? 9999 : d; }

function isPointInPond(px, py) {
  return dist({x: px, y: py}, {x: state.pond.x, y: state.pond.y}) < state.pond.r;
}

function randomWood() { const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
const isGold = Math.random() < 0.15; for (let i = 0; i < 20; i += 1) { const wood = { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 10, angle: Math.random() * Math.PI * 2, isGolden: isGold };
if (dist(wood, state.fire) > state.fire.r + 60 && dist(wood, state.player) > state.player.r + 30 && !isPointInPond(wood.x, wood.y)) return wood;
} return { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 10, angle: Math.random() * Math.PI * 2, isGolden: isGold };
}

function randomMushroom() { const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
for (let i = 0; i < 20; i += 1) { const mushroom = { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 8 };
if (dist(mushroom, state.fire) > state.fire.r + 80 && dist(mushroom, state.player) > state.player.r + 30 && !isPointInPond(mushroom.x, mushroom.y)) return mushroom;
} return { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 8 };
}

function randomApple() { 
  const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
  for (let i = 0; i < 20; i += 1) { 
      const apple = { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 6 };
      if (dist(apple, state.fire) > state.fire.r + 80 && dist(apple, state.player) > state.player.r + 30 && !isPointInPond(apple.x, apple.y)) return apple;
  } 
  return { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), r: 6 };
}

function seedWoods() { state.woods = []; state.pendingWoodRespawns = 0; state.woodRespawnTimer = 0;
for (let i = 0; i < state.targetWoodCount; i += 1) state.woods.push(randomWood()); state.mushrooms = []; state.pendingMushroomRespawns = 0;
state.mushroomRespawnTimer = 0; for (let i = 0; i < state.targetMushroomCount; i += 1) state.mushrooms.push(randomMushroom()); state.apples = [];
for (let i = 0; i < 3; i += 1) state.apples.push(randomApple());}

function isNight() { return (state.dayNightTimer % CYCLE_SECONDS) >= DAY_SECONDS; }

function updateHud() {
  const fireBar = document.getElementById("fireBar"); if (fireBar) fireBar.style.width = Math.max(0, state.fire.level) + "%";
  const hBar = document.getElementById("healthBar");
  if (hBar) hBar.style.width = Math.max(0, state.health) + "%";
  const wWrap = document.getElementById("woodIconsWrapper");
  if (wWrap) { const icons = wWrap.querySelectorAll(".wood-icon");
  icons.forEach((icon, index) => { if (index < state.bagWood) icon.classList.add("active"); else icon.classList.remove("active"); }); }
  const sIcon = document.querySelector(".sun-icon");
  const mIcon = document.querySelector(".moon-icon:not(.blood-moon-icon)"); const bmIcon = document.querySelector(".blood-moon-icon");
  if (sIcon && mIcon && bmIcon) { 
      if (isNight()) { sIcon.style.opacity = 0;
      if (state.currentDay % 4 === 0) { mIcon.style.opacity = 0; bmIcon.style.opacity = 1; } else { mIcon.style.opacity = 1;
      bmIcon.style.opacity = 0; } } else { sIcon.style.opacity = 1; mIcon.style.opacity = 0; bmIcon.style.opacity = 0;
      } 
  }
  const scoreEl = document.getElementById("scoreText"); if (scoreEl) scoreEl.textContent = String(Math.floor(state.score));
  const dayEl = document.getElementById("dayText");
  if (dayEl) dayEl.textContent = state.currentDay;
  const goldEl = document.getElementById("goldenWoodText"); if (goldEl) goldEl.textContent = state.sessionGoldenWood;
  
  const tMenu = document.getElementById("tentMenu");
  if (tMenu) {
      if (dist(state.player, state.tent) < state.tent.r + 40) {
          tMenu.classList.remove("hidden-fade");
          tMenu.innerHTML = `
              <div class="tent-item" onpointerdown="equipFood('apple')">🍎 ${state.inventory.apple}</div>
              <div class="tent-item" onpointerdown="equipFood('mushroom')">🍄 ${state.inventory.mushroom}</div>
              <div class="tent-item" onpointerdown="equipFood('fish')">🐟 ${state.inventory.fish}</div>
              ${state.inventory.cooked_mushroom > 0 ?
              `<div class="tent-item" onpointerdown="equipFood('cooked_mushroom')">🥘 ${state.inventory.cooked_mushroom}</div>` : ""}
              ${state.inventory.cooked_fish > 0 ?
              `<div class="tent-item" onpointerdown="equipFood('cooked_fish')">🍣 ${state.inventory.cooked_fish}</div>` : ""}
          `;
      } else {
          tMenu.classList.add("hidden-fade");
      }
  }

  const mBtn = document.getElementById("mobileActionBtn");
  if (mBtn) {
      if (state.equippedFood && state.equippedFood !== "fish") { 
          mBtn.innerHTML = "EAT";
          mBtn.style.color = "#4ade80"; 
      } else {
          mBtn.innerHTML = "FEED FIRE";
          mBtn.style.color = "#fff"; 
      }
  }
}

function clampPlayer() { const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
const half = getPlayerDrawSize() * 0.5; state.player.x = Math.min(w - half, Math.max(half, state.player.x || half));
state.player.y = Math.min(h - half, Math.max(half, state.player.y || half)); }

function collectItems() {
  let wCollected = 0;
  let goldenCollected = 0;
  state.woods = state.woods.filter((wood) => { if (dist(state.player, wood) <= state.player.r + wood.r) { if (wood.isGolden) goldenCollected++; else wCollected++; playSound(sounds.wood); return false; } return true; });
  let totalWood = wCollected + (goldenCollected * 5);
  if (totalWood > 0) { const spaceLeft = state.maxWood - state.bagWood;
  const actualCollected = Math.min(totalWood, spaceLeft); state.bagWood += actualCollected; state.score += (wCollected * 5) + (goldenCollected * 50);
  state.pendingWoodRespawns += (wCollected + goldenCollected); if (goldenCollected > 0) { state.sessionGoldenWood += goldenCollected;
  state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: "GOLDEN WOOD!", life: 1.5, color: "#ffd700" });
  } }
  
  state.mushrooms = state.mushrooms.filter((m) => { 
      if (dist(state.player, m) <= state.player.r + m.r) { 
          state.inventory.mushroom++; 
          playSound(sounds.wood); 
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 20, text: "+1 🍄", life: 1.5, color: "#ff4a4a" }); 
          state.pendingMushroomRespawns++;
          return false; 
      } 
      return true; 
  });
  state.apples = state.apples.filter((a) => { 
      if (dist(state.player, a) <= state.player.r + a.r) { 
          state.inventory.apple++; 
          playSound(sounds.wood); 
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 20, text: "+1 🍎", life: 1.5, color: "#ff3333" }); 
          return false; 
      } 
      return true; 
  });
  if (state.blueMushroom && dist(state.player, state.blueMushroom) <= state.player.r + state.blueMushroom.r) { 
      state.superModeTimer = 8.0; playSound(sounds.feed);
      state.score += 100; 
      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "SUPER!", life: 2.0, color: "#00ffff" }); 
      state.blueMushroom = null;
      state.blueMushroomTimer = 40 + Math.random() * 40; 
  }  
}

function spawnSmoke(x, y, count) { for (let i = 0; i < count; i++) { state.smokeParticles.push({ x: x + (Math.random() * 20 - 10), y: y + (Math.random() * 10 - 5), vx: (Math.random() * 15 - 7.5), vy: -(15 + Math.random() * 25), life: 1.0, decay: 0.4 + Math.random() * 0.6, r: 8 + Math.random() * 12 });
} }
function updateSmoke(dt) { for (let i = state.smokeParticles.length - 1; i >= 0; i--) { let p = state.smokeParticles[i];
p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt; p.r += dt * 15;
if (p.life <= 0) { state.smokeParticles.splice(i, 1); } } }
function spawnSparks(x, y, count) { for (let i = 0; i < count; i++) { state.sparks.push({ x: x + (Math.random() * 20 - 10), y: y + (Math.random() * 10 - 5), vx: (Math.random() * 30 - 15), vy: -(30 + Math.random() * 50), life: 1.0, decay: 0.8 + Math.random() * 0.7, r: 1.5 + Math.random() * 2 });
} }
function updateSparks(dt) { for (let i = state.sparks.length - 1; i >= 0; i--) { let p = state.sparks[i];
p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
if (p.life <= 0) { state.sparks.splice(i, 1); } } }
function updateFloatingTexts(dt) { for (let i = state.floatingTexts.length - 1; i >= 0; i--) { let ft = state.floatingTexts[i];
ft.y -= dt * 30; ft.life -= dt; if (ft.life <= 0) { state.floatingTexts.splice(i, 1);
} } }
function updateWind(dt) { for (let i = state.windParticles.length - 1; i >= 0; i--) { let wp = state.windParticles[i];
wp.x -= wp.speed * dt; if (wp.x < -150) { state.windParticles.splice(i, 1);
} } }

function feedFire() {
  if (state.gameOver) return;

  if (state.equippedFood && state.equippedFood !== "fish") {
      if (state.equippedFood === "apple") {
          state.health = Math.min(100, state.health + 10);
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+10 HP", life: 1.5, color: "#4ade80" });
      } else if (state.equippedFood === "mushroom") {
          state.health = Math.min(100, state.health + 20);
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+20 HP", life: 1.5, color: "#4ade80" });
      } else if (state.equippedFood === "cooked_mushroom") {
          state.health = Math.min(100, state.health + 40);
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+40 HP", life: 1.5, color: "#4ade80" });
      } else if (state.equippedFood === "cooked_fish") {
          state.health = Math.min(100, state.health + 80);
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+80 HP", life: 1.5, color: "#4ade80" });
      }
      
      state.equippedCount--;
      if (state.equippedCount <= 0) {
          state.equippedFood = null;
          state.equippedCount = 0;
      }
      playSound(sounds.feed); updateHud();
      return; 
  }

  const inRange = dist(state.player, state.fire) < state.player.r + state.fire.r + 20;
  if (!inRange || state.bagWood <= 0) {
      if (state.equippedFood === "fish") {
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "NEEDS COOKING!", life: 1.5, color: "#ff4a4a" });
      }
      return;
  }
  
  if (state.fire.level <= 0) { spawnSmoke(state.fire.x, state.fire.y, 12);
  }
  if (state.fire.level < 15 && state.fire.level > 0) { state.score += 50;
  state.floatingTexts.push({ x: state.fire.x, y: state.fire.y - 40, text: "CLOSE CALL! +50", life: 2.0, color: "#ffd700" });
  }
  spawnSparks(state.fire.x, state.fire.y, 15);
  state.bagWood -= 1; state.fire.level = Math.min(100, state.fire.level + 18); state.score += 10;
  playSound(sounds.feed); updateHud();
}

function nightBlend() { const cyclePos = state.dayNightTimer % CYCLE_SECONDS; const edge = 8;
if (cyclePos < DAY_SECONDS - edge) return 0; if (cyclePos < DAY_SECONDS) return (cyclePos - (DAY_SECONDS - edge)) / edge;
if (cyclePos < DAY_SECONDS + edge) return 1; if (cyclePos < CYCLE_SECONDS - edge) return 1;
return 1 - (cyclePos - (CYCLE_SECONDS - edge)) / edge; }

function updatePet(dt) {
  if (state.gameOver) return;
  const dToPlayer = dist(state.pet, state.player); const dToTent = dist(state.pet, state.tent); const night = isNight();
  let isJustFollowingPlayer = false;
  if (night) {
    state.pet.isFetching = false; state.pet.hasWood = false;
    if (currentPetTier === 0) {
      if (dToTent < 150) { state.pet.targetX = state.tent.x + 45;
      state.pet.targetY = state.tent.y + 40; state.pet.isSleeping = dist(state.pet, {x: state.pet.targetX, y: state.pet.targetY}) < 5; state.pet.isSitting = state.pet.isSleeping;
      } else { state.pet.targetX = state.tent.x + 45; state.pet.targetY = state.tent.y + 40; state.pet.isSleeping = false; state.pet.isSitting = false;
      }
    } else {
      state.pet.isSleeping = false;
      if (dToPlayer > 50) { state.pet.targetX = state.player.x + 15; state.pet.targetY = state.player.y + 15; state.pet.isSitting = false;
      isJustFollowingPlayer = true; } else { state.pet.isSitting = true; }
      let cooldownMultiplier = state.bloodMoonActive ?
      0.5 : 1.0;
      if (!state.pet.barkCooldown) state.pet.barkCooldown = 0;
      if (state.pet.barkCooldown > 0) state.pet.barkCooldown -= dt;
      if (state.pet.barkCooldown <= 0 && state.enemies.length > 0) {
          let closeEnemy = state.enemies.find(e => dist(state.pet, e) < 160);
          if (closeEnemy) { state.floatingTexts.push({ x: state.pet.x, y: state.pet.y - 25, text: "WOOF! WOOF!", life: 1.2, color: "#ffd700" }); playSound(sounds.wood);
          state.pet.barkCooldown = 4.0 * cooldownMultiplier; }
      }
      if (currentPetTier === 2) {
          if (!state.pet.attackCooldown) state.pet.attackCooldown = 0;
          if (state.pet.attackCooldown > 0) state.pet.attackCooldown -= dt;
          if (state.pet.attackCooldown <= 0) {
              let attackTarget = state.enemies.find(e => dist(state.pet, e) < 65);
              if (attackTarget && (!attackTarget.stunTimer || attackTarget.stunTimer <= 0)) {
                  attackTarget.stunTimer = 1.5;
                  state.floatingTexts.push({ x: attackTarget.x, y: attackTarget.y - 20, text: "STUNNED!", life: 1.5, color: "#ff4a4a" }); state.pet.attackCooldown = 10.0 * cooldownMultiplier;
                  state.pet.x = attackTarget.x; state.pet.y = attackTarget.y;
              }
          }
      }
    }
  } else {
    state.pet.isSleeping = false;
    if (!state.pet.isFetching && !state.pet.hasWood) { state.pet.fetchTimer -= dt; if (state.pet.fetchTimer <= 0) { state.pet.isFetching = true;
    state.pet.targetX = 50 + Math.random() * ((canvas.clientWidth || 800) - 100);
    state.pet.targetY = 50 + Math.random() * ((canvas.clientHeight || 600) - 100);
    } }
    if (state.pet.isFetching && !state.pet.hasWood) { state.pet.isSitting = false;
    if (dist(state.pet, {x: state.pet.targetX, y: state.pet.targetY}) < 15) { state.pet.hasWood = true; state.pet.isFetching = false;
    } } else if (state.pet.hasWood) { state.pet.targetX = state.player.x; state.pet.targetY = state.player.y; state.pet.isSitting = false;
    if (dToPlayer < 40) { if (state.bagWood < state.maxWood) { state.bagWood++; state.score += 5; playSound(sounds.wood);
    state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+1 WOOD", life: 1.5, color: "#d2b48c" }); updateHud(); } state.pet.hasWood = false;
    state.pet.fetchTimer = 20 + Math.random() * 20; } } else { if (dToPlayer > 50) { state.pet.targetX = state.player.x;
    state.pet.targetY = state.player.y; state.pet.isSitting = false; isJustFollowingPlayer = true; } else if (dToPlayer < 40) { state.pet.isSitting = true;
    } }
  }
  
  if (!state.pet.isSitting) { let dx = state.pet.targetX - state.pet.x;
  let dy = state.pet.targetY - state.pet.y; let angle = Math.atan2(dy, dx) || 0; state.pet.angle = angle;
  let actualSpeed = isJustFollowingPlayer ? state.player.speed : state.pet.speed; let moveDist = actualSpeed * dt;
  if (dist(state.pet, {x: state.pet.targetX, y: state.pet.targetY}) > moveDist) { state.pet.x += (Math.cos(angle) * moveDist) || 0;
  state.pet.y += (Math.sin(angle) * moveDist) || 0; } }
}

function updateRaccoons(dt) {
  if (state.gameOver) return;
  if (!isNight()) { state.raccoonSpawnTimer -= dt; if (state.raccoonSpawnTimer <= 0 && state.raccoons.length < 1) { const angle = Math.random() * Math.PI * 2;
  const spawnDist = Math.max(canvas.clientWidth || 800, canvas.clientHeight || 600) / 2 + 50;
  state.raccoons.push({ x: state.player.x + Math.cos(angle) * spawnDist, y: state.player.y + Math.sin(angle) * spawnDist, speed: 130 + Math.random() * 20, r: 12, hasWood: false, fleeAngle: null, wobble: 0 });
  state.raccoonSpawnTimer = 15 + Math.random() * 15; } }
  for (let i = state.raccoons.length - 1; i >= 0; i--) { let rac = state.raccoons[i];
  rac.wobble += dt * 15; let flee = false; if (isNight() || dist(rac, state.player) < 70 || rac.hasWood) { flee = true;
  } if (flee) { if (rac.fleeAngle === null) { rac.fleeAngle = Math.atan2(rac.y - state.player.y, rac.x - state.player.x);
  if (isNaN(rac.fleeAngle)) rac.fleeAngle = 0; } rac.x += Math.cos(rac.fleeAngle) * rac.speed * dt; rac.y += Math.sin(rac.fleeAngle) * rac.speed * dt;
  if (dist(rac, state.player) > 1000) { state.raccoons.splice(i, 1); } } else { if (state.woods.length > 0) { let nearestWood = null;
  let minDist = Infinity; state.woods.forEach(w => { let d = dist(rac, w); if (d < minDist) { minDist = d; nearestWood = w; } });
  if (nearestWood) { let angle = Math.atan2(nearestWood.y - rac.y, nearestWood.x - rac.x); if (isNaN(angle)) angle = 0;
  rac.x += Math.cos(angle) * rac.speed * dt; rac.y += Math.sin(angle) * rac.speed * dt + Math.sin(rac.wobble) * 2;
  rac.fleeAngle = null; if (dist(rac, nearestWood) < rac.r + nearestWood.r) { state.woods = state.woods.filter(w => w !== nearestWood); state.pendingWoodRespawns++;
  rac.hasWood = true; state.floatingTexts.push({ x: rac.x, y: rac.y - 20, text: "STOLEN!", life: 1.5, color: "#ff9900" });
  } } } else { rac.x += Math.cos(rac.wobble * 0.1) * rac.speed * 0.3 * dt;
  rac.y += Math.sin(rac.wobble * 0.1) * rac.speed * 0.3 * dt;
  } } }
}

function updateRespawns(dt) {
  if (state.pendingWoodRespawns > 0) { state.woodRespawnTimer -= dt; if (state.woodRespawnTimer <= 0) { state.woods.push(randomWood());
  state.pendingWoodRespawns -= 1; state.woodRespawnTimer = 4 + Math.random() * 3;
  } }
  if (state.rainDuration > 0 && Math.random() < dt * 0.5 && (state.mushrooms.length + state.pendingMushroomRespawns) < 4) { state.pendingMushroomRespawns++;
  }
  if (state.pendingMushroomRespawns > 0) { if (state.rainDuration > 0) { state.mushroomRespawnTimer -= dt * 10;
  } else { state.mushroomRespawnTimer -= dt; } if (state.mushroomRespawnTimer <= 0) { state.mushrooms.push(randomMushroom()); state.pendingMushroomRespawns -= 1;
  state.mushroomRespawnTimer = 40 + Math.random() * 20; } }
  if (!state.blueMushroom) { state.blueMushroomTimer -= dt;
  if (state.blueMushroomTimer <= 0) { state.blueMushroom = randomMushroom(); } }
}

function updateRain(dt) {
  if (state.windDuration > 0) return;
  if (state.rainDuration > 0) { state.rainDuration -= dt; if (Math.random() < 40 * dt) { state.rainDrops.push({ x: Math.random() * (canvas.clientWidth || 800), y: -10, length: 15 + Math.random() * 10, speed: 600 + Math.random() * 200 });
  } if (state.rainDuration <= 0) state.rainTimer = 60 + Math.random() * 60; } else { state.rainTimer -= dt;
  if (state.rainTimer <= 0) state.rainDuration = 10 + Math.random() * 10;
  }
  for (let i = state.rainDrops.length - 1; i >= 0; i--) { let drop = state.rainDrops[i];
  drop.y += drop.speed * dt; drop.x -= (drop.speed * 0.1) * dt;
  if (drop.y > (canvas.clientHeight || 600)) { state.rainDrops.splice(i, 1); } }
}

function updateWalkAnimation(dt, isMoving) {
  const frameW = spriteFrames.walk.w;
  const availableCols = Math.max(1, Math.floor((walkIdleSprite.naturalWidth || frameW) / frameW)); const walkCols = Math.min(WALK_MAX_FRAMES, Math.max(1, availableCols - WALK_START_COL));
  if (!isMoving) { anim.walkFrame = 0; anim.walkTimer = 0; return; }
  anim.walkTimer += dt;
  const frameDuration = 1 / WALK_FPS; while (anim.walkTimer >= frameDuration) { anim.walkTimer -= frameDuration;
  anim.walkFrame = (anim.walkFrame + 1) % walkCols; }
}

function updateDeathAnimation(dt) {
  if (state.deathAnimDone) return;
  anim.deathTimer += dt;
  const frameDuration = 1 / DEATH_FPS;
  while (anim.deathTimer >= frameDuration && !state.deathAnimDone) { anim.deathTimer -= frameDuration; anim.deathFrame += 1;
  if (anim.deathFrame >= deathClip.frameCount - 1) { anim.deathFrame = Math.max(0, deathClip.frameCount - 1); state.deathAnimDone = true;
  } }
}

function updateFireAnimation(dt) {
  if (state.fire.level <= 0) { state.fire.currentFrame = 0; state.fire.animationTimer = 0; fireAnim.frameTimer = 0; return;
  }
  const firePower = Math.max(0, Math.min(1, state.fire.level / 100)); const fps = FIRE_FPS_MIN + (FIRE_FPS_MAX - FIRE_FPS_MIN) * firePower;
  fireAnim.frameTimer += dt; state.fire.animationTimer += dt * fps;
  while (fireAnim.frameTimer >= (1 / fps)) { fireAnim.frameTimer -= (1 / fps);
  state.fire.currentFrame = Math.floor(state.fire.animationTimer % fireAnim.frameCount); }
}

function dirToRow(dir) { if (dir === "up") return 3; if (dir === "left") return 1;
  if (dir === "right") return 2; return 0; }

function update(dt) {
  if (state.status === "MENU" || state.status === "PAUSED") { updateFireAnimation(dt);
  return; }
  if (state.gameOver) { updateDeathAnimation(dt); return; }
  
  state.dayNightTimer += dt;
  let calcDay = Math.floor(state.dayNightTimer / CYCLE_SECONDS) + 1;
  if (calcDay > state.currentDay) { 
      state.currentDay = calcDay;
      state.dayMessageTimer = 3.0;
  }

  if (isNight() && state.currentDay % 4 === 0) {
      if (!state.bloodMoonActive) {
          state.bloodMoonActive = true;
          state.bloodMoonMessageTimer = 3.0;
          playSound(sounds.howl);
          state.bloodMoonHowlTimer = 15 + Math.random() * 10;
      }
  } else {
      if (state.bloodMoonActive) {
          state.bloodMoonActive = false;
          state.survivedBloodMoonMessageTimer = 4.0;
          let currentBank = parseInt(localStorage.getItem("campfireGoldenWood") || "0");
          currentBank += 100;
          localStorage.setItem("campfireGoldenWood", currentBank);
          state.sessionGoldenWood += 100;
          playSound(sounds.wood);
      }
  }

  if (state.bloodMoonActive) {
      state.bloodMoonHowlTimer -= dt;
      if (state.bloodMoonHowlTimer <= 0) {
          playSound(sounds.howl);
          state.bloodMoonHowlTimer = 15 + Math.random() * 10;
      }
  }

  if (state.dayMessageTimer > 0) state.dayMessageTimer -= dt;
  if (state.bloodMoonMessageTimer > 0) state.bloodMoonMessageTimer -= dt;
  if (state.survivedBloodMoonMessageTimer > 0) state.survivedBloodMoonMessageTimer -= dt;
  const moveX = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const moveY = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
  const len = Math.hypot(moveX, moveY) ||
  1;
  const isMoving = moveX !== 0 || moveY !== 0;
  if (state.superModeTimer > 0) { 
      state.superModeTimer -= dt;
      state.player.speed = 260;
      if (isMoving && Math.random() < 0.4) { 
          state.playerTrails.push({ x: state.player.x, y: state.player.y, life: 0.3 });
      } 
  } else { 
      state.player.speed = 170;
  }
  
  for (let i = state.playerTrails.length - 1; i >= 0; i--) { 
      state.playerTrails[i].life -= dt;
      if (state.playerTrails[i].life <= 0) state.playerTrails.splice(i, 1); 
  }
  
  if (isMoving) { 
      if (Math.abs(moveX) > Math.abs(moveY)) state.player.dir = moveX > 0 ?
  "right" : "left"; else state.player.dir = moveY > 0 ? "down" : "up";
  }
  
  state.player.x += ((moveX / len) * state.player.speed * dt) || 0;
  state.player.y += ((moveY / len) * state.player.speed * dt) || 0;
  clampPlayer();
  let dPond = dist(state.player, state.pond);
  
  // GÖLET ÇARPIŞMASI: Karakter suya giremez, görünmez bir duvar iter
  if (dPond < state.pond.r + state.player.r - 5) {
      let angle = Math.atan2(state.player.y - state.pond.y, state.player.x - state.pond.x);
      state.player.x = state.pond.x + Math.cos(angle) * (state.pond.r + state.player.r - 5);
      state.player.y = state.pond.y + Math.sin(angle) * (state.pond.r + state.player.r - 5);
      dPond = state.pond.r + state.player.r - 5; // Balık tutma hesabı için mesafeyi sıfırla
  }

  // KIYIDA BALIK TUTMA: Göletin sınırındaysa (Kenardayken)
  if (dPond <= state.pond.r + state.player.r + 15 && !isMoving) {
      state.pond.fishProgress += dt;
      if (state.pond.fishProgress >= 4.0) {
          state.inventory.fish++;
          state.pond.fishProgress = 0;
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+1 🐟", life: 1.5, color: "#4ea9ff" });
      }
  } else { state.pond.fishProgress = 0; }

  if (!state.cookTimer) state.cookTimer = 0;
  let dFire = dist(state.player, state.fire);
  let nearFire = dFire < state.fire.r + 40 && state.fire.level > 0;
  if (nearFire && (state.equippedFood === "mushroom" || state.equippedFood === "fish")) {
      state.cookTimer += dt;
      let reqTime = state.equippedFood === "fish" ? 3.0 : 2.0;
      if (state.cookTimer >= reqTime) {
          state.equippedFood = state.equippedFood === "fish" ?
  "cooked_fish" : "cooked_mushroom";
          state.cookTimer = 0;
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "COOKED!", life: 1.5, color: "#ff9900" });
      }
  } else { state.cookTimer = 0; }

  let dTent = dist(state.player, state.tent);
  if (dTent < state.player.r + state.tent.r - 10) { 
      let angle = Math.atan2(state.player.y - state.tent.y, state.player.x - state.tent.x);
      state.player.x = state.tent.x + Math.cos(angle) * (state.player.r + state.tent.r - 10);
      state.player.y = state.tent.y + Math.sin(angle) * (state.player.r + state.tent.r - 10);
  }
  
  let fireColRadius = state.fire.r - 8;
  if (dFire < state.player.r + fireColRadius) { 
      let angle = Math.atan2(state.player.y - state.fire.y, state.player.x - state.fire.x);
      state.player.x = state.fire.x + Math.cos(angle) * (state.player.r + fireColRadius); 
      state.player.y = state.fire.y + Math.sin(angle) * (state.player.r + fireColRadius);
  }

  if (state.rainDuration <= 0) { 
      if (state.windDuration > 0) { 
          state.windDuration -= dt;
          if (Math.random() < 12 * dt) { 
              state.windParticles.push({ x: (canvas.clientWidth || 800) + 50, y: Math.random() * (canvas.clientHeight || 600), length: 40 + Math.random() * 60, speed: 500 + Math.random() * 300 });
          } 
          if (state.windDuration <= 0) state.windTimer = 40 + Math.random() * 40;
  } else { 
          state.windTimer -= dt;
          if (state.windTimer <= 0) state.windDuration = 10 + Math.random() * 10; 
      } 
  }

  let windDrainMultiplier = 2.0;
  let rainDrainMultiplier = 2.5; 
  if (currentFireShieldTier >= 1) windDrainMultiplier = 1.3; 
  if (currentFireShieldTier >= 2) rainDrainMultiplier = 1.5;
  if (currentFireShieldTier >= 3) { windDrainMultiplier = 1.0; rainDrainMultiplier = 1.0; } 

  const fireWasAlive = state.fire.level > 0;
  let fireDrainRate = isNight() ? (1.6 * 1.5) : 1.6;
  if (state.windDuration > 0) fireDrainRate *= windDrainMultiplier;
  if (state.rainDuration > 0) fireDrainRate *= rainDrainMultiplier; 
  
  state.fire.level -= dt * fireDrainRate;
  if (state.fire.level <= 0) { 
      state.fire.level = 0;
      if (fireWasAlive) { spawnSmoke(state.fire.x, state.fire.y, 15);
  } 
  }
  
  updatePet(dt); updateRaccoons(dt); updateSmoke(dt); updateSparks(dt); updateFloatingTexts(dt); updateWind(dt); updateRain(dt); updateFireAnimation(dt);
  
  state.health -= dt * 0.3;
  if (isMoving) state.health -= dt * 1.2; 
  if (isNight() && state.fire.level <= 0) state.health -= dt * 14;
  if (isNight()) {
      let bmMultiplier = state.bloodMoonActive ? 2 : 1;
  const maxEnemies = (3 + Math.floor(state.score / 50)) * bmMultiplier;
  if (state.enemies.length < maxEnemies && Math.random() < dt * 0.5) {
          const angle = Math.random() * Math.PI * 2;
  const spawnDist = Math.max(canvas.clientWidth || 800, canvas.clientHeight || 600) / 2 + 100;
          let speedMult = state.bloodMoonActive ?
  1.3 : 1.0;
          let finalSpeed = (55 + Math.random() * 25) * speedMult;
  state.enemies.push({
              x: state.player.x + Math.cos(angle) * spawnDist,
              y: state.player.y + Math.sin(angle) * spawnDist,
              speed: finalSpeed,
              baseSpeed: finalSpeed,
              wobble: Math.random() * Math.PI * 2,
             
   type: "normal",
              r: 14
          });
  }
      
      if (state.bloodMoonActive) {
          if (!state.fireEaterSpawnTimer) {
              state.fireEaterSpawnTimer = 10 + Math.random() * 10;
  }
          state.fireEaterSpawnTimer -= dt;
  let activeEaters = state.enemies.filter(e => e.type === "fire_eater").length;
          
          if (state.fireEaterSpawnTimer <= 0 && activeEaters < 1) { 
              const angle = Math.random() * Math.PI * 2;
  const spawnDist = Math.max(canvas.clientWidth || 800, canvas.clientHeight || 600) / 2 + 150;
  state.enemies.push({
                  x: state.fire.x + Math.cos(angle) * spawnDist,
                  y: state.fire.y + Math.sin(angle) * spawnDist,
                  speed: 30,
                  baseSpeed: 30,
                
    wobble: 0,
                  type: "fire_eater",
                  r: 24
              });
  state.fireEaterSpawnTimer = 25 + Math.random() * 15;
          }
      }
  } else {
      state.enemies = [];
  }

  for (let i = state.enemies.length - 1; i >= 0; i--) {
      let enemy = state.enemies[i];
  if (!enemy.stunTimer) {
          enemy.stunTimer = 0;
  }
      if (enemy.stunTimer > 0) {
          enemy.stunTimer -= dt;
  continue;
      }
      
      if (enemy.type === "fire_eater") {
          let dx = state.fire.x - enemy.x;
  let dy = state.fire.y - enemy.y;
          let fDist = Math.hypot(dx, dy);
  if (fDist > 0) {
              dx /= fDist;
  dy /= fDist;
          }
          
          if (state.superModeTimer > 0 && dist(enemy, state.player) < 150) {
              dx = -(state.player.x - enemy.x);
  dy = -(state.player.y - enemy.y);
          } 
          
          enemy.x += dx * enemy.speed * dt;
  enemy.y += dy * enemy.speed * dt;
          
          if (fDist < state.fire.r + enemy.r && state.fire.level > 0) {
              state.fire.level = Math.max(0, state.fire.level - 40);
  state.floatingTexts.push({
                  x: state.fire.x,
                  y: state.fire.y - 40,
                  text: "FIRE DRAINED!",
                  life: 2.0,
                  color: "#9c27b0"
  
              });
              spawnSmoke(state.fire.x, state.fire.y, 25);
              state.enemies.splice(i, 1);
              continue;
  }
      } else {
          enemy.wobble += dt * 4;
  let dx = state.player.x - enemy.x + Math.cos(enemy.wobble) * 20;
          let dy = state.player.y - enemy.y + Math.sin(enemy.wobble) * 20;
  let pDist = Math.hypot(dx, dy);
          
          if (pDist > 0) {
              dx /= pDist;
  dy /= pDist;
          }
          
          if (state.superModeTimer > 0) {
              dx = -dx;
  dy = -dy;
              enemy.speed = 90;
          } else {
              enemy.speed = enemy.baseSpeed;
  }
          
          let nextX = enemy.x + dx * enemy.speed * dt;
  let nextY = enemy.y + dy * enemy.speed * dt;
          let eTentDist = dist({ x: nextX, y: nextY }, state.tent);
  if (eTentDist < 14 + state.tent.r) {
              let tAngle = Math.atan2(enemy.y - state.tent.y, enemy.x - state.tent.x);
  nextX = state.tent.x + Math.cos(tAngle) * (14 + state.tent.r);
              nextY = state.tent.y + Math.sin(tAngle) * (14 + state.tent.r);
  }
          
          let fDist = dist({ x: nextX, y: nextY }, state.fire);
  const safeRadius = (state.fire.level / 100 * 180) + 30;
  if (fDist < safeRadius && state.fire.level > 0) {
              let fAngle = Math.atan2(enemy.y - state.fire.y, enemy.x - state.fire.x);
  nextX = state.fire.x + Math.cos(fAngle) * safeRadius;
              nextY = state.fire.y + Math.sin(fAngle) * safeRadius;
  }
          
          enemy.x = nextX;
  enemy.y = nextY;
      }

      let colRadius = enemy.type === "fire_eater" ? 28 : 20;
  if (dist(enemy, state.player) < colRadius) {
          if (state.superModeTimer > 0) {
              state.score += (enemy.type === "fire_eater" ? 150 : 50);
  state.floatingTexts.push({
                  x: enemy.x,
                  y: enemy.y - 10,
                  text: (enemy.type === "fire_eater" ? "+150" : "+50"),
                  life: 1.5,
                
    color: "#ffd700"
              });
  spawnSparks(enemy.x, enemy.y, 15);
              state.enemies.splice(i, 1);
          } else {
              if (enemy.type === "fire_eater") {
                  state.health -= 40;
  state.floatingTexts.push({
                      x: state.player.x,
                      y: state.player.y - 30,
                      text: "DEFENDED!",
                      life: 1.5,
      
                  color: "#4ea9ff"
                  });
  spawnSmoke(enemy.x, enemy.y, 10);
                  state.enemies.splice(i, 1);
              } else {
                  state.health -= dt * 25;
  }
              state.damageFlash = 1;
  }
      }
  }

  if (state.damageFlash > 0) { state.damageFlash -= dt * 2.5;
  if (state.damageFlash < 0) state.damageFlash = 0; }
  
  if (state.health <= 0) {
    state.health = 0;
  if (!state.gameOver) {
      state.gameOver = true; state.deathAnimDone = false; anim.deathFrame = 0; anim.deathTimer = 0;
  state.bloodMoonActive = false; controls.up = controls.down = controls.left = controls.right = false; stopAudio();
      if (dieSprite.complete) configureDeathClip();
      
      let currentBank = 0;
  try { 
          if (state.score > (localStorage.getItem("campfireHighScore") || 0)) localStorage.setItem("campfireHighScore", Math.floor(state.score));
  if (state.currentDay > (localStorage.getItem("campfireHighDay") || 1)) localStorage.setItem("campfireHighDay", state.currentDay); 
          
          currentBank = parseInt(localStorage.getItem("campfireGoldenWood") || "0");
          currentBank += state.sessionGoldenWood;
          localStorage.setItem("campfireGoldenWood", currentBank);
  } catch(e) {}
      
      setTimeout(() => { 
          const goUI = document.getElementById("gameOverUI"); 
          if(goUI) { 
              document.getElementById("finalScoreText").innerHTML = `Score: ${Math.floor(state.score)} <br> Day: ${state.currentDay} <br><br> <span style="color:#ffd700; font-size:18px; text-shadow: 0 0 5px rgba(255,215,0,0.5);">+${state.sessionGoldenWood} Golden Wood Earned!</span>`; 
              goUI.classList.remove("hidden"); 
         
   }     
      }, 1500);
  }
  }

  if (audioStarted) {
    const d = dist(state.player, state.fire);
  let fireVol = 1 - (d / 350); if (isNaN(fireVol) || fireVol < 0 || state.fire.level <= 0) fireVol = 0;
  if (fireVol > 0 && state.fire.level > 0) {
      if (sounds.fire.paused) sounds.fire.play().catch(()=>{});
  sounds.fire.volume = Math.min(0.8, fireVol);
    } else {
      if (!sounds.fire.paused) sounds.fire.pause();
  }

    if (isNight()) {
      if (state.bloodMoonActive) {
          if (sounds.bloodmoon.paused) sounds.bloodmoon.play().catch(()=>{});
  if (!sounds.night.paused) sounds.night.pause();
          sounds.bloodmoon.volume = 0.6;
      } else {
          if (sounds.night.paused) sounds.night.play().catch(()=>{});
  if (!sounds.bloodmoon.paused) sounds.bloodmoon.pause();
          sounds.night.volume = 0.5;
      }
      if (!sounds.day.paused) sounds.day.pause();
  } else {
      if (sounds.day.paused) sounds.day.play().catch(()=>{});
      if (!sounds.night.paused) sounds.night.pause();
      if (!sounds.bloodmoon.paused) sounds.bloodmoon.pause();
      sounds.day.volume = 0.5;
  }

    if (state.windDuration > 0) {
      if (sounds.wind.paused) sounds.wind.play().catch(()=>{});
      sounds.wind.volume = 0.6;
  } else {
      if (!sounds.wind.paused) sounds.wind.pause();
  }

    if (state.rainDuration > 0) {
      if (sounds.rain.paused) sounds.rain.play().catch(()=>{});
      sounds.rain.volume = 0.5;
  } else {
      if (!sounds.rain.paused) sounds.rain.pause();
    }
  }
  
  updateWalkAnimation(dt, isMoving); collectItems();
  updateRespawns(dt);
  state.score += dt * 1.4;
}

function drawCircle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill(); }

function drawWoodItem(x, y, angle, isGolden = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  if (isGolden) { ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 10; ctx.fillStyle = "#ffcc00"; } else { ctx.fillStyle = "#6d4c31";
  }
  ctx.beginPath(); ctx.arc(-8, 0, 5, Math.PI/2, Math.PI*1.5); ctx.lineTo(8, -5); ctx.arc(8, 0, 5, -Math.PI/2, Math.PI/2); ctx.lineTo(-8, 5); ctx.fill();
  ctx.strokeStyle = isGolden ? "#b8860b" : "#4a3320"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(6, -2); ctx.moveTo(-8, 1); ctx.lineTo(4, 1); ctx.stroke();
  ctx.fillStyle = isGolden ? "#fffacd" : "#c29a6b"; ctx.beginPath(); ctx.ellipse(8, 0, 2.5, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

function drawMushroom(x, y, isSuper = false) {
  ctx.save(); ctx.translate(x, y); if (isSuper) { ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 12;
  }
  ctx.fillStyle = "#e8d8c8"; ctx.fillRect(-2.5, 0, 5, 7); ctx.fillStyle = isSuper ? "#00ffff" : "#d32f2f"; ctx.beginPath();
  ctx.arc(0, 0, 7, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(-3, -3, 1.2, 0, Math.PI*2); ctx.fill(); ctx.beginPath();
  ctx.arc(3, -4, 1.2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -1.5, 1, 0, Math.PI*2); ctx.fill(); ctx.restore();
}

function drawApple(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#ff1a1a"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#4a2e00"; ctx.fillRect(-1, -8, 2, 4);
  ctx.fillStyle = "#2e8b57"; ctx.beginPath(); ctx.ellipse(2, -6, 3, 1.5, Math.PI/4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  }

function drawCampfireBase() { 
  const fx = state.fire.x; const fy = state.fire.y + 15;
  ctx.fillStyle = "rgba(20, 10, 10, 0.7)"; 
  ctx.beginPath();
  ctx.ellipse(fx, fy, 22, 12, 0, 0, Math.PI * 2); 
  ctx.fill();
  if (currentFireShieldTier >= 1) {
      ctx.save();
      ctx.fillStyle = "#6e6e6e";
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
  for(let i = 0; i < 5; i++) {
          let angle = Math.PI + (i * Math.PI/4);
  let sx = fx + Math.cos(angle) * 19;
          let sy = fy + Math.sin(angle) * 10 - 2;
          ctx.beginPath();
  ctx.ellipse(sx, sy, 5, 4, angle, 0, Math.PI * 2);
          ctx.fill(); 
          ctx.stroke();
      }
      ctx.restore();
  }

  drawWoodItem(fx - 12, fy + 2, Math.PI / 6);
  drawWoodItem(fx + 12, fy + 2, -Math.PI / 6);
  drawWoodItem(fx, fy - 4, Math.PI / 2);
}

function drawSmoke() { state.smokeParticles.forEach(p => { ctx.save(); ctx.globalAlpha = Math.max(0, p.life * 0.6); ctx.fillStyle = "#a8b0b8"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
  }
function drawSparks() { 
    state.sparks.forEach(p => { 
        ctx.save(); 
        ctx.globalAlpha = Math.max(0, p.life); 
        ctx.fillStyle = "#ffb300"; 
        ctx.shadowColor = "#ff4500"; 
        ctx.shadowBlur = 6; 
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); 
        ctx.fill(); 
   
       ctx.restore(); 
    });
  }
function drawFloatingTexts() { state.floatingTexts.forEach(ft => { ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, ft.life)); ctx.fillStyle = ft.color || "#ffffff"; ctx.font = "bold 15px Arial"; ctx.textAlign = "center"; ctx.shadowColor = "#000000"; ctx.shadowBlur = 4; ctx.fillText(ft.text, ft.x, ft.y); ctx.restore(); });
  }
function drawPlayerTrails() { state.playerTrails.forEach(t => { ctx.save(); ctx.globalAlpha = Math.max(0, t.life * 2); ctx.fillStyle = "#00ffff"; ctx.beginPath(); ctx.arc(t.x, t.y, state.player.r * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
  }
function drawWind() { if (state.windParticles.length === 0) return; ctx.save(); ctx.strokeStyle = "rgba(200, 220, 255, 0.4)"; ctx.lineWidth = 2; ctx.beginPath();
  state.windParticles.forEach(wp => { ctx.moveTo(wp.x, wp.y); ctx.lineTo(wp.x + wp.length, wp.y); }); ctx.stroke(); ctx.restore();
  }
function drawRain() { if (state.rainDuration <= 0 && state.rainDrops.length === 0) return; ctx.save();
  if (state.rainDuration > 0) { ctx.fillStyle = "rgba(20, 30, 50, 0.25)"; ctx.fillRect(0, 0, canvas.clientWidth || 800, canvas.clientHeight || 600);
  } ctx.strokeStyle = "rgba(150, 180, 255, 0.4)"; ctx.lineWidth = 1.5; ctx.beginPath();
  state.rainDrops.forEach(drop => { ctx.moveTo(drop.x, drop.y); ctx.lineTo(drop.x - (drop.length * 0.1), drop.y + drop.length); }); ctx.stroke(); ctx.restore();
  }

function drawEnvironment() {
  const w = (canvas.clientWidth || 800) + 10; const h = (canvas.clientHeight || 600) + 10;
  ctx.fillStyle = "#1e3d1c"; ctx.fillRect(-5, -5, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let i = 0; i < 80; i++) ctx.fillRect((i * 67) % w, (i * 43) % h, 4, 4);
  ctx.fillStyle = "#3e2723"; ctx.beginPath(); ctx.ellipse(state.fire.x, state.fire.y - 20, 220, 140, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#4a3525"; ctx.beginPath();
  ctx.ellipse(state.fire.x, state.fire.y - 20, 170, 100, 0, 0, Math.PI * 2); ctx.fill();
  state.trees.forEach(tree => { ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.arc(tree.x + 8, tree.y + 8, tree.r, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = tree.color; ctx.beginPath(); ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.arc(tree.x, tree.y, tree.r * 0.5, 0, Math.PI*2); ctx.fill(); });
  // --- YENİ BÜYÜK GÖLET VE SU EFEKTİ ÇİZİMİ ---
  ctx.save();
  const px = state.pond.x; 
  const py = state.pond.y;
  const baseR = state.pond.r; 

  // 1. Katman: Derin Su (Koyu Mavi Taban)
  ctx.fillStyle = "rgba(10, 30, 60, 0.9)"; 
  ctx.beginPath();
  ctx.moveTo(px, py); 
  ctx.arc(px, py, baseR, 0, Math.PI * 2); 
  ctx.fill();
  // 2. Katman: Yüzey Suyu (Biraz daha açık mavi)
  ctx.fillStyle = "rgba(43, 108, 176, 0.6)"; 
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, baseR * 0.98, 0, Math.PI * 2); 
  ctx.fill();
  // 3. Katman: Su Efekti (Hareketli Işık Parıltıları)
  const time = performance.now() * 0.001; 
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 3; i++) {
      const waveOffset = Math.sin(time * 1.5 + i * 2) * 5;
  const r = baseR * 0.9 - i * 40 + waveOffset; 
      if (r <= 0) continue;
      
      ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(150, 220, 255, ${0.15 - i * 0.05})`;
  ctx.stroke();
  }
  ctx.restore();
}

function drawTent() {
  const tx = state.tent.x;
  const ty = state.tent.y;
  ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath();
  ctx.ellipse(tx, ty + 20, 75, 25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1a252f"; ctx.beginPath(); ctx.moveTo(tx, ty - 60);
  ctx.lineTo(tx - 65, ty + 35); ctx.lineTo(tx + 65, ty + 35);
  ctx.fill();
  ctx.fillStyle = "#050505"; ctx.beginPath();
  ctx.moveTo(tx, ty - 25); ctx.lineTo(tx - 30, ty + 35);
  ctx.lineTo(tx + 30, ty + 35); ctx.fill();
  ctx.fillStyle = "#2c3e50";
  ctx.beginPath(); ctx.moveTo(tx, ty - 60);
  ctx.lineTo(tx - 65, ty + 35); ctx.lineTo(tx - 25, ty + 35);
  ctx.lineTo(tx, ty - 25); ctx.fill();
  ctx.fillStyle = "#34495e";
  ctx.beginPath(); ctx.moveTo(tx, ty - 60); ctx.lineTo(tx + 65, ty + 35);
  ctx.lineTo(tx + 25, ty + 35);
  ctx.lineTo(tx, ty - 25); ctx.fill();
  ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(tx - 65, ty + 35);
  ctx.lineTo(tx - 85, ty + 50); ctx.moveTo(tx + 65, ty + 35);
  ctx.lineTo(tx + 85, ty + 50); ctx.stroke();
  ctx.fillStyle = "#95a5a6"; ctx.beginPath(); ctx.arc(tx, ty - 60, 3, 0, Math.PI*2); ctx.fill();
  }

function drawFireLight() {
  const darkFactor = nightBlend();
  if (state.fire.level <= 0) return;
  const lightIntensity = isNight() ?
  0.6 * darkFactor : 0.15;
  const firePower = state.fire.level / 100; const flicker = Math.sin(state.fire.animationTimer * 0.5) * 8;
  const radius = (firePower * 180) + flicker + 30;
  const gradient = ctx.createRadialGradient(state.fire.x, state.fire.y, 5, state.fire.x, state.fire.y, radius);
  gradient.addColorStop(0, `rgba(255, 120, 0, ${lightIntensity})`); gradient.addColorStop(0.3, `rgba(255, 60, 0, ${lightIntensity * 0.5})`); gradient.addColorStop(0.7, `rgba(255, 30, 0, ${lightIntensity * 0.2})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(state.fire.x, state.fire.y, radius, 0, Math.PI * 2);
  ctx.fill(); 
  const tx = state.tent.x; const ty = state.tent.y;
  const tentGrad = ctx.createLinearGradient(tx, ty + 35, tx, ty - 60);
  tentGrad.addColorStop(0, `rgba(255, 130, 0, ${lightIntensity * 1.5})`); tentGrad.addColorStop(1, 'rgba(255, 80, 0, 0)'); 
  ctx.fillStyle = tentGrad; ctx.beginPath(); ctx.moveTo(tx, ty - 60);
  ctx.lineTo(tx - 65, ty + 35); ctx.lineTo(tx - 25, ty + 35); ctx.lineTo(tx, ty - 25); ctx.fill(); ctx.beginPath();
  ctx.moveTo(tx, ty - 60); ctx.lineTo(tx + 65, ty + 35); ctx.lineTo(tx + 25, ty + 35); ctx.lineTo(tx, ty - 25);
  ctx.fill(); ctx.restore();
}

function drawEnemies() { 
  state.enemies.forEach(enemy => { 
      ctx.save(); 
      if (enemy.type === "fire_eater") {
          ctx.fillStyle = "rgba(20, 0, 30, 0.9)";
          ctx.shadowColor = "#9c27b0";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2);
        
    ctx.fill();
          
          let angle = Math.atan2(state.fire.y - enemy.y, state.fire.x - enemy.x);
          let ex = Math.cos(angle) * 10;
          let ey = Math.sin(angle) * 10;
          
          ctx.fillStyle = "#e040fb";
          ctx.shadowColor = "#e040fb";
      
      ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(enemy.x + ex, enemy.y + ey, 6, 0, Math.PI*2);
          ctx.fill();
      } else {
          ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 14, 0, Math.PI * 2);
       
         ctx.fill(); 
          
          ctx.fillStyle = "#ff1a1a";
  ctx.shadowColor = "#ff0000";
          ctx.shadowBlur = 12;
          let angle = Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x);
  let ex = Math.cos(angle) * 5;
          let ey = Math.sin(angle) * 5; 
          
          ctx.beginPath();
  ctx.arc(enemy.x + ex + Math.cos(angle - Math.PI/2)*5, enemy.y + ey + Math.sin(angle - Math.PI/2)*5, 3.5, 0, Math.PI*2);
          ctx.fill(); 
          
          ctx.beginPath();
  ctx.arc(enemy.x + ex + Math.cos(angle + Math.PI/2)*5, enemy.y + ey + Math.sin(angle + Math.PI/2)*5, 3.5, 0, Math.PI*2);
          ctx.fill();
  }
      ctx.restore(); 
  });
}

function drawFireSprite() {
  if (state.fire.level <= 0) return;
  if (!fireSprite.complete || fireAnim.frameCount <= 0) return;
  const cols = 10;
  const totalFrames = 60;
  const frameWidth = fireSprite.width / 10; const frameHeight = fireSprite.height / 6;
  const currentFrame = Math.floor(state.fire.animationTimer % totalFrames);
  const sx = (currentFrame % cols) * frameWidth;
  const sy = Math.floor(currentFrame / cols) * frameHeight;
  ctx.drawImage(fireSprite, sx, sy, frameWidth, frameHeight, state.fire.x - 32, state.fire.y - 32, 64, 64);
  if (currentFireShieldTier >= 2 && state.rainDuration > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
  ctx.arc(state.fire.x, state.fire.y - 5, 25, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 200, 0.25)";
      ctx.fill();
      ctx.restore();
  }
}

function drawPlayerSprite() {
  const size = getPlayerDrawSize(); const drawX = state.player.x - size * 0.5;
  const drawY = state.player.y - size * 0.5;
  if (state.gameOver && dieSprite.complete) { const fw = spriteFrames.die.w, fh = spriteFrames.die.h;
  const sx = (deathClip.startCol + Math.min(anim.deathFrame, deathClip.frameCount - 1)) * fw; const sy = deathClip.row * fh;
  ctx.drawImage(dieSprite, sx, sy, fw, fh, drawX, drawY, size, size); return; }
  if (state.superModeTimer > 0) { ctx.save();
  ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 20; ctx.fillStyle = "rgba(0, 255, 255, 0.4)"; ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  if (walkIdleSprite.complete) {
    const fw = spriteFrames.walk.w, fh = spriteFrames.walk.h;
  const walkRows = Math.max(1, Math.floor((walkIdleSprite.naturalHeight || fh) / fh)); const row = Math.min(dirToRow(state.player.dir), walkRows - 1);
  const sx = (WALK_START_COL + anim.walkFrame) * fw; const sy = row * fh;
    const d = dist(state.player, state.fire);
  if (d < 200 && state.fire.level > 10) { if (tintCanvas.width !== Math.floor(size)) { tintCanvas.width = Math.floor(size); tintCanvas.height = Math.floor(size);
  } tintCtx.clearRect(0, 0, tintCanvas.width, tintCanvas.height); tintCtx.drawImage(walkIdleSprite, sx, sy, fw, fh, 0, 0, size, size); tintCtx.globalCompositeOperation = 'source-atop';
  const glowOpacity = Math.max(0, (1 - d / 200) * 0.25); tintCtx.fillStyle = `rgba(255, 120, 0, ${glowOpacity})`;
  tintCtx.fillRect(0, 0, size, size); tintCtx.globalCompositeOperation = 'source-over'; ctx.drawImage(tintCanvas, drawX, drawY);
  } else { ctx.drawImage(walkIdleSprite, sx, sy, fw, fh, drawX, drawY, size, size); }
    return;
  }
  drawCircle(state.player.x, state.player.y, state.player.r, "#4ea9ff");
}

function drawPet() {
  ctx.save(); ctx.translate(state.pet.x, state.pet.y);
  if (state.pet.isSleeping) {
    const breathe = Math.sin(Date.now() * 0.003) * 1; 
    ctx.fillStyle = "#8b5a2b"; ctx.beginPath();
  ctx.ellipse(0, 2 - breathe/2, 11, 7 + breathe/2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#a06b3a"; ctx.beginPath();
  ctx.ellipse(0, 0 - breathe/2, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5c3a21"; ctx.beginPath();
  ctx.ellipse(-8, 4, 5, 2, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5; ctx.beginPath();
  ctx.moveTo(3, 2 - breathe/2); ctx.lineTo(6, 3 - breathe/2); ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; ctx.font = "bold 10px monospace";
  ctx.fillText("z", 4, -8 + Math.sin(Date.now()*0.002)*2); ctx.font = "bold 8px monospace"; ctx.fillText("z", 10, -14 + Math.sin(Date.now()*0.002 + 1)*2); ctx.restore(); return;
  }
  if (Math.cos(state.pet.angle) < 0) ctx.scale(-1, 1);
  const bounce = state.pet.isSitting ? 0 : Math.abs(Math.sin(Date.now() * 0.015)) * 3;
  const tailWag = state.pet.isSitting ? Math.sin(Date.now() * 0.005) * 0.2 : Math.sin(Date.now() * 0.02) * 0.5;
  ctx.fillStyle = "#5c3a21"; ctx.save();
  ctx.translate(-8, -2 - bounce); ctx.rotate(tailWag); ctx.fillRect(-4, -1, 5, 2); ctx.restore();
  ctx.fillStyle = "#6d4726"; if (state.pet.isSitting) { ctx.fillRect(-7, 2, 4, 3);
  ctx.fillRect(1, 2, 3, 3); } else { ctx.fillRect(-6, 2 - bounce, 3, 4); ctx.fillRect(2, 2 - bounce, 3, 4);
  }
  ctx.fillStyle = "#8b5a2b"; ctx.fillRect(-8, -5 - bounce, 14, 8);
  ctx.fillStyle = "#cba37b"; ctx.fillRect(4, -4 - bounce, 3, 6);
  ctx.fillStyle = "#a06b3a"; ctx.fillRect(4, -10 - bounce, 8, 7);
  ctx.fillStyle = "#5c3a21"; const earFlap = state.pet.isSitting ?
  0 : Math.sin(Date.now() * 0.02) * 2; ctx.fillRect(4, -12 - bounce + (earFlap>0?1:0), 2, 3);
  ctx.fillRect(9, -12 - bounce + (earFlap>0?1:0), 2, 3);
  ctx.fillStyle = "#111"; ctx.fillRect(10, -6 - bounce, 3, 2); ctx.fillStyle = "#111";
  ctx.fillRect(7, -8 - bounce, 2, 2);
  if (state.pet.isSitting && !state.pet.hasWood) { ctx.fillStyle = "#e57373"; ctx.fillRect(9, -4 - bounce, 2, 2);
  }
  if (state.pet.hasWood) { ctx.save(); ctx.translate(13, -4 - bounce); ctx.scale(0.5, 0.5); drawWoodItem(0, 0, 0); ctx.restore(); }
  ctx.restore();
  }

function drawRaccoons() {
  state.raccoons.forEach(rac => {
    ctx.save(); ctx.translate(rac.x, rac.y);
    if (rac.fleeAngle !== null) { if (Math.cos(rac.fleeAngle) < 0) ctx.scale(-1, 1); } else if (state.woods.length > 0) { let nearestWood = state.woods[0]; if (nearestWood && nearestWood.x < rac.x) ctx.scale(-1, 1); }
    const bounce = Math.abs(Math.sin(rac.wobble)) * 3;
    ctx.fillStyle = "#4a4a4a"; ctx.beginPath(); ctx.ellipse(-12, -2 - bounce, 6, 3, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = "#222"; ctx.beginPath(); ctx.ellipse(-14, -1 - bounce, 2, 3, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(-10, -3 - bounce, 2, 3, Math.PI/6, 0, Math.PI*2); ctx.fill();
   
   ctx.fillStyle = "#696969"; ctx.fillRect(-8, -6 - bounce, 14, 8);
    ctx.fillStyle = "#222"; ctx.fillRect(-6, 2 - bounce, 2, 3); ctx.fillRect(2, 2 - bounce, 2, 3);
    ctx.fillStyle = "#696969"; ctx.fillRect(4, -8 - bounce, 8, 7);
    ctx.fillStyle = "#4a4a4a"; ctx.fillRect(4, -10 - bounce, 2, 2);
  ctx.fillRect(9, -10 - bounce, 2, 2);
    ctx.fillStyle = "#222"; ctx.fillRect(5, -6 - bounce, 7, 3);
    ctx.fillStyle = "#fff";
  ctx.fillRect(6, -5 - bounce, 1, 1); ctx.fillRect(9, -5 - bounce, 1, 1);
    ctx.fillStyle = "#111";
  ctx.fillRect(11, -3 - bounce, 2, 2);
    if (rac.hasWood) { ctx.save(); ctx.translate(12, -2 - bounce); ctx.scale(0.5, 0.5); drawWoodItem(0, 0, 0); ctx.restore();
  }
    ctx.restore();
  });
}

function draw() {
  const w = (canvas.clientWidth || 800) + 10;
  const h = (canvas.clientHeight || 600) + 10; ctx.clearRect(-5, -5, w, h);
  drawEnvironment(); 
  state.woods.forEach(wood => drawWoodItem(wood.x, wood.y, wood.angle, wood.isGolden));
  state.mushrooms.forEach(mushroom => drawMushroom(mushroom.x, mushroom.y, false));
  state.apples.forEach(apple => drawApple(apple.x, apple.y));
  if (state.blueMushroom) { drawMushroom(state.blueMushroom.x, state.blueMushroom.y, true); }
  drawTent(); drawCampfireBase(); drawFireSprite();
  drawSparks(); drawSmoke();
  const darkFactor = nightBlend();
  if (darkFactor > 0) { 
      ctx.save();
  if (state.currentDay % 4 === 0) {
          ctx.fillStyle = `rgba(40, 0, 0, ${0.4 + darkFactor * 0.5})`;
  } else {
          ctx.fillStyle = `rgba(8, 16, 34, ${0.2 + darkFactor * 0.65})`;
  }
      ctx.fillRect(-5, -5, w, h); 
      drawFireLight(); 
      ctx.restore(); 
      drawEnemies(); 
  } else { drawFireLight();
  }

  if (currentFireShieldTier >= 3 && (state.windDuration > 0 || state.rainDuration > 0)) {
      ctx.save();
  ctx.beginPath();
      ctx.ellipse(state.fire.x, state.fire.y - 30, 95, 65, 0, Math.PI, 0);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
      ctx.stroke();
  ctx.fillStyle = "rgba(255, 215, 0, 0.08)";
      ctx.fill();
      ctx.restore();
  }

  drawPlayerTrails(); drawWind(); drawRain(); drawRaccoons(); drawPet(); drawPlayerSprite(); drawFloatingTexts();
  const cw = canvas.clientWidth || 800; const ch = canvas.clientHeight || 600;
  if (state.dayMessageTimer > 0) { ctx.save();
  ctx.globalAlpha = Math.min(1, state.dayMessageTimer); ctx.fillStyle = "#ffd700";
      ctx.font = "bold 40px Arial"; ctx.textAlign = "center"; ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
      ctx.fillText("DAY " + state.currentDay, cw / 2, ch / 4); ctx.font = "bold 20px Arial";
  ctx.fillStyle = "#fff";
      ctx.fillText("SURVIVED", cw / 2, ch / 4 + 30); ctx.restore();
  }

  if (state.bloodMoonMessageTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, state.bloodMoonMessageTimer));
  ctx.fillStyle = "#ff0000";
      ctx.font = "bold 25px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10;
  ctx.fillText("THE BLOOD MOON RISES...", cw / 2, 60);
      ctx.restore();
  }

  if (state.survivedBloodMoonMessageTimer > 0) {
      ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, state.survivedBloodMoonMessageTimer));
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
      ctx.fillText("BLOOD MOON SURVIVED!", cw / 2, 60);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 18px Arial";
  ctx.fillText("+100 GOLDEN WOOD", cw / 2, 90);
      ctx.restore();
  }

  if (state.pond.fishProgress > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(state.player.x - 20, state.player.y - 45, 40, 6);
      ctx.fillStyle = "#4ea9ff";
  ctx.fillRect(state.player.x - 20, state.player.y - 45, 40 * (state.pond.fishProgress / 4.0), 6);
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial";
  ctx.textAlign = "center"; ctx.fillText("Fishing...", state.player.x, state.player.y - 50);
  }
  if (state.cookTimer > 0) {
      let reqTime = state.equippedFood === "fish" ?
  3.0 : 2.0;
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(state.player.x - 20, state.player.y - 45, 40, 6);
      ctx.fillStyle = "#ff9900";
  ctx.fillRect(state.player.x - 20, state.player.y - 45, 40 * (state.cookTimer / reqTime), 6);
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial";
  ctx.textAlign = "center"; ctx.fillText("Cooking...", state.player.x, state.player.y - 50);
  }

  if (state.equippedFood) {
      let icon = "";
  if (state.equippedFood === "apple") icon = "🍎";
      if (state.equippedFood === "mushroom") icon = "🍄";
  if (state.equippedFood === "cooked_mushroom") icon = "🥘"; 
      if (state.equippedFood === "fish") icon = "🐟";
  if (state.equippedFood === "cooked_fish") icon = "🍣";
      ctx.font = "20px Arial"; ctx.textAlign = "center";
  let offsetY = (state.cookTimer > 0 || state.pond.fishProgress > 0) ? 75 : 55;
  let countText = state.equippedCount > 1 ? " x" + state.equippedCount : "";
      ctx.fillText(icon + countText, state.player.x, state.player.y - offsetY);
  }
  
  if (state.damageFlash > 0) { ctx.fillStyle = `rgba(255, 0, 0, ${state.damageFlash * 0.4})`;
  ctx.fillRect(-5, -5, w, h); }
}

function resetGame() {
    state.status = "MENU"; state.gameOver = false; state.deathAnimDone = false;
  state.score = 0;
    state.health = 100; state.bagWood = 0; state.dayNightTimer = 0; state.currentDay = 1; state.damageFlash = 0;
  state.sessionGoldenWood = 0;
    
    updateMaxWoodCapacity();
    updatePetStats();
    
    const wWrap = document.getElementById("woodIconsWrapper");
    if (wWrap) { wWrap.innerHTML = renderWoodIcons();
  }
    
    stopAudio(); 
    if(document.getElementById("hudPauseBtn")) { 
      document.getElementById("hudPauseBtn").innerHTML = "⏸";
  }

    const rect = canvas.getBoundingClientRect(); state.fire.x = rect.width * 0.5; state.fire.y = rect.height * 0.5 + 40;
  state.fire.level = 100; state.tent.x = state.fire.x; state.tent.y = state.fire.y - 85; state.player.x = state.fire.x - 50; state.player.y = state.fire.y;
  state.player.dir = "down";
    state.pet.x = state.player.x + 20; state.pet.y = state.player.y + 20; state.pet.hasWood = false; state.pet.isFetching = false;
  state.pet.isSitting = true; state.pet.isSleeping = false;
    state.enemies = []; state.raccoons = []; state.smokeParticles = []; state.sparks = [];
  state.floatingTexts = []; state.playerTrails = []; state.windParticles = []; state.rainDrops = [];
    state.pendingWoodRespawns = 0; state.woodRespawnTimer = 0;
  state.pendingMushroomRespawns = 0; state.mushroomRespawnTimer = 0; state.blueMushroomTimer = 30 + Math.random() * 30; state.superModeTimer = 0; state.raccoonSpawnTimer = 15;
  state.windTimer = 20 + Math.random() * 30; state.windDuration = 0; state.rainTimer = 30 + Math.random() * 40; state.rainDuration = 0;
  state.bloodMoonActive = false; state.bloodMoonMessageTimer = 0; state.survivedBloodMoonMessageTimer = 0; state.bloodMoonHowlTimer = 0; state.fireEaterSpawnTimer = 0;
    controls.up = false;
  controls.down = false; controls.left = false; controls.right = false;
    seedWoods(); updateHud();
  }

function frame(ts) {
  if (typeof ts !== 'number') ts = performance.now();
  if (!state.lastTs) state.lastTs = ts;
  let dt = (ts - state.lastTs) / 1000; if (isNaN(dt) || dt < 0) dt = 0;
  dt = Math.min(dt, 0.04); state.lastTs = ts;
  try { update(dt); draw(); updateHud(); } catch(err) { console.error("Game Loop Error:", err);
  }
  requestAnimationFrame(frame);
}

const joystickZone = document.getElementById("joystickZone");
const joystickBase = document.getElementById("joystickBase");
const joystickStick = document.getElementById("joystickStick");
const mobileActionBtn = document.getElementById("mobileActionBtn");
  let joystickActive = false;
let joyBaseX = 0, joyBaseY = 0;
const maxJoyRadius = 40;
  function handlePointerDown(e) {
    if (state.gameOver || state.status !== "PLAYING") return;
    initAudio();
    joystickActive = true;
  const rect = joystickZone.getBoundingClientRect();
    joyBaseX = e.clientX - rect.left;
    joyBaseY = e.clientY - rect.top;
    joystickBase.style.left = joyBaseX + "px";
  joystickBase.style.top = joyBaseY + "px";
    joystickBase.classList.remove("hidden");
    joystickStick.style.transform = `translate(-50%, -50%)`;
    
    updateJoystickControls(0, 0);
  }

function handlePointerMove(e) {
    if (!joystickActive || state.gameOver || state.status !== "PLAYING") return;
    e.preventDefault(); 
    const rect = joystickZone.getBoundingClientRect();
  let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;
    
    let dx = currentX - joyBaseX;
  let dy = currentY - joyBaseY;
    let distance = Math.hypot(dx, dy);
  if (distance > maxJoyRadius) {
        dx = (dx / distance) * maxJoyRadius;
  dy = (dy / distance) * maxJoyRadius;
    }
    
    joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  updateJoystickControls(dx, dy);
}

function handlePointerUp(e) {
    joystickActive = false;
    joystickBase.classList.add("hidden");
    updateJoystickControls(0, 0);
  }

function updateJoystickControls(dx, dy) {
    const threshold = 10;
    controls.right = dx > threshold;
  controls.left = dx < -threshold;
    controls.down = dy > threshold;
    controls.up = dy < -threshold;
  }

if(joystickZone) {
    joystickZone.addEventListener("pointerdown", handlePointerDown);
    joystickZone.addEventListener("pointermove", handlePointerMove);
    joystickZone.addEventListener("pointerup", handlePointerUp);
    joystickZone.addEventListener("pointercancel", handlePointerUp);
    joystickZone.addEventListener("pointerleave", handlePointerUp);
    joystickZone.addEventListener("contextmenu", e => e.preventDefault());
  }

if(mobileActionBtn) {
    mobileActionBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        initAudio();
        if(state.status === "PLAYING") feedFire();
    });
  mobileActionBtn.addEventListener("contextmenu", e => e.preventDefault());
}

function bindKeyboard() {
  window.addEventListener("keydown", (e) => {
    initAudio(); if (state.gameOver || state.status !== "PLAYING") return; const k = e.key.toLowerCase();
    if (e.key === "ArrowUp" || k === "w") controls.up = true; if (e.key === "ArrowDown" || k === "s") controls.down = true;
    if (e.key === "ArrowLeft" || k === "a") controls.left = true; if (e.key === "ArrowRight" || k === "d") controls.right = true;
    if (e.key === " ") feedFire();
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (e.key === "ArrowUp" || k === "w") controls.up = false; if (e.key === "ArrowDown" || k === "s") controls.down = false;
    if (e.key === "ArrowLeft" || k === "a") controls.left = false; if (e.key === "ArrowRight" || k === "d") controls.right = false;
  });
  }

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); seedWoods(); bindKeyboard(); updateHud(); requestAnimationFrame(frame);

function resumeGame() { state.status = "PLAYING"; const pUI = document.getElementById("pauseUI"); if (pUI) pUI.classList.add("hidden");
  const pauseBtn = document.getElementById("hudPauseBtn"); if(pauseBtn) pauseBtn.innerHTML = "⏸"; resumeAudio(); state.lastTs = performance.now(); }
function quitToMenu() { const pUI = document.getElementById("pauseUI");
  if (pUI) pUI.classList.add("hidden"); resetGame(); document.getElementById("mainMenu").classList.remove("hidden"); }

document.getElementById("startBtn").addEventListener("click", () => { initAudio(); state.status = "PLAYING"; document.getElementById("mainMenu").classList.add("hidden"); });
  document.getElementById("scoresBtn").addEventListener("click", () => { 
    const high = localStorage.getItem("campfireHighScore") || 0; 
    const day = localStorage.getItem("campfireHighDay") || 1; 
    const bank = localStorage.getItem("campfireGoldenWood") || 0;
    
    document.getElementById("highScoreList").innerHTML = `
        <div style="text-align: left;">
            <p>🔥 Best Score: <span style="color:#ffd700;">${high}</span></p>
            <p>📅 Max Days: <span style="color:#ffd700;">${day}</span></p>
            <hr style="border:0; border-top:1px 
  solid #555; margin: 15px 0;">
            <p>💰 Total Golden Wood: <span style="color:#ffd700;">${bank}</span></p>
        </div>
    `; 
    document.getElementById("mainMenu").classList.add("hidden"); 
    document.getElementById("scoreBoard").classList.remove("hidden"); 
    
    const scoreH2 = document.querySelector("#scoreBoard h2");
    if(scoreH2) scoreH2.textContent = "CAREER STATS";
});
  document.getElementById("backBtn").addEventListener("click", () => { document.getElementById("scoreBoard").classList.add("hidden"); document.getElementById("mainMenu").classList.remove("hidden"); });

const menuReturnBtn = document.getElementById("menuReturnBtn");
  if(menuReturnBtn) { menuReturnBtn.addEventListener("click", () => { document.getElementById("gameOverUI").classList.add("hidden"); resetGame(); document.getElementById("mainMenu").classList.remove("hidden"); }); }
const hudPauseBtn = document.getElementById("hudPauseBtn");
  if(hudPauseBtn) { hudPauseBtn.addEventListener("click", () => { if (state.gameOver) return; if (state.status === "PLAYING") { state.status = "PAUSED"; const pUI = document.getElementById("pauseUI"); if (pUI) pUI.classList.remove("hidden"); hudPauseBtn.innerHTML = "▶"; pauseAudio(); } else if (state.status === "PAUSED") { resumeGame(); } });
  }

const dynamicResumeBtn = document.getElementById("resumeBtn"); if(dynamicResumeBtn) dynamicResumeBtn.addEventListener("click", resumeGame);
const dynamicQuitBtn = document.getElementById("quitBtn"); if(dynamicQuitBtn) dynamicQuitBtn.addEventListener("click", quitToMenu);

const mainMenuBtns = document.querySelector("#mainMenu .menu-buttons");
  if (mainMenuBtns && !document.getElementById("upgradesBtn")) {
    const upgBtn = document.createElement("button");
    upgBtn.id = "upgradesBtn";
    upgBtn.className = "menu-btn secondary";
  upgBtn.innerHTML = "🟡 UPGRADES";
    
    upgBtn.addEventListener("click", () => {
        renderUpgradesMenu();
        document.getElementById("mainMenu").classList.add("hidden");
        document.getElementById("upgradesMenu").classList.remove("hidden");
    });
  mainMenuBtns.appendChild(upgBtn);
}

function renderUpgradesMenu() {
    const totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    const uMenu = document.getElementById("upgradesMenu");
  let bpButtonHTML = "";
    let bpDescHTML = "Current Capacity: 5 <br> Next: <span style='color:#ffd700'>10 Wood</span>";
  if (currentBackpackTier === 0) { bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 150</button>`;
  }
    else if (currentBackpackTier === 1) { bpDescHTML = "Current Capacity: 10 <br> Next: <span style='color:#ffd700'>15 Wood</span>";
  bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 450</button>`; }
    else if (currentBackpackTier === 2) { bpDescHTML = "Current Capacity: 15 <br> Next: <span style='color:#ffd700'>20 Wood</span>";
  bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 1200</button>`; }
    else { bpDescHTML = "Current Capacity: 20 <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>";
  bpButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    let petButtonHTML = "";
  let petDescHTML = "Sleeps at night. <br> Next: <span style='color:#ffd700'>Watchdog (Lv. 1)</span>";
  if (currentPetTier === 0) { petButtonHTML = `<button class="buy-btn" onclick="buyPetUpgrade()">💰 300</button>`;
  }
    else if (currentPetTier === 1) { petDescHTML = "Awake at night & barks to warn. <br> Next: <span style='color:#ffd700'>Defender (Lv. 2)</span>";
  petButtonHTML = `<button class="buy-btn" onclick="buyPetUpgrade()">💰 700</button>`; }
    else { petDescHTML = "Awake at night & stuns nearest enemy. <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>";
  petButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    let fsButtonHTML = "";
  let fsDescHTML = "No protection. <br> Next: <span style='color:#ffd700'>Windbreak Stones (Lv. 1)</span>";
  if (currentFireShieldTier === 0) { fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 200</button>`;
  }
    else if (currentFireShieldTier === 1) { fsDescHTML = "Wind resistance. <br> Next: <span style='color:#ffd700'>Treated Wood (Lv. 2)</span>";
  fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 500</button>`; }
    else if (currentFireShieldTier === 2) { fsDescHTML = "Rain & Wind resistance. <br> Next: <span style='color:#ffd700'>Guardian Aura (Lv. 3)</span>";
  fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 1000</button>`; }
    else { fsDescHTML = "Immune to Storms. <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>";
  fsButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    uMenu.innerHTML = `
        <h2>UPGRADES</h2>
        <div class="gold-bank-display">🟡 Total Gold: ${totalGold}</div>
        
        <div id="shopNotification" style="color: #ff4a4a; font-weight: bold; font-size: 14px; height: 20px; margin-bottom: 15px; opacity: 0; transition: opacity 0.3s ease; text-transform: uppercase; letter-spacing: 1px;"></div>
        
        <div class="shop-container">
            <div class="shop-card">
 
  
                <div class="card-info">
                    <h3>Wood Backpack (Lv. ${currentBackpackTier})</h3>
                    <p>${bpDescHTML}</p>
                </div>
                <div class="button-container">${bpButtonHTML}</div>
       
         
            </div>
            
            <div class="shop-card">
                <div class="card-info">
                    <h3>Good Boy Training (Lv. ${currentPetTier})</h3>
                    <p>${petDescHTML}</p>
 
           
                </div>
                <div class="button-container">${petButtonHTML}</div>
            </div>

            <div class="shop-card">
                <div class="card-info">
                
      <h3>Fire Shield (Lv. ${currentFireShieldTier})</h3>
                    <p>${fsDescHTML}</p>
                </div>
                <div class="button-container">${fsButtonHTML}</div>
            </div>
        </div>
        
        <button id="closeUpgradesBtn" class="menu-btn secondary" 
  style="width:120px; padding:10px; margin-top:10px;">BACK</button>
    `;
    document.getElementById("closeUpgradesBtn").addEventListener("click", () => {
        document.getElementById("upgradesMenu").classList.add("hidden");
        document.getElementById("mainMenu").classList.remove("hidden");
    });
  }

window.buyBackpackUpgrade = function() {
    let totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    if (currentBackpackTier >= UPGRADE_DATA.backpack.length) return;
  const nextUpgrade = UPGRADE_DATA.backpack[currentBackpackTier];
    if (totalGold >= nextUpgrade.cost) {
        totalGold -= nextUpgrade.cost;
  localStorage.setItem("campfireGoldenWood", totalGold);
        currentBackpackTier++;
        localStorage.setItem("backpackTier", currentBackpackTier);
        updateMaxWoodCapacity();
        const wWrap = document.getElementById("woodIconsWrapper");
        if (wWrap) wWrap.innerHTML = renderWoodIcons();
        renderUpgradesMenu();
        if(sounds && sounds.feed) sounds.feed.play();
  } else { showShopNotification("Not enough Golden Wood! Keep surviving."); }
};
  window.buyPetUpgrade = function() {
    let totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    if (currentPetTier >= UPGRADE_DATA.pet.length) return;
  const nextUpgrade = UPGRADE_DATA.pet[currentPetTier];
    if (totalGold >= nextUpgrade.cost) {
        totalGold -= nextUpgrade.cost;
  localStorage.setItem("campfireGoldenWood", totalGold);
        currentPetTier++;
        localStorage.setItem("campfirePetTier", currentPetTier);
        updatePetStats();
        renderUpgradesMenu();
        if(sounds && sounds.feed) sounds.feed.play(); 
    } else { showShopNotification("Not enough Golden Wood! Keep surviving.");
  }
};

window.buyFireShieldUpgrade = function() {
    let totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    if (currentFireShieldTier >= UPGRADE_DATA.fireShield.length) return;
  const nextUpgrade = UPGRADE_DATA.fireShield[currentFireShieldTier];
    if (totalGold >= nextUpgrade.cost) {
        totalGold -= nextUpgrade.cost;
  localStorage.setItem("campfireGoldenWood", totalGold);
        currentFireShieldTier++;
        localStorage.setItem("campfireFireShieldTier", currentFireShieldTier);
        renderUpgradesMenu();
        if(sounds && sounds.feed) sounds.feed.play(); 
    } else { showShopNotification("Not enough Golden Wood! Keep surviving."); }
};
  function showShopNotification(message) {
    const notifEl = document.getElementById("shopNotification");
    if (!notifEl) return;
    notifEl.textContent = message;
    notifEl.style.opacity = "1";
  if (window.shopNotifTimeout) clearTimeout(window.shopNotifTimeout);
    window.shopNotifTimeout = setTimeout(() => {
        notifEl.style.opacity = "0";
    }, 2000);
  }