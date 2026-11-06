/* =====================================================
   3D MOBILE NAV CONTROLLER
   - Animated hamburger -> X coin-flip (CSS 3D + GSAP)
   - Nav panel opens with a 3D perspective tilt + slide
   - Blurred backdrop overlay, staggered link entrance
   - A genuine tiny Three.js particle burst fires from the
     button every time it's tapped, so the "3D engine" feels
     visibly alive and connected to the toggle, not just decor
   - Body scroll lock while open, closes on link click,
     backdrop click, or Escape key
   - Stays in sync even if nav is closed elsewhere (e.g.
     script.js's activePage() on link click) via a
     MutationObserver on nav's class list
===================================================== */

(function () {
    const menuIcon = document.getElementById('menu-icon');
    const nav = document.querySelector('header nav');
    const overlay = document.getElementById('navOverlay');
    if (!menuIcon || !nav || !overlay) return;

    const hasGSAP = typeof gsap !== 'undefined';
    const navLinkEls = nav.querySelectorAll('a');

    let isOpen = false;

    /* ---------- tiny real Three.js particle burst from the button ---------- */
    const burst = (function setupBurst() {
        if (typeof THREE === 'undefined') return { fire() { } };

        let canvas, renderer, scene, camera, particles, rafId, activeUntil = 0;

        function ensureScene() {
            if (renderer) return;
            canvas = document.createElement('canvas');
            canvas.id = 'menu-burst-canvas';
            canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1002;';
            document.body.appendChild(canvas);

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(window.innerWidth, window.innerHeight);

            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, -10, 10);

            window.addEventListener('resize', () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.right = window.innerWidth;
                camera.bottom = window.innerHeight;
                camera.updateProjectionMatrix();
            }, { passive: true });
        }

        function fire() {
            ensureScene();
            const rect = menuIcon.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const rootStyles = getComputedStyle(document.documentElement);
            const color = new THREE.Color(rootStyles.getPropertyValue('--main-color').trim() || '#ff8c00');

            const COUNT = 26;
            const positions = new Float32Array(COUNT * 3);
            const velocities = [];
            for (let i = 0; i < COUNT; i++) {
                positions[i * 3] = cx;
                positions[i * 3 + 1] = cy;
                positions[i * 3 + 2] = 0;
                const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.3;
                const speed = 60 + Math.random() * 90;
                velocities.push({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({
                color, size: 6, transparent: true, opacity: 1,
                blending: THREE.AdditiveBlending, depthWrite: false,
            });
            const points = new THREE.Points(geo, mat);
            scene.add(points);

            const start = performance.now();
            const duration = 650;
            activeUntil = start + duration;

            function animateBurst(now) {
                const t = Math.min((now - start) / duration, 1);
                const pos = geo.attributes.position.array;
                for (let i = 0; i < COUNT; i++) {
                    pos[i * 3] = cx + velocities[i].x * t;
                    pos[i * 3 + 1] = cy + velocities[i].y * t;
                }
                geo.attributes.position.needsUpdate = true;
                mat.opacity = 1 - t;
                renderer.render(scene, camera);

                if (t < 1) {
                    rafId = requestAnimationFrame(animateBurst);
                } else {
                    scene.remove(points);
                    geo.dispose();
                    mat.dispose();
                }
            }
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(animateBurst);
        }

        return { fire };
    })();

    function openNav() {
        if (isOpen) return;
        isOpen = true;
        document.body.classList.add('nav-open');
        menuIcon.classList.add('active');
        menuIcon.setAttribute('aria-expanded', 'true');
        nav.classList.add('active');
        overlay.classList.add('active');
        burst.fire();

        if (hasGSAP) {
            gsap.killTweensOf(nav);
            gsap.fromTo(nav,
                { autoAlpha: 1, rotateY: 35, x: 60, transformPerspective: 900 },
                { rotateY: 0, x: 0, duration: 0.55, ease: 'power4.out' }
            );
            gsap.fromTo(navLinkEls,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, delay: 0.12, ease: 'power2.out' }
            );
        }
    }

    function closeNav() {
        if (!isOpen) return;
        isOpen = false;
        document.body.classList.remove('nav-open');
        menuIcon.classList.remove('active');
        menuIcon.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        burst.fire();

        if (hasGSAP) {
            gsap.killTweensOf(nav);
            gsap.to(nav, {
                rotateY: 20, x: 40, duration: 0.3, ease: 'power2.in',
                onComplete: () => nav.classList.remove('active')
            });
        } else {
            nav.classList.remove('active');
        }
    }

    function toggleNav() {
        isOpen ? closeNav() : openNav();
    }

    menuIcon.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    // Keep the button + overlay in sync if something else (script.js's
    // activePage()) removes nav's "active" class directly.
    const observer = new MutationObserver(() => {
        const navHasActive = nav.classList.contains('active');
        if (!navHasActive && isOpen) {
            isOpen = false;
            document.body.classList.remove('nav-open');
            menuIcon.classList.remove('active');
            menuIcon.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('active');
        }
    });
    observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
})();