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

  function isLocalDevHost() {
    var h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "";
  }

  function init() {
    if (!document.querySelector("[data-pricing]")) return;

    // /api/geo only exists on the deployed Cloudflare Worker, not under a
    // local dev server (Live Server, etc). Skip the request there instead of
    // letting it fail with a 404 on every load; the page already defaults to
    // USD pricing with no JS involved.
    if (isLocalDevHost()) return;

    // Currency is decided only by the visitor's IP-based country (via /api/geo,
    // which reflects the real connecting IP/VPN exit location on Cloudflare).
    // There is no timezone-based fallback: a VPN changes the IP, not the
    // device's system timezone, so guessing from timezone would ignore the
    // VPN entirely and show the wrong currency. If the check fails, the page
    // simply keeps its default USD pricing.
    fetch("/api/geo", { cache: "no-store" })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.country === "IN") {
          applyInr();
        }
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
