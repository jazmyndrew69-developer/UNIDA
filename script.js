/* ========= 1) Role toggle (elegant fade) ========= */
const roleEl = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let r = 0;
setInterval(() => {
  r = (r + 1) % roles.length;
  roleEl.style.opacity = 0;
  setTimeout(() => {
    roleEl.textContent = roles[r];
    roleEl.style.opacity = 1;
  }, 220);
}, 2600);

/* ========= 2) Scene switcher (cinematic slides) ========= */
const scenes = Array.from(document.querySelectorAll(".scene"));
let current = 0;

function showScene(index){
  if (index === current || index < 0 || index >= scenes.length) return;
  scenes[current].classList.remove("active");
  scenes[index].classList.add("active");
  current = index;
}

// Nav + CTA buttons use data-index
document.querySelectorAll("[data-index]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const idx = Number(btn.dataset.index);
    showScene(idx);
  });
});

// Keyboard arrows (optional)
window.addEventListener("keydown", (e)=>{
  if (e.key === "ArrowDown" || e.key === "PageDown") showScene(current+1);
  if (e.key === "ArrowUp"   || e.key === "PageUp")   showScene(current-1);
});

/* ========= 3) Petals (slow cinematic) ========= */
const petalsRoot = document.getElementById("petals");
function petal(){
  const p = document.createElement("span");
  p.className = "petal";
  const size = 8 + Math.random()*10;
  const dur  = 12 + Math.random()*8;
  p.style.left = Math.random()*100 + "vw";
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.animationDuration = dur + "s";
  petalsRoot.appendChild(p);
  setTimeout(()=>p.remove(), dur*1000);
}
setInterval(petal, 650);
