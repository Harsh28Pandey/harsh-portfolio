/* =====================================================
   TEAM MEMBERS (Projects section)
   - "Team Project" badge  (sirf tab jab members >= 2)
   - Team icon button (case-study button ke right side me) + member count
   - Click -> modal with member info (desktop + mobile)
   - Project key = case-study button ka data-project value,
     isliye index.html me koi markup change nahi karna.
   Naya project add karna ho -> neeche TEAM_DATA me ek entry.
===================================================== */
(function () {
    'use strict';

    /* ---------------- DATA: yaha edit karo ----------------
       key  = data-project (index.html ke case-study-btn se)
       Apni real links / role yahan bhar do.               */
    const ME = {
        name: 'Harsh Pandey',
        role: 'Full Stack Developer',
        github: 'https://github.com/Harsh28Pandey',
        linkedin: 'https://www.linkedin.com/in/harsh28pandey/'
    };

    const TEAM_DATA = {
        'reposense': [
            ME,
            { name: 'Anshuman Sharma', role: 'Contributor', github: 'https://github.com/Anshuman-sharma2006', linkedin: 'https://www.linkedin.com/in/anshuman-sharma-b886a3371/' }
        ],
        'library-management': [
            ME,
            { name: 'Abhay Singh', role: 'Contributor', github: 'https://github.com/Abhay2110s', linkedin: 'https://www.linkedin.com/in/abhay-singh-btech/' },
            { name: 'Ayansh Yadav', role: 'Contributor', github: 'https://github.com/Ayansh252yadav', linkedin: 'https://www.linkedin.com/in/ayansh-yadav/' }
        ]
    };

    /* ---------------- helpers ---------------- */
    function initials(name) {
        return name.trim().split(/\s+/).map(function (w) { return w[0]; })
            .slice(0, 2).join('').toUpperCase();
    }
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------------- modal (ek hi baar bnta hai) ---------------- */
    const overlay = document.createElement('div');
    overlay.className = 'tm-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
        "<div class='tm-modal' role='dialog' aria-modal='true' aria-labelledby='tmTitle'>" +
        "<button class='tm-close' type='button' aria-label='Close'><i class='bx bx-x'></i></button>" +
        "<div class='tm-head'><span class='tm-head-icon'><i class='bx bx-group'></i></span>" +
        "<div><h3 id='tmTitle'></h3><p class='tm-sub'></p></div></div>" +
        "<div class='tm-list'></div></div>";
    document.body.appendChild(overlay);

    const titleEl = overlay.querySelector('#tmTitle');
    const subEl = overlay.querySelector('.tm-sub');
    const listEl = overlay.querySelector('.tm-list');
    let lastFocus = null;

    function openModal(projectName, members) {
        lastFocus = document.activeElement;
        titleEl.textContent = projectName;
        subEl.textContent = members.length > 1
            ? 'Team Project • ' + members.length + ' members'
            : 'Solo Project';

        listEl.innerHTML = members.map(function (m) {
            var links = '';
            if (m.github) links += "<a href='" + esc(m.github) + "' target='_blank' rel='noopener' aria-label='GitHub'><i class='bx bxl-github'></i></a>";
            if (m.linkedin) links += "<a href='" + esc(m.linkedin) + "' target='_blank' rel='noopener' aria-label='LinkedIn'><i class='bx bxl-linkedin'></i></a>";
            return "<div class='tm-member'>" +
                "<span class='tm-avatar'>" + esc(initials(m.name)) + "</span>" +
                "<div class='tm-info'><h4>" + esc(m.name) + "</h4><p>" + esc(m.role || '') + "</p></div>" +
                (links ? "<div class='tm-links'>" + links + "</div>" : '') +
                "</div>";
        }).join('');

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.tm-close').focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.closest('.tm-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    /* ---------------- inject into project cards ---------------- */
    function inject() {
        document.querySelectorAll('.project-detail').forEach(function (detail) {
            if (detail.dataset.teamReady) return;

            var btn = detail.querySelector('.case-study-btn[data-project]');
            if (!btn) return;
            var members = TEAM_DATA[btn.dataset.project];
            if (!members || !members.length) return;

            detail.dataset.teamReady = 'true';
            var wrapper = detail.querySelector('.project-title-wrapper');
            var projectName = (detail.querySelector('h3') || {}).textContent || 'Project';
            var isTeam = members.length >= 2;

            // 1) "Team Project" badge (title ke saath)
            if (isTeam && wrapper) {
                var badge = document.createElement('span');
                badge.className = 'status-badge tm-team-badge';
                badge.innerHTML = "<i class='bx bx-group'></i> Team Project";
                wrapper.appendChild(badge);
            }

            // 2) Team icon button: case-study button ke RIGHT side me
            var row = document.createElement('button');
            row.type = 'button';
            row.className = 'tm-trigger';
            row.setAttribute('aria-label', members.length + ' contributors. View team members');
            row.innerHTML =
                "<i class='bx bx-group'></i>" +
                "<em class='tm-num'>" + members.length + "</em>" +
                "<span>" + (members.length > 1 ? 'Team • ' : '') + members.length +
                (members.length > 1 ? ' Members' : ' Member') + "</span>";
            row.addEventListener('click', function () { openModal(projectName, members); });

            btn.insertAdjacentElement('afterend', row);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
    else inject();
    window.addEventListener('load', inject);
})();