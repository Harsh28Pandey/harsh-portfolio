/* =====================================================
   THREE.JS 3D BACKGROUND — INTERACTIVE EDITION
   - Floating particle field + wireframe shapes
   - Colors auto-match the site's --main-color CSS variable
   - Mouse/touch parallax, click burst, scroll zoom, hover glow
   - Pauses when tab is hidden (battery friendly)
   - Lower particle count automatically on small screens
===================================================== */

(function () {
    if (typeof THREE === "undefined") return; // three.js failed to load, fail silently

    const canvas = document.getElementById("three-bg-canvas");
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- read theme colors straight from CSS so it always matches ----
    const rootStyles = getComputedStyle(document.documentElement);
    const mainColorHex = rootStyles.getPropertyValue("--main-color").trim() || "#ff8c00";
    const mainColor = new THREE.Color(mainColorHex);
    const accentColor = mainColor.clone().offsetHSL(0.5, 0, 0.05); // complementary glow accent

    // ---- scene setup ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 55;
    const baseCameraZ = 55;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ---- particle field ----
    const particleCount = isMobile ? 350 : 900;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3); // original resting spot, for burst recovery
    const velocities = new Float32Array(particleCount * 3);    // per-particle burst velocity
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 140;
        const y = (Math.random() - 0.5) * 140;
        const z = (Math.random() - 0.5) * 140;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        basePositions[i * 3] = x;
        basePositions[i * 3 + 1] = y;
        basePositions[i * 3 + 2] = z;
        scales[i] = Math.random();
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: mainColor,
        size: 0.55,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ---- floating wireframe shapes for extra "3D advanced" feel ----
    const shapes = [];
    const shapeCount = isMobile ? 3 : 6;
    const geometries = [
        new THREE.IcosahedronGeometry(4, 0),
        new THREE.OctahedronGeometry(3.5, 0),
        new THREE.TorusGeometry(3, 0.9, 8, 24),
    ];

    for (let i = 0; i < shapeCount; i++) {
        const geo = geometries[i % geometries.length];
        const mat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? mainColor : accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 90,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60 - 20
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData.rotSpeed = {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
        };
        mesh.userData.floatOffset = Math.random() * Math.PI * 2;
        mesh.userData.baseScale = 1;
        mesh.userData.targetScale = 1; // eased toward on hover
        mesh.userData.baseOpacity = mat.opacity;
        scene.add(mesh);
        shapes.push(mesh);
    }

    // ---- pointer state (unifies mouse + touch) ----
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let hoveredShape = null;

    function setPointer(clientX, clientY) {
        pointerX = (clientX / window.innerWidth - 0.5) * 2;
        pointerY = (clientY / window.innerHeight - 0.5) * 2;
        pointerNDC.set(pointerX, -pointerY);
    }

    window.addEventListener("mousemove", (e) => setPointer(e.clientX, e.clientY), { passive: true });

    window.addEventListener(
        "touchmove",
        (e) => {
            if (e.touches.length) setPointer(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: true }
    );

    // ---- click / tap burst: nearby particles get a little outward kick ----
    function triggerBurst(clientX, clientY) {
        if (reduceMotion) return;

        // Unproject a rough world-space point at the particle field's depth
        const ndcX = (clientX / window.innerWidth) * 2 - 1;
        const ndcY = -(clientY / window.innerHeight) * 2 + 1;
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = (0 - camera.position.z) / dir.z;
        const burstPoint = camera.position.clone().add(dir.multiplyScalar(distance));

        const burstRadius = 28;
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const dx = positions[idx] - burstPoint.x;
            const dy = positions[idx + 1] - burstPoint.y;
            const dz = positions[idx + 2] - burstPoint.z;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < burstRadius * burstRadius) {
                const dist = Math.sqrt(distSq) || 0.001;
                const force = (1 - dist / burstRadius) * 1.8;
                velocities[idx] += (dx / dist) * force;
                velocities[idx + 1] += (dy / dist) * force;
                velocities[idx + 2] += (dz / dist) * force;
            }
        }
    }

    window.addEventListener("click", (e) => triggerBurst(e.clientX, e.clientY));
    window.addEventListener(
        "touchstart",
        (e) => {
            if (e.touches.length) {
                setPointer(e.touches[0].clientX, e.touches[0].clientY);
                triggerBurst(e.touches[0].clientX, e.touches[0].clientY);
            }
        },
        { passive: true }
    );

    // ---- scroll: subtle camera dolly for depth feel ----
    let scrollOffset = 0;
    window.addEventListener(
        "scroll",
        () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollOffset = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        },
        { passive: true }
    );

    // ---- resize handling (debounced) ----
    let resizeTimeout = null;
    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 150);
        },
        { passive: true }
    );

    // ---- pause when tab hidden ----
    let isVisible = true;
    document.addEventListener("visibilitychange", () => {
        isVisible = document.visibilityState === "visible";
    });

    // ---- animation loop (capped ~45fps) ----
    const clock = new THREE.Clock();
    // const frameInterval = 1 / 45;
    const frameInterval = isMobile ? 1 / 30 : 1 / 45;
    let accumulator = 0;
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const delta = clock.getDelta();
        accumulator += delta;
        if (accumulator < frameInterval) return;
        const dt = accumulator;
        accumulator = 0;

        const elapsed = clock.getElapsedTime();

        targetX += (pointerX - targetX) * 0.03;
        targetY += (pointerY - targetY) * 0.03;

        if (!reduceMotion) {
            particles.rotation.y = elapsed * 0.02 + targetX * 0.15;
            particles.rotation.x = targetY * 0.1;

            // integrate burst velocities, ease particles back to resting position
            const posAttr = particlesGeometry.attributes.position;
            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                if (
                    Math.abs(velocities[idx]) > 0.0001 ||
                    Math.abs(velocities[idx + 1]) > 0.0001 ||
                    Math.abs(velocities[idx + 2]) > 0.0001
                ) {
                    positions[idx] += velocities[idx] * dt * 30;
                    positions[idx + 1] += velocities[idx + 1] * dt * 30;
                    positions[idx + 2] += velocities[idx + 2] * dt * 30;

                    // drag
                    velocities[idx] *= 0.9;
                    velocities[idx + 1] *= 0.9;
                    velocities[idx + 2] *= 0.9;

                    // gentle spring back toward resting spot
                    positions[idx] += (basePositions[idx] - positions[idx]) * 0.01;
                    positions[idx + 1] += (basePositions[idx + 1] - positions[idx + 1]) * 0.01;
                    positions[idx + 2] += (basePositions[idx + 2] - positions[idx + 2]) * 0.01;
                }
            }
            posAttr.needsUpdate = true;

            // shape float + hover highlight (raycast every few frames, it's cheap enough but no need every tick)
            frameCount++;
            if (frameCount % 4 === 0) {
                raycaster.setFromCamera(pointerNDC, camera);
                const hits = raycaster.intersectObjects(shapes);
                hoveredShape = hits.length ? hits[0].object : null;
            }

            shapes.forEach((mesh) => {
                mesh.rotation.x += mesh.userData.rotSpeed.x;
                mesh.rotation.y += mesh.userData.rotSpeed.y;
                mesh.position.y += Math.sin(elapsed * 0.5 + mesh.userData.floatOffset) * 0.01;

                const isHovered = mesh === hoveredShape;
                mesh.userData.targetScale = isHovered ? 1.35 : 1;
                const s = mesh.scale.x + (mesh.userData.targetScale - mesh.scale.x) * 0.08;
                mesh.scale.set(s, s, s);
                mesh.material.opacity +=
                    ((isHovered ? mesh.userData.baseOpacity * 2.2 : mesh.userData.baseOpacity) -
                        mesh.material.opacity) *
                    0.08;
            });

            // parallax + scroll dolly combined
            camera.position.x += (targetX * 4 - camera.position.x) * 0.02;
            camera.position.y += (-targetY * 4 - camera.position.y) * 0.02;
            const targetZ = baseCameraZ - scrollOffset * 15;
            camera.position.z += (targetZ - camera.position.z) * 0.04;
            camera.lookAt(scene.position);
        }

        renderer.render(scene, camera);
    }

    animate();
})();