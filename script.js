/*
  Creation • script.js
  Changes: role toggle, petals, safe project-card click handler with keyboard access,
  and optional form prefill support without breaking anchors.
*/

/* ===== ROLE TOGGLE (Elegant slow fade) ===== */
(function roleToggle(){
  const role = document.getElementById("toggle-role");
  if (!role) return;
  const roles = ["Developer", "Designer"];
  let r = 0;
  setInterval(() => {
    r = (r + 1) % roles.length;
    role.textContent = roles[r];
  }, 2600);
})();

/* ===== CHERRY BLOSSOM PETALS (home only visible) ===== */
(function petals(){
  const container = document.getElementById("petals");
  if (!container) return;
  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 4 + Math.random() * 6 + "s";
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
  }
  setInterval(createPetal, 300);
})();

/* ===== PROJECT CARDS: make entire card clickable (and keyboard accessible) ===== */
(function projectCards(){
  const cards = document.querySelectorAll(".project-card[data-link]");
  if (!cards.length) return;

  cards.forEach(card => {
    const url = card.getAttribute("data-link") || "#";
    // visual affordance
    card.style.cursor = "pointer";
    // open in new tab on click
    card.addEventListener("click", (e) => {
      // ignore if user clicked a child real link
      const a = e.target.closest("a");
      if (a) return;
      if (url && url !== "#") window.open(url, "_blank", "noopener");
    });
    // keyboard: Enter activates
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        card.click();
      }
    });
  });
})();

/* ===== SERVICES: optional plan prefill without breaking anchors =====
   By default, <a> already opens the form. We only add a plan parameter if the
   Google Form exposes an 'entry.XXXX' prefill. Replace ENTRY_ID with your real ID.
*/
(function servicePlans(){
  const ENTRY_ID = null; // e.g., "entry.123456789" — set once you share the edit link
  const buttons = document.querySelectorAll(".btn-start[data-plan]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // mark that user opened a form tab — if you later want a “return to contact” behavior on SPA.
      sessionStorage.setItem("form-opened", "1");

      if (!ENTRY_ID) return; // leave href untouched if we don't have the field id
      const base = new URL(btn.href);
      base.searchParams.set(ENTRY_ID, btn.dataset.plan);
      btn.href = base.toString();
    });
  });
})();

// Activate Lucide icons globally
if (window.lucide) lucide.createIcons();
