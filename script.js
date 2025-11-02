/* ---- ROLE TOGGLE ---- */
const role = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let index = 0;

setInterval(() => {
  index = (index + 1) % roles.length;
  role.classList.add("glitch");
  role.textContent = roles[index];
  setTimeout(() => role.classList.remove("glitch"), 300);
}, 1800);

/* ---- OPEN/CLOSE SCENES ---- */
const overlay = document.getElementById("overlay");

document.querySelectorAll("[data-scene]").forEach(btn => {
  btn.addEventListener("click", () => {
    overlay.classList.add("show");
    document.getElementById(`scene-${btn.dataset.scene}`).hidden = false;
  });
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    overlay.classList.remove("show");
    btn.closest(".scene").hidden = true;
  });
});
