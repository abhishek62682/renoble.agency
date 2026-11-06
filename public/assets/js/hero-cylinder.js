import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

(function () {
  "use strict";

  function notifyReady() {
    window.dispatchEvent(new CustomEvent("hero-cylinder:ready"));
  }

  function init() {
    var container = document.getElementById("hero-cylinder");
    if (!container) {
      notifyReady();
      return;
    }

    var isMobile =
      window.matchMedia && window.matchMedia("(max-width: 767px)").matches;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.2);

    var renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    var IMAGES = [
      "assets/images/hero-cylinder/image-09.jpg",
      "assets/images/hero-cylinder/image-26.jpg",
      "assets/images/hero-cylinder/image-27.jpg",
      "assets/images/hero-cylinder/image-31.jpg",
      "assets/images/hero-cylinder/image-14.jpg",
      "assets/images/hero-cylinder/image-32.jpg",
    ];

    var CELL_W = 512;
    var CELL_H = 512;
    var GAP = 24;
    var canvas = document.createElement("canvas");
    canvas.width = IMAGES.length * CELL_W;
    canvas.height = CELL_H;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace || texture.colorSpace;
    texture.wrapS = THREE.RepeatWrapping;

    var loadedCount = 0;
    function onImageSettled() {
      loadedCount++;
      if (loadedCount === IMAGES.length) {
        notifyReady();
      }
    }

    IMAGES.forEach(function (src, i) {
      var img = new Image();
      img.onload = function () {
        var destW = CELL_W - GAP;
        var destH = CELL_H - GAP;
        var scale = Math.max(destW / img.width, destH / img.height);
        var sw = destW / scale;
        var sh = destH / scale;
        var sx = (img.width - sw) / 2;
        var sy = (img.height - sh) / 2;
        var dx = i * CELL_W + GAP / 2;
        var dy = GAP / 2;
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, destW, destH);
        texture.needsUpdate = true;
        onImageSettled();
      };
      img.onerror = onImageSettled;
      img.src = src;
    });

    var geometry = new THREE.CylinderGeometry(1, 1, 1, 60, 60, true);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    var cyl = new THREE.Mesh(geometry, material);
    cyl.rotation.set(0.3, 1.4, 0);
    cyl.scale.setScalar(2.3);
    scene.add(cyl);

    var MAX_TILT_X = 0.45;

    function clampTiltX(x) {
      return Math.max(-MAX_TILT_X, Math.min(MAX_TILT_X, x));
    }

    var clock = new THREE.Clock();
    var visible = true;

    var dragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartRotX = 0;
    var dragStartRotY = 0;
    var speedX = 0;
    var speedY = 0;
    var lastDragX = 0;
    var lastDragY = 0;

    container.style.cursor = isMobile ? "default" : "grab";

    function onPointerDown(e) {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragStartRotX = cyl.rotation.x;
      dragStartRotY = cyl.rotation.y;
      speedX = 0;
      speedY = 0;
      container.style.cursor = "grabbing";
      container.setPointerCapture && container.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      var deltaX = e.clientX - dragStartX;
      var deltaY = e.clientY - dragStartY;
      cyl.rotation.y = dragStartRotY + deltaX * 0.01;
      cyl.rotation.x = clampTiltX(dragStartRotX + deltaY * 0.01);
      speedY = (e.clientX - lastDragX) * 0.01;
      speedX = (e.clientY - lastDragY) * 0.01;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      container.style.cursor = "grab";
      container.releasePointerCapture && container.releasePointerCapture(e.pointerId);
    }

    if (!isMobile) {
      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointerleave", onPointerUp);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      var delta = clock.getDelta();
      if (dragging) {
        // rotation already applied directly in onPointerMove
      } else if (Math.abs(speedY) > 0.0005 || Math.abs(speedX) > 0.0005) {
        cyl.rotation.y += speedY;
        cyl.rotation.x = clampTiltX(cyl.rotation.x + speedX);
        if (cyl.rotation.x === MAX_TILT_X || cyl.rotation.x === -MAX_TILT_X) {
          speedX = 0;
        }
        speedY *= 0.95;
        speedX *= 0.95;
      } else {
        cyl.rotation.y += delta;
      }
      renderer.render(scene, camera);
    }

    function onResize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", onResize);

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
