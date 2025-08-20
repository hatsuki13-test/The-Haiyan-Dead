/* ========= PANEL LOGIC ========= */
let current = 1;
const panels = [...document.querySelectorAll(".panel")];
const loading = document.getElementById("loading");
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

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
    lightningSound.play().catch(()=>{});
    introSoundPlayed = true;
  }
  if (n === 7) startCreditsRoll();
}

function withLoader(next) {
  loading.classList.add("active");
  setTimeout(() => {
    next();
    loading.classList.remove("active");
  }, 1200);
}

document.addEventListener("click", e => {
  const next = e.target.closest("[data-next]");
  if (!next) return;
  const target = parseInt(next.getAttribute("data-next"), 10);
  withLoader(() => showPanel(target));
});

/* ========= THEME TOGGLE ========= */
themeSwitch.addEventListener("change", () => {
  body.classList.toggle("light", themeSwitch.checked);
  updatePalette();
});

/* ========= TYPEWRITER ========= */
function startTypewriter(el) {
  const text = el.getAttribute("data-text") || "";
  const lines = text.split("\n");
  el.innerHTML = "";
  let lineIndex = 0, wordIndex = 0;
  let words = lines[lineIndex].trim().split(/\s+/);

  function step() {
    if (lineIndex >= lines.length) return;
    if (wordIndex < words.length) {
      el.innerHTML += (wordIndex ? " " : "") + words[wordIndex];
      wordIndex++;
      setTimeout(step, 200);
    } else {
      el.innerHTML += "<br><br>";
      lineIndex++;
      if (lineIndex < lines.length) {
        words = lines[lineIndex].trim().split(/\s+/);
        wordIndex = 0;
        setTimeout(step, 200);
      }
    }
  }
  step();
}

/* ========= OUTRO ========= */
function startCreditsRoll() {
  const roll = document.getElementById("credits-roll");
  const creditsText = (
    "Especially to you, Ma'am Fortuno.\n\n" +
    "Creator: Me\n" +
    "Video Editor: Me\n" +
    "Editing: Me\n" +
    "Storyline: Him\n" +
    "Upload: Him\n\n" +
    "— The End —"
  );
  roll.style.animation = "none";
  roll.offsetHeight;
  roll.textContent = creditsText;
  roll.style.animation = "";
}

/* ========= WEATHER ANIMATION ========= */
const canvas = document.getElementById("weather-canvas");
const flash = document.getElementById("lightning-flash");
const ctx = canvas.getContext("2d", { alpha: true });

let W=0,H=0,DPR=Math.max(1,Math.min(2,window.devicePixelRatio||1));
function resize() {
  W = canvas.clientWidth = window.innerWidth;
  H = canvas.clientHeight = window.innerHeight;
  canvas.width = W*DPR;
  canvas.height = H*DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
resize(); window.addEventListener("resize", resize);

const palette = {
  dark:{skyTop:"#0b0f14",skyBot:"#101823",cloud:"rgba(200,220,255,0.06)",rain:"rgba(200,230,255,0.55)",bolt:"#f8fbff"},
  light:{skyTop:"#e8f1fb",skyBot:"#cfe3f7",cloud:"rgba(30,40,60,0.07)",rain:"rgba(40,60,90,0.55)",bolt:"#ffffff"}
};
let colors=palette.dark;
function updatePalette(){ colors = body.classList.contains("light") ? palette.light : palette.dark; }
updatePalette();

const clouds=[], drops=[];
function makeClouds(){ clouds.length=0; for(let i=0;i<20;i++){clouds.push({x:Math.random()*W,y:Math.random()*H*0.5,r:80+Math.random()*120,s:0.1+Math.random()*0.3});}} makeClouds();
function makeRain(){ drops.length=0; for(let i=0;i<(W*H)/10000;i++){drops.push({x:Math.random()*W,y:Math.random()*H,l:8+Math.random()*12,vx:-2,vy:12+Math.random()*8});}} makeRain();
window.addEventListener("resize",()=>{makeClouds();makeRain();});

let nextStrike=2000+Math.random()*8000,since=0;
function lightning(dt){ since+=dt; if(since<nextStrike) return; flash.style.opacity="1"; setTimeout(()=>flash.style.opacity="0",80);
  let x=Math.random()*W,y=-20; ctx.save();ctx.strokeStyle=colors.bolt;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);
  for(let i=0;i<10;i++){x+=(Math.random()-0.5)*50;y+=H/10;ctx.lineTo(x,y);} ctx.stroke();ctx.restore(); since=0;nextStrike=2500+Math.random()*6000;}

let last=performance.now();
function frame(now){
  const dt=now-last; last=now;
  const sky=ctx.createLinearGradient(0,0,0,H); sky.addColorStop(0,colors.skyTop); sky.addColorStop(1,colors.skyBot);
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  for(const c of clouds){c.x-=c.s;if(c.x<-c.r)c.x=W+c.r;const g=ctx.createRadialGradient(c.x,c.y,c.r*0.2,c.x,c.y,c.r);g.addColorStop(0,colors.cloud);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();}
  ctx.strokeStyle=colors.rain;ctx.beginPath();for(const d of drops){d.x+=d.vx;d.y+=d.vy;if(d.y>H||d.x<-20){d.x=Math.random()*W;d.y=-20;}ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.vx*0.5,d.y-d.l);}ctx.stroke();
  lightning(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ========= START ========= */
showPanel(1);