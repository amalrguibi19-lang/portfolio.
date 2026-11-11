
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target); 
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  const loader = document.getElementById("loader");
  if (loader) {
    const hideLoader = () =>
      setTimeout(() => loader.classList.add("hide"), reduceMotion ? 0 : 450);
    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader);

    setTimeout(() => loader.classList.add("hide"), 4000);
  }

  const progress = document.querySelector(".scroll-progress");
  const header = document.getElementById("header");
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;
    if (progress) progress.style.width = ratio * 100 + "%";
    if (header) header.classList.toggle("scrolled", doc.scrollTop > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const glow = document.querySelector(".cursor-glow");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (glow && hasFinePointer && !reduceMotion) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      glow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
    (function loop() {
      cx += (mx - cx) * 0.15;  
      cy += (my - cy) * 0.15;
      glow.style.transform =
        "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  const menuBtn = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();