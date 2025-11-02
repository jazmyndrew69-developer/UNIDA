// ---------- ROLE TOGGLE ----------
const role = document.getElementById("toggle-role");
const comingSoon = document.getElementById("coming-soon");
const roles = ["Developer", "Designer"];
let r = 0;

function switchRole(){
  r = (r+1) % roles.length;
  role.textContent = roles[r];
  comingSoon.style.opacity = roles[r] === "Designer" ? "0.8" : "0";
}
setInterval(switchRole, 2600);

// ---------- OPEN / CLOSE SCENES ----------
document.querySelectorAll("[data-scene]").forEach(btn =>
  btn.addEventListener("click", () => {
    document.getElementById(`scene-${btn.dataset.scene}`).hidden = false;
    document.getElementById("overlay").style.display = "block";
  })
);

document.querySelectorAll("[data-close]").forEach(btn =>
  btn.addEventListener("click", () => {
    btn.closest(".scene").hidden = true;
    document.getElementById("overlay").style.display = "none";
  })
);

// ---------- PETALS ----------
function createPetal(){
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = (6 + Math.random() * 6) + "s";
  document.getElementById("petals").appendChild(petal);
  setTimeout(()=>petal.remove(), 12000);
}
setInterval(createPetal, 480);
