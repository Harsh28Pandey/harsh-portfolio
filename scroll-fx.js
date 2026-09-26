/* =====================================================================
   SCROLL-TRIGGERED ANIMATIONS  (Single-Page / scroll mode)
   -----------------------------------------------------------------
   Kya karta hai (poore page ke liye, top se bottom tak):

   1) Home (🏠)      — home-img par depth parallax (scroll ke saath
                        thoda upar/neeche + scale drift) + home-detail
                        block ka soft scroll-out fade. Existing
                        continuous animations (typing text, float-3d
                        badge, cursor blink) ko bilkul chhoo nahi
                        rahe — hum sirf PARENT wrappers par kaam
                        karte hain, unke andar wale elements apni
                        jagah waise hi chalte rehte hain.
   2) Services (🚀) aur Tech (🪐) — "bubble float": card viewport me
                        aate hi elastic pop-in, phir halka continuous
                        float (bubble ki tarah) jab tak visible hai.
   3) Section headings (Services / Projects / Tech) — clip-reveal +
                        slide-up jab section screen me aata hai.
   4) Overview (🧭)   — cards alternately left/right se 3D rotate
                        karte hue slide-in reveal, tab switch (Education/
                        Experience/Skills/etc) par bhi replay hota hai.
   5) Projects (🧩)   — dono project-box (detail switcher + image
                        carousel) opposite direction se 3D depth ke
                        saath slide-in.
   6) Connect (🤝)    — dono connect-box (info + form) alternate
                        slide+scale-in reveal.

   Performance / safety guarantees:
   - Sirf transform + opacity (aur entrance-only par thoda filter:blur)
     animate hote hain — kahin bhi layout-triggering property nahi
     chhedi jaati.
   - Har continuous/idle tween off-screen jaate hi PAUSE ho jata hai
     — jitne elements screen par nahi hain unke liye zero JS work.
   - `prefers-reduced-motion: reduce` set logon ke liye poora system
     silently skip ho jata hai.
   - Mobile/touch par heavier 3D-rotate/parallax effects automatically
     halke (kam rotation/parallax) ho jate hain — matchMedia ke zariye
     — aur breakpoint cross hone par (resize) khud re-tune ho jate hain.
   - Yeh system SIRF single-page (scroll) mode me engage hota hai.
     Multi-page (section-swap) mode me kuch bhi touch nahi karta —
     wahan existing section-fx.js apna kaam waise hi karta rehta
     hai jaise pehle karta tha, aur is file ka koi bhi tween/trigger
     disengage() par poori tarah clean ho jata hai (elements apni
     normal multi-page state me wapas aa jate hain).
   - Koi bhi doosri file (single-page.js, section-fx.js, script.js,
     tilt-3d.js, three-bg.js, etc.) is file ne CHANGE nahi ki —
     sirf body par lagne wali "single-page" class ko observe karke
     khud ko on/off karta hai.
===================================================== */

