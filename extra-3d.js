/* =====================================================================
   extra-3d.js  —  Page-wide Dev Code Rain + Contact Globe
   ---------------------------------------------------------------------
   1. DEV CODE RAIN (whole page, fixed behind everything)
        - Falling code characters (0 1 { } < > => ...) in your theme orange
        - Floating code tokens ( </>  { }  async  git  npm ... ) with
          mouse parallax
        - Characters near the mouse glow brighter
        - Nav / logo click = quick "warp" speed boost
        - Pauses when tab is hidden, respects prefers-reduced-motion
        - Plain 2D canvas, so it is light on CPU/GPU
   2. CONTACT GLOBE (Three.js) — draggable dotted globe with Kanpur pin
        - needs global THREE (already in your index.html)
   No HTML/CSS edits needed; CSS is injected from here.
   ===================================================================== */
(function () {
    'use strict';

    const HAS_THREE = typeof THREE !== 'undefined';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const cssMain =
        getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim() || '#ff8c00';
    const SOFT_HEX = '#ffd9a3';

    function hexToRgb(hex) {
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map((c) => c + c).join('');
        const n = parseInt(h, 16);
        if (isNaN(n)) return [255, 140, 0];
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    const MAIN_RGB = hexToRgb(cssMain);
    const SOFT_RGB = hexToRgb(SOFT_HEX);

    /* ------------------------------------------------------------------ */
    /* Inject CSS                                                          */
    /* ------------------------------------------------------------------ */
    const style = document.createElement('style');
    style.textContent = `
        #devrain-canvas {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: -1;
            pointer-events: none;
        }
        .globe3d-wrap {
            position: relative;
            width: 100%;
            max-width: 38rem;
            height: 26rem;
            margin: 2.5rem auto 0;
            cursor: grab;
            touch-action: pan-y;
            user-select: none;
            -webkit-user-select: none;
        }
        .globe3d-wrap.dragging { cursor: grabbing; }
        .globe3d-wrap canvas { width: 100%; height: 100%; display: block; }
        .globe3d-cap {
            text-align: center;
            font-size: 1.3rem;
            color: #aaa;
            margin-top: 0.4rem;
            letter-spacing: 0.05rem;
        }
        .globe3d-cap b { color: var(--main-color); font-weight: 600; }
    `;
    document.head.appendChild(style);

    /* ------------------------------------------------------------------ */
    /* 1. DEV CODE RAIN                                                    */
    /* ------------------------------------------------------------------ */
    function initCodeRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'devrain-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) { canvas.remove(); return; }

        const RAIN_CHARS = ['0', '1', '0', '1', '{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '&', '|', '+', '*', '#', '$', '%', '!', '?', '~'];
        const FLOAT_TOKENS = ['</>', '{ }', '=>', '();', 'async', 'await', 'const', 'git', 'npm', 'JSON', 'API', '404', 'null', '[ ]', '&&', 'fn()', 'MERN', 'DSA', 'C++', 'SQL'];

        const FONT_SIZE = isMobile ? 14 : 16;
        const COL_W = FONT_SIZE * 1.15;
        const ACTIVE_RATIO = isMobile ? 0.3 : 0.38;
        const BASE_ALPHA = 0.30;
        const FRAME_MS = 1000 / 30;

        let W = 0, H = 0, cols = 0, rows = 0;
        let columns = [];
        let floaters = [];

        const mouse = { x: -9999, y: -9999, px: 0, py: 0, tpx: 0, tpy: 0 };
        let boost = 1;

        function randChar() { return RAIN_CHARS[(Math.random() * RAIN_CHARS.length) | 0]; }

        function makeColumn(i, initial) {
            const trail = 10 + ((Math.random() * 14) | 0);
            const glyphs = [];
            for (let k = 0; k < 40; k++) glyphs.push(randChar());
            return {
                x: i * COL_W + COL_W / 2,
                y: initial ? Math.random() * rows : -Math.random() * rows * 0.8,
                speed: 0.12 + Math.random() * 0.28,
                trail,
                glyphs,
                active: Math.random() < ACTIVE_RATIO
            };
        }

        function makeFloaters() {
            const n = isMobile ? 7 : 16;
            floaters = [];
            for (let i = 0; i < n; i++) {
                const depth = 0.3 + Math.random() * 0.9;
                floaters.push({
                    text: FLOAT_TOKENS[(Math.random() * FLOAT_TOKENS.length) | 0],
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: -0.08 - Math.random() * 0.18,
                    size: 14 + depth * 16,
                    depth,
                    alpha: 0.10 + depth * 0.12,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.floor(W * DPR);
            canvas.height = Math.floor(H * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            cols = Math.ceil(W / COL_W);
            rows = Math.ceil(H / FONT_SIZE) + 2;
            columns = [];
            for (let i = 0; i < cols; i++) columns.push(makeColumn(i, true));
            makeFloaters();
            if (reduceMotion) draw(0, true);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.tpx = (e.clientX / W - 0.5) * 2;
            mouse.tpy = (e.clientY / H - 0.5) * 2;
        }, { passive: true });
        window.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

        // Quick warp when navigating
        document.addEventListener('click', (e) => {
            if (e.target.closest && e.target.closest('header nav a, .logo')) boost = 6;
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        function rgba(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a.toFixed(3) + ')'; }

        function draw(frames, staticFrame) {
            ctx.clearRect(0, 0, W, H);

            // ---- Floating code tokens (behind the rain) ----
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            for (let i = 0; i < floaters.length; i++) {
                const f = floaters[i];
                if (!staticFrame) {
                    f.x += f.vx * frames * boost * 0.6;
                    f.y += f.vy * frames * boost * 0.6;
                    f.phase += 0.01 * frames;
                    if (f.y < -40) { f.y = H + 30; f.x = Math.random() * W; }
                    if (f.x < -120) f.x = W + 60;
                    if (f.x > W + 120) f.x = -60;
                }
                const ox = mouse.px * f.depth * 28;
                const oy = mouse.py * f.depth * 20 + Math.sin(f.phase) * 6;
                ctx.font = '600 ' + f.size.toFixed(0) + 'px Consolas, "Courier New", monospace';
                ctx.fillStyle = rgba(MAIN_RGB, f.alpha);
                ctx.fillText(f.text, f.x + ox, f.y + oy);
            }

            // ---- Falling code rain ----
            ctx.font = FONT_SIZE + 'px Consolas, "Courier New", monospace';
            ctx.textAlign = 'center';
            for (let c = 0; c < columns.length; c++) {
                const col = columns[c];
                if (!col.active) continue;

                if (!staticFrame) {
                    col.y += col.speed * frames * boost;
                    if (Math.random() < 0.02 * frames) col.glyphs[(Math.random() * 40) | 0] = randChar();
                    if (col.y - col.trail > rows) {
                        col.y = -Math.random() * rows * 0.5;
                        col.speed = 0.12 + Math.random() * 0.28;
                        col.trail = 10 + ((Math.random() * 14) | 0);
                        col.active = Math.random() < ACTIVE_RATIO * 2.2;
                    }
                }

                const headRow = Math.floor(col.y);
                for (let i = 0; i < col.trail; i++) {
                    const row = headRow - i;
                    if (row < 0 || row > rows) continue;
                    const py = row * FONT_SIZE;

                    let a = (1 - i / col.trail) * BASE_ALPHA;

                    // mouse glow
                    const dx = col.x - mouse.x;
                    const dy = py - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 22500) { // 150px radius
                        a += (1 - Math.sqrt(d2) / 150) * 0.55;
                    }
                    if (a > 0.9) a = 0.9;

                    ctx.fillStyle = i === 0 ? rgba(SOFT_RGB, Math.min(0.85, a + 0.25)) : rgba(MAIN_RGB, a);
                    ctx.fillText(col.glyphs[((row % 40) + 40) % 40], col.x, py);
                }
            }
        }

        resize();
        if (reduceMotion) return; // static frame already drawn

        let lastDraw = 0;
        function frame(t) {
            requestAnimationFrame(frame);
            if (document.hidden) return;
            if (t - lastDraw < FRAME_MS) return;
            const frames = Math.min((t - lastDraw) / 16.667, 3);
            lastDraw = t;

            mouse.px += (mouse.tpx - mouse.px) * 0.06;
            mouse.py += (mouse.tpy - mouse.py) * 0.06;
            boost += (1 - boost) * 0.05;

            draw(frames, false);
        }
        requestAnimationFrame(frame);
    }

    /* ------------------------------------------------------------------ */
    /* Helpers (globe)                                                     */
    /* ------------------------------------------------------------------ */
    function makeRenderer(canvas) {
        try {
            const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
            r.setPixelRatio(DPR);
            r.setClearColor(0x000000, 0);
            return r;
        } catch (e) {
            console.warn('[extra-3d] WebGL unavailable:', e);
            return null;
        }
    }

    function watchSize(canvas, renderer, camera) {
        function resize() {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
        else window.addEventListener('resize', resize);
    }

    const isActive = (sel) => {
        const el = document.querySelector(sel);
        return !!(el && el.classList.contains('active'));
    };

    /* ------------------------------------------------------------------ */
    /* 2. CONTACT: Dotted globe with Kanpur pin                            */
    /* ------------------------------------------------------------------ */
    function latLonToVec3(lat, lon, R) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return new THREE.Vector3(
            -R * Math.sin(phi) * Math.cos(theta),
            R * Math.cos(phi),
            R * Math.sin(phi) * Math.sin(theta)
        );
    }

    function initGlobe() {
        const box = document.querySelector('.connect-container .connect-box');
        if (!box) return null;

        const MAIN = new THREE.Color(cssMain);

        const wrap = document.createElement('div');
        wrap.className = 'globe3d-wrap';
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-label', 'Rotating globe with a pin on Kanpur, India');
        wrap.appendChild(canvas);
        box.appendChild(wrap);

        const cap = document.createElement('p');
        cap.className = 'globe3d-cap';
        cap.innerHTML = '<b>Kanpur, Uttar Pradesh</b> &middot; drag to rotate';
        box.appendChild(cap);

        const renderer = makeRenderer(canvas);
        if (!renderer) { wrap.remove(); cap.remove(); return null; }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
        camera.position.z = 4.2;
        watchSize(canvas, renderer, camera);

        const R = 1.3;
        const KANPUR = { lat: 26.4499, lon: 80.3319 };

        const tilt = new THREE.Group();
        tilt.rotation.x = KANPUR.lat * Math.PI / 180;
        scene.add(tilt);

        const globe = new THREE.Group();
        tilt.add(globe);

        // Occluder so back-side dots are hidden
        const occluder = new THREE.Mesh(
            new THREE.SphereGeometry(R * 0.985, 32, 24),
            new THREE.MeshBasicMaterial({ colorWrite: false })
        );
        occluder.renderOrder = -1;
        globe.add(occluder);

        // Faint wire sphere
        globe.add(new THREE.Mesh(
            new THREE.SphereGeometry(R, isMobile ? 18 : 28, isMobile ? 12 : 18),
            new THREE.MeshBasicMaterial({ color: MAIN, wireframe: true, transparent: true, opacity: 0.12 })
        ));

        // Dots (Fibonacci sphere)
        const N = isMobile ? 700 : 1500;
        const pos = new Float32Array(N * 3);
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2;
            const rr = Math.sqrt(1 - y * y);
            const th = golden * i;
            pos[i * 3] = Math.cos(th) * rr * R;
            pos[i * 3 + 1] = y * R;
            pos[i * 3 + 2] = Math.sin(th) * rr * R;
        }
        const dotGeo = new THREE.BufferGeometry();
        dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        globe.add(new THREE.Points(
            dotGeo,
            new THREE.PointsMaterial({ color: MAIN, size: 0.028, transparent: true, opacity: 0.75, depthWrite: false })
        ));

        // Kanpur pin + pulse ring
        const v = latLonToVec3(KANPUR.lat, KANPUR.lon, R);
        const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        pin.position.copy(v);
        globe.add(pin);

        const pulse = new THREE.Mesh(
            new THREE.RingGeometry(0.07, 0.09, 32),
            new THREE.MeshBasicMaterial({ color: MAIN, transparent: true, side: THREE.DoubleSide, depthWrite: false })
        );
        pulse.position.copy(v);
        pulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
        globe.add(pulse);

        // Start with Kanpur facing the camera
        globe.rotation.y = -Math.atan2(v.x, v.z);

        // Drag to rotate
        let dragging = false, lx = 0, ly = 0, resumeAt = 0;
        wrap.addEventListener('pointerdown', (e) => {
            dragging = true; lx = e.clientX; ly = e.clientY;
            wrap.classList.add('dragging');
            try { wrap.setPointerCapture(e.pointerId); } catch (_) { }
        });
        wrap.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            globe.rotation.y += (e.clientX - lx) * 0.008;
            tilt.rotation.x = Math.max(-0.6, Math.min(1.2, tilt.rotation.x + (e.clientY - ly) * 0.005));
            lx = e.clientX; ly = e.clientY;
        });
        const endDrag = () => {
            dragging = false;
            wrap.classList.remove('dragging');
            resumeAt = performance.now() + 1500;
        };
        wrap.addEventListener('pointerup', endDrag);
        wrap.addEventListener('pointercancel', endDrag);
        wrap.addEventListener('pointerleave', () => { if (dragging) endDrag(); });

        let last = 0;
        return {
            update(t) {
                if (!isActive('section.connect')) return;
                const dt = Math.min(t - last, 0.05);
                last = t;

                if (!reduceMotion && !dragging && performance.now() > resumeAt) {
                    globe.rotation.y += dt * 0.25;
                }

                const p = (t % 1.8) / 1.8;
                pulse.scale.setScalar(1 + p * 2.2);
                pulse.material.opacity = (1 - p) * 0.9;

                renderer.render(scene, camera);
            }
        };
    }

    /* ------------------------------------------------------------------ */
    /* Boot                                                                */
    /* ------------------------------------------------------------------ */
    function boot() {
        initCodeRain();

        if (!HAS_THREE) {
            console.warn('[extra-3d] THREE not loaded, globe skipped.');
            return;
        }
        const globe = initGlobe();
        if (!globe) return;

        const clock = new THREE.Clock();
        (function frame() {
            requestAnimationFrame(frame);
            if (document.hidden) return;
            globe.update(clock.getElapsedTime());
        })();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();