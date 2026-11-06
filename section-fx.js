/* =====================================================
   SECTION ENTRANCE CHOREOGRAPHY
   This site swaps between full-screen <section> panels
   (adds/removes the "active" class) rather than doing a
   continuous page scroll, so classic ScrollTrigger reveals
   don't apply page-wide. Instead: whenever a section gains
   "active", we run a GSAP stagger/3D-tilt-in timeline on its
   cards, synced to the section's own CSS fade timing so
   nothing double-animates or flashes.
===================================================== */

(function () {
    if (typeof gsap === "undefined") return;

    const CARD_SELECTORS = {
        home: ".home-detail > *",
        services: ".services-box",
        overview: ".overview-item",
        project: ".project-box",
        "tech-section": ".tech-box",
        connect: ".connect-box, .connect-container > *",
    };

    function msFromCSSTime(str) {
        if (!str) return 0;
        str = str.trim().split(",")[0];
        if (str.endsWith("ms")) return parseFloat(str);
        if (str.endsWith("s")) return parseFloat(str) * 1000;
        return 0;
    }

    function animateSection(section) {
        let selector = null;
        for (const cls in CARD_SELECTORS) {
            if (section.classList.contains(cls)) { selector = CARD_SELECTORS[cls]; break; }
        }
        if (!selector) return;

        const cards = section.querySelectorAll(selector);
        if (!cards.length) return;

        // Sync with whatever animation-delay is currently set on the
        // section (3.4s on the very first load, 0s on subsequent
        // section switches — see script.js's activePage()).
        const delayMs = msFromCSSTime(getComputedStyle(section).animationDelay);

        gsap.killTweensOf(cards);
        gsap.set(cards, { opacity: 0, y: 36, rotateX: -8, transformPerspective: 800 });
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            delay: Math.max(delayMs, 0) / 1000 + 0.05,
            overwrite: "auto",
        });
    }

    // Run once for whichever section starts active (home, on first load).
    document.querySelectorAll("section.active").forEach((section) => {
        section.dataset.fxSeenActive = "1";
        animateSection(section);
    });

    // React to every future section switch.
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.attributeName !== "class") return;
            const section = m.target;
            if (section.classList.contains("active") && !section.dataset.fxSeenActive) {
                section.dataset.fxSeenActive = "1";
                animateSection(section);
            } else if (!section.classList.contains("active")) {
                delete section.dataset.fxSeenActive;
            }
        });
    });

    document.querySelectorAll("section").forEach((s) => {
        observer.observe(s, { attributes: true, attributeFilter: ["class"] });
    });
})();