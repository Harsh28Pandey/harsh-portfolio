/* =====================================================
   3D TILT CARDS (no library needed)
   - Cards rotate in 3D following the mouse position
   - Adds a moving glare/shine overlay
   - Skips itself on touch devices & reduced-motion users
===================================================== */

(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (reduceMotion || isTouch) return; // keep static styling, skip JS tilt

    // Selectors for every "card" that should feel 3D.
    // Add more selectors here any time you add a new card section.
    const SELECTORS = [
        ".services-box",
        ".tech-box",
        ".overview-item",
        ".connect-box",
        ".home-img .img-box",
    ].join(",");

    const MAX_TILT = 10; // degrees
    const SCALE_ON_HOVER = 1.035;

    function initTilt(el) {
        el.classList.add("tilt-3d");

        // add glare overlay once
        const glare = document.createElement("div");
        glare.className = "tilt-glare";
        el.appendChild(glare);

        let rect = null;
        let pendingEvent = null;
        let rafId = null;

        function onEnter() {
            rect = el.getBoundingClientRect();
            el.style.willChange = "transform";
        }

        // Batch mousemove into a single write per animation frame instead
        // of writing to style.transform on every raw mousemove event —
        // cheaper and noticeably smoother, especially on lower-end laptops.
        function applyMove() {
            rafId = null;
            const e = pendingEvent;
            if (!e || !rect) return;

            const px = (e.clientX - rect.left) / rect.width; // 0 - 1
            const py = (e.clientY - rect.top) / rect.height; // 0 - 1

            const rotateY = (px - 0.5) * MAX_TILT * 2;
            const rotateX = (0.5 - py) * MAX_TILT * 2;

            el.style.transform = `scale(${SCALE_ON_HOVER}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            glare.style.setProperty("--gx", `${px * 100}%`);
            glare.style.setProperty("--gy", `${py * 100}%`);
        }

        function onMove(e) {
            if (!rect) rect = el.getBoundingClientRect();
            pendingEvent = e;
            if (rafId === null) rafId = requestAnimationFrame(applyMove);
        }

        function onLeave() {
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
            el.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
            el.style.willChange = "auto";
            rect = null;
        }

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mousemove", onMove, { passive: true });
        el.addEventListener("mouseleave", onLeave);
    }

    function attachAll() {
        document.querySelectorAll(SELECTORS).forEach((el) => {
            if (!el.dataset.tiltReady) {
                el.dataset.tiltReady = "true";
                initTilt(el);
            }
        });
    }

    // Run once DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", attachAll);
    } else {
        attachAll();
    }

    // Some cards (overview items, project images) may be injected/swapped
    // later by script.js. Re-scan on load + after a short delay to catch them.
    window.addEventListener("load", attachAll);
    setTimeout(attachAll, 1500);
})();