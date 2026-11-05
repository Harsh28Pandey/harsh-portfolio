(function () {
    'use strict';

    const data = window.SERVICES_DATA || [];
    const cards = document.querySelectorAll('.services-container .services-box');
    if (!cards.length || !data.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'sv-modal-overlay';
    overlay.id = 'service-modal';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="sv-modal" role="dialog" aria-modal="true" aria-labelledby="sv-modal-title">
            <button class="sv-modal-close" id="sv-modal-close" aria-label="Close service details">
                <i class='bx bx-x'></i>
            </button>
            <div class="sv-modal-scroll" id="sv-modal-scroll"></div>
            <div class="sv-modal-foot">
                <p>Interested in this service?</p>
                <button type="button" class="btn" id="sv-modal-cta">Let's Work Together</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const scrollBox = overlay.querySelector('#sv-modal-scroll');
    const closeBtn = overlay.querySelector('#sv-modal-close');
    const ctaBtn = overlay.querySelector('#sv-modal-cta');
    let lastFocused = null;

    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

    function findData(card, idx) {
        const h3 = card.querySelector('h3');
        const title = norm(h3 ? h3.textContent : '');
        return data.find((d) => norm(d.match) === title) || data[idx] || null;
    }

    function render(s) {
        let d = 0;
        const a = () => `class="sv-anim" style="--d:${d++}"`;

        scrollBox.innerHTML = `
            <div class="sv-head sv-anim" style="--d:0">
                <div class="sv-head-icon"><i class="${s.icon}"></i></div>
                <div class="sv-head-text">
                    <h3 id="sv-modal-title">${s.title}</h3>
                    <p>${s.tagline}</p>
                </div>
            </div>

            <p class="sv-desc sv-anim" style="--d:1">${s.description}</p>

            <div class="sv-block sv-anim" style="--d:2">
                <h4 class="sv-block-title"><i class='bx bx-check-shield'></i> What I Offer</h4>
                <ul class="sv-offers">
                    ${s.offers.map((o) => `<li><i class='bx bxs-check-circle'></i><span>${o}</span></li>`).join('')}
                </ul>
            </div>

            <div class="sv-block sv-anim" style="--d:3">
                <h4 class="sv-block-title"><i class='bx bx-chip'></i> Tech &amp; Tools</h4>
                <div class="sv-tech">
                    ${s.tech.map((t) => `<span>${t}</span>`).join('')}
                </div>
            </div>

            <div class="sv-block sv-anim" style="--d:4">
                <h4 class="sv-block-title"><i class='bx bx-git-branch'></i> How I Work</h4>
                <div class="sv-steps">
                    ${s.process.map((p, i) => `
                        <div class="sv-step">
                            <span class="sv-step-num">0${i + 1}</span>
                            <h5>${p.title}</h5>
                            <p>${p.text}</p>
                        </div>`).join('')}
                </div>
            </div>

            <div class="sv-block sv-anim" style="--d:5">
                <h4 class="sv-block-title"><i class='bx bx-package'></i> What You Get</h4>
                <div class="sv-deliver">
                    ${s.deliverables.map((x) => `<span><i class='bx bx-check'></i>${x}</span>`).join('')}
                </div>
            </div>`;
        scrollBox.scrollTop = 0;
    }

    function openModal(s) {
        lastFocused = document.activeElement;
        render(s);
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => closeBtn.focus(), 50);
    }

    function closeModal() {
        if (!overlay.classList.contains('open')) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    cards.forEach((card, idx) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        const handler = (e) => {
            if (e.target.closest('a')) e.preventDefault();
            const s = findData(card, idx);
            if (s) openModal(s);
        };

        card.addEventListener('click', handler);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handler(e);
            }
        });
    });
    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(); 
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusables = overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    ctaBtn.addEventListener('click', () => {
        closeModal();
        const connectLink = document.querySelector('header nav a[href="#connect"]');
        if (connectLink) setTimeout(() => connectLink.click(), 250);
    });
})();