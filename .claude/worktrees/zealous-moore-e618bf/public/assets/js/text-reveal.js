(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wrapTextNode(node, ref) {
    var parts = node.nodeValue.split(/(\s+)/);
    var frag = document.createDocumentFragment();
    parts.forEach(function (part) {
      if (part === "") return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      var outer = document.createElement("span");
      outer.className = "reveal-word";
      var inner = document.createElement("span");
      inner.className = "reveal-word-inner";
      inner.style.setProperty("--wi", ref.i++);
      inner.textContent = part;
      outer.appendChild(inner);
      frag.appendChild(outer);
    });
    node.parentNode.replaceChild(frag, node);
  }

  function wrapWords(el) {
    var ref = { i: 0 };
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          wrapTextNode(child, ref);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
    el.classList.add("word-reveal");
    return el.querySelectorAll(".reveal-word-inner");
  }

  var hasGsap = typeof gsap !== "undefined";
  var hasScrollTrigger = hasGsap && !!window.ScrollTrigger;
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  function initSectionHeadings() {
    var headings = document.querySelectorAll(".h2.section-header");
    if (!headings.length) return;

    Array.prototype.forEach.call(headings, function (heading) {
      var words = wrapWords(heading);
      if (!words.length) return;

      if (reduceMotion || !hasGsap || !hasScrollTrigger) {
        heading.classList.add("is-in");
        return;
      }

      gsap.set(words, { opacity: 0.12, filter: "blur(6px)", y: 10, willChange: "transform, filter, opacity" });
      gsap.to(words, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 0.4,
          fastScrollEnd: true,
          onLeave: function () { gsap.set(words, { willChange: "auto" }); },
          onLeaveBack: function () { gsap.set(words, { willChange: "auto" }); },
        },
      });
    });
  }

  function init() {
    initSectionHeadings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
