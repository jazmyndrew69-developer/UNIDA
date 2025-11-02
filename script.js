// ===== ROLE TOGGLE =====
const role = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let i = 0;

setInterval(() => {
  i = (i + 1) % roles.length;
  role.textContent = roles[i];
}, 2400);


// ===== OPEN SCENE =====
document.querySelectorAll("[data-scene]").forEach(btn =>
  btn.addEventListener("click", () => {
    const target = document.getElementById(`scene-${btn.dataset.scene}`);
    closeAllScenes();
    target.hidden = false;
  })
);


// ===== CLOSE BUTTON =====
document.querySelectorAll("[data-close]").forEach(btn =>
  btn.addEventListener("click", () => btn.closest(".scene").hidden = true)
);


// ===== CLOSE POPUP ON ACTION INSIDE =====
function closeAllScenes() {
  document.querySelectorAll(".scene").forEach(scene => {
    scene.hidden = true;
  });
}

// auto-close pop-up when clicking project cards or service CTA
document.querySelectorAll("a[target='_blank'], a.btn").forEach(el =>
  el.addEventListener("click", () => closeAllScenes())
);

/* === FALLING PETALS === */
function createPetal() {
  const petal = document.createElement("span");
  petal.classList.add("petal");

  const size = Math.random() * 12 + 10;          // petal size
  const fallDuration = Math.random() * 6 + 12;   // slower fall (12–18s)
  const leftPos = Math.random() * 100;           // random x start position

  petal.style.left = leftPos + "vw";
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.animationDuration = fallDuration + "s";

  // your asset image (IMPORTANT: file must be inside /assets/)
  petal.style.backgroundImage = "url('assets/petal.png')";
  petal.style.backgroundSize = "cover";

  document.getElementById("petals").appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, fallDuration * 1000);
}

// steady flow (one petal every 600ms)
setInterval(createPetal, 600);
