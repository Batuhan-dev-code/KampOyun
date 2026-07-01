// ====== GEÇİCİ TEST KODU ======
// Altın hilesini açmak için aşağıdaki satırın başındaki "//" işaretlerini sil.
// localStorage.setItem("campfireGoldenWood", 5000);

// Direk 2. Bölümden başlamak için aşağıdaki satırı ekledik:
localStorage.setItem("campfireCurrentStoryLevel", 2);
// =======================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tintCanvas = document.createElement("canvas");
const tintCtx = tintCanvas.getContext("2d"); 

const hudEl = document.querySelector(".hud");

// --- ÇOKLU DİL (i18n) SİSTEMİ ---
let currentLang = localStorage.getItem("campfireLang");
if (!currentLang) {
    currentLang = navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}

const I18N = {
    en: {
        btnStory: "📖 STORY MODE",
        btnStoryCont: "📖 CONTINUE STORY",
        btnSurvival: "🏕️ SURVIVAL MODE",
        btnLocked: "🔒 SURVIVAL (LOCKED)",
        btnScores: "SCORES",
        btnUpgrades: "🟡 UPGRADES",
        intro1Title: "CHAPTER 1: THE WRECKAGE",
        intro1Text: "My plane crashed... I'm lucky to be alive, but the radio is shattered. The map shows an old communication tower in the snowy mountains to the North. I must reach it, but first I need to gather my strength. I must survive for at least 3 days, pack my camp, and set off.",
        intro2Title: "CHAPTER 2: THE HOWL",
        intro2Text: "I've passed the forest, but the wind at the rocky foothills is relentless. My fire keeps dying. Last night, I heard a familiar bark through the storm... Could my dog have survived the crash? I must find him!",
        clickToContinue: "- CLICK TO CONTINUE -",
        tooDangerous: "TOO DANGEROUS NOW!",
        notReady: "NOT READY TO TRAVEL YET!",
        mustRescueDog: "CAN'T LEAVE WITHOUT MY DOG!",
        dogRescued: "FRIEND RESCUED!",
        bagFull: "BAG FULL!",
        deposited: "DEPOSITED!",
        stored: "STORED 🪵",
        noWood: "NO WOOD!",
        needsCooking: "NEEDS COOKING!",
        cooked: "COOKED!",
        superMode: "SUPER MODE!",
        fireDrained: "FIRE DRAINED!",
        defended: "DEFENDED!",
        stunned: "STUNNED!",
        treasure: "TREASURE! +10 🟡",
        closeCall: "CLOSE CALL! +50",
        safelyExtracted: "SAFELY EXTRACTED!",
        lvl1Complete: "CHAPTER 1 COMPLETED!",
        lvl2Complete: "CHAPTER 2 COMPLETED!",
        day: "Day",
        score: "Score",
        empty: "Empty",
        depositAll: "📥 DEPOSIT ALL",
        packCamp: "🏕️ PACK CAMP",
        feedFire: "FEED FIRE",
        eat: "EAT",
        fishing: "Fishing...",
        cooking: "Cooking...",
        searching: "Searching...",
        leafEmpty: "EMPTY",
        leafWood: "FOUND WOOD!",
        leafRaccoon: "AMBUSH!",
        survived: "SURVIVED",
        bloodMoonRises: "THE BLOOD MOON RISES...",
        bloodMoonSurvived: "BLOOD MOON SURVIVED!",
        goldenWoodSaved: "Golden Wood Saved!",
        statsTitle: "CAREER STATS",
        back: "BACK",
        resume: "RESUME",
        mainMenu: "MAIN MENU"
    },
    tr: {
        btnStory: "📖 HİKAYE MODU",
        btnStoryCont: "📖 HİKAYEYE DEVAM ET",
        btnSurvival: "🏕️ SONSUZ MOD",
        btnLocked: "🔒 SONSUZ MOD (KİLİTLİ)",
        btnScores: "SKORLAR",
        btnUpgrades: "🟡 YETENEKLER",
        intro1Title: "BÖLÜM 1: ENKAZ",
        intro1Text: "Uçağım düştü... Şanslıyım ki hayattayım ama telsiz parçalandı. Haritaya göre Kuzeydeki karlı dağlarda eski bir iletişim kulesi var. Oraya ulaşmalıyım ama önce toparlanmam lazım. En az 3 gün hayatta kalıp, kampı toplayarak yola çıkmalıyım.",
        intro2Title: "BÖLÜM 2: ULUMA",
        intro2Text: "Ormanı aştım ama kayalık tepelerde rüzgar acımasız. Ateşim sürekli sönüyor. Dün gece fırtınanın içinden tanıdık bir havlama sesi duydum... Olamaz, köpeğim yaşıyor olabilir mi? Onu bulmalıyım!",
        clickToContinue: "- DEVAM ETMEK İÇİN TIKLA -",
        tooDangerous: "ŞU AN ÇOK TEHLİKELİ!",
        notReady: "HENÜZ YOLA ÇIKMAYA HAZIR DEĞİLSİN!",
        mustRescueDog: "KÖPEĞİMİ BURADA BIRAKAMAM!",
        dogRescued: "DOST KURTARILDI!",
        bagFull: "ÇANTA DOLU!",
        deposited: "DEPOLANDI!",
        stored: "DEPOLANDI 🪵",
        noWood: "ODUN YOK!",
        needsCooking: "PİŞİRİLMELİ!",
        cooked: "PİŞTİ!",
        superMode: "SÜPER MOD!",
        fireDrained: "ATEŞ SÖNDÜRÜLDÜ!",
        defended: "SAVUNULDU!",
        stunned: "SERSEMLETİLDİ!",
        treasure: "HAZİNE! +10 🟡",
        closeCall: "UCUZ ATLATTI! +50",
        safelyExtracted: "GÜVENLE KAÇILDI!",
        lvl1Complete: "1. BÖLÜM TAMAMLANDI!",
        lvl2Complete: "2. BÖLÜM TAMAMLANDI!",
        day: "Gün",
        score: "Skor",
        empty: "Boş",
        depositAll: "📥 HEPSİNİ DEPOLA",
        packCamp: "🏕️ KAMPI TOPLA",
        feedFire: "ATEŞİ BESLE",
        eat: "YEMEK YE",
        fishing: "Balık Tutuluyor...",
        cooking: "Pişiriliyor...",
        searching: "Aranıyor...",
        leafEmpty: "BOŞ",
        leafWood: "ODUN BULUNDU!",
        leafRaccoon: "PUSU!",
        survived: "HAYATTA KALDIN",
        bloodMoonRises: "KANLI AY YÜKSELİYOR...",
        bloodMoonSurvived: "KANLI AY ATLATILDI!",
        goldenWoodSaved: "Altın Odun Kurtarıldı!",
        statsTitle: "KARİYER STATLARIN",
        back: "GERİ",
        resume: "DEVAM ET",
        mainMenu: "ANA MENÜ"
    }
};

function t(key) {
    return I18N[currentLang][key] || key;
}

const tentStyle = document.createElement('style');
tentStyle.innerHTML = `
  #tentMenu { position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%); background: rgba(15,15,15,0.95); border: 2px solid #a0522d; border-radius: 12px; padding: 10px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; pointer-events: auto; z-index: 100; transition: opacity 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.6); max-width: 85%; width: max-content; }
  .tent-item { color: white; font-size: 14px; font-weight: bold; cursor: pointer; text-align: center; padding: 6px 12px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: all 0.1s; user-select: none; }
  .tent-item:active { transform: scale(0.95); background: rgba(255,255,255,0.3); }
  .hidden-fade { opacity: 0; pointer-events: none !important; }
`;
document.head.appendChild(tentStyle);

const tentMenu = document.createElement("div");
tentMenu.id = "tentMenu";
tentMenu.className = "hidden-fade";
tentMenu.addEventListener("pointerdown", e => e.stopPropagation());
document.querySelector(".game-shell").appendChild(tentMenu);

const introUI = document.createElement("div");
introUI.id = "introUI";
introUI.className = "hidden";
introUI.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:#050505; color:#fff; z-index:1000; padding:20px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; font-family:monospace;";
document.querySelector(".game-shell").appendChild(introUI);

let typingInterval;
function playIntro(title, text, callback) {
    document.getElementById("mainMenu").classList.add("hidden");
    introUI.classList.remove("hidden");
    introUI.innerHTML = `<h2 style="color:#ffd700; margin-bottom:20px; font-family:Arial;">${title}</h2><p id="introText" style="font-size:15px; line-height:1.6; max-width:85%; min-height:100px;"></p><div id="introClick" class="hidden" style="margin-top:40px; color:#aaa; cursor:pointer; font-weight:bold; font-family:Arial;">${t("clickToContinue")}</div>`;
    
    const textEl = document.getElementById("introText");
    const clickEl = document.getElementById("introClick");
    let i = 0;
    
    if(typingInterval) clearInterval(typingInterval);
    
    if (!state.isMuted) {
        sounds.typewriter.currentTime = 0;
        sounds.typewriter.play().catch(()=>{});
    }
    
    const finishTyping = () => {
        clearInterval(typingInterval);
        textEl.textContent = text;
        clickEl.classList.remove("hidden");
        
        sounds.typewriter.pause();
        sounds.typewriter.currentTime = 0;
        
        introUI.onclick = () => {
            introUI.onclick = null;
            introUI.classList.add("hidden");
            callback();
        };
    };
    
    typingInterval = setInterval(() => {
        textEl.textContent += text.charAt(i);
        i++;
        if(i >= text.length) {
            finishTyping();
        }
    }, 80);
    
    introUI.onclick = () => {
        if(i < text.length) finishTyping();
    };
}

