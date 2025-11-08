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

  /* remove active from current */
  scenes[current].classList.remove("active");

  /* if leaving HOME, hide bg */
  document.querySelector(".hero-bg").style.opacity = index === 0 ? "1" : "0";

  /* show new scene */
  scenes[index].classList.add("active");
  current = index;

  /* show footer only on last slide */
  document.querySelector(".footer").classList.toggle("show", index === scenes.length - 1);
}

/* NAVIGATION clicking events */
document.querySelectorAll("button[data-index]").forEach(btn =>
  btn.addEventListener("click", () => {
    const target = Number(btn.dataset.index);
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


// ===========================
// Get Started → Google Form (new tab) + return-to-contact
// ===========================
(function attachFormButtons(){
  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScfxAYcVID9KQSnTX93mXykN7rEYf9obHNeSjhYly-ysy8xKw/viewform?usp=header";
  const buttons = document.querySelectorAll(".btn-start");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // prefer data-form if you ever change per-plan URLs later
      const url = btn.getAttribute("data-form") || FORM_URL;

      // mark that form was opened
      sessionStorage.setItem("form-opened", "1");

      // open in a new tab (keeps your requirement)
      window.open(url, "_blank", "noopener");

      // optional: nudge scroll to contact if the user returns quickly
      // we'll actually jump on window focus below
    });
  });

  // When the user comes back to this tab (after submitting the form),
  // auto-jump to Contact.
  window.addEventListener("focus", () => {
    if (sessionStorage.getItem("form-opened") === "1") {
      sessionStorage.removeItem("form-opened");
      // Jump to contact section smoothly
      const contact = document.querySelector("#contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
