/* =====================================================
   MAGNETIC BUTTONS
   - .btn / .overview-btn / header-actions buttons gently
     pull toward the cursor when hovered, spring back on leave.
   - Skips itself on touch devices & reduced-motion, same
     pattern as the existing tilt-3d.js.
===================================================== */

(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (reduceMotion || isTouch) return;

    const hasGSAP = typeof gsap !== "undefined";
    const STRENGTH = 0.35;
    const MAX_PULL = 14;

    function initMagnet(el) {
        if (el.dataset.magnetReady) return;
        el.dataset.magnetReady = "true";

        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);
            const x = Math.max(-MAX_PULL, Math.min(MAX_PULL, relX * STRENGTH));
            const y = Math.max(-MAX_PULL, Math.min(MAX_PULL, relY * STRENGTH));

            if (hasGSAP) {
                gsap.to(el, { x, y, duration: 0.35, ease: "power3.out" });
            } else {
                el.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        el.addEventListener("mouseleave", () => {
            if (hasGSAP) {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
            } else {
                el.style.transform = "translate(0, 0)";
            }
        });
    }

    function attachAll() {
        document.querySelectorAll(".btn, .overview-btn, .header-actions button").forEach(initMagnet);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", attachAll);
    } else {
        attachAll();
    }
    window.addEventListener("load", attachAll);
    setTimeout(attachAll, 1500);
})();