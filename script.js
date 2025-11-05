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
