(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (reduceMotion || isTouch) return; 
    const SELECTORS = [
        ".services-box",
        ".tech-box",
        ".overview-item",
        ".connect-box",
        ".home-img .img-box",
    ].join(",");

    const MAX_TILT = 10; 
    const SCALE_ON_HOVER = 1.035;

    function initTilt(el) {
        el.classList.add("tilt-3d");

        const glare = document.createElement("div");
        glare.className = "tilt-glare";
        glare.setAttribute("aria-hidden", "true");
        el.appendChild(glare);

        let rect = null;
        let pendingEvent = null;
        let rafId = null;

        function onEnter() {
            rect = el.getBoundingClientRect();
            el.style.willChange = "transform";
        }

        function applyMove() {
            rafId = null;
            const e = pendingEvent;
            if (!e || !rect) return;

            const px = (e.clientX - rect.left) / rect.width; 
            const py = (e.clientY - rect.top) / rect.height; 

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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", attachAll);
    } else {
        attachAll();
    }

    window.addEventListener("load", attachAll);
    setTimeout(attachAll, 1500);
})();