if (!document.getElementById("pauseUI")) {
    const pUI = document.createElement("div");
    pUI.id = "pauseUI";
    pUI.className = "hidden";
    pUI.innerHTML = `
        <div class="pause-box">
            <h2 id="pauseTitle">PAUSED</h2>
            <div class="menu-buttons pause-btns">
                <button id="resumeBtn" class="menu-btn primary"></button>
                <button id="quitBtn" class="menu-btn secondary"></button>
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
  howl: new Audio("assets/howl.mp3"),
  eat: new Audio("assets/eat.mp3"),
  buy: new Audio("assets/buy.mp3"),
  typewriter: new Audio("assets/typewriter.mp3")
};
sounds.fire.loop = true; sounds.day.loop = true; sounds.night.loop = true;
sounds.wind.loop = true; sounds.rain.loop = true; sounds.bloodmoon.loop = true;
sounds.typewriter.loop = true;
let audioStarted = false;

const state = {
  status: "MENU", 
  gameMode: "STORY", 
  currentLevel: 1,
  
  player: { x: 100, y: 100, r: 14, speed: 170, dir: "down" },
  pet: { x: 120, y: 120, r: 8, targetX: 120, targetY: 120, speed: 155, isSitting: true, isSleeping: false, angle: 0, fetchTimer: 15, isFetching: false, hasWood: false },
  fire: { x: 0, y: 0, r: 22, level: 100, currentFrame: 0, animationTimer: 0 }, tent: { x: 0, y: 0, r: 40 },
  woods: [], mushrooms: [], blueMushroom: null, enemies: [], trees: [], rocks: [], smokeParticles: [], sparks: [], floatingTexts: [], playerTrails: [], raccoons: [], windParticles: [], rainDrops: [],
  leafPiles: [], leafParticles: [], leafSpawnTimer: 0, pondLeaves: [],
  pendingWoodRespawns: 0, woodRespawnTimer: 0, targetWoodCount: 7, pendingMushroomRespawns: 0, mushroomRespawnTimer: 0, targetMushroomCount: 2, blueMushroomTimer: 30 + Math.random() * 30, superModeTimer: 0, raccoonSpawnTimer: 15, windTimer: 20 + Math.random() * 30, windDuration: 0, rainTimer: 30 + Math.random() * 40, rainDuration: 0,
  
  maxCarry: 3, 
  carried: { wood: 0, apple: 0, mushroom: 0, fish: 0, blue_fish: 0 },
  tentStorage: { wood: 0, apple: 0, mushroom: 0, fish: 0, cooked_mushroom: 0, cooked_fish: 0, blue_fish: 0, cooked_blue_fish: 0 },
  
  sessionGoldenWood: 0, 
  
  isMuted: localStorage.getItem("campfireMuted") === "true",
  bloodMoonActive: false, bloodMoonHowlTimer: 0, bloodMoonMessageTimer: 0, survivedBloodMoonMessageTimer: 0, fireEaterSpawnTimer: 0,
  score: 0, health: 100, dayNightTimer: 0, lastTs: 0, gameOver: false, deathAnimDone: false, damageFlash: 0, currentDay: 1, dayMessageTimer: 0,
  
  equippedFood: null,
  equippedCount: 0,
  apples: [],
  pond: { x: 0, y: 0, r: 55, fishProgress: 0, fishCaughtToday: false },
  cookTimer: 0,
  
  dogRescued: false
};

window.depositItems = function(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    let deposited = false;
    for (let key in state.carried) {
        if (state.carried[key] > 0) {
            state.tentStorage[key] += state.carried[key];
            state.carried[key] = 0;
            deposited = true;
        }
    }
    if (deposited) {
        playSound(sounds.wood);
        state.floatingTexts.push({ x: state.tent.x, y: state.tent.y - 40, text: t("deposited"), life: 1.5, color: "#4ade80" });
        updateHud();
    }
};

window.equipFood = function(type, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    
    if (state.equippedFood && state.equippedFood !== type) {
        state.tentStorage[state.equippedFood] += state.equippedCount;
        state.equippedFood = null;
        state.equippedCount = 0;
    }
    
    if (state.tentStorage[type] > 0) {
        state.equippedFood = type;
        if (!state.equippedCount) state.equippedCount = 0;
        state.equippedCount++;
        state.tentStorage[type]--;
        state.cookTimer = 0; 
        playSound(sounds.wood);
        updateHud(); 
    }
};

window.packCampAndLeave = function(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    
    if (isNight() || state.bloodMoonActive) {
        state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: t("tooDangerous"), life: 2.0, color: "#ff4a4a" });
        return;
    }
    
    if (state.gameMode === "STORY") {
        if (state.currentLevel === 1) {
            if (state.currentDay < 3) {
                state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: t("notReady"), life: 2.0, color: "#ff4a4a" });
                return;
            }
        } else if (state.currentLevel === 2) {
            if (!state.dogRescued) {
                state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: t("mustRescueDog"), life: 2.0, color: "#ff4a4a" });
                return;
            }
            if (state.currentDay < 5) {
                state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: t("notReady"), life: 2.0, color: "#ff4a4a" });
                return;
            }
        }
    }
    
    state.gameOver = true;
    state.deathAnimDone = true;
    controls.up = controls.down = controls.left = controls.right = false; 
    stopAudio();
    
    let currentBank = parseInt(localStorage.getItem("campfireGoldenWood") || "0");
    currentBank += state.sessionGoldenWood;
    localStorage.setItem("campfireGoldenWood", currentBank);
    
    if (state.score > (localStorage.getItem("campfireHighScore") || 0)) localStorage.setItem("campfireHighScore", Math.floor(state.score));
    if (state.currentDay > (localStorage.getItem("campfireHighDay") || 1)) localStorage.setItem("campfireHighDay", state.currentDay); 
    
    let titleText = t("safelyExtracted");
    let titleColor = "#4ade80";
    
    if (state.gameMode === "STORY") {
        if (state.currentLevel === 1) {
            localStorage.setItem("campfireSurvivalUnlocked", "true");
            localStorage.setItem("campfireCurrentStoryLevel", 2);
            titleText = t("lvl1Complete");
            titleColor = "#ffd700";
        } else if (state.currentLevel === 2) {
            localStorage.setItem("campfireCurrentStoryLevel", 3);
            titleText = t("lvl2Complete");
            titleColor = "#ffd700";
        }
    }
    
    setTimeout(() => { 
        const goUI = document.getElementById("gameOverUI"); 
        if(goUI) { 
            const title = goUI.querySelector("h2");
            if(title) { title.textContent = titleText; title.style.color = titleColor; }
            
            document.getElementById("finalScoreText").innerHTML = `${t("score")}: ${Math.floor(state.score)} <br> ${t("day")}: ${state.currentDay} <br><br> <span style="color:#ffd700; font-size:18px; text-shadow: 0 0 5px rgba(255,215,0,0.5);">+${state.sessionGoldenWood} ${t("goldenWoodSaved")}</span>`; 
            
            const mrBtn = document.getElementById("menuReturnBtn");
            if(mrBtn) mrBtn.textContent = t("mainMenu");
            
            goUI.classList.remove("hidden"); 
        }     
    }, 500);
};

function initAudio() {
  if (audioStarted) return;
  audioStarted = true;
  sounds.day.volume = 0; sounds.night.volume = 0; sounds.fire.volume = 0;
  sounds.wind.volume = 0; sounds.rain.volume = 0; sounds.bloodmoon.volume = 0;
  Object.keys(sounds).forEach(key => {
    let snd = sounds[key];
    snd.muted = state.isMuted;
    if (snd.loop && key !== "typewriter") snd.play().catch(() => console.log("Audio file not added yet."));
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
function resumeAudio() { 
    if (!audioStarted) return; 
    Object.keys(sounds).forEach(key => { 
        let snd = sounds[key];
        if (snd.loop && key !== "typewriter") snd.play().catch(()=>{}); 
    }); 
}

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
  .bag-container { display: flex; flex-direction: column; justify-content: center; background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 6px; border: 1px solid #4a5568; min-width: 150px; }
  .time-container { position: relative; width: 26px; height: 26px; display: flex; justify-content: center; align-items: center; }
  .time-icon { position: absolute; width: 24px; height: 24px; transition: opacity 0.5s; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.8)); }
  .score-text { font-size: 13px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px #000; background: rgba(0,0,0,0.4); padding: 6px 12px; border-radius: 6px; border: 1px solid #4a5568; margin-top: 6px; text-align: center; line-height: 1.4; }
  .shop-container { display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; padding-right: 5px; }
  .shop-container::-webkit-scrollbar { width: 4px; }
  .shop-container::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
`;
document.head.appendChild(style);

const SVG_SUN = '<svg class="time-icon sun-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="yellow"/><path d="M50 0 V10 M50 90 V100 M0 50 H10 M90 50 H100 M15 15 L22 22 M78 78 L85 85 M15 85 L22 78 M78 15 L85 22" stroke="yellow" stroke-width="5"/></svg>';
const SVG_MOON = '<svg class="time-icon moon-icon" viewBox="0 0 100 100"><path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill="white"/></svg>';
const SVG_BLOOD_MOON = '<svg class="time-icon blood-moon-icon" viewBox="0 0 100 100"><path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill="#ff2a2a" filter="drop-shadow(0px 0px 5px rgba(255,0,0,0.8))"/></svg>';

const topRow = document.createElement("div"); topRow.className = "hud-row";
const bottomRow = document.createElement("div"); bottomRow.className = "hud-row";

const UPGRADE_DATA = {
  backpack: [{ level: 1, capacity: 6, cost: 150 }, { level: 2, capacity: 10, cost: 450 }, { level: 3, capacity: 15, cost: 1200 }],
  pet: [{ level: 1, speed: 190, cost: 300 }, { level: 2, speed: 230, cost: 700 }],
  fireShield: [{ level: 1, cost: 200 }, { level: 2, cost: 500 }, { level: 3, cost: 1000 }],
  fishing: [{ level: 1, cost: 300 }, { level: 2, cost: 800 }, { level: 3, cost: 1500 }]
};

let currentBackpackTier = parseInt(localStorage.getItem("backpackTier")) || 0;
let currentPetTier = parseInt(localStorage.getItem("campfirePetTier")) || 0;
let currentFireShieldTier = parseInt(localStorage.getItem("campfireFireShieldTier")) || 0;
let currentFishingTier = parseInt(localStorage.getItem("campfireFishingTier")) || 0;

function updateMaxCarryCapacity() { 
    if (currentBackpackTier === 0) { state.maxCarry = 3; } 
    else { state.maxCarry = UPGRADE_DATA.backpack[currentBackpackTier - 1].capacity; } 
}
function updatePetStats() { if (currentPetTier === 0) { state.pet.speed = 155; } else if (currentPetTier === 1) { state.pet.speed = 190; } else if (currentPetTier === 2) { state.pet.speed = 230; } }

updateMaxCarryCapacity(); updatePetStats();

function renderBagIcons() { 
    let currentCarry = Object.values(state.carried).reduce((a,b)=>a+b, 0);
    let isFull = currentCarry >= state.maxCarry;
    let statusText = isFull ? `<span style="color:#ff4a4a; font-size:12px; margin-left:4px; font-weight:900;">(FULL)</span>` : "";
    
    let html = `
        <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
            <span style="font-size:16px;">🎒 <span style="color:${isFull ? '#ff4a4a' : '#fff'}; font-weight:bold;">${currentCarry}/${state.maxCarry}</span>${statusText}</span>
        </div>
        <div style="display:flex; justify-content:center; gap:6px; font-size:12px; margin-top:2px;">
    `;
    if(state.carried.wood > 0) html += `<span>🪵${state.carried.wood}</span>`;
    if(state.carried.apple > 0) html += `<span>🍎${state.carried.apple}</span>`;
    if(state.carried.mushroom > 0) html += `<span>🍄${state.carried.mushroom}</span>`;
    if(state.carried.fish > 0) html += `<span>🐟${state.carried.fish}</span>`;
    if(state.carried.blue_fish > 0) html += `<span>💎🐟${state.carried.blue_fish}</span>`;
    if(currentCarry === 0) html += `<span style="color:#aaa;">${t("empty")}</span>`;
    html += `</div>`;
    return html; 
}

const bagWrap = document.createElement("div"); bagWrap.className = "bag-container"; bagWrap.id = "bagWrapper"; bagWrap.innerHTML = renderBagIcons(); topRow.appendChild(bagWrap);
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
fireWrap.innerHTML = '🔥 <div class="bar-container"><div id="fireBar" class="bar-fill fire-fill"></div></div>'; barsGroup.appendChild(fireWrap);
const healthWrap = document.createElement("div"); healthWrap.className = "bar-wrapper";
healthWrap.innerHTML = '❤️ <div class="bar-container"><div id="healthBar" class="bar-fill health-fill"></div></div>'; barsGroup.appendChild(healthWrap);bottomRow.appendChild(barsGroup);
const scoreWrap = document.createElement("div"); scoreWrap.className = "score-text";
scoreWrap.innerHTML = `<span id="dayTextContainer"></span> | <span id="scoreTextContainer"></span> | <span style="color:#ffd700;">🟡 <span id="goldenWoodText">0</span></span>`; bottomRow.appendChild(scoreWrap);
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

function isPointInPond(px, py) {
    let isAutumn = state.gameMode === "STORY" && state.currentLevel === 2;
    if (isAutumn) {
        const h = canvas.clientHeight || 600;
        return py > h - 100; 
    }
    return dist({x: px, y: py}, {x: state.pond.x, y: state.pond.y}) < state.pond.r;
}

function generateEnvironment() { 
    state.trees = [];
    state.rocks = [];
    const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
    let isAutumn = state.gameMode === "STORY" && state.currentLevel === 2;
    
    if (isAutumn) {
        for(let i=0; i<20; i++) {
            let rx = Math.random() * w;
            let ry = Math.random() * (h - 120);
            if(dist({x:rx, y:ry}, state.fire) > 200) {
                state.rocks.push({x: rx, y: ry, r: 10 + Math.random()*15});
            }
        }
    }
    
    for (let i = 0; i < 70; i++) { 
        let tx = Math.random() * w;
        let ty = Math.random() * h; 
        if (dist({ x: tx, y: ty }, state.fire) > 230 && !isPointInPond(tx, ty)) { 
            let c1 = isAutumn ? "#8b4513" : "#142e12";
            let c2 = isAutumn ? "#a0522d" : "#1a3a17";
            let dead = isAutumn && Math.random() < 0.4;
            state.trees.push({ x: tx, y: ty, r: 15 + Math.random() * 25, color: Math.random() > 0.5 ? c1 : c2, isDead: dead });
        } 
    } 
}

function resizeCanvas() { 
  const ratio = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.imageSmoothingEnabled = false;
  state.fire.x = rect.width * 0.5;
  state.fire.y = rect.height * 0.5 + 40; state.tent.x = state.fire.x; state.tent.y = state.fire.y - 85;
  state.pond.x = 0; state.pond.y = rect.height; state.pond.r = rect.width * 0.35;
  if (state.trees.length === 0) generateEnvironment();
}

function dist(a, b) { let d = Math.hypot(a.x - b.x, a.y - b.y);
return isNaN(d) ? 9999 : d; }

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

function isNight() { return (state.dayNightTimer % CYCLE_SECONDS) >= DAY_SECONDS;
}

function updateHud() {
  const fireBar = document.getElementById("fireBar"); if (fireBar) fireBar.style.width = Math.max(0, state.fire.level) + "%";
  const hBar = document.getElementById("healthBar");
  if (hBar) hBar.style.width = Math.max(0, state.health) + "%";
  
  const bWrap = document.getElementById("bagWrapper");
  if (bWrap) { bWrap.innerHTML = renderBagIcons(); }

  const sIcon = document.querySelector(".sun-icon");
  const mIcon = document.querySelector(".moon-icon:not(.blood-moon-icon)"); const bmIcon = document.querySelector(".blood-moon-icon");
  if (sIcon && mIcon && bmIcon) { 
      if (isNight()) { sIcon.style.opacity = 0;
      if (state.currentDay % 4 === 0) { mIcon.style.opacity = 0; bmIcon.style.opacity = 1; } else { mIcon.style.opacity = 1;
      bmIcon.style.opacity = 0; } } else { sIcon.style.opacity = 1; mIcon.style.opacity = 0; bmIcon.style.opacity = 0;
      } 
  }
  
  const scoreContainer = document.getElementById("scoreTextContainer");
  if(scoreContainer) scoreContainer.textContent = `${t("score")}: ${Math.floor(state.score)}`;
  
  const dayContainer = document.getElementById("dayTextContainer");
  if(dayContainer) dayContainer.textContent = `${t("day")} ${state.currentDay}`;
  
  const goldEl = document.getElementById("goldenWoodText"); if (goldEl) goldEl.textContent = state.sessionGoldenWood;
  
  const tMenu = document.getElementById("tentMenu");
  if (tMenu) {
      const entrancePos = { x: state.tent.x, y: state.tent.y + 35 };
      if (state.gameOver || dist(state.player, entrancePos) > 40) {
          tMenu.classList.add("hidden-fade");
      } else {
          tMenu.classList.remove("hidden-fade");
          
          const hasCarriedItems = Object.values(state.carried).reduce((a,b)=>a+b, 0) > 0;
          let depositBtn = hasCarriedItems 
            ? `<div class="tent-item" style="background: rgba(52, 152, 219, 0.4); border: 1px solid #3498db; width: 100%; margin-bottom: 5px;" onpointerdown="depositItems(event)">${t("depositAll")}</div>` 
            : "";

          const newTentHTML = depositBtn + `
              <div class="tent-item" onpointerdown="equipFood('apple', event)">🍎 ${state.tentStorage.apple}</div>
              <div class="tent-item" onpointerdown="equipFood('mushroom', event)">🍄 ${state.tentStorage.mushroom}</div>
              <div class="tent-item" onpointerdown="equipFood('fish', event)">🐟 ${state.tentStorage.fish}</div>
              ${state.tentStorage.blue_fish > 0 ? `<div class="tent-item" onpointerdown="equipFood('blue_fish', event)">💎🐟 ${state.tentStorage.blue_fish}</div>` : ""}
              ${state.tentStorage.cooked_blue_fish > 0 ? `<div class="tent-item" onpointerdown="equipFood('cooked_blue_fish', event)">💎🍣 ${state.tentStorage.cooked_blue_fish}</div>` : ""}
              ${state.tentStorage.cooked_mushroom > 0 ? `<div class="tent-item" onpointerdown="equipFood('cooked_mushroom', event)">🥘 ${state.tentStorage.cooked_mushroom}</div>` : ""}
              ${state.tentStorage.cooked_fish > 0 ? `<div class="tent-item" onpointerdown="equipFood('cooked_fish', event)">🍣 ${state.tentStorage.cooked_fish}</div>` : ""}
              <div class="tent-item" style="background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; margin-top: 5px; width: 100%;" onpointerdown="packCampAndLeave(event)">${t("packCamp")}</div>
          `;
          if (tMenu.innerHTML !== newTentHTML) {
              tMenu.innerHTML = newTentHTML;
          }
      }
  }

  const mBtn = document.getElementById("mobileActionBtn");
  if (mBtn) {
    if (state.equippedFood && state.equippedFood !== "fish" && state.equippedFood !== "blue_fish") { 
          mBtn.innerHTML = t("eat");
          mBtn.style.color = "#4ade80"; 
      } else {
          mBtn.innerHTML = t("feedFire");
          mBtn.style.color = "#fff"; 
      }
  }
}

function clampPlayer() { const w = canvas.clientWidth || 800; const h = canvas.clientHeight || 600;
const half = getPlayerDrawSize() * 0.5; state.player.x = Math.min(w - half, Math.max(half, state.player.x || half));
state.player.y = Math.min(h - half, Math.max(half, state.player.y || half)); }

function collectItems() {
  let currentCarry = Object.values(state.carried).reduce((a,b)=>a+b, 0);

  state.woods = state.woods.filter((wood) => { 
      if (dist(state.player, wood) <= state.player.r + wood.r) { 
          if (wood.isGolden) {
              state.sessionGoldenWood++;
              state.score += 50;
              playSound(sounds.wood);
              state.floatingTexts.push({ x: state.player.x, y: state.player.y - 40, text: "GOLDEN WOOD!", life: 1.5, color: "#ffd700" });
              state.pendingWoodRespawns++;
              return false;
          } else {
              if (currentCarry < state.maxCarry) {
                  state.carried.wood++;
                  currentCarry++;
                  state.score += 5;
                  playSound(sounds.wood);
                  state.pendingWoodRespawns++;
                  return false;
              }
          }
      } 
      return true; 
  });
  
  state.mushrooms = state.mushrooms.filter((m) => { 
      if (dist(state.player, m) <= state.player.r + m.r) { 
          if (currentCarry < state.maxCarry) {
              state.carried.mushroom++; 
              currentCarry++;
              playSound(sounds.wood); 
              state.floatingTexts.push({ x: state.player.x, y: state.player.y - 20, text: "+1 🍄", life: 1.5, color: "#ff4a4a" }); 
              state.pendingMushroomRespawns++;
              return false; 
          }
      } 
      return true; 
  });

  state.apples = state.apples.filter((a) => { 
      if (dist(state.player, a) <= state.player.r + a.r) { 
          if (currentCarry < state.maxCarry) {
              state.carried.apple++; 
              currentCarry++;
              playSound(sounds.wood); 
              state.floatingTexts.push({ x: state.player.x, y: state.player.y - 20, text: "+1 🍎", life: 1.5, color: "#ff3333" }); 
              return false; 
          }
      } 
      return true; 
  });

  if (state.blueMushroom && dist(state.player, state.blueMushroom) <= state.player.r + state.blueMushroom.r) { 
      state.superModeTimer = 8.0; playSound(sounds.feed);
      state.score += 100; 
      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("superMode"), life: 2.0, color: "#00ffff" }); 
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

// === BURASI ÖNCEKİ KODDA YANLIŞLIKLA SİLİNEN KISIMDI ===
function updateLeafParticles(dt) {
    if (state.gameMode !== "STORY" || state.currentLevel !== 2) return;
    
    state.leafSpawnTimer -= dt;
    let spawnRate = state.windDuration > 0 ? 0.05 : 0.4;
    if(state.leafSpawnTimer <= 0) {
        state.leafParticles.push({
            x: (canvas.clientWidth || 800) + 50,
            y: Math.random() * (canvas.clientHeight || 600),
            speed: (state.windDuration > 0 ? 300 : 100) + Math.random() * 50,
            wobbleSpeed: 5 + Math.random() * 5,
            wobbleOffset: Math.random() * Math.PI * 2,
            color: Math.random() > 0.5 ? "#a0522d" : "#cd853f"
        });
        state.leafSpawnTimer = spawnRate;
    }

    for(let i = state.leafParticles.length - 1; i >= 0; i--) {
        let lp = state.leafParticles[i];
        lp.x -= lp.speed * dt;
        lp.y += Math.sin(performance.now() * 0.001 * lp.wobbleSpeed + lp.wobbleOffset) * 2;
        if(lp.x < -50) state.leafParticles.splice(i, 1);
    }
}

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
      } else if (state.equippedFood === "cooked_blue_fish") {
          state.health = 100;
          state.superModeTimer = 16.0; 
          state.score += 200;
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("superMode"), life: 2.0, color: "#00ffff" });
      }
      
      state.equippedCount--;
      if (state.equippedCount <= 0) {
          state.equippedFood = null;
          state.equippedCount = 0;
      }
      playSound(sounds.eat); updateHud();
      return; 
  }

  const inRange = dist(state.player, state.fire) < state.player.r + state.fire.r + 20;
  if (!inRange) return;

  let usedWood = false;
  if (state.tentStorage.wood > 0) {
      state.tentStorage.wood--;
      usedWood = true;
  } else if (state.carried.wood > 0) {
      state.carried.wood--;
      usedWood = true;
  }

  if (!usedWood) {
    if (state.equippedFood === "fish" || state.equippedFood === "blue_fish") {
      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("needsCooking"), life: 1.5, color: "#ff4a4a" });
    } else {
      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("noWood"), life: 1.0, color: "#ff4a4a" });
    }
    return;
  }
  
  if (state.fire.level <= 0) { spawnSmoke(state.fire.x, state.fire.y, 12); }
  if (state.fire.level < 15 && state.fire.level > 0) { state.score += 50;
      state.floatingTexts.push({ x: state.fire.x, y: state.fire.y - 40, text: t("closeCall"), life: 2.0, color: "#ffd700" });
  }
  spawnSparks(state.fire.x, state.fire.y, 15);
  state.fire.level = Math.min(100, state.fire.level + 18); state.score += 10;
  playSound(sounds.feed); updateHud();
}

