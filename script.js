// ===== SIMPLE ROLE TOGGLE (no glitch) =====
const role = document.getElementById("toggle-role");
const comingSoon = document.getElementById("coming-soon");
const roles = ["Developer", "Designer"];
let idx = 0;

function setRole() {
  idx = (idx + 1) % roles.length;
  role.style.opacity = 0;
  setTimeout(() => {
    role.textContent = roles[idx];
    role.style.opacity = 1;
    comingSoon.style.opacity = roles[idx] === "Designer" ? 0.85 : 0;
  }, 220);
}
setInterval(setRole, 2600);
setRole();

// ===== PETALS (soft, elegant) =====
const petalsRoot = document.getElementById("petals");
function createPetal(){
  const s = document.createElement("span");
  s.className = "petal";
  const size = 8 + Math.random()*10;          // 8–18px
  const dur  = 12 + Math.random()*7;          // 12–19s
  s.style.left = Math.random()*100 + "vw";
  s.style.width = size + "px";
  s.style.height = size + "px";
  s.style.animationDuration = dur + "s";
  petalsRoot.appendChild(s);
  setTimeout(()=>s.remove(), dur*1000);
}
setInterval(createPetal, 650);

// ===== Smooth in-page scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(!id || id === "#") return;
    const target = document.querySelector(id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// ===== Reveal on scroll (cinematic) =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
