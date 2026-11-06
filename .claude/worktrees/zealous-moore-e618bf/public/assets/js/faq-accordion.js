(function () {
  "use strict";

  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  Array.prototype.forEach.call(items, function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.setAttribute("tabindex", "0");
    question.setAttribute("role", "button");
    question.setAttribute("aria-expanded", "false");

    function toggle() {
      var open = item.classList.toggle("is-open");
      question.setAttribute("aria-expanded", String(open));
      answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
    }

    question.addEventListener("click", toggle);
    question.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    window.addEventListener("resize", function () {
      if (item.classList.contains("is-open")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
})();
