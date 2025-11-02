// =========================
// ROLE TOGGLE (glitch + smooth switching)
// =========================

const role = document.getElementById("toggle-role");
const comingSoon = document.getElementById("coming-soon");

let roles = ["Developer", "Designer"];
let index = 0;

function updateRole() {
  index = (index + 1) % roles.length;

  // restart glitch animation
  role.classList.remove("glitch-active");
  void role.offsetWidth;
  role.textContent = roles[index];
  role.classList.add("glitch-active");

  // fade "coming soon"
  comingSoon.style.opacity = roles[index] === "Designer" ? "0.7" : "0";
}

// slower, less spammy switch
setInterval(updateRole, 2600);
updateRole();

// =========================
// OPEN / CLOSE SCENES
// =========================

document.querySelectorAll("[data-scene]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(`scene-${btn.dataset.scene}`);
    document.getElementById("overlay").classList.add("active");
    target.hidden = false;
    target.classList.add("open");
  });
});

document.querySelectorAll("[data-close]").forEach(btn =>
  btn.addEventListener("click", () => {
    const scene = btn.closest(".scene");
    scene.classList.remove("open");
    scene.hidden = true;
    document.getElementById("overlay").classList.remove("active");
  })
);

