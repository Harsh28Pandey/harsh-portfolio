/* =====================================================
   LOADER 3D BADGE
   A tiny, cheap Three.js scene (own renderer, ~150x150px)
   that spins a wireframe icosahedron with a glowing core
   inside the loader card. Exposes window.loaderBadge with
   show()/hide()/setProgress(0-100) so loader.js can drive it.
   Only renders frames while the loader is actually visible —
   zero cost the rest of the time.
===================================================== */

(function () {
    if (typeof THREE === "undefined") {
        window.loaderBadge = { show() { }, hide() { }, setProgress() { } };
        return;
    }

    const canvas = document.getElementById("loader-3d-canvas");
    const percentEl = document.getElementById("loaderPercent");
    if (!canvas) {
        window.loaderBadge = { show() { }, hide() { }, setProgress() { } };
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const mainColorHex = rootStyles.getPropertyValue("--main-color").trim() || "#ff8c00";
    const mainColor = new THREE.Color(mainColorHex);

    const size = 150;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size, false);

    const outerGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const outerMat = new THREE.MeshBasicMaterial({ color: mainColor, wireframe: true, transparent: true, opacity: 0.9 });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outer);

    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    let rafId = null;
    let visible = false;
    let progress = 0; // 0-100, animated externally via GSAP

    function render() {
        outer.rotation.x += 0.014;
        outer.rotation.y += 0.02;
        core.rotation.x -= 0.01;
        core.rotation.y += 0.016;

        // Progress subtly changes the badge's spin speed & scale, so it
        // "feels" tied to loading rather than just decorative.
        const s = 1 + (progress / 100) * 0.15;
        core.scale.setScalar(s);

        renderer.render(scene, camera);
        if (visible) rafId = requestAnimationFrame(render);
    }

    function show() {
        if (visible) return;
        visible = true;
        rafId = requestAnimationFrame(render);
    }

    function hide() {
        visible = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    function setProgress(p) {
        progress = Math.max(0, Math.min(100, p));
        if (percentEl) percentEl.textContent = String(Math.round(progress)).padStart(2, "0");
    }

    window.loaderBadge = { show, hide, setProgress };
})();