// ===== ROLE TOGGLE =====
const role = document.getElementById("toggle-role");
const roles = ["Developer", "Designer"];
let i = 0;

setInterval(() => {
  i = (i + 1) % roles.length;
  role.textContent = roles[i];
}, 2600);


// ===== CINEMATIC SECTION SWITCH =====
const sections = document.querySelectorAll(".scene");
let currentSection = 0;

// show first section (hero)
sections[currentSection].classList.add("active");

function showSection(index) {
  if (index === currentSection) return;

  sections[currentSection].classList.remove("active");
  sections[index].classList.add("active");

  currentSection = index;
}

// nav triggers
document.querySelectorAll("[data-index]").forEach(btn => {
  btn.addEventListener("click", () => {
    const index = Number(btn.dataset.index);
    showSection(index);
  });
});
