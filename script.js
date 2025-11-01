// helpers
const $ = (q, c=document)=>c.querySelector(q);
const $$ = (q, c=document)=>Array.from(c.querySelectorAll(q));

/* ===== Petals (soft, continuous on home) ===== */
(function petals(){
  const container = $('#petals');
  if (!container) return;
  const PETAL_COUNT = window.innerWidth < 768 ? 14 : 28;

  for (let i=0;i<PETAL_COUNT;i++){
    const p = document.createElement('span');
    p.className = 'petal';
    const delay = (Math.random()*8).toFixed(2);
    const dur = (10 + Math.random()*12).toFixed(2);
    const size = (8 + Math.random()*10).toFixed(0);
    const left = (Math.random()*100).toFixed(2);

    p.style.left = left + '%';
    p.style.animationDelay = delay + 's';
    p.style.animationDuration = dur + 's';
    p.style.width = size + 'px';
    p.style.height = size*0.7 + 'px';

    container.appendChild(p);
  }

  // inject minimal CSS for petals
  const petalStyle = document.createElement('style');
  petalStyle.textContent = `
  .petal{
    position:absolute; top:-6vh; background: radial-gradient(circle at 30% 30%, #FFD6E4 0%, #FFC5D9 60%, rgba(255,255,255,0) 61%);
    border-radius: 60% 40% 60% 40%; opacity:.8; filter: blur(.2px);
    animation: fall linear infinite;
  }
  @keyframes fall {
    0%   { transform: translateY(-6vh) translateX(0) rotate(0deg); opacity:.0; }
    10%  { opacity:.9; }
    100% { transform: translateY(110vh) translateX(20vw) rotate(160deg); opacity:.0; }
  }`;
  document.head.appendChild(petalStyle);
})();

/* ===== Developer / Designer toggle (elegant fade) ===== */
const roleEl = $('#toggle-role');
const comingEl = $('#coming-soon');
const roles = ['Developer','Designer'];
let idx = 0;
function setRole(){
  idx = (idx + 1) % roles.length;
  if (!roleEl) return;
  roleEl.style.opacity = '0';
  roleEl.style.transform = 'translateY(4px)';
  setTimeout(()=>{
    roleEl.textContent = roles[idx];
    roleEl.style.opacity = '1';
    roleEl.style.transform = 'translateY(0)';
    if (comingEl) comingEl.style.opacity = roles[idx] === 'Designer' ? '1' : '0';
  }, 220);
}
setInterval(setRole, 2000);

/* ===== Scene Controller (full cinematic interaction) ===== */
const overlay = $('#overlay');
const scenes = {
  about: $('#scene-about'),
  services: $('#scene-services'),
  projects: $('#scene-projects'),
  contact: $('#scene-contact'),
};

function openScene(key){
  const scene = scenes[key];
  if (!scene) return;
  // show overlay
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  // show scene
  scene.hidden = false;
  // force reflow before adding .open for transition
  void scene.offsetWidth;
  scene.classList.add('open');

  // lock background
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // focus first focusable
  const focusable = scene.querySelector('[data-close], a, button, input, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
}

function closeScenes(){
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  Object.values(scenes).forEach(scene=>{
    if (!scene.hidden){
      scene.classList.remove('open');
      // wait for transition then hide
      setTimeout(()=>{ scene.hidden = true; }, 220);
    }
  });
  // unlock background
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

$$('[data-scene]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const key = btn.getAttribute('data-scene');
    if (!key) return;
    e.preventDefault();
    openScene(key);
  });
});

$$('[data-close]').forEach(btn=>{
  btn.addEventListener('click', closeScenes);
});

// close on overlay click (optional, feels premium if we require the ✕)
// overlay.addEventListener('click', closeScenes);

// close on ESC
window.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') closeScenes();
});
