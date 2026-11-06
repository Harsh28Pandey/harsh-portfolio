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

    document.querySelectorAll("section.active").forEach((section) => {
        section.dataset.fxSeenActive = "1";
        animateSection(section);
    });
3
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