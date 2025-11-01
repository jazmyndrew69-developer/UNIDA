// helpers
const $ = (q, c=document)=>c.querySelector(q);
const $$ = (q, c=document)=>Array.from(c.querySelectorAll(q));

/* ===== Petals (soft, continuous) ===== */
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
})();

/* Petal CSS (injected for clarity) */
const petalStyle = document.createElement('style');
petalStyle.textContent = `
.petal{
  position:absolute; top:-6vh; background: radial-gradient(circle at 30% 30%, #FFD6E4 0%, #FFC5D9 60%, rgba(255,255,255,0) 61%);
  border-radius: 60% 40% 60% 40%;
  opacity:.8; filter: blur(.2px);
  animation: fall linear infinite;
}
@keyframes fall {
  0%   { transform: translateY(-6vh) translateX(0) rotate(0deg); opacity:.0; }
  10%  { opacity:.9; }
  100% { transform: translateY(110vh) translateX(20vw) rotate(160deg); opacity:.0; }
}
`;
document.head.appendChild(petalStyle);

/* ===== Developer / Designer toggle (elegant fade) ===== */
const roleEl = $('#toggle-role');
const wrapEl = $('#toggle-wrapper');
const comingEl = $('#coming-soon');
const roles = ['Developer','Designer'];
let idx = 0;

function setRole(){
  idx = (idx + 1) % roles.length;
  if (!roleEl) return;
  // fade out, swap, fade in
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

/* ===== Smooth anchor scroll ===== */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = $(id);
    if (el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
