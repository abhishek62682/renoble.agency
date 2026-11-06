(function () {
  "use strict";

  var items = document.querySelectorAll(".portfolio-collection-item");
  if (!items.length) return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (item) {
      item.classList.add("is-in");
    });
    return;
  }

  // small stagger between the two cards in the same row
  Array.prototype.forEach.call(items, function (item, i) {
    item.style.transitionDelay = (i % 2) * 0.1 + "s";
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  Array.prototype.forEach.call(items, function (item) {
    observer.observe(item);
  });
})();
