/* ==========================================================================
   CUSTOM CURSOR (dot + lagging ring)
   ========================================================================== */
(function () {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) return;

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverables = document.querySelectorAll(
    "a, button, .btn, .secondary-btn, .skill-card, .philosophy-card, .card, .project-card, .contact-link, .glass-chip--link"
  );
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
})();

/* ==========================================================================
   3D TILT — profile card + project/cert cards
   ========================================================================== */
(function () {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) return;

  function attachTilt(el, strength) {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  const profileTilt = document.querySelector(".tilt-card");
  if (profileTilt) attachTilt(profileTilt, 14);

  document.querySelectorAll(".project-card, .card").forEach((el) => attachTilt(el, 5));
})();

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  });
});

/* ==========================================================================
   SCROLL REVEAL
   ========================================================================== */
const hiddenElements = document.querySelectorAll(".hidden");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
hiddenElements.forEach((el) => observer.observe(el));

/* ==========================================================================
   NAV BACKGROUND ON SCROLL
   ========================================================================== */
const navEl = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navEl.style.background = "rgba(8,8,12,0.75)";
  } else {
    navEl.style.background = "rgba(10,10,15,0.55)";
  }
});