(function () {
    if (typeof gsap === "undefined") return;               // GSAP na mile to kuch mat karo
    if (typeof ScrollTrigger === "undefined") return;       // plugin blocked/failed → silently skip
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // user ne animations off rakhi hain — poora respect karo

    const body = document.body;
    const isSingle = () => body.classList.contains("single-page");
    const isCoarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const isNarrow = () => window.innerWidth < 768;
    const lightMode = () => isCoarse || isNarrow(); // mobile/touch => halka 3D

    let engaged = false;

    // Sab tweens/triggers yahan collect hote hain taaki disengage()
    // par ek jagah se sab kuch cleanly kill ho sake.
    let scrollTriggers = [];   // one-shot / scrub ScrollTrigger instances
    let idleTweens = [];       // continuous float tweens (pause/resume hote rehte hain)
    let overviewBatch = [];    // overview ke ScrollTrigger.batch instances

    function track(st) {
        if (st) scrollTriggers.push(st);
        return st;
    }

    /* ---------------------------------------------------------------
       STEP 0 — har services/tech card ko ek invisible wrapper do.
       Yeh sirf EK BAAR hota hai. Wrapper hi float hota hai, andar
       wali .services-box/.tech-box tilt-3d.js ke hover-tilt ke liye
       bilkul free rehti hai — isliye dono animations ek dusre se
       kabhi takrate (conflict) nahi.
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       STEP 1 — bubble float builder (Services + Tech dono isi ek
       function se banate hain, alag amplitude/timing ke saath taaki
       har section apni jagah thoda organic/alag lage).
    --------------------------------------------------------------- */
    function buildBubbleFx(containerSelector) {
        const wraps = gsap.utils.toArray(containerSelector + " .bubble-wrap");

        wraps.forEach((wrap, i) => {
            // shuru me card chhota, neeche, halka rotated aur invisible
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

    /* ---------------------------------------------------------------
       STEP 2 — Overview section: cards alternately left/right se 3D
       rotate karte hue slide-in hote hain, staggered. Yeh sirf ek
       baar chalta hai (bubble wale continuous float nahi hai) —
       isliye .overview-item par lagne wale tilt-3d.js hover-tilt se
       bhi koi takrav nahi hota.
    --------------------------------------------------------------- */
    function buildOverviewFx() {
        overviewBatch.forEach((st) => st.kill());
        overviewBatch = [];

        const items = gsap.utils.toArray(".overview-detail.active .overview-item");
        if (!items.length) return;

        gsap.set(items, { clearProps: "all" });

        const rotateAmt = lightMode() ? 16 : 34; // mobile par kam rotation

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

    /* ---------------------------------------------------------------
       STEP 3 — Section headings (🚀/🧩/🪐 — top-level section
       headings only, ek hi baar dikhte hain) ko ek clip-reveal +
       slide-up entrance do. Halka, ek-hi-element hone se koi doosri
       animation se conflict nahi hota.
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       STEP 4 — Projects section: dono .project-box (detail switcher
       + image carousel) opposite directions se depth ke saath
       slide-in hote hain jab section screen me aata hai.
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       STEP 5 — Connect section: dono .connect-box (info card + form)
       alternate slide+scale-in reveal.
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       STEP 6 — Home section: sirf parent wrappers par subtle scroll
       parallax (scrub) — andar ke elements (typing text, cursor,
       float-3d badge) bilkul untouched rehte hain, isliye koi
       existing animation break nahi hoti.
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       LIFECYCLE — sirf single-page mode me engage/disengage
    --------------------------------------------------------------- */
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

        // sab kuch clean karke elements ko unki normal (multi-page)
        // state me chhod do — section-fx.js apna kaam waise hi
        // sambhal lega jaise pehle karta tha.
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

    /* ---------------------------------------------------------------
       Overview tab switch hone par (Education / Experience / Skills
       / etc.) us naye active tab ke cards ke liye reveal replay karo.
    --------------------------------------------------------------- */
    document.addEventListener("click", (e) => {
        if (!isSingle()) return;
        if (!e.target.closest(".overview-btn")) return;
        // script.js pehle active class switch karta hai, hum ek tick
        // baad chalte hain taaki naya .overview-detail.active ready ho
        setTimeout(buildOverviewFx, 60);
    });

    /* ---------------------------------------------------------------
       body par "single-page" class ka add/remove single-page.js
       control karta hai (multi/single toggle button). Hum us class
       ko sirf observe karte hain — single-page.js ko chhedte nahi.
    --------------------------------------------------------------- */
    new MutationObserver(sync).observe(body, {
        attributes: true,
        attributeFilter: ["class"],
    });

    function boot() {
        sync();
        // images/fonts settle hone ke baad measurements accurate
        // karne ke liye ek refresh extra
        setTimeout(() => ScrollTrigger.refresh(), 600);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());

    /* ---------------------------------------------------------------
       Resize (jaise mobile <-> desktop rotate, ya window resize):
       agar engaged hain to poora rebuild karo taaki lightMode()-based
       rotation/parallax amounts naye breakpoint ke hisaab se sahi ho
       jaayen; warna sirf measurements refresh karo.
    --------------------------------------------------------------- */
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