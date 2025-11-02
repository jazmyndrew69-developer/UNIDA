/* ===== 1) Developer ⇄ Designer (elegant fade) ===== */
const roleEl = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let idx = 0;
setInterval(() => {
  idx = (idx + 1) % roles.length;
  roleEl.style.opacity = 0;
  setTimeout(() => {
    roleEl.textContent = roles[idx];
    roleEl.style.opacity = 1;
  }, 250);
}, 2600);

/* ===== 2) Falling petals (calm cadence) ===== */
const petalsRoot = document.getElementById("petals");
function createPetal(){
  const p = document.createElement("span");
  p.className = "petal";
  const size = 8 + Math.random()*10;
  const dur  = 10 + Math.random()*7;
  p.style.left = Math.random()*100 + "vw";
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.animationDuration = dur + "s";
  petalsRoot.appendChild(p);
  setTimeout(()=>p.remove(), dur*1000);
}
setInterval(createPetal, 520);

/* ===== 3) Cinematic scene reveal on scroll ===== */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.fade').forEach(el=>observer.observe(el));

/* ===== 4) Smooth scroll via data-scroll ===== */
document.querySelectorAll('[data-scroll]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    const target = document.querySelector(el.getAttribute('data-scroll'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
