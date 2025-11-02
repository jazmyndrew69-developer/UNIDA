/* ============================
   1) Elegant Developer ⇄ Designer toggle
============================ */
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


/* ============================
   2) Falling Cherry-Blossom Petals Animation
============================ */
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = Math.random() * 6 + 5 + "s";
  document.getElementById("petals").appendChild(petal);

  setTimeout(() => petal.remove(), 11000);
}
setInterval(createPetal, 450);


/* ============================
   3) Cinematic fade-in reveal
============================ */
const revealEls = document.querySelectorAll(".fade, .fade-element, section, .card");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.82;

  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("visible");
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run on load


/* ============================
   4) Smooth navigation scroll
============================ */
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
