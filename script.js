/* ===== ROLE TOGGLE (Elegant slow fade) ===== */
const role = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let r = 0;

setInterval(() => {
  r = (r + 1) % roles.length;
  role.textContent = roles[r];
}, 2600);


/* ===== CINEMATIC SLIDES ===== */
const scenes = Array.from(document.querySelectorAll(".scene"));
let current = 0;

function showScene(index) {
  if (index === current || index < 0 || index >= scenes.length) return;

  scenes[current].classList.remove("active");
  document.querySelector(".hero-bg").style.opacity = index === 0 ? "1" : "0";

  scenes[index].classList.add("active");
  current = index;

  document.querySelector(".footer").classList.toggle(
    "show",
    index === scenes.length - 1
  );
}

/* NAVIGATION + CTA buttons (works for <button> and <a>) */
document.querySelectorAll("[data-index]").forEach(el =>
  el.addEventListener("click", () => {
    const target = Number(el.dataset.index);
    showScene(target);
  })
);


/* ===== CHERRY BLOSSOM PETALS ===== */
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 4 + Math.random() * 6 + "s";
  document.getElementById("petals").appendChild(petal);
  setTimeout(() => petal.remove(), 9000);
}
setInterval(createPetal, 300);


/* ===== UNIFIED GET STARTED BUTTON LOGIC ===== */
(function attachFormButtons() {
  const FORM_URL = "https://forms.gle/WiaRHtZSaZGv8kXW7";

  document.querySelectorAll(".btn-start").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(FORM_URL, "_blank", "noopener");

      sessionStorage.setItem("form-opened", "1");
    });
  });

  window.addEventListener("focus", () => {
    if (sessionStorage.getItem("form-opened") === "1") {
      sessionStorage.removeItem("form-opened");
      showScene(4);
    }
  });
})();
