/*
  script.js
  Stable, minimal JS:
   - role toggle
   - cherry blossom petals (all pages, mobile friendly)
   - clickable project cards (data-link)
   - services Get Started buttons (open Google Form)
   - footer reveal/hide behavior on index.html only
   - keyboard & swipe support for .cards-row containers
   - lucide icons initialization
*/

/* ===== ROLE TOGGLE ===== */
(function roleToggle() {
  const role = document.getElementById("toggle-role");
  if (!role) return;
  const roles = ["Developer", "Designer"];
  let r = 0;
  setInterval(() => {
    r = (r + 1) % roles.length;
    role.textContent = roles[r];
  }, 2600);
})();

/* ===== PETALS (mobile-friendly) ===== */
(function petals() {
  const container = document.getElementById("petals");
  if (!container) return;

  // lower density for narrow screens for performance
  const interval = window.innerWidth < 420 ? 500 : 300;
  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 4 + Math.random() * 6 + "s";
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
  }
  setInterval(createPetal, interval);
})();

/* ===== CLICKABLE PROJECT CARDS ===== */
(function projectCards() {
  const cards = document.querySelectorAll(".project-card[data-link], .card-item.project-card[data-link]");
  if (!cards.length) return;
  cards.forEach(card => {
    const url = card.dataset.link;
    if (!url) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      window.open(url, "_blank", "noopener");
    });
    card.addEventListener("keypress", e => {
      if (e.key === "Enter") card.click();
    });
  });
})();

/* ===== SERVICES: Get Started buttons open form (new tab) ===== */
(function servicesForm() {
  const FORM_URL = "https://forms.gle/ayJHG2n686WdVC9W7";
  document.querySelectorAll(".btn-start").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = btn.getAttribute("href") || FORM_URL;
      window.open(href, "_blank", "noopener");
      sessionStorage.setItem("form-opened", "1");
    });
  });
})();

/* ===== cards-row keyboard + pointer helpers ===== */
(function cardsRowControls() {
  const rows = document.querySelectorAll(".cards-row");
  if (!rows.length) return;

  rows.forEach(row => {
    // make sure row focusable
    if (!row.hasAttribute("tabindex")) row.setAttribute("tabindex", "0");

    // keyboard left/right
    row.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        row.scrollBy({ left: -320, behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        row.scrollBy({ left: 320, behavior: "smooth" });
      }
    });

    // touch swipe handled by native overflow + pointer drag listeners for mouse
    let isDown = false, startX = 0, scrollLeft = 0;
    row.addEventListener("pointerdown", (e) => {
      isDown = true;
      row.setPointerCapture(e.pointerId);
      startX = e.clientX;
      scrollLeft = row.scrollLeft;
    });
    row.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      row.scrollLeft = scrollLeft - dx;
    });
    row.addEventListener("pointerup", (e) => { isDown = false; try { row.releasePointerCapture(e.pointerId); } catch {} });
    row.addEventListener("pointercancel", () => isDown = false);
  });
})();

/* ===== FIX: footer hidden/reveal behavior (index.html only) ===== */
(function footerReveal() {
  // only run on index page
  if (!document.body || document.body.id !== "index-page") return;
  const footer = document.querySelector(".footer");
  if (!footer) return;

  // initial state: .footer--hidden is in markup
  // reveal when scrollY > 0.5 * innerHeight OR when user reaches bottom
  const REVEAL_THRESHOLD = 0.5; // fraction of viewport height
  let revealed = false;
  let debounceTimer = null;

  function checkReveal() {
    const sc = window.scrollY || window.pageYOffset || 0;
    const shouldReveal = (sc > window.innerHeight * REVEAL_THRESHOLD) || ((window.innerHeight + sc) >= (document.documentElement.scrollHeight - 8));
    if (shouldReveal && !revealed) {
      footer.classList.remove("footer--hidden");
      footer.classList.add("footer--revealed");
      revealed = true;
      // update accessible toggle if present
      const toggle = document.getElementById("reveal-footer-btn");
      if (toggle) toggle.setAttribute("aria-pressed", "true");
    }
  }

  // debounce scroll to avoid heavy operations
  window.addEventListener("scroll", () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkReveal, 120);
  }, { passive: true });

  // If returning from the form (session flag), reveal footer immediately as convenience
  window.addEventListener("focus", () => {
    if (sessionStorage.getItem("form-opened") === "1") {
      footer.classList.remove("footer--hidden");
      footer.classList.add("footer--revealed");
      sessionStorage.removeItem("form-opened");
      revealed = true;
    }
  });

  // Accessible toggle for keyboard users — toggles reveal permanently.
  const toggleBtn = document.getElementById("reveal-footer-btn");
  if (toggleBtn) {
    toggleBtn.classList.remove("visually-hidden-toggle");
    toggleBtn.setAttribute("aria-pressed", "false");
    toggleBtn.addEventListener("click", () => {
      footer.classList.remove("footer--hidden");
      footer.classList.add("footer--revealed");
      toggleBtn.setAttribute("aria-pressed", "true");
      // COMMENT: remove this toggle button in markup if you don't want a permanent reveal option.
    });
  }

  // run once on load in case user is already scrolled
  requestAnimationFrame(checkReveal);
})();

/* ===== LUCIDE ICONS ===== */
if (window.lucide) lucide.createIcons();
