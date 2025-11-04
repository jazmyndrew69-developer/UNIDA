/* ========== 1) ROLE TOGGLE (elegant fade) ========== */
const roleEl = document.getElementById("role");
if (roleEl) {
  const roles = ["Developer", "Designer"];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % roles.length;
    roleEl.style.transition = "opacity .22s ease";
    roleEl.style.opacity = 0;
    setTimeout(() => {
      roleEl.textContent = roles[i];
      roleEl.style.opacity = 1;
    }, 220);
  }, 2600);
}

/* ========== 2) APPLY PER-SECTION BACKGROUNDS ========== */
// CSS attr() for images isn’t supported widely—set via JS:
const scenes = Array.from(document.querySelectorAll(".scene"));
scenes.forEach(s => {
  const bg = s.getAttribute("data-bg");
  if (bg) s.style.setProperty("--bg-url", `url('${bg}')`);
  if (bg) s.style.backgroundImage = `url('${bg}')`; // hard apply
});

/* ========== 3) CINEMATIC SLIDE SYSTEM (scroll/nav) ========== */
const footer = document.querySelector(".footer");
let current = 0;

// ensure first active only
scenes.forEach((s, i) => s.classList.toggle("active", i === 0));
if (footer) footer.classList.toggle("show", current === scenes.length - 1);

function showScene(index) {
  if (index === current || index < 0 || index >= scenes.length) return;
  scenes[current].classList.remove("active");
  scenes[index].classList.add("active");
  current = index;
  if (footer) footer.classList.toggle("show", current === scenes.length - 1);
}

// nav buttons
document.querySelectorAll("[data-index]").forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.index);
    showScene(idx);
  });
});

// wheel (one slide per scroll)
let lock = false;
window.addEventListener("wheel", (e) => {
  if (lock) return;
  lock = true;
  if (e.deltaY > 0) showScene(current + 1);
  else showScene(current - 1);
  setTimeout(() => (lock = false), 900);
}, { passive: true });

// keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "PageDown") showScene(current + 1);
  if (e.key === "ArrowUp" || e.key === "PageUp") showScene(current - 1);
});

// touch swipe (mobile)
let touchStartY = null;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (touchStartY === null) return;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dy) > 60) {
    if (dy < 0) showScene(current + 1); // swipe up → next
    else showScene(current - 1);        // swipe down → prev
  }
  touchStartY = null;
}, { passive: true });
