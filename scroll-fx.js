(function () {
    if (typeof gsap === "undefined") return;               
    if (typeof ScrollTrigger === "undefined") return;      
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; 

    const body = document.body;
    const isSingle = () => body.classList.contains("single-page");
    const isCoarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const isNarrow = () => window.innerWidth < 768;
    const lightMode = () => isCoarse || isNarrow(); 

    let engaged = false;

    let scrollTriggers = [];  
    let idleTweens = [];      
    let overviewBatch = [];   

    function track(st) {
        if (st) scrollTriggers.push(st);
        return st;
    }

    function wrapCards(selector) {
        document.querySelectorAll(selector).forEach((card) => {
            if (card.dataset.bubbleWrapped) return;
            card.dataset.bubbleWrapped = "true";
            const wrap = document.createElement("div");
            wrap.className = "bubble-wrap";
            card.parentNode.insertBefore(wrap, card);
            wrap.appendChild(card);
        });
    }

    function ensureWrapped() {
        wrapCards(".services-container > .services-box");
        wrapCards(".tech-container > .tech-box");
    }

    function buildBubbleFx(containerSelector) {
        const wraps = gsap.utils.toArray(containerSelector + " .bubble-wrap");

        wraps.forEach((wrap, i) => {
            gsap.set(wrap, {
                opacity: 0,
                y: 90,
                scale: 0.55,
                rotate: i % 2 === 0 ? -14 : 14,
                transformOrigin: "50% 100%",
            });

            let idleTween = null;

            function startIdleFloat() {
                if (idleTween) { idleTween.play(); return; }
                idleTween = gsap.to(wrap, {
                    y: "+=" + (12 + Math.random() * 12).toFixed(1),
                    rotate: (i % 2 === 0 ? 1 : -1) * (3 + Math.random() * 3),
                    duration: 2.3 + Math.random() * 1.6,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                });
                idleTweens.push(idleTween);
            }

            function pauseIdleFloat() {
                if (idleTween) idleTween.pause();
                wrap.style.willChange = "auto";
            }

            function playEntrance() {
                wrap.style.willChange = "transform, opacity";
                gsap.to(wrap, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    duration: 1.1,
                    ease: "elastic.out(1, 0.65)",
                    delay: (i % 4) * 0.06,
                    overwrite: "auto",
                    onComplete: startIdleFloat,
                });
            }

            track(ScrollTrigger.create({
                trigger: wrap,
                start: "top 88%",
                onEnter: playEntrance,
                onEnterBack: playEntrance,
                onLeave: pauseIdleFloat,
                onLeaveBack: pauseIdleFloat,
            }));
        });
    }

    function buildOverviewFx() {
        overviewBatch.forEach((st) => st.kill());
        overviewBatch = [];

        const items = gsap.utils.toArray(".overview-detail.active .overview-item");
        if (!items.length) return;

        gsap.set(items, { clearProps: "all" });

        const rotateAmt = lightMode() ? 16 : 34;

        overviewBatch = ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) => {
                gsap.fromTo(
                    batch,
                    {
                        opacity: 0,
                        x: (idx) => (idx % 2 === 0 ? -70 : 70),
                        rotateY: (idx) => (idx % 2 === 0 ? -rotateAmt : rotateAmt),
                        filter: "blur(6px)",
                        transformPerspective: 900,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        rotateY: 0,
                        filter: "blur(0px)",
                        duration: 0.85,
                        ease: "power3.out",
                        stagger: 0.09,
                        overwrite: "auto",
                    }
                );
            },
        });
    }

    function buildHeadingFx() {
        const headings = gsap.utils.toArray(
            ".services > .heading, .project > .heading, .tech-section > .heading"
        );

        headings.forEach((h) => {
            gsap.set(h, { opacity: 0, y: 38, clipPath: "inset(0 0 100% 0)" });

            track(ScrollTrigger.create({
                trigger: h,
                start: "top 90%",
                onEnter: () => animateHeading(h),
                onEnterBack: () => animateHeading(h),
            }));
        });

        function animateHeading(h) {
            gsap.to(h, {
                opacity: 1,
                y: 0,
                clipPath: "inset(0% 0 0% 0)",
                duration: 0.9,
                ease: "power4.out",
                overwrite: "auto",
            });
        }
    }

    function buildProjectFx() {
        const boxes = gsap.utils.toArray(".project-container > .project-box");
        if (!boxes.length) return;

        const xAmt = lightMode() ? 40 : 110;
        const rotateAmt = lightMode() ? 0 : 10;

        gsap.set(boxes, { clearProps: "all" });

        track(ScrollTrigger.create({
            trigger: ".project-container",
            start: "top 82%",
            onEnter: () => playIn(),
            onEnterBack: () => playIn(),
        }));

        function playIn() {
            gsap.fromTo(
                boxes,
                {
                    opacity: 0,
                    x: (idx) => (idx % 2 === 0 ? -xAmt : xAmt),
                    y: 40,
                    rotateY: (idx) => (idx % 2 === 0 ? rotateAmt : -rotateAmt),
                    scale: 0.94,
                    transformPerspective: 1000,
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.16,
                    overwrite: "auto",
                }
            );
        }
    }

    function buildConnectFx() {
        const boxes = gsap.utils.toArray(".connect-container > .connect-box");
        if (!boxes.length) return;

        const xAmt = lightMode() ? 36 : 90;

        gsap.set(boxes, { clearProps: "all" });

        track(ScrollTrigger.create({
            trigger: ".connect-container",
            start: "top 85%",
            onEnter: () => playIn(),
            onEnterBack: () => playIn(),
        }));

        function playIn() {
            gsap.fromTo(
                boxes,
                {
                    opacity: 0,
                    y: 60,
                    x: (idx) => (idx % 2 === 0 ? -xAmt : xAmt),
                    scale: 0.92,
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    stagger: 0.14,
                    overwrite: "auto",
                }
            );
        }
    }

    function buildHomeFx() {
        const homeSection = document.querySelector("section.home");
        const homeImg = document.querySelector(".home-img");
        const homeDetail = document.querySelector(".home-detail");
        if (!homeSection) return;

        gsap.set([homeImg, homeDetail].filter(Boolean), { clearProps: "all" });

        if (homeImg) {
            track(ScrollTrigger.create({
                trigger: homeSection,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
                animation: gsap.fromTo(
                    homeImg,
                    { yPercent: 0, scale: 1 },
                    { yPercent: isNarrow() ? -6 : -14, scale: 1.05, ease: "none" }
                ),
            }));
        }

        if (homeDetail) {
            track(ScrollTrigger.create({
                trigger: homeSection,
                start: "top top",
                end: "70% top",
                scrub: 0.6,
                animation: gsap.fromTo(
                    homeDetail,
                    { yPercent: 0, opacity: 1 },
                    { yPercent: -8, opacity: 0.35, ease: "none" }
                ),
            }));
        }
    }

    function engage() {
        if (engaged) return;
        engaged = true;
        ensureWrapped();
        buildBubbleFx(".services-container");
        buildBubbleFx(".tech-container");
        buildHeadingFx();
        buildOverviewFx();
        buildProjectFx();
        buildConnectFx();
        buildHomeFx();
        ScrollTrigger.refresh();
    }

    function disengage() {
        if (!engaged) return;
        engaged = false;

        scrollTriggers.forEach((st) => st.kill());
        scrollTriggers = [];

        idleTweens.forEach((t) => t.kill());
        idleTweens = [];

        overviewBatch.forEach((st) => st.kill());
        overviewBatch = [];

        gsap.set(".bubble-wrap", { clearProps: "all" });
        gsap.set(".overview-item", { clearProps: "all" });
        gsap.set(".services > .heading, .project > .heading, .tech-section > .heading", { clearProps: "all" });
        gsap.set(".project-container > .project-box", { clearProps: "all" });
        gsap.set(".connect-container > .connect-box", { clearProps: "all" });
        const homeImg = document.querySelector(".home-img");
        const homeDetail = document.querySelector(".home-detail");
        if (homeImg) gsap.set(homeImg, { clearProps: "all" });
        if (homeDetail) gsap.set(homeDetail, { clearProps: "all" });
    }

    function sync() {
        if (isSingle()) engage();
        else disengage();
    }

    document.addEventListener("click", (e) => {
        if (!isSingle()) return;
        if (!e.target.closest(".overview-btn")) return;
        setTimeout(buildOverviewFx, 60);
    });

    new MutationObserver(sync).observe(body, {
        attributes: true,
        attributeFilter: ["class"],
    });

    function boot() {
        sync();
        setTimeout(() => ScrollTrigger.refresh(), 600);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());

    let resizeTimer;
    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (engaged) {
                    disengage();
                    engage();
                } else {
                    ScrollTrigger.refresh();
                }
            }, 200);
        },
        { passive: true }
    );
})();