/* =====================================================================
   extra-3d.js (optimized) — Dev Code Rain + Contact Globe
   ---------------------------------------------------------------------
   What changed vs the original:
   RAIN
     - Glyphs are pre-rendered once into a sprite atlas and drawn with
       drawImage (no per-glyph fillText / fillStyle string building)
     - Starts only after the page has loaded + browser is idle (no LCP/TBT cost)
     - Skipped on data-saver / very low-end devices; static frame on reduced-motion
     - Canvas resolution capped, loop fully stops while the tab is hidden
   GLOBE
     - Three.js (~600 KB) is NOT in the initial load any more: it is fetched
       only when the Connect section is opened
     - Render loop runs only while Connect is active + on screen + tab visible
     - Fewer dots / segments, lower pixel ratio
   ===================================================================== */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const saveData = !!(navigator.connection && navigator.connection.saveData);
    const lowEnd = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 2;
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const RAIN_DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

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
    /* Injected CSS                                                        */
    /* ------------------------------------------------------------------ */
    const style = document.createElement('style');
    style.textContent = `
        #devrain-canvas{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none}
        .globe3d-wrap{position:relative;width:100%;max-width:38rem;height:26rem;margin:2.5rem auto 0;cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;contain:layout paint}
        .globe3d-wrap.dragging{cursor:grabbing}
        .globe3d-wrap canvas{width:100%;height:100%;display:block}
        .globe3d-cap{text-align:center;font-size:1.3rem;color:#aaa;margin-top:.4rem;letter-spacing:.05rem}
        .globe3d-cap b{color:var(--main-color);font-weight:600}
    `;
    document.head.appendChild(style);

    /* ------------------------------------------------------------------ */
    /* 1. DEV CODE RAIN (sprite atlas)                                     */
    /* ------------------------------------------------------------------ */
    function initCodeRain() {
        if (saveData || lowEnd) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'devrain-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) { canvas.remove(); return; }

        const RAIN_CHARS = ['0', '1', '{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '&', '|', '+', '*', '#', '$', '%', '!', '?', '~'];
        const FLOAT_TOKENS = ['</>', '{ }', '=>', '();', 'async', 'await', 'const', 'git', 'npm', 'JSON', 'API', '404', 'null', '[ ]', '&&', 'fn()', 'MERN', 'DSA', 'C++', 'SQL'];
        const FONT_FAMILY = 'Consolas, "Courier New", monospace';

        const FONT_SIZE = isMobile ? 14 : 16;
        const COL_W = FONT_SIZE * 1.15;
        const ACTIVE_RATIO = isMobile ? 0.28 : 0.36;
        const BASE_ALPHA = 0.30;
        const MAX_ALPHA = 0.9;
        const FRAME_MS = 1000 / 30;
        const LEVELS = 12;
        const GLYPHS = 40;

        /* ---- Sprite atlas: rows 0..LEVELS-1 = main colour, LEVELS..2*LEVELS-1 = soft (head) ---- */
        const cellW = Math.ceil(COL_W * RAIN_DPR);
        const cellH = Math.ceil(FONT_SIZE * 1.3 * RAIN_DPR);
        const baseline = Math.round(cellH * 0.8);
        const atlas = document.createElement('canvas');
        atlas.width = cellW * RAIN_CHARS.length;
        atlas.height = cellH * LEVELS * 2;
        (function buildAtlas() {
            const a = atlas.getContext('2d');
            a.font = Math.round(FONT_SIZE * RAIN_DPR) + 'px ' + FONT_FAMILY;
            a.textAlign = 'center';
            a.textBaseline = 'alphabetic';
            for (let row = 0; row < LEVELS * 2; row++) {
                const soft = row >= LEVELS;
                const lvl = (row % LEVELS) + 1;
                const alpha = (lvl / LEVELS) * MAX_ALPHA;
                a.fillStyle = 'rgba(' + (soft ? SOFT_RGB : MAIN_RGB).join(',') + ',' + alpha.toFixed(3) + ')';
                for (let c = 0; c < RAIN_CHARS.length; c++) {
                    a.fillText(RAIN_CHARS[c], c * cellW + cellW / 2, row * cellH + baseline);
                }
            }
        })();
        const dW = cellW / RAIN_DPR;
        const dH = cellH / RAIN_DPR;
        const dBase = baseline / RAIN_DPR;

        let W = 0, H = 0, cols = 0, rows = 0;
        let columns = [];
        let floaters = [];

        const mouse = { x: -9999, y: -9999, px: 0, py: 0, tpx: 0, tpy: 0 };
        let boost = 1;

        const randGlyph = () => (Math.random() * RAIN_CHARS.length) | 0;
        const rgba = (rgb, a) => 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a.toFixed(3) + ')';

        function makeColumn(i, initial) {
            const glyphs = new Uint8Array(GLYPHS);
            for (let k = 0; k < GLYPHS; k++) glyphs[k] = randGlyph();
            return {
                x: i * COL_W + COL_W / 2,
                y: initial ? Math.random() * rows : -Math.random() * rows * 0.8,
                speed: 0.12 + Math.random() * 0.28,
                trail: 10 + ((Math.random() * 14) | 0),
                glyphs,
                active: Math.random() < ACTIVE_RATIO
            };
        }

        function makeFloaters() {
            const n = isMobile ? 6 : 14;
            floaters = [];
            for (let i = 0; i < n; i++) {
                const depth = 0.3 + Math.random() * 0.9;
                const size = Math.round(14 + depth * 16);
                floaters.push({
                    text: FLOAT_TOKENS[(Math.random() * FLOAT_TOKENS.length) | 0],
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: -0.08 - Math.random() * 0.18,
                    font: '600 ' + size + 'px ' + FONT_FAMILY,
                    depth,
                    fill: rgba(MAIN_RGB, 0.10 + depth * 0.12),
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.floor(W * RAIN_DPR);
            canvas.height = Math.floor(H * RAIN_DPR);
            ctx.setTransform(RAIN_DPR, 0, 0, RAIN_DPR, 0, 0);
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
        document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

        // Quick warp when navigating
        document.addEventListener('click', (e) => {
            if (e.target.closest && e.target.closest('header nav a, .logo')) boost = 6;
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        });

        function draw(frames, staticFrame) {
            ctx.clearRect(0, 0, W, H);

            // ---- floating tokens ----
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
                ctx.font = f.font;
                ctx.fillStyle = f.fill;
                ctx.fillText(f.text, f.x + mouse.px * f.depth * 28, f.y + mouse.py * f.depth * 20 + Math.sin(f.phase) * 6);
            }

            // ---- code rain via sprite atlas ----
            const mx = mouse.x, my = mouse.y;
            for (let c = 0; c < columns.length; c++) {
                const col = columns[c];
                if (!col.active) continue;

                if (!staticFrame) {
                    col.y += col.speed * frames * boost;
                    if (Math.random() < 0.02 * frames) col.glyphs[(Math.random() * GLYPHS) | 0] = randGlyph();
                    if (col.y - col.trail > rows) {
                        col.y = -Math.random() * rows * 0.5;
                        col.speed = 0.12 + Math.random() * 0.28;
                        col.trail = 10 + ((Math.random() * 14) | 0);
                        col.active = Math.random() < ACTIVE_RATIO * 2.2;
                    }
                }

                const headRow = Math.floor(col.y);
                const dx = col.x - mx;
                const nearX = dx > -150 && dx < 150;

                for (let i = 0; i < col.trail; i++) {
                    const row = headRow - i;
                    if (row < 0 || row > rows) continue;
                    const py = row * FONT_SIZE;

                    let a = (1 - i / col.trail) * BASE_ALPHA;
                    if (nearX) {
                        const dy = py - my;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < 22500) a += (1 - Math.sqrt(d2) / 150) * 0.55;
                    }
                    if (i === 0) a += 0.25;
                    if (a > MAX_ALPHA) a = MAX_ALPHA;

                    let lvl = Math.ceil((a / MAX_ALPHA) * LEVELS) - 1;
                    if (lvl < 0) lvl = 0; else if (lvl >= LEVELS) lvl = LEVELS - 1;
                    const srow = i === 0 ? lvl + LEVELS : lvl;
                    const g = col.glyphs[((row % GLYPHS) + GLYPHS) % GLYPHS];

                    ctx.drawImage(atlas, g * cellW, srow * cellH, cellW, cellH, col.x - dW / 2, py - dBase, dW, dH);
                }
            }
        }

        resize();
        if (reduceMotion) return; // static frame already drawn

        let lastDraw = 0;
        let rafId = 0;
        function frame(t) {
            rafId = requestAnimationFrame(frame);
            if (t - lastDraw < FRAME_MS) return;
            const frames = Math.min((t - lastDraw) / 16.667, 3);
            lastDraw = t;

            mouse.px += (mouse.tpx - mouse.px) * 0.06;
            mouse.py += (mouse.tpy - mouse.py) * 0.06;
            boost += (1 - boost) * 0.05;

            draw(frames, false);
        }

        // Fully stop (not just skip) while the tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { cancelAnimationFrame(rafId); rafId = 0; }
            else if (!rafId) { lastDraw = performance.now(); rafId = requestAnimationFrame(frame); }
        });

        rafId = requestAnimationFrame(frame);
    }

    /* ------------------------------------------------------------------ */
    /* 2. CONTACT GLOBE (Three.js, lazy)                                   */
    /* ------------------------------------------------------------------ */
    let threePromise = null;
    function loadThree() {
        if (typeof THREE !== 'undefined') return Promise.resolve();
        if (threePromise) return threePromise;
        threePromise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = THREE_URL;
            s.async = true;
            s.onload = resolve;
            s.onerror = () => { threePromise = null; reject(new Error('three.js failed to load')); };
            document.head.appendChild(s);
        });
        return threePromise;
    }

    function latLonToVec3(lat, lon, R) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return new THREE.Vector3(
            -R * Math.sin(phi) * Math.cos(theta),
            R * Math.cos(phi),
            R * Math.sin(phi) * Math.sin(theta)
        );
    }

    function buildGlobe() {
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

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: 'low-power' });
            renderer.setPixelRatio(Math.min(DPR, 1.5));
            renderer.setClearColor(0x000000, 0);
        } catch (e) {
            console.warn('[extra-3d] WebGL unavailable:', e);
            wrap.remove(); cap.remove();
            return null;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
        camera.position.z = 4.2;

        function resize() {
            const w = canvas.clientWidth, h = canvas.clientHeight;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
        else window.addEventListener('resize', resize);

        const R = 1.3;
        const KANPUR = { lat: 26.4499, lon: 80.3319 };

        const tilt = new THREE.Group();
        tilt.rotation.x = KANPUR.lat * Math.PI / 180;
        scene.add(tilt);

        const globe = new THREE.Group();
        tilt.add(globe);

        const occluder = new THREE.Mesh(
            new THREE.SphereGeometry(R * 0.985, 24, 16),
            new THREE.MeshBasicMaterial({ colorWrite: false })
        );
        occluder.renderOrder = -1;
        globe.add(occluder);

        globe.add(new THREE.Mesh(
            new THREE.SphereGeometry(R, isMobile ? 14 : 22, isMobile ? 10 : 14),
            new THREE.MeshBasicMaterial({ color: MAIN, wireframe: true, transparent: true, opacity: 0.12 })
        ));

        const N = isMobile ? 500 : 1000;
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
            new THREE.PointsMaterial({ color: MAIN, size: 0.03, transparent: true, opacity: 0.75, depthWrite: false })
        ));

        const v = latLonToVec3(KANPUR.lat, KANPUR.lon, R);
        const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        pin.position.copy(v);
        globe.add(pin);

        const pulse = new THREE.Mesh(
            new THREE.RingGeometry(0.07, 0.09, 24),
            new THREE.MeshBasicMaterial({ color: MAIN, transparent: true, side: THREE.DoubleSide, depthWrite: false })
        );
        pulse.position.copy(v);
        pulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
        globe.add(pulse);

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

        const clock = new THREE.Clock();
        let last = 0;

        return {
            wrap,
            render() {
                const t = clock.getElapsedTime();
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

    function initGlobeLazy() {
        const section = document.querySelector('section.connect');
        if (!section) return;

        let globe = null;
        let building = false;
        let rafId = 0;
        let onScreen = true;

        const shouldRun = () => section.classList.contains('active') && onScreen && !document.hidden && globe;

        function loop() {
            if (!shouldRun()) { rafId = 0; return; }
            rafId = requestAnimationFrame(loop);
            globe.render();
        }
        function kick() {
            if (!rafId && shouldRun()) rafId = requestAnimationFrame(loop);
        }

        function onActive() {
            if (!section.classList.contains('active')) return;
            if (globe) { kick(); return; }
            if (building) return;
            building = true;
            loadThree().then(() => {
                globe = buildGlobe();
                building = false;
                if (globe && 'IntersectionObserver' in window) {
                    new IntersectionObserver((entries) => {
                        onScreen = entries[0].isIntersecting;
                        if (onScreen) kick();
                    }).observe(globe.wrap);
                }
                kick();
            }).catch((e) => { building = false; console.warn('[extra-3d]', e); });
        }

        new MutationObserver(onActive).observe(section, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('visibilitychange', kick);
        onActive();
    }

    /* ------------------------------------------------------------------ */
    /* Boot — nothing here competes with first paint                        */
    /* ------------------------------------------------------------------ */
    function boot() {
        initGlobeLazy(); // only sets up an observer; Three.js loads on demand
        const startRain = () => initCodeRain();
        if ('requestIdleCallback' in window) requestIdleCallback(startRain, { timeout: 4000 });
        else setTimeout(startRain, 2000);
    }

    function afterLoad() {
        if (document.readyState === 'complete') boot();
        else window.addEventListener('load', boot, { once: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterLoad);
    else afterLoad();
})();