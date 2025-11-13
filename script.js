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


// === About page fade-in + parallax ===
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".about-img");
  const text = document.querySelector(".about-text");

  if (img && text) {
    // Reveal animation when in viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.classList.add("reveal");
          text.classList.add("reveal");
        }
      });
    }, { threshold: 0.2 });

    observer.observe(img);
    observer.observe(text);

    // Parallax motion on scroll (subtle)
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.05; // 8% scroll speed
      img.style.setProperty("--parallax-offset", `${offset}px`);
    });
  }
});


// === Global fade-in + parallax for About, Services, Projects ===
document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(
    ".about-img, .about-text, .card"
  );

  if (fadeTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeTargets.forEach((el) => observer.observe(el));

    // Subtle parallax for large screens
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.06;
      fadeTargets.forEach((el) => {
        el.style.setProperty("--parallax-offset", `${offset}px`);
      });
    });
  }
});

/* ============================================================
   Projects Carousel JS
   - Auto-scroll showcase (rAF)
   - Pause on interaction (hover, pointer, touch, keyboard)
   - Mouse drag / touch swipe
   - Keyboard left/right
   - Fade-in/out arrows with idle timer
   - Edge detection disables arrows
   Notes: This code is defensive: it runs only if #projects-carousel exists.
   ============================================================ */

(function projectsCarouselModule() {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return; // nothing to do on other pages

  // Configurable constants
  const AUTO_SCROLL_SPEED_PX_PER_SEC = 50; // px per second (≈ 2.5px per 50ms)
  const RAF_MIN_INTERVAL_MS = 16; // ~60fps
  const IDLE_TIMEOUT_MS = 5000; // resume auto-scroll after 5s of inactivity
  const ARROW_HIDE_DELAY_MS = 3000; // hide arrows 3s after last interaction
  const EDGE_EPS = 1; // tolerance for edge detection

  // Elements
  const wrapper = document.getElementById("projects-wrapper");
  const leftBtn = document.getElementById("carousel-left");
  const rightBtn = document.getElementById("carousel-right");

  // State
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let lastInteractionAt = Date.now();
  let lastActivityTimeout = null;
  let arrowHideTimeout = null;
  let autoScrollPaused = false;
  let rafId = null;
  let lastRAFTime = null;

  // Utility: show arrows (add class to wrapper), and schedule hide
  function showArrows() {
    wrapper.classList.add("show-arrows");
    leftBtn.setAttribute("aria-hidden", "false");
    rightBtn.setAttribute("aria-hidden", "false");
    leftBtn.removeAttribute("tabindex");
    rightBtn.removeAttribute("tabindex");

    if (arrowHideTimeout) clearTimeout(arrowHideTimeout);
    arrowHideTimeout = setTimeout(hideArrows, ARROW_HIDE_DELAY_MS);
  }

  function hideArrows() {
    wrapper.classList.remove("show-arrows");
    leftBtn.setAttribute("aria-hidden", "true");
    rightBtn.setAttribute("aria-hidden", "true");
    leftBtn.setAttribute("tabindex", "-1");
    rightBtn.setAttribute("tabindex", "-1");
  }

 function updateArrowDisabledState() {
  const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  const current = Math.round(carousel.scrollLeft);

  // Use a slightly higher epsilon to tolerate subpixel rounding
  const EPS = 4;

  if (current <= EPS) {
    leftBtn.setAttribute("disabled", "");
  } else {
    leftBtn.removeAttribute("disabled");
  }

  if (current >= maxScrollLeft - EPS) {
    rightBtn.setAttribute("disabled", "");
  } else {
    rightBtn.removeAttribute("disabled");
  }
}

  // Scroll helpers
  function smoothScrollBy(px) {
    carousel.scrollBy({ left: px, behavior: "smooth" });
  }

  // Auto-scroll using requestAnimationFrame
  function startAutoScroll() {
    if (rafId) return;
    lastRAFTime = null;
    autoScrollPaused = false;
    rafId = requestAnimationFrame(autoStep);
  }

  function stopAutoScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    lastRAFTime = null;
    autoScrollPaused = true;
  }

  function autoStep(timestamp) {
    if (!lastRAFTime) lastRAFTime = timestamp;
    const dt = timestamp - lastRAFTime;
    lastRAFTime = timestamp;

    if (!autoScrollPaused) {
      const pxToScroll = (AUTO_SCROLL_SPEED_PX_PER_SEC * dt) / 1000;
      // If at end, smoothly snap back to start and continue
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft + pxToScroll >= maxScrollLeft - EDGE_EPS) {
        // Jump smoothly back to 0
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollLeft += pxToScroll;
      }
      updateArrowDisabledState();
    }

    rafId = requestAnimationFrame(autoStep);
  }

  // Interaction handlers: pause auto-scroll and show arrows, then resume after idle
  function onUserInteraction() {
    lastInteractionAt = Date.now();
    showArrows();
    stopAutoScroll();

    if (lastActivityTimeout) clearTimeout(lastActivityTimeout);
    lastActivityTimeout = setTimeout(() => {
      // resume only if no new interactions
      const since = Date.now() - lastInteractionAt;
      if (since >= IDLE_TIMEOUT_MS) startAutoScroll();
    }, IDLE_TIMEOUT_MS + 50);
  }

  // Pointer drag support (mouse + touch)
  carousel.addEventListener("pointerdown", (e) => {
    isPointerDown = true;
    carousel.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startScrollLeft = carousel.scrollLeft;
    onUserInteraction();
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    carousel.scrollLeft = startScrollLeft - dx;
    updateArrowDisabledState();
  });

  carousel.addEventListener("pointerup", (e) => {
    isPointerDown = false;
    try { carousel.releasePointerCapture(e.pointerId); } catch (err) {}
    onUserInteraction();
  });

  carousel.addEventListener("pointerup", () => updateArrowDisabledState());

  carousel.addEventListener("pointercancel", () => {
    isPointerDown = false;
  });

  // Hover/focus interactions
  wrapper.addEventListener("mouseenter", onUserInteraction);
  wrapper.addEventListener("mousemove", onUserInteraction);
  wrapper.addEventListener("touchstart", onUserInteraction, {passive:true});
  wrapper.addEventListener("focusin", onUserInteraction);

  // Keyboard support when carousel focused
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "Left") {
      e.preventDefault();
      smoothScrollBy(-300);
      onUserInteraction();
    } else if (e.key === "ArrowRight" || e.key === "Right") {
      e.preventDefault();
      smoothScrollBy(300);
      onUserInteraction();
    }
  });

  // Arrow clicks (manual scrolling, with proper recheck)
