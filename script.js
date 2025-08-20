/* ========= PANEL LOGIC ========= */
let current = 1;
const panels = [...document.querySelectorAll(".panel")];
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Lightning sound element (intro only)
const lightningSound = document.getElementById("lightning-sound");
let introSoundPlayed = false;

function showPanel(n) {
  panels.forEach(p => {
    p.classList.remove("active");
    const v = p.querySelector("video");
    if (v) v.pause();
  });

  const panel = document.getElementById(`panel${n}`);
  panel.classList.add("active");
  current = n;

  const tb = panel.querySelector(".text-box");
  if (tb) startTypewriter(tb);

  if (n === 1 && !introSoundPlayed) {
    lightningSound.currentTime = 0;
    lightningSound.play().catch(() => {});
    introSoundPlayed = true;
  }

  if (n === 7) startCreditsRoll();
}

// Handle next buttons
document.addEventListener("click", e => {
  const next = e.target.closest("[data-next]");
  if (!next) return;
  const target = parseInt(next.getAttribute("data-next"), 10);
  showPanel(target);
});

/* ========= THEME TOGGLE ========= */
themeSwitch.addEventListener("change", () => {
  body.classList.toggle("light", themeSwitch.checked);
});

/* ========= TYPEWRITER ========= */
function startTypewriter(el) {
  const text = el.getAttribute("data-text") || "";
  const words = text.split(/\s+/);
  el.innerHTML = "";
  let i = 0;
  function step() {
    if (i < words.length) {
      el.innerHTML += (i > 0 ? " " : "") + words[i];
      i++;
      setTimeout(step, 220);
    }
  }
  step();
}

/* ========= OUTRO ========= */
function startCreditsRoll() {
  const roll = document.getElementById("credits-roll");
  const creditsText = "Especially to you, Ma'am Fortuno.\n\nCreator: Me\nVideo Editor: Me\nEditing: Me\nStoryline: Him\nUpload: Him\n\n— The End —";
  roll.textContent = creditsText;
  roll.style.animation = "none";
  roll.offsetHeight; // reflow
  roll.style.animation = "";
}

/* ========= WEATHER BACKGROUND ========= */
const canvas = document.getElementById("weather-canvas");
const flash = document.getElementById("lightning-flash");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Rain
const drops = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  l: 10 + Math.random() * 20,
  vy: 4 + Math.random() * 4
}));

// Lightning timer
let nextStrike = 2000 + Math.random() * 8000;
let sinceStrike = 0;
let last = performance.now();

function frame(now) {
  const dt = now - last;
  last = now;

  ctx.fillStyle = body.classList.contains("light") ? "#cfe3f7" : "#0b0f14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rain
  ctx.strokeStyle = "rgba(200,230,255,0.6)";
  ctx.beginPath();
  for (const d of drops) {
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.l);
    d.y += d.vy;
    if (d.y > canvas.height) d.y = -20;
  }
  ctx.stroke();

  // Lightning
  sinceStrike += dt;
  if (sinceStrike > nextStrike) {
    flash.style.opacity = "1";
    setTimeout(() => (flash.style.opacity = "0"), 100);
    sinceStrike = 0;
    nextStrike = 3000 + Math.random() * 8000;
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ========= STARTUP ========= */
showPanel(1);