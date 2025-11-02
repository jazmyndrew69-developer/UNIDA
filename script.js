/* ==============================================
   1) DEVELOPER ⇆ DESIGNER (elegant fade toggle)
============================================== */
const roleEl = document.getElementById("toggle-role");
if (roleEl) {
  const roles = ["Developer", "Designer"];
  let idx = 0;

  // smooth fade swap
  setInterval(() => {
    idx = (idx + 1) % roles.length;
    roleEl.style.transition = "opacity .22s ease";
    roleEl.style.opacity = 0;
    setTimeout(() => {
      roleEl.textContent = roles[idx];
      roleEl.style.opacity = 1;
    }, 220);
  }, 2600);
}

/* ==============================================
   2) CINEMATIC SCENE SYSTEM (slides)
   - click nav or scroll (one slide per wheel)
   - keyboard (PgUp/PgDn / arrows)
   - mobile swipe
   - footer only on last slide
============================================== */
const scenes = Array.from(document.querySelectorAll(".scene"));
const footer = document.querySelector(".footer");
let current = 0;

// ensure only the first scene is active at start
(function initScenes() {
  scenes.forEach((s, i) => s.classList.toggle("active", i === 0));
  if (footer) footer.classList.toggle("show", scenes.length > 0 && current === scenes.length - 1);
})();

function showScene(index) {
  if (index === current || index < 0 || index >= scenes.length) return;
  scenes[current].classList.remove("active");
  scenes[index].classList.add("active");
  current = index;

  // show footer only on last slide
  if (footer) footer.classList.toggle("show", current === scenes.length - 1);
}

// nav buttons + CTAs use data-index
document.querySelectorAll("[data-index]").forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.index);
    showScene(idx);
  });
});

// wheel (one slide per scroll) — throttled
let wheelLock = false;
window.addEventListener("wheel", (e) => {
  if (wheelLock) return;
  wheelLock = true;

  if (e.deltaY > 0) showScene(current + 1);
  else showScene(current - 1);

  setTimeout(() => (wheelLock = false), 900); // throttle to match CSS transition
}, { passive: true });

// keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "PageDown") showScene(current + 1);
  if (e.key === "ArrowUp" || e.key === "PageUp") showScene(current - 1);
});

// touch swipe for mobile
let touchStartY = null;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (touchStartY === null) return;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // swipe threshold ~ 60px
  if (Math.abs(dy) > 60) {
    if (dy < 0) showScene(current + 1); // swipe up → next
    else showScene(current - 1);        // swipe down → prev
  }
  touchStartY = null;
}, { passive: true });
