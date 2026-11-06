(function () {
  "use strict";

  function applyInr() {
    var nodes = document.querySelectorAll("[data-pricing]");
    Array.prototype.forEach.call(nodes, function (node) {
      var amount = node.getAttribute("data-inr-amount");
      if (!amount) return;
      var symbolEl = node.querySelector("[data-currency-symbol]");
      var amountEl = node.querySelector("[data-currency-amount]");
      if (symbolEl) symbolEl.textContent = "₹";
      if (amountEl) amountEl.textContent = amount;
    });
  }

  function looksLikeIndia() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      return tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
    } catch (e) {
      return false;
    }
  }

  function init() {
    if (!document.querySelector("[data-pricing]")) return;

    fetch("/api/geo", { cache: "no-store" })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.country === "IN") {
          applyInr();
        } else if (!data && looksLikeIndia()) {
          applyInr();
        }
      })
      .catch(function () {
        if (looksLikeIndia()) applyInr();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
