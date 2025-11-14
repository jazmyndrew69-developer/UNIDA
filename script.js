/*
  Creation • script.js (stable final)
  All behavior: role toggle, petals, clickables, services, fade/parallax, projects carousel, lucide icons.
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

/* ===== PETALS ===== */
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
      if (e.target.closest("a")) return;
      window.open(url, "_blank", "noopener");
    });
    card.addEventListener("keypress", e => { if (e.key === "Enter") card.click(); });
  });
})();

/* ===== SERVICES GET STARTED (open form) ===== */
(function serviceButtons() {
  const FORM_URL = "https://forms.gle/ayJHG2n686WdVC9W7";
  document.querySelectorAll(".btn-start").forEach(btn => {
    btn.addEventListener("click", (e) => {
      // open form in new tab
      e.preventDefault();
      window.open(btn.href || FORM_URL, "_blank", "noopener");
      // mark for potential return behavior
      sessionStorage.setItem("form-opened", "1");
    });
  });

  // optional: jump to contact if returning
  window.addEventListener("focus", () => {
    if (sessionStorage.getItem("form-opened") === "1") {
      sessionStorage.removeItem("form-opened");
      // if contact page exists, navigate there
      if (location.pathname.endsWith("index.html")) {
        window.location.href = "contact.html";
      }
    }
  });
})();

/* ===== FADE-IN + PARALLAX ===== */
document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(".about-img, .about-text, .card");
  if (!fadeTargets.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("reveal"); });
  }, { threshold: 0.2 });
  fadeTargets.forEach(el => observer.observe(el));
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.06;
    fadeTargets.forEach(el => el.style.setProperty("--parallax-offset", `${offset}px`));
  });
});

/* ============================================================
   Projects Carousel (ping-pong), arrows, drag, keyboard
   ============================================================ */
(function projectsCarouselModule() {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return;

  const wrapper = document.getElementById("projects-wrapper");
  const leftBtn = document.getElementById("carousel-left");
  const rightBtn = document.getElementById("carousel-right");

  const AUTO_SCROLL_SPEED_PX_PER_SEC = 50;
  const IDLE_TIMEOUT_MS = 5000;
  const ARROW_HIDE_DELAY_MS = 3000;
  const EDGE_EPS = 2;

  let direction = "right";
  let rafId = null;
  let lastRAFTime = null;
  let lastInteractionAt = Date.now();
  let arrowHideTimeout = null;
  let resumeTimeout = null;
  let autoScrollPaused = false;

  function showArrows() {
    if (wrapper) wrapper.classList.add("show-arrows");
    [leftBtn, rightBtn].forEach(b => {
      if (!b) return;
      b.setAttribute("aria-hidden", "false");
      b.removeAttribute("tabindex");
    });
    clearTimeout(arrowHideTimeout);
    arrowHideTimeout = setTimeout(hideArrows, ARROW_HIDE_DELAY_MS);
  }
  function hideArrows() {
    if (wrapper) wrapper.classList.remove("show-arrows");
    [leftBtn, rightBtn].forEach(b => {
      if (!b) return;
      b.setAttribute("aria-hidden", "true");
      b.setAttribute("tabindex", "-1");
    });
  }

  function updateArrowDisabledState() {
    if (!leftBtn || !rightBtn) return;
    const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const current = Math.round(carousel.scrollLeft);
    const atStart = current <= EDGE_EPS;
    const atEnd = current >= maxScrollLeft - EDGE_EPS;
    leftBtn.style.opacity = atStart ? "0.2" : "1";
    leftBtn.disabled = atStart;
    rightBtn.style.opacity = atEnd ? "0.2" : "1";
    rightBtn.disabled = atEnd;
  }

  function autoStep(timestamp) {
    if (!lastRAFTime) lastRAFTime = timestamp;
    const dt = timestamp - lastRAFTime;
    lastRAFTime = timestamp;

    if (!autoScrollPaused) {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const pxToScroll = (AUTO_SCROLL_SPEED_PX_PER_SEC * dt) / 1000;

      if (direction === "right") {
        if (carousel.scrollLeft + pxToScroll >= maxScrollLeft - EDGE_EPS) direction = "left";
        else carousel.scrollLeft += pxToScroll;
      } else {
        if (carousel.scrollLeft - pxToScroll <= EDGE_EPS) direction = "right";
        else carousel.scrollLeft -= pxToScroll;
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

  function onUserInteraction() {
    lastInteractionAt = Date.now();
    showArrows();
    stopAutoScroll();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (Date.now() - lastInteractionAt >= IDLE_TIMEOUT_MS) startAutoScroll();
    }, IDLE_TIMEOUT_MS);
  }

  // arrow clicks
  if (leftBtn) leftBtn.addEventListener("click", () => { carousel.scrollBy({ left: -300, behavior: "smooth" }); onUserInteraction(); setTimeout(updateArrowDisabledState, 600); });
  if (rightBtn) rightBtn.addEventListener("click", () => { carousel.scrollBy({ left: 300, behavior: "smooth" }); onUserInteraction(); setTimeout(updateArrowDisabledState, 600); });

  // pointer drag
  let isDragging = false, startX = 0, scrollStart = 0;
  carousel.addEventListener("pointerdown", e => {
    isDragging = true; carousel.setPointerCapture(e.pointerId);
    startX = e.clientX; scrollStart = carousel.scrollLeft; onUserInteraction();
  });
  carousel.addEventListener("pointermove", e => { if (!isDragging) return; carousel.scrollLeft = scrollStart - (e.clientX - startX); updateArrowDisabledState(); });
  carousel.addEventListener("pointerup", e => { isDragging = false; try { carousel.releasePointerCapture(e.pointerId); } catch {} onUserInteraction(); });
  carousel.addEventListener("pointercancel", () => isDragging = false);

  // keyboard
  carousel.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); carousel.scrollBy({ left: -300, behavior: "smooth" }); onUserInteraction(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); carousel.scrollBy({ left: 300, behavior: "smooth" }); onUserInteraction(); }
  });

  // scroll updates
  carousel.addEventListener("scroll", () => { onUserInteraction(); updateArrowDisabledState(); });
  window.addEventListener("resize", updateArrowDisabledState);

  // init
  requestAnimationFrame(() => { showArrows(); setTimeout(hideArrows, 1500); updateArrowDisabledState(); });
  startAutoScroll();

  window.addEventListener("pagehide", () => { if (rafId) cancelAnimationFrame(rafId); });
})();

/* ===== LUCIDE ICONS ===== */
if (window.lucide) lucide.createIcons();
