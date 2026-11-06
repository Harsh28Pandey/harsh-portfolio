(function () {
    'use strict';

    var STORAGE_KEY = 'portfolio-view-mode';
    var body = document.body;
    var navLinks = document.querySelectorAll('header nav a');
    var sections = document.querySelectorAll('section');
    var navbar = document.querySelector('header nav');
    var menuIcon = document.querySelector('#menu-icon');
    var navOverlay = document.getElementById('navOverlay');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!navLinks.length || !sections.length) return;

    function isSingle() {
        return body.classList.contains('single-page');
    }

    /* ---------- storage helpers (try/catch for private mode) ---------- */
    function readSavedMode() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function saveMode(mode) {
        try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* ignore */ }
    }

    /* ---------- sliding switch ---------- */
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'view-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('role', 'switch');
    toggleBtn.innerHTML =
        "<span class='vt-thumb'></span>" +
        "<span class='vt-fx' aria-hidden='true'><span class='vt-glow'></span></span>" +
        "<span class='vt-pulse' aria-hidden='true'></span>" +
        "<span class='vt-opt vt-multi'><i class='bx bx-columns'></i><span class='vt-label'>Multi</span></span>" +
        "<span class='vt-opt vt-single'><i class='bx bx-layout'></i><span class='vt-label'>Single</span></span>";
    document.body.appendChild(toggleBtn);

    // circular reveal curtain
    var curtain = document.createElement('div');
    curtain.id = 'view-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(curtain);

    // mini terminal loader card
    var loader = document.createElement('div');
    loader.id = 'view-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
        "<div class='vl-bar'><span class='vl-dot r'></span><span class='vl-dot y'></span><span class='vl-dot g'></span></div>" +
        "<div class='vl-body'>" +
        "<p class='vl-line'><span class='vl-prompt'>$</span><span class='vl-text'></span><span class='vl-cursor'></span></p>" +
        "<div class='vl-track'><div class='vl-fill'></div></div>" +
        "</div>";
    document.body.appendChild(loader);
    var loaderText = loader.querySelector('.vl-text');

    function setToggleState(single) {
        toggleBtn.setAttribute('data-mode', single ? 'single' : 'multi');
        toggleBtn.setAttribute('aria-checked', single ? 'true' : 'false');
        var label = single ? 'Single page view on. Switch to multi page view'
            : 'Multi page view on. Switch to single page scroll view';
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.setAttribute('data-tip', single ? 'Switch to Multi Page' : 'Switch to Single Page');
        toggleBtn.removeAttribute('title');
    }

    function updateToggleUI() {
        setToggleState(isSingle());
    }

    /* ---------- button effects: mouse spotlight + click ripple ---------- */
    var fx = toggleBtn.querySelector('.vt-fx');

    toggleBtn.addEventListener('pointermove', function (e) {
        var r = toggleBtn.getBoundingClientRect();
        toggleBtn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        toggleBtn.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });

    toggleBtn.addEventListener('pointerdown', function (e) {
        if (reduceMotion || !fx) return;
        var r = toggleBtn.getBoundingClientRect();
        var size = Math.max(r.width, r.height) * 1.6;
        var rip = document.createElement('span');
        rip.className = 'vt-ripple';
        rip.style.width = rip.style.height = size + 'px';
        rip.style.left = (e.clientX - r.left - size / 2) + 'px';
        rip.style.top = (e.clientY - r.top - size / 2) + 'px';
        fx.appendChild(rip);
        setTimeout(function () { if (rip.parentNode) rip.parentNode.removeChild(rip); }, 700);
    });

    function typeText(el, text, speed) {
        el.textContent = '';
        var i = 0;
        var timer = setInterval(function () {
            i++;
            el.textContent = text.slice(0, i);
            if (i >= text.length) clearInterval(timer);
        }, speed);
    }

    /* ---------- helpers ---------- */
    function activeNavIndex() {
        for (var i = 0; i < navLinks.length; i++) {
            if (navLinks[i].classList.contains('active')) return i;
        }
        return 0;
    }

    function setActiveNav(idx) {
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.toggle('active', i === idx);
        }
    }

    function sectionTop(idx) {
        return sections[idx].getBoundingClientRect().top + window.pageYOffset;
    }

    function scrollToSection(idx, smooth) {
        if (!sections[idx]) return;
        window.scrollTo({ top: sectionTop(idx), behavior: smooth ? 'smooth' : 'auto' });
    }

    function closeMobileNav() {
        if (!navbar) return;
        navbar.classList.remove('active');
        setTimeout(function () {
            if (navbar.classList.contains('active')) return;
            if (menuIcon) {
                menuIcon.classList.remove('active');
                menuIcon.setAttribute('aria-expanded', 'false');
            }
            if (navOverlay) navOverlay.classList.remove('active');
            body.classList.remove('nav-open');
        }, 500);
    }

    /* ---------- scroll spy  ---------- */
    var ticking = false;

    function updateSpy() {
        if (!isSingle()) return;
        var mark = window.innerHeight * 0.4;
        var idx = 0;
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].getBoundingClientRect().top <= mark) idx = i;
        }
        var atBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4;
        if (atBottom) idx = sections.length - 1;
        setActiveNav(idx);
    }

    window.addEventListener('scroll', function () {
        if (!isSingle() || ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;
            updateSpy();
        });
    }, { passive: true });

    window.addEventListener('resize', updateSpy);

    /* ---------- nav / logo clicks in single mode (capture phase) ---------- */
    document.addEventListener('click', function (e) {
        if (!isSingle()) return;

        var idx = -1;
        var link = e.target.closest('header nav a');
        var logo = e.target.closest('.logo');

        if (link) {
            idx = Array.prototype.indexOf.call(navLinks, link);
        } else if (logo) {
            idx = 0;
        }
        if (idx < 0) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        closeMobileNav();
        setTimeout(function () {
            scrollToSection(idx, true);
        }, 60);
    }, true);

    /* ---------- mode switching ---------- */
    function enableSingle(isInit) {
        var idx = activeNavIndex();

        body.classList.add('single-page');

        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.add('active');
        }

        updateToggleUI();

        if (isInit) {
            body.classList.add('sp-boot');
            setTimeout(function () { body.classList.remove('sp-boot'); }, 4500);
        } else {
            requestAnimationFrame(function () {
                scrollToSection(idx, false);
                updateSpy();
            });
        }
    }

    function enableMulti() {
        updateSpy();
        var idx = activeNavIndex();

        body.classList.remove('single-page', 'sp-boot');

        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.toggle('active', i === idx);
            sections[i].style.animationDelay = '0s';
            sections[i].scrollTop = 0;
        }
        setActiveNav(idx);

        window.scrollTo(0, 0);
        updateToggleUI();
    }

    /* ---------- animated switch ---------- */
    var busy = false;

    toggleBtn.addEventListener('click', function () {
        if (busy) return;
        busy = true;

        toggleBtn.classList.add('is-used');
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* ignore */ } }

        var toSingle = !isSingle();

        function apply() {
            if (toSingle) {
                enableSingle(false);
                saveMode('single');
            } else {
                enableMulti();
                saveMode('multi');
            }
        }

        setToggleState(toSingle);

        if (reduceMotion) {
            apply();
            busy = false;
            return;
        }

        toggleBtn.classList.add('is-busy');

        var r = toggleBtn.getBoundingClientRect();
        curtain.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
        curtain.style.setProperty('--cy', (r.top + r.height / 2) + 'px');
        curtain.classList.add('is-in');

        setTimeout(function () {
            apply();
            loader.classList.add('is-show');
            typeText(loaderText, toSingle ? ' switch --view=single-page' : ' switch --view=multi-page', 26);

            setTimeout(function () {
                loader.classList.remove('is-show');

                setTimeout(function () {
                    curtain.classList.remove('is-in');
                    setTimeout(function () {
                        busy = false;
                        toggleBtn.classList.remove('is-busy');
                    }, 600);
                }, 250);
            }, 1000);
        }, 600);
    });

    /* ---------- initial mode ---------- */
    var urlMode = null;
    try { urlMode = new URLSearchParams(window.location.search).get('view'); } catch (e) { /* ignore */ }

    var startMode = urlMode === 'single' || urlMode === 'multi' ? urlMode : (readSavedMode() || 'single');

    if (startMode === 'single') {
        enableSingle(true);
    } else {
        updateToggleUI();
    }
})();