leftBtn.addEventListener("click", () => {
  smoothScrollBy(-300);
  onUserInteraction();
  setTimeout(updateArrowDisabledState, 600); // ✅ added: ensures left arrow re-enables dynamically
});

rightBtn.addEventListener("click", () => {
  smoothScrollBy(300);
  onUserInteraction();
  setTimeout(updateArrowDisabledState, 600);
});


  // Make cards clickable (maintains your previous project-card behavior)
  (function clickableCards() {
    const cards = carousel.querySelectorAll(".project-card");
    cards.forEach(card => {
      const url = card.dataset.link || "#";
      // if user clicks a real <a> inside card let it handle it
      card.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a) return;
        if (url && url !== "#") window.open(url, "_blank", "noopener");
      });
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) card.click();
      });
    });
  })();

  // Arrow hide/show behavior: show on scroll as well
  let scrollTimer = null;
  carousel.addEventListener("scroll", () => {
    onUserInteraction();
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      updateArrowDisabledState();
    }, 120);
  });

  // Initial state
  updateArrowDisabledState();
  hideArrows(); // default hidden
  startAutoScroll(); // begin auto-scroll after load

  // Ensure arrows disabled state updates when window resizes or content changes
  window.addEventListener("resize", () => {
    updateArrowDisabledState();
    onUserInteraction();
  });

  // Accessibility: show arrows when user tabs into carousel
  carousel.addEventListener("focus", showArrows);

  // Clean up when leaving page (avoid rAF running indefinitely)
  window.addEventListener("pagehide", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

})();

// Activate Lucide icons globally
if (window.lucide) lucide.createIcons();
