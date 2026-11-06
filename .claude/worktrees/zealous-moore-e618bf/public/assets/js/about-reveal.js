(function () {
  "use strict";

  function init() {
    var statement = document.querySelector(".about-statement");
    if (!statement || typeof gsap === "undefined" || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    var units = statement.querySelectorAll(".about-line > *");
    if (!units.length) return;

    gsap.set(units, { opacity: 0.12, filter: "blur(6px)", y: 10 });

    gsap.to(units, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: statement,
        start: "top 85%",
        end: "bottom 55%",
        scrub: 1,
      },
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
