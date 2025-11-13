/*
  Creation • script.js (final clean version)
  Purpose: unified JS for all pages
  Features: role toggle, petals, fade/parallax, clickable cards, form prefills,
  Lucide icons, and ping-pong project carousel.
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

/* ===== CHERRY BLOSSOM PETALS ===== */
(function petals() {
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

/* ===== PROJECT CARDS CLICKABLE ===== */
(function projectCards() {
  const cards = document.querySelectorAll(".project-card[data-link]");
  cards.forEach(card => {
    const url = card.dataset.link;
    if (!url) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", e => {
      if (e.target.closest("a")) return; // don't override inner links
      window.open(url, "_blank", "noopener");
    });
    card.addEventListener("keypress", e => {
      if (e.key === "Enter") card.click();
    });
  });
})();

/* ===== SERVICES PREFILL HANDLER ===== */
(function servicePlans() {
  const ENTRY_ID = null; // e.g., "entry.123456789" (set if Google Form supports it)
  const buttons = document.querySelectorAll(".btn-start[data-plan]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      sessionStorage.setItem("form-opened", "1");
      if (!ENTRY_ID) return;
      const base = new URL(btn.href);
      base.searchParams.set(ENTRY_ID, btn.dataset.plan);
      btn.href = base.toString();
    });
  });
})();

/* ===== ABOUT / SERVICES / PROJECTS FADE-IN + PARALLAX ===== */
document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(".about-img, .about-text, .card");
  if (!fadeTargets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("reveal");
    });
  }, { threshold: 0.2 });

  fadeTargets.forEach(el => observer.observe(el));

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.06;
    fadeTargets.forEach(el => el.style.setProperty("--parallax-offset", `${offset}px`));
  });
});

/* ============================================================
   PROJECTS CAROUSEL
   ============================================================ */
(function projectsCarouselModule() {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return;

  const wrapper = document.getElementById("projects-wrapper");
  const leftBtn = document.getElementById("carousel-left");
  const rightBtn = document.getElementById("carousel-right");

  // config
  const AUTO_SCROLL_SPEED_PX_PER_SEC = 50;
  const IDLE_TIMEOUT_MS = 5000;
  const ARROW_HIDE_DELAY_MS = 3000;
  const EDGE_EPS = 2;

  // state
  let direction = "right";
  let rafId = null;
  let lastRAFTime = null;
  let lastInteractionAt = Date.now();
  let arrowHideTimeout = null;
  let resumeTimeout = null;
  let autoScrollPaused = false;

  /* --- Arrow visibility --- */
  function showArrows() {
    wrapper.classList.add("show-arrows");
    [leftBtn, rightBtn].forEach(b => {
      b.setAttribute("aria-hidden", "false");
      b.removeAttribute("tabindex");
    });
    clearTimeout(arrowHideTimeout);
    arrowHideTimeout = setTimeout(hideArrows, ARROW_HIDE_DELAY_MS);
  }

  function hideArrows() {
    wrapper.classList.remove("show-arrows");
    [leftBtn, rightBtn].forEach(b => {
      b.setAttribute("aria-hidden", "true");
      b.setAttribute("tabindex", "-1");
    });
  }

  /* --- Disable arrows at edges --- */
  function updateArrowDisabledState() {
    const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const current = Math.round(carousel.scrollLeft);
    const atStart = current <= EDGE_EPS;
    const atEnd = current >= maxScrollLeft - EDGE_EPS;
    atStart ? leftBtn.setAttribute("disabled", "") : leftBtn.removeAttribute("disabled");
    atEnd ? rightBtn.setAttribute("disabled", "") : rightBtn.removeAttribute("disabled");
  }

  /* --- Auto-scroll logic --- */
  function autoStep(timestamp) {
    if (!lastRAFTime) lastRAFTime = timestamp;
    const dt = timestamp - lastRAFTime;
    lastRAFTime = timestamp;

    if (!autoScrollPaused) {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const pxToScroll = (AUTO_SCROLL_SPEED_PX_PER_SEC * dt) / 1000;

      if (direction === "right") {
        if (carousel.scrollLeft + pxToScroll >= maxScrollLeft - EDGE_EPS)
          direction = "left";
        else
          carousel.scrollLeft += pxToScroll;
      } else {
        if (carousel.scrollLeft - pxToScroll <= 0 + EDGE_EPS)
          direction = "right";
        else
          carousel.scrollLeft -= pxToScroll;
      }
      updateArrowDisabledState();
    }

    rafId = requestAnimationFrame(autoStep);
  }

  function startAutoScroll() {
    if (rafId) return;
    autoScrollPaused = false;
    lastRAFTime = null;
    rafId = requestAnimationFrame(autoStep);
  }

  function stopAutoScroll() {
    autoScrollPaused = true;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* --- User interaction pause/resume --- */
  function onUserInteraction() {
    lastInteractionAt = Date.now();
    showArrows();
    stopAutoScroll();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (Date.now() - lastInteractionAt >= IDLE_TIMEOUT_MS) startAutoScroll();
    }, IDLE_TIMEOUT_MS);
  }

  /* --- Manual scroll (arrows) --- */
  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -300, behavior: "smooth" });
    onUserInteraction();
    setTimeout(updateArrowDisabledState, 600);
  });
  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: 300, behavior: "smooth" });
    onUserInteraction();
    setTimeout(updateArrowDisabledState, 600);
  });

  /* --- Pointer drag & touch swipe --- */
  let isDragging = false, startX = 0, scrollStart = 0;
  carousel.addEventListener("pointerdown", e => {
    isDragging = true;
    carousel.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollStart = carousel.scrollLeft;
    onUserInteraction();
  });
  carousel.addEventListener("pointermove", e => {
    if (!isDragging) return;
    carousel.scrollLeft = scrollStart - (e.clientX - startX);
    updateArrowDisabledState();
  });
  carousel.addEventListener("pointerup", e => {
    isDragging = false;
    try { carousel.releasePointerCapture(e.pointerId); } catch {}
    onUserInteraction();
  });
  carousel.addEventListener("pointercancel", () => (isDragging = false));

  /* --- Keyboard arrows --- */
  carousel.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      carousel.scrollBy({ left: -300, behavior: "smooth" });
      onUserInteraction();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      carousel.scrollBy({ left: 300, behavior: "smooth" });
      onUserInteraction();
    }
  });

  /* --- Scroll updates --- */
  carousel.addEventListener("scroll", () => {
    onUserInteraction();
    updateArrowDisabledState();
  });
  window.addEventListener("resize", updateArrowDisabledState);

 function updateArrowDisabledState() {
  if (!leftBtn || !rightBtn) return;
  const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  const current = Math.round(carousel.scrollLeft);
  const EPS = 2;

  const atStart = current <= EPS;
  const atEnd = current >= maxScrollLeft - EPS;

  leftBtn.style.opacity = atStart ? "0.2" : "1";
  leftBtn.disabled = atStart;

  rightBtn.style.opacity = atEnd ? "0.2" : "1";
  rightBtn.disabled = atEnd;
}

/* ===== LUCIDE ICONS ===== */
if (window.lucide) lucide.createIcons();
