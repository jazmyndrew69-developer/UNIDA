// ROLE TOGGLE — now slower and clean
const role = document.getElementById("toggle-role");
const comingSoon = document.getElementById("coming-soon");
const roles = ["Developer", "Designer"];
let i = 0;

function updateRole() {
  i = (i + 1) % roles.length;
  role.textContent = roles[i];

  if (roles[i] === "Designer") {
    comingSoon.style.opacity = "1";
  } else {
    comingSoon.style.opacity = "0";
  }

  role.classList.add("flicker");
  setTimeout(() => role.classList.remove("flicker"), 600);
}

setInterval(updateRole, 2800);

// SCENE SYSTEM
document.querySelectorAll("[data-scene]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.scene;
    document.getElementById(`scene-${target}`).hidden = false;
    document.getElementById("overlay").classList.add("active");
  });
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".scene").hidden = true;
    document.getElementById("overlay").classList.remove("active");
  });
});
