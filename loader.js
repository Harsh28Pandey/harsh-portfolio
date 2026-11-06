const devPhrases = [
    "compiling_components.js",
    "optimizing_assets.css",
    "rendering_ui...",
    "fetching_awesomeness()",
    "connecting_database.sql",
    "securing_endpoints()",
    "deploying_magic.exe"
];

let devPhraseIndex = 0;
let devTypeTimeout;

function typeDevPhrase() {
    const el = document.getElementById('devLoaderTyped');
    if (!el) return;

    const phrase = devPhrases[devPhraseIndex % devPhrases.length];
    let charIndex = 0;
    el.textContent = "";

    function typeChar() {
        if (charIndex <= phrase.length) {
            el.textContent = phrase.slice(0, charIndex);
            charIndex++;
            devTypeTimeout = setTimeout(typeChar, 40);
        } else {
            devPhraseIndex++;
        }
    }
    typeChar();
}

function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.visibility = 'visible';
    loader.style.opacity = '1';

    clearTimeout(devTypeTimeout);
    typeDevPhrase();

    const fill = document.querySelector('.dev-loader-progress-fill');
    if (fill) {
        fill.style.animation = 'none';
        void fill.offsetWidth; 
        fill.style.animation = '';
    }

    if (window.loaderBadge) {
        window.loaderBadge.show();
        window.loaderBadge.setProgress(0);
        const counter = { value: 0 };
        if (typeof gsap !== 'undefined') {
            gsap.to(counter, {
                value: 100,
                duration: 1.05,
                ease: 'power2.out',
                onUpdate: () => window.loaderBadge.setProgress(counter.value)
            });
        } else {
            window.loaderBadge.setProgress(100);
        }
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.visibility = 'hidden';
        clearTimeout(devTypeTimeout);
        if (window.loaderBadge) window.loaderBadge.hide();
    }, 600);
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        showLoader();
        // setTimeout(hideLoader, 1200);
        setTimeout(hideLoader, 800);
    });
});
