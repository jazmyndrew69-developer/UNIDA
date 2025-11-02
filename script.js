// ===== SIMPLE ROLE TOGGLE (fade only) =====
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
    // show warning only for Designer
    comingSoon.style.opacity = roles[idx] === "Designer" ? 0.9 : 0;
  }, 200);
}
setInterval(setRole, 2700);
setRole();

// ===== FALLING PETALS (elegant speed) =====
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

// ===== SCENE REVEAL ON SCROLL =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:.15});

document.querySelectorAll('.fade-element').forEach(el=>io.observe(el));