function nightBlend() { const cyclePos = state.dayNightTimer % CYCLE_SECONDS; const edge = 8;
  if (cyclePos < DAY_SECONDS - edge) return 0; if (cyclePos < DAY_SECONDS) return (cyclePos - (DAY_SECONDS - edge)) / edge;
  if (cyclePos < DAY_SECONDS + edge) return 1; if (cyclePos < CYCLE_SECONDS - edge) return 1;
  return 1 - (cyclePos - (CYCLE_SECONDS - edge)) / edge; }

function updatePet(dt) {
  if (state.gameOver) return;
  
  if (state.gameMode === "STORY" && state.currentLevel === 1) return;
  if (state.gameMode === "STORY" && state.currentLevel === 2 && !state.dogRescued) return;

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
      let cooldownMultiplier = state.bloodMoonActive ? 0.5 : 1.0;
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
                  state.floatingTexts.push({ x: attackTarget.x, y: attackTarget.y - 20, text: t("stunned"), life: 1.5, color: "#ff4a4a" }); state.pet.attackCooldown = 10.0 * cooldownMultiplier;
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
    } } else if (state.pet.hasWood) { 
        state.pet.targetX = state.tent.x + 40; 
        state.pet.targetY = state.tent.y + 20; 
        state.pet.isSitting = false;
        
        if (dist(state.pet, {x: state.pet.targetX, y: state.pet.targetY}) < 30) { 
            state.tentStorage.wood++; 
            state.score += 5; 
            playSound(sounds.wood);
            state.floatingTexts.push({ x: state.pet.x, y: state.pet.y - 20, text: t("stored"), life: 1.5, color: "#d2b48c" }); 
            updateHud(); 
            state.pet.hasWood = false;
            state.pet.fetchTimer = 20 + Math.random() * 20; 
        } 
    } else { 
        if (dToPlayer > 50) { state.pet.targetX = state.player.x;
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
// === BURASI ÖNCEKİ KODDA YANLIŞLIKLA SİLİNEN KISIMDI ===

function update(dt) {
  if (state.status === "MENU" || state.status === "PAUSED") { updateFireAnimation(dt);
      return; }
  if (state.gameOver) { updateDeathAnimation(dt); return; }
  
  state.dayNightTimer += dt;
  let calcDay = Math.floor(state.dayNightTimer / CYCLE_SECONDS) + 1;
  if (calcDay > state.currentDay) { 
      state.currentDay = calcDay;
      state.dayMessageTimer = 3.0;
      state.pond.fishCaughtToday = false;
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
  const len = Math.hypot(moveX, moveY) || 1;
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
  
  let isAutumn = state.gameMode === "STORY" && state.currentLevel === 2;

  if (isAutumn) {
      let searchingPile = null;
      for(let p of state.leafPiles) {
          if(!p.searched && dist(state.player, p) < state.player.r + p.r + 10) {
              searchingPile = p; break;
          }
      }
      if(searchingPile && !isMoving) {
          searchingPile.progress += dt;
          if(searchingPile.progress >= 2.5) {
              searchingPile.searched = true;
              
              if(searchingPile.content === "dog" && state.currentDay < 3) {
                  let unsearched = state.leafPiles.filter(p => !p.searched && p !== searchingPile);
                  if(unsearched.length > 0) {
                      let newDogPile = unsearched[Math.floor(Math.random() * unsearched.length)];
                      newDogPile.content = "dog";
                      searchingPile.content = Math.random() > 0.5 ? "wood" : "empty";
                  }
              }
              
              if(searchingPile.content === "dog") {
                  state.dogRescued = true;
                  state.pet.x = searchingPile.x;
                  state.pet.y = searchingPile.y;
                  state.floatingTexts.push({x: state.player.x, y: state.player.y - 40, text: t("dogRescued"), life: 2.0, color: "#4ade80"});
                  playSound(sounds.wood);
              } else if(searchingPile.content === "wood") {
                  for(let k=0; k<3; k++) {
                      state.woods.push({ x: searchingPile.x + (Math.random()*30-15), y: searchingPile.y + (Math.random()*30-15), r: 10, angle: Math.random() * Math.PI * 2, isGolden: false });
                  }
                  state.floatingTexts.push({x: searchingPile.x, y: searchingPile.y - 20, text: t("leafWood"), life: 1.5, color: "#ffd700"});
                  playSound(sounds.wood);
              } else if(searchingPile.content === "raccoon") {
                  state.raccoons.push({ x: searchingPile.x, y: searchingPile.y, speed: 150, r: 12, hasWood: false, fleeAngle: null, wobble: 0 });
                  state.floatingTexts.push({x: searchingPile.x, y: searchingPile.y - 20, text: t("leafRaccoon"), life: 1.5, color: "#ff4a4a"});
                  playSound(sounds.howl);
              } else {
                  state.floatingTexts.push({x: searchingPile.x, y: searchingPile.y - 20, text: t("leafEmpty"), life: 1.5, color: "#aaa"});
              }
          }
      } else if (searchingPile && isMoving) {
          searchingPile.progress = 0;
      } else {
          for(let p of state.leafPiles) p.progress = 0;
      }
      
      const ch = canvas.clientHeight || 600;
      let cliffY = ch - 95;
      if (state.player.y > cliffY - state.player.r) {
          state.player.y = cliffY - state.player.r;
      }
      state.pond.fishProgress = 0;
  } else {
      let dPond = dist(state.player, state.pond);
      
      if (dPond < state.pond.r + state.player.r - 5) {
          let angle = Math.atan2(state.player.y - state.pond.y, state.player.x - state.pond.x);
          state.player.x = state.pond.x + Math.cos(angle) * (state.pond.r + state.player.r - 5);
          state.player.y = state.pond.y + Math.sin(angle) * (state.pond.r + state.player.r - 5);
          dPond = state.pond.r + state.player.r - 5;
      }

      let reqFishTime = currentFishingTier >= 1 ? 2.0 : 4.0; 
      let currentCarry = Object.values(state.carried).reduce((a,b)=>a+b, 0);

      if (dPond <= state.pond.r + state.player.r + 15 && !isMoving && !state.pond.fishCaughtToday && currentCarry < state.maxCarry) {
          state.pond.fishProgress += dt;
          if (state.pond.fishProgress >= reqFishTime) {
              state.pond.fishProgress = 0;
              state.pond.fishCaughtToday = true;
              
              if (currentFishingTier >= 2 && Math.random() < 0.20) {
                  state.sessionGoldenWood += 10;
                  let currentBank = parseInt(localStorage.getItem("campfireGoldenWood") || "0");
                  localStorage.setItem("campfireGoldenWood", currentBank + 10);
                  state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("treasure"), life: 2.0, color: "#ffd700" });
                  playSound(sounds.wood);
              } else {
                  if (currentFishingTier >= 3) {
                      state.carried.blue_fish++;
                      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+1 💎🐟", life: 1.5, color: "#00ffff" });
                  } else {
                      state.carried.fish++;
                      state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: "+1 🐟", life: 1.5, color: "#4ea9ff" });
                  }
              }
          }
      } else { 
          state.pond.fishProgress = 0;
      }
  }

  if (!state.cookTimer) state.cookTimer = 0;
  let dFire = dist(state.player, state.fire);
  let nearFire = dFire < state.fire.r + 40 && state.fire.level > 0;
  if (nearFire && (state.equippedFood === "mushroom" || state.equippedFood === "fish" || state.equippedFood === "blue_fish")) {
      state.cookTimer += dt;
      let reqTime = (state.equippedFood === "fish" || state.equippedFood === "blue_fish") ? 3.0 : 2.0;
      if (state.cookTimer >= reqTime) {
          if (state.equippedFood === "fish") state.equippedFood = "cooked_fish";
          else if (state.equippedFood === "blue_fish") state.equippedFood = "cooked_blue_fish";
          else state.equippedFood = "cooked_mushroom";
          state.cookTimer = 0;
          state.floatingTexts.push({ x: state.player.x, y: state.player.y - 30, text: t("cooked"), life: 1.5, color: "#ff9900" });
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
          if (state.windDuration <= 0) {
              state.windTimer = 40 + Math.random() * 40;
              if (isAutumn) state.windTimer = 10 + Math.random() * 15;
          }
      } else { 
          state.windTimer -= dt;
          if (state.windTimer <= 0) {
              state.windDuration = 10 + Math.random() * 10; 
              if (isAutumn) state.windDuration = 15 + Math.random() * 10;
          }
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
  
  updatePet(dt); updateRaccoons(dt); updateSmoke(dt); updateSparks(dt); updateFloatingTexts(dt); updateWind(dt); updateRain(dt); updateFireAnimation(dt); updateLeafParticles(dt);
  
  state.health -= dt * 0.3;
  if (isMoving) state.health -= dt * 1.2; 
  if (isNight() && state.fire.level <= 0) state.health -= dt * 14;
  if (isNight()) {
      let bmMultiplier = state.bloodMoonActive ? 2 : 1;
      const maxEnemies = (3 + Math.floor(state.score / 50)) * bmMultiplier;
      if (state.enemies.length < maxEnemies && Math.random() < dt * 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const spawnDist = Math.max(canvas.clientWidth || 800, canvas.clientHeight || 600) / 2 + 100;
          let speedMult = state.bloodMoonActive ? 1.3 : 1.0;
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
                  text: t("fireDrained"),
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
                      text: t("defended"),
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
        state.gameOver = true; state.deathAnimDone = false; anim.deathFrame = 0;
        anim.deathTimer = 0;
        state.bloodMoonActive = false; controls.up = controls.down = controls.left = controls.right = false; stopAudio();
        if (dieSprite.complete) configureDeathClip();
        
        let savedGold = Math.floor(state.sessionGoldenWood / 2);
        let lostGold = state.sessionGoldenWood - savedGold;
        
        try { 
            if (state.score > (localStorage.getItem("campfireHighScore") || 0)) localStorage.setItem("campfireHighScore", Math.floor(state.score));
            if (state.currentDay > (localStorage.getItem("campfireHighDay") || 1)) localStorage.setItem("campfireHighDay", state.currentDay); 
            
            let currentBank = parseInt(localStorage.getItem("campfireGoldenWood") || "0");
            currentBank += savedGold;
            localStorage.setItem("campfireGoldenWood", currentBank);
        } catch(e) {}
        
        setTimeout(() => { 
            const goUI = document.getElementById("gameOverUI"); 
            if(goUI) { 
                const title = goUI.querySelector("h2");
                if(title) { title.textContent = "GAME OVER"; title.style.color = "#ff4a4a"; } 
                
                document.getElementById("finalScoreText").innerHTML = `${t("score")}: ${Math.floor(state.score)} <br> ${t("day")}: ${state.currentDay} <br><br> <span style="color:#ff4a4a; font-size:16px;">-${lostGold} Gold Lost (Death Penalty)</span><br><span style="color:#ffd700; font-size:18px; text-shadow: 0 0 5px rgba(255,215,0,0.5);">+${savedGold} ${t("goldenWoodSaved")}</span>`; 
                
                const mrBtn = document.getElementById("menuReturnBtn");
                if(mrBtn) mrBtn.textContent = t("mainMenu");
                
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
function drawLeafParticles() {
    state.leafParticles.forEach(lp => {
        ctx.save();
        ctx.translate(lp.x, lp.y);
        ctx.rotate(performance.now() * 0.005);
        ctx.fillStyle = lp.color;
        ctx.beginPath(); ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    });
}
function drawLeafPiles() {
    if (state.gameMode !== "STORY" || state.currentLevel !== 2) return;
    state.leafPiles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        let wobble = (!p.searched && state.windDuration > 0) ? Math.sin(performance.now() * 0.005 + p.x) * 2 : 0;
        
        if(p.searched) {
            ctx.globalAlpha = 0.4;
            wobble = 0;
        }
        
        p.leaves.forEach(l => {
            ctx.save();
            ctx.translate(l.dx, l.dy + wobble);
            ctx.rotate(l.ang);
            ctx.fillStyle = l.col;
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.quadraticCurveTo(0, -3, 5, 0);
            ctx.quadraticCurveTo(0, 3, -5, 0);
            ctx.fill();
            ctx.restore();
        });
        ctx.restore();

        if(!p.searched && p.progress > 0) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(p.x - 20, p.y - p.r - 15, 40, 6);
            ctx.fillStyle = "#ffd700";
            ctx.fillRect(p.x - 20, p.y - p.r - 15, 40 * (p.progress / 2.5), 6);
            ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial";
            ctx.textAlign = "center"; ctx.fillText(t("searching"), p.x, p.y - p.r - 20);
        }
    });
}

function drawEnvironment() {
  const w = (canvas.clientWidth || 800) + 10; const h = (canvas.clientHeight || 600) + 10;
  
  let isAutumn = state.gameMode === "STORY" && state.currentLevel === 2;
  
  let groundColor = isAutumn ? "#3d2b1c" : "#1e3d1c";
  ctx.fillStyle = groundColor; 
  ctx.fillRect(-5, -5, w, h);
  
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let i = 0; i < 80; i++) ctx.fillRect((i * 67) % w, (i * 43) % h, 4, 4);
  
  ctx.fillStyle = "#3e2723"; ctx.beginPath(); ctx.ellipse(state.fire.x, state.fire.y - 20, 220, 140, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#4a3525"; ctx.beginPath();
  ctx.ellipse(state.fire.x, state.fire.y - 20, 170, 100, 0, 0, Math.PI * 2); ctx.fill();
  
  state.trees.forEach(tree => { 
      if(tree.isDead) {
          ctx.strokeStyle = "#2c1c11";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(tree.x, tree.y + 10);
          ctx.lineTo(tree.x, tree.y - tree.r);
          ctx.moveTo(tree.x, tree.y - tree.r*0.2);
          ctx.lineTo(tree.x - tree.r*0.6, tree.y - tree.r*0.8);
          ctx.moveTo(tree.x, tree.y - tree.r*0.4);
          ctx.lineTo(tree.x + tree.r*0.5, tree.y - tree.r*0.9);
          ctx.stroke();
      } else {
          ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.arc(tree.x + 8, tree.y + 8, tree.r, 0, Math.PI*2); ctx.fill(); 
          ctx.fillStyle = tree.color; ctx.beginPath(); ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI*2); ctx.fill(); 
          ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.arc(tree.x, tree.y, tree.r * 0.5, 0, Math.PI*2); ctx.fill(); 
      }
  });
  
  if (isAutumn) {
      // Uçurum / Kayalık Çizimi
      ctx.fillStyle = "#2a1f18";
      ctx.beginPath();
      ctx.moveTo(-10, h - 80);
      for(let i=0; i<=w+20; i+=30) {
          ctx.lineTo(i, h - 80 + Math.sin(i*0.05)*15);
      }
      ctx.lineTo(w+10, h+10);
      ctx.lineTo(-10, h+10);
      ctx.fill();

      ctx.strokeStyle = "#1a120c";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-10, h - 80);
      for(let i=0; i<=w+20; i+=30) {
          ctx.lineTo(i, h - 80 + Math.sin(i*0.05)*15);
      }
      ctx.stroke();

      // Etraftaki Kayalar
      state.rocks.forEach(rock => {
          ctx.save();
          ctx.translate(rock.x, rock.y);
          ctx.fillStyle = "#4a4a4a";
          ctx.beginPath(); ctx.ellipse(0, 0, rock.r, rock.r*0.7, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#5c5c5c";
          ctx.beginPath(); ctx.ellipse(-rock.r*0.15, -rock.r*0.15, rock.r*0.6, rock.r*0.4, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath(); ctx.ellipse(rock.r*0.3, rock.r*0.3, rock.r*0.4, rock.r*0.3, 0, 0, Math.PI*2); ctx.fill();
          ctx.restore();
      });
  } else {
      // Göl Çizimi (Bölüm 1 ve Survival)
      ctx.save();
      const px = state.pond.x; 
      const py = state.pond.y;
      const baseR = state.pond.r; 

      ctx.fillStyle = "rgba(10, 30, 60, 0.9)"; 
      ctx.beginPath();
      ctx.moveTo(px, py); 
      ctx.arc(px, py, baseR, 0, Math.PI * 2); 
      ctx.fill();
      ctx.fillStyle = "rgba(43, 108, 176, 0.6)"; 
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, baseR * 0.98, 0, Math.PI * 2); 
      ctx.fill();
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
      
      if (!state.pond.fishCaughtToday) {
        ctx.save();
        const cx = px + baseR * 0.45; 
        const cy = py - baseR * 0.45;
        
        const fishX = cx + Math.cos(time * 1.2) * (baseR * 0.25);
        const fishY = cy + Math.sin(time * 1.2) * (baseR * 0.25);
        const jumpSine = Math.sin(time * 2.5);
        const jumpAmount = Math.max(0, jumpSine) * 15; 
        
        const isMovingRight = -Math.sin(time * 1.2) > 0;
        
        ctx.translate(fishX, fishY - jumpAmount);
        if (isMovingRight) ctx.scale(-1, 1);
          
          let isBlue = currentFishingTier >= 3;
          if (isBlue) ctx.scale(1.4, 1.4);
          
          ctx.globalAlpha = jumpAmount > 2 ? 1.0 : 0.4; 
          
          ctx.fillStyle = isBlue ? "#00e5ff" : "#ff7f50";
          ctx.beginPath(); ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill(); 
          ctx.beginPath();
          ctx.moveTo(8, 0); ctx.lineTo(14, -5); ctx.lineTo(14, 5); ctx.fill(); 
          ctx.fillStyle = isBlue ? "#00b0ff" : "#ff5722"; 
          ctx.beginPath(); ctx.ellipse(0, -4, 3, 2, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-4, -1, 1.5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(-4.5, -1, 0.5, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        
        if (jumpAmount > 0 && jumpAmount < 6) {
            ctx.save();
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.beginPath();
            ctx.ellipse(fishX, fishY + 2, 6 + Math.random() * 4, 2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
      }
  }
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
  
  let stack = Math.min(15, state.tentStorage.wood);
  if(stack > 0) {
      ctx.save();
      const pileX = tx + 45;
      const pileY = ty + 25;
      for(let i=0; i<stack; i++) {
          let row = Math.floor(i / 5);
          let col = i % 5;
          drawWoodItem(pileX + col * 6, pileY - row * 5, 0, false);
      }
      ctx.restore();
  }
}

function drawFireLight() {
  const darkFactor = nightBlend();
  if (state.fire.level <= 0) return;
  const lightIntensity = isNight() ? 0.6 * darkFactor : 0.15;
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
  if (state.gameMode === "STORY" && state.currentLevel === 1) return;
  if (state.gameMode === "STORY" && state.currentLevel === 2 && !state.dogRescued) return;

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

  drawPlayerTrails(); drawWind(); drawRain(); drawRaccoons(); drawPet(); 
  drawLeafPiles();
  
  drawPlayerSprite(); drawFloatingTexts(); drawLeafParticles();
  
  const cw = canvas.clientWidth || 800; const ch = canvas.clientHeight || 600;
  if (state.dayMessageTimer > 0) { ctx.save();
      ctx.globalAlpha = Math.min(1, state.dayMessageTimer); ctx.fillStyle = "#ffd700";
      ctx.font = "bold 40px Arial"; ctx.textAlign = "center"; ctx.shadowColor = "#000";
      ctx.shadowBlur = 10;
      ctx.fillText(`${t("day")} ${state.currentDay}`, cw / 2, ch / 4); ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(t("survived"), cw / 2, ch / 4 + 30); ctx.restore();
  }

  if (state.bloodMoonMessageTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, state.bloodMoonMessageTimer));
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 25px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10;
      ctx.fillText(t("bloodMoonRises"), cw / 2, 60);
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
      ctx.fillText(t("bloodMoonSurvived"), cw / 2, 60);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 18px Arial";
      ctx.fillText("+100 🟡", cw / 2, 90);
      ctx.restore();
  }

  if (state.pond.fishProgress > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(state.player.x - 20, state.player.y - 45, 40, 6);
      ctx.fillStyle = "#4ea9ff";
      ctx.fillRect(state.player.x - 20, state.player.y - 45, 40 * (state.pond.fishProgress / 4.0), 6);
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial";
      ctx.textAlign = "center"; ctx.fillText(t("fishing"), state.player.x, state.player.y - 50);
  }
  if (state.cookTimer > 0) {
      let reqTime = (state.equippedFood === "fish" || state.equippedFood === "blue_fish") ? 3.0 : 2.0;
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(state.player.x - 20, state.player.y - 45, 40, 6);
      ctx.fillStyle = "#ff9900";
      ctx.fillRect(state.player.x - 20, state.player.y - 45, 40 * (state.cookTimer / reqTime), 6);
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial";
      ctx.textAlign = "center"; ctx.fillText(t("cooking"), state.player.x, state.player.y - 50);
  }

  if (state.equippedFood) {
      let icon = "";
      if (state.equippedFood === "apple") icon = "🍎";
      if (state.equippedFood === "mushroom") icon = "🍄";
      if (state.equippedFood === "cooked_mushroom") icon = "🥘"; 
      if (state.equippedFood === "fish") icon = "🐟";
      if (state.equippedFood === "cooked_fish") icon = "🍣";
      if (state.equippedFood === "blue_fish") icon = "💎🐟";
      if (state.equippedFood === "cooked_blue_fish") icon = "💎🍣";    
      ctx.font = "20px Arial"; ctx.textAlign = "center";
      let offsetY = (state.cookTimer > 0 || state.pond.fishProgress > 0) ? 75 : 55;
      let countText = state.equippedCount > 1 ? " x" + state.equippedCount : "";
      ctx.fillText(icon + countText, state.player.x, state.player.y - offsetY);
  }
  
  if (state.damageFlash > 0) { ctx.fillStyle = `rgba(255, 0, 0, ${state.damageFlash * 0.4})`;
      ctx.fillRect(-5, -5, w, h); }
}

function resetState() {
    state.gameOver = false; state.deathAnimDone = false;
    state.score = 0;
    state.health = 100; state.dayNightTimer = 0; state.currentDay = 1; state.damageFlash = 0;
    state.sessionGoldenWood = 0;
    
    state.carried = { wood: 0, apple: 0, mushroom: 0, fish: 0, blue_fish: 0 };
    state.tentStorage = { wood: 0, apple: 0, mushroom: 0, fish: 0, cooked_mushroom: 0, cooked_fish: 0, blue_fish: 0, cooked_blue_fish: 0 };
    
    updateMaxCarryCapacity();
    updatePetStats();
    
    const bWrap = document.getElementById("bagWrapper");
    if (bWrap) { bWrap.innerHTML = renderBagIcons(); }
    
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
    state.leafParticles = []; state.leafSpawnTimer = 0; state.leafPiles = [];
    state.pondLeaves = [];
    state.pendingWoodRespawns = 0; state.woodRespawnTimer = 0;
    state.pendingMushroomRespawns = 0; state.mushroomRespawnTimer = 0; state.blueMushroomTimer = 30 + Math.random() * 30; state.superModeTimer = 0; state.raccoonSpawnTimer = 15;
    state.windTimer = 20 + Math.random() * 30; state.windDuration = 0; state.rainTimer = 30 + Math.random() * 40; state.rainDuration = 0;
    state.bloodMoonActive = false; state.bloodMoonMessageTimer = 0; state.survivedBloodMoonMessageTimer = 0; state.bloodMoonHowlTimer = 0; state.fireEaterSpawnTimer = 0;
    
    if (state.gameMode === "STORY") {
        if (state.currentLevel === 1) {
            state.dogRescued = false;
        } else if (state.currentLevel === 2) {
            state.dogRescued = false;
            
            // Gölet yapraklarını oluştur
            for(let i=0; i<5; i++) {
                state.pondLeaves.push({
                    ang: Math.random() * Math.PI * 2,
                    dist: 10 + Math.random() * 35,
                    rotDir: Math.random() > 0.5 ? 1 : -1,
                    col: ["#8b4513", "#a0522d", "#cd853f"][Math.floor(Math.random() * 3)]
                });
            }

            let pileCoords = [];
            for (let i=0; i<6; i++) {
                let angle = Math.random() * Math.PI * 2;
                let distFromCenter = 250 + Math.random() * 200;
                let px = state.fire.x + Math.cos(angle) * distFromCenter;
                let py = state.fire.y + Math.sin(angle) * distFromCenter;
                px = Math.max(50, Math.min((canvas.clientWidth || 800) - 50, px));
                py = Math.max(50, Math.min((canvas.clientHeight || 600) - 50, py));
                if(isPointInPond(px, py)) { py -= 150; }
                
                // Daha gerçekçi yığınlar için rastgele yaprak koordinatları üret
                let leaves = [];
                for(let j=0; j<18; j++) {
                    leaves.push({
                        dx: (Math.random()-0.5) * 35,
                        dy: (Math.random()-0.5) * 20,
                        ang: Math.random() * Math.PI * 2,
                        col: ["#8b4513", "#a0522d", "#cd853f", "#d2691e"][Math.floor(Math.random()*4)]
                    });
                }
                
                pileCoords.push({ x: px, y: py, r: 25, progress: 0, searched: false, content: "empty", leaves: leaves });
            }
            let dogIndex = Math.floor(Math.random() * pileCoords.length);
            pileCoords[dogIndex].content = "dog";
            for(let i=0; i<pileCoords.length; i++) {
                if(i !== dogIndex) {
                    let rand = Math.random();
                    if(rand < 0.3) pileCoords[i].content = "wood";
                    else if(rand < 0.6) pileCoords[i].content = "raccoon";
                }
            }
            state.leafPiles = pileCoords;
        } else {
            state.dogRescued = true; 
        }
    } else {
        state.dogRescued = true; 
    }
    
    controls.up = false;
    controls.down = false; controls.left = false; controls.right = false;
    generateEnvironment();
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

function setupMainMenu() {
    const menuBtns = document.querySelector("#mainMenu .menu-buttons");
    if(!menuBtns) return;
    menuBtns.innerHTML = ""; 
    
    let savedStoryLevel = parseInt(localStorage.getItem("campfireCurrentStoryLevel")) || 1;
    
    const btnStory = document.createElement("button");
    btnStory.className = "menu-btn primary";
    btnStory.innerHTML = savedStoryLevel > 1 ? t("btnStoryCont") : t("btnStory");
    btnStory.onclick = () => {
        state.gameMode = "STORY";
        state.currentLevel = savedStoryLevel;
        resetState();
        if (state.currentLevel === 1) {
            playIntro(t("intro1Title"), t("intro1Text"), () => {
                initAudio(); state.status = "PLAYING"; 
            });
        } else if (state.currentLevel === 2) {
            playIntro(t("intro2Title"), t("intro2Text"), () => {
                initAudio(); state.status = "PLAYING"; 
            });
        } else {
            initAudio(); state.status = "PLAYING"; 
        }
    };
    menuBtns.appendChild(btnStory);
    
    const isSurvivalUnlocked = localStorage.getItem("campfireSurvivalUnlocked") === "true";
    const btnSurvival = document.createElement("button");
    btnSurvival.className = "menu-btn " + (isSurvivalUnlocked ? "primary" : "secondary");
    btnSurvival.innerHTML = isSurvivalUnlocked ? t("btnSurvival") : t("btnLocked");
    btnSurvival.disabled = !isSurvivalUnlocked;
    btnSurvival.onclick = () => {
        state.gameMode = "SURVIVAL";
        resetState();
        initAudio(); state.status = "PLAYING"; document.getElementById("mainMenu").classList.add("hidden");
    };
    menuBtns.appendChild(btnSurvival);
    
    const btnScores = document.createElement("button");
    btnScores.className = "menu-btn secondary";
    btnScores.innerHTML = t("btnScores");
    btnScores.onclick = () => {
        const high = localStorage.getItem("campfireHighScore") || 0; 
        const day = localStorage.getItem("campfireHighDay") || 1; 
        const bank = localStorage.getItem("campfireGoldenWood") || 0;
        
        document.getElementById("highScoreList").innerHTML = `
            <div style="text-align: left;">
                <p>🔥 Best Score: <span style="color:#ffd700;">${high}</span></p>
                <p>📅 Max Days: <span style="color:#ffd700;">${day}</span></p>
                <hr style="border:0; border-top:1px solid #555; margin: 15px 0;">
                <p>💰 Total Golden Wood: <span style="color:#ffd700;">${bank}</span></p>
            </div>
        `; 
        document.getElementById("mainMenu").classList.add("hidden"); 
        document.getElementById("scoreBoard").classList.remove("hidden"); 
        
        const scoreH2 = document.querySelector("#scoreBoard h2");
        if(scoreH2) scoreH2.textContent = t("statsTitle");
    };
    menuBtns.appendChild(btnScores);

    const upgBtn = document.createElement("button");
    upgBtn.id = "upgradesBtn";
    upgBtn.className = "menu-btn secondary";
    upgBtn.innerHTML = t("btnUpgrades");
    upgBtn.onclick = () => {
        renderUpgradesMenu();
        document.getElementById("mainMenu").classList.add("hidden");
        document.getElementById("upgradesMenu").classList.remove("hidden");
    };
    menuBtns.appendChild(upgBtn);
    
    const btnLang = document.createElement("button");
    btnLang.className = "menu-btn secondary";
    btnLang.innerHTML = "🌐 " + currentLang.toUpperCase();
    btnLang.onclick = () => {
        currentLang = currentLang === "tr" ? "en" : "tr";
        localStorage.setItem("campfireLang", currentLang);
        setupMainMenu();
    };
    menuBtns.appendChild(btnLang);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); seedWoods(); bindKeyboard(); setupMainMenu(); updateHud(); requestAnimationFrame(frame);

function resumeGame() { state.status = "PLAYING"; const pUI = document.getElementById("pauseUI"); if (pUI) pUI.classList.add("hidden");
  const pauseBtn = document.getElementById("hudPauseBtn"); if(pauseBtn) pauseBtn.innerHTML = "⏸"; resumeAudio(); state.lastTs = performance.now(); }
function quitToMenu() { const pUI = document.getElementById("pauseUI");
  if (pUI) pUI.classList.add("hidden"); state.status = "MENU"; setupMainMenu(); document.getElementById("mainMenu").classList.remove("hidden"); }

document.getElementById("backBtn").addEventListener("click", () => { document.getElementById("scoreBoard").classList.add("hidden"); document.getElementById("mainMenu").classList.remove("hidden"); });

const menuReturnBtn = document.getElementById("menuReturnBtn");
if(menuReturnBtn) { menuReturnBtn.addEventListener("click", () => { document.getElementById("gameOverUI").classList.add("hidden"); state.status = "MENU"; setupMainMenu(); document.getElementById("mainMenu").classList.remove("hidden"); }); }
const hudPauseBtn = document.getElementById("hudPauseBtn");
if(hudPauseBtn) { hudPauseBtn.addEventListener("click", () => { if (state.gameOver) return; if (state.status === "PLAYING") { state.status = "PAUSED"; const pUI = document.getElementById("pauseUI"); if (pUI) pUI.classList.remove("hidden"); hudPauseBtn.innerHTML = "▶"; pauseAudio(); 
    document.getElementById("pauseTitle").textContent = "PAUSED";
    document.getElementById("resumeBtn").textContent = t("resume");
    document.getElementById("quitBtn").textContent = t("mainMenu");
} else if (state.status === "PAUSED") { resumeGame(); } });
}

const dynamicResumeBtn = document.getElementById("resumeBtn"); if(dynamicResumeBtn) dynamicResumeBtn.addEventListener("click", resumeGame);
const dynamicQuitBtn = document.getElementById("quitBtn"); if(dynamicQuitBtn) dynamicQuitBtn.addEventListener("click", quitToMenu);

function renderUpgradesMenu() {
    const totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    const uMenu = document.getElementById("upgradesMenu");
    
    let bpButtonHTML = "";
    let bpDescHTML = "Current Capacity: 3 <br> Next: <span style='color:#ffd700'>6 Slots</span>";
    if (currentBackpackTier === 0) { bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 150</button>`; }
    else if (currentBackpackTier === 1) { bpDescHTML = "Current Capacity: 6 <br> Next: <span style='color:#ffd700'>10 Slots</span>"; bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 450</button>`; }
    else if (currentBackpackTier === 2) { bpDescHTML = "Current Capacity: 10 <br> Next: <span style='color:#ffd700'>15 Slots</span>"; bpButtonHTML = `<button class="buy-btn" onclick="buyBackpackUpgrade()">💰 1200</button>`; }
    else { bpDescHTML = "Current Capacity: 15 <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>"; bpButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    let petButtonHTML = "";
    let petDescHTML = "Sleeps at night. <br> Next: <span style='color:#ffd700'>Watchdog (Lv. 1)</span>";
    if (currentPetTier === 0) { petButtonHTML = `<button class="buy-btn" onclick="buyPetUpgrade()">💰 300</button>`; }
    else if (currentPetTier === 1) { petDescHTML = "Awake at night & barks to warn. <br> Next: <span style='color:#ffd700'>Defender (Lv. 2)</span>"; petButtonHTML = `<button class="buy-btn" onclick="buyPetUpgrade()">💰 700</button>`; }
    else { petDescHTML = "Awake at night & stuns nearest enemy. <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>"; petButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    let fsButtonHTML = "";
    let fsDescHTML = "No protection. <br> Next: <span style='color:#ffd700'>Windbreak Stones (Lv. 1)</span>";
    if (currentFireShieldTier === 0) { fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 200</button>`; }
    else if (currentFireShieldTier === 1) { fsDescHTML = "Wind resistance. <br> Next: <span style='color:#ffd700'>Treated Wood (Lv. 2)</span>"; fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 500</button>`; }
    else if (currentFireShieldTier === 2) { fsDescHTML = "Rain & Wind resistance. <br> Next: <span style='color:#ffd700'>Guardian Aura (Lv. 3)</span>"; fsButtonHTML = `<button class="buy-btn" onclick="buyFireShieldUpgrade()">💰 1000</button>`; }
    else { fsDescHTML = "Immune to Storms. <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>"; fsButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    let fgButtonHTML = "";
    let fgDescHTML = "Time: 4s. <br> Next: <span style='color:#ffd700'>Sturdy Rod (2s)</span>";
    if (currentFishingTier === 0) { fgButtonHTML = `<button class="buy-btn" onclick="buyFishingUpgrade()">💰 300</button>`; }
    else if (currentFishingTier === 1) { fgDescHTML = "Time: 2s. <br> Next: <span style='color:#ffd700'>Lucky Lure (20% Chest)</span>"; fgButtonHTML = `<button class="buy-btn" onclick="buyFishingUpgrade()">💰 800</button>`; }
    else if (currentFishingTier === 2) { fgDescHTML = "2s + 20% Chest. <br> Next: <span style='color:#ffd700'>Harpoon (Blue Fish)</span>"; fgButtonHTML = `<button class="buy-btn" onclick="buyFishingUpgrade()">💰 1500</button>`; }
    else { fgDescHTML = "Catches Super Blue Fish! <br> <span style='color:#4caf50'>MAX LEVEL REACHED</span>"; fgButtonHTML = `<button class="buy-btn maxed" disabled>MAX</button>`; }

    uMenu.innerHTML = `
        <h2>${t("btnUpgrades").replace('🟡 ', '')}</h2>
        <div class="gold-bank-display">🟡 Total Gold: ${totalGold}</div>
        
        <div id="shopNotification" style="color: #ff4a4a; font-weight: bold; font-size: 14px; height: 20px; margin-bottom: 15px; opacity: 0; transition: opacity 0.3s ease; text-transform: uppercase; letter-spacing: 1px;"></div>
        
        <div class="shop-container">
            <div class="shop-card">
                <div class="card-info">
                    <h3>Inventory Backpack (Lv. ${currentBackpackTier})</h3>
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
            
            <div class="shop-card">
                <div class="card-info">
                    <h3>Fishing Gear (Lv. ${currentFishingTier})</h3>
                    <p>${fgDescHTML}</p>
                </div>
                <div class="button-container">${fgButtonHTML}</div>
            </div>
        </div>
        
        <button id="closeUpgradesBtn" class="menu-btn secondary" style="width:120px; padding:10px; margin-top:10px;">${t("back")}</button>
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
        updateMaxCarryCapacity();
        const bWrap = document.getElementById("bagWrapper");
        if (bWrap) bWrap.innerHTML = renderBagIcons();
        renderUpgradesMenu();
        if(sounds && sounds.buy) sounds.buy.play();
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
        if(sounds && sounds.buy) sounds.buy.play(); 
    } else { showShopNotification("Not enough Golden Wood! Keep surviving."); }
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
        if(sounds && sounds.buy) sounds.buy.play(); 
    } else { showShopNotification("Not enough Golden Wood! Keep surviving."); }
};

window.buyFishingUpgrade = function() {
    let totalGold = parseInt(localStorage.getItem("campfireGoldenWood")) || 0;
    if (currentFishingTier >= UPGRADE_DATA.fishing.length) return;
    const nextUpgrade = UPGRADE_DATA.fishing[currentFishingTier];
    if (totalGold >= nextUpgrade.cost) {
        totalGold -= nextUpgrade.cost;
        localStorage.setItem("campfireGoldenWood", totalGold);
        currentFishingTier++;
        localStorage.setItem("campfireFishingTier", currentFishingTier);
        renderUpgradesMenu();
        if(sounds && sounds.buy) sounds.buy.play();
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