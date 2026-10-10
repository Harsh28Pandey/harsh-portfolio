(function () {
    'use strict';
    var USERNAME = 'Harsh28Pandey';
    var PINNED = ['RepoSense', 'think-flow', 'Library-Management']; 
    var MAX_REPOS = 6;                                             
    var CACHE_MIN = 30;

    var FALLBACK_REPOS = [
        { name: 'RepoSense', description: 'AI assistant that auto-generates READMEs, reviews PRs and tracks repo health.', language: 'JavaScript' },
        { name: 'think-flow', description: 'Intelligent agent platform built with LangGraph and LangChain.', language: 'Python' },
        { name: 'Library-Management', description: 'Library Management System in Python with Tkinter and SQLite.', language: 'Python' }
    ];

    var LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', 'C++': '#f34b7d',
        C: '#9aa0a6', Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051'
    };

    var root = document.getElementById('gh-activity');
    if (!root) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (sel) { return root.querySelector(sel); };
    var graphEl = $('#ghGraph');
    var monthsEl = $('#ghMonths');
    var scrollEl = $('#ghScroll');
    var noteEl = $('#ghNote');
    var reposEl = $('#ghRepos');
    var langCard = $('#ghLangCard');
    var langBar = $('#ghLangBar');
    var langList = $('#ghLangs');
    var card = graphEl ? graphEl.closest('.gh-card') : null;

    /* ---------------- helpers ---------------- */
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function cacheGet(key) {
        try {
            var raw = sessionStorage.getItem(key);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (Date.now() - obj.t > CACHE_MIN * 60000) return null;
            return obj.d;
        } catch (e) { return null; }
    }
    function cacheSet(key, data) {
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) { /* ignore */ }
    }

    function getJSON(url, key) {
        var cached = cacheGet(key);
        if (cached) return Promise.resolve({ data: cached, cached: true });

        var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 9000) : null;

        return fetch(url, ctrl ? { signal: ctrl.signal } : undefined).then(function (res) {
            if (timer) clearTimeout(timer);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        }).then(function (data) {
            cacheSet(key, data);
            return { data: data, cached: false };
        }).catch(function (err) {
            if (timer) clearTimeout(timer);
            throw err;
        });
    }

    function setStat(name, value) {
        var el = $('[data-gh="' + name + '"]');
        if (!el) return;
        if (typeof value !== 'number') { el.textContent = value; return; }
        if (reduceMotion) { el.textContent = value.toLocaleString(); return; }
        var start = performance.now(), dur = 900;
        (function tick(now) {
            var t = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(value * (1 - Math.pow(1 - t, 3))).toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }

    /* ---------------- contribution graph ---------------- */
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function parseDay(str) { return new Date(str + 'T00:00:00'); }

    function buildGraph(days) {
        var first = parseDay(days[0].date);
        var pad = first.getDay(); // Sunday = 0
        var cells = [];
        for (var p = 0; p < pad; p++) cells.push(null);
        days.forEach(function (d) { cells.push(d); });

        var weeks = Math.ceil(cells.length / 7);
        graphEl.style.setProperty('--weeks', weeks);
        monthsEl.style.setProperty('--weeks', weeks);

        var frag = document.createDocumentFragment();
        cells.forEach(function (d) {
            var c = document.createElement('i');
            if (!d) {
                c.className = 'gh-cell is-blank';
            } else {
                c.className = 'gh-cell';
                c.setAttribute('data-l', String(Math.max(0, Math.min(4, d.level || 0))));
                c.setAttribute('data-date', d.date);
                c.setAttribute('data-count', String(d.count || 0));
            }
            frag.appendChild(c);
        });
        graphEl.innerHTML = '';
        graphEl.appendChild(frag);

        // month labels
        monthsEl.innerHTML = '';
        var lastMonth = -1, lastCol = -10;
        for (var w = 0; w < weeks; w++) {
            var d0 = null;
            for (var k = 0; k < 7; k++) {
                if (cells[w * 7 + k]) { d0 = cells[w * 7 + k]; break; }
            }
            if (!d0) continue;
            var m = parseDay(d0.date).getMonth();
            if (m !== lastMonth && w - lastCol >= 3) {
                var s = document.createElement('span');
                s.textContent = MONTHS[m];
                s.style.gridColumn = String(w + 1);
                monthsEl.appendChild(s);
                lastCol = w;
            }
            lastMonth = m;
        }

        if (scrollEl) scrollEl.scrollLeft = scrollEl.scrollWidth;
    }

    function streaks(days) {
        var longest = 0, run = 0;
        days.forEach(function (d) {
            if (d.count > 0) { run++; if (run > longest) longest = run; } else run = 0;
        });
        var current = 0, i = days.length - 1;
        if (i >= 0 && days[i].count === 0) i--;
        for (; i >= 0 && days[i].count > 0; i--) current++;
        return { longest: longest, current: current };
    }

    /* tooltip */
    var tip = null;
    function ensureTip() {
        if (tip || !card) return;
        tip = document.createElement('div');
        tip.className = 'gh-tip';
        tip.hidden = true;
        card.appendChild(tip);
    }
    function showTip(cell) {
        ensureTip();
        if (!tip || !cell || cell.classList.contains('is-blank')) return;
        var n = parseInt(cell.getAttribute('data-count'), 10) || 0;
        var date = parseDay(cell.getAttribute('data-date'));
        tip.textContent = (n === 0 ? 'No' : n) + ' contribution' + (n === 1 ? '' : 's') + ' on ' +
            date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        tip.hidden = false;
        var cr = card.getBoundingClientRect(), r = cell.getBoundingClientRect();
        var left = r.left - cr.left + r.width / 2;
        var half = tip.offsetWidth / 2 + 8;
        left = Math.max(half, Math.min(card.clientWidth - half, left));
        tip.style.left = left + 'px';
        tip.style.top = (r.top - cr.top - 8) + 'px';
    }
    function hideTip() { if (tip) tip.hidden = true; }

    if (graphEl) {
        graphEl.addEventListener('pointerover', function (e) {
            var c = e.target.closest && e.target.closest('.gh-cell');
            if (c) showTip(c);
        });
        graphEl.addEventListener('pointerleave', hideTip);
        if (scrollEl) scrollEl.addEventListener('scroll', hideTip, { passive: true });
    }

    function showGraphFallback() {
        var hex = (getComputedStyle(document.documentElement).getPropertyValue('--main-color') || '').trim();
        var colorPart = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) + '/' : '';
        monthsEl.innerHTML = '';
        graphEl.style.display = 'block';
        graphEl.innerHTML = '';
        var img = new Image();
        img.className = 'gh-fallback-img';
        img.alt = 'GitHub contribution chart for ' + USERNAME;
        img.loading = 'lazy';
        img.onerror = function () {
            graphEl.innerHTML = '<p class="gh-empty">Live graph is unavailable right now. ' +
                '<a href="https://github.com/' + USERNAME + '" target="_blank" rel="noopener" style="color:var(--main-color)">View it on GitHub</a></p>';
        };
        img.src = 'https://ghchart.rshah.org/' + colorPart + USERNAME;
        graphEl.appendChild(img);
    }

    /* ---------------- languages + repos ---------------- */
    function renderLanguages(repos) {
        if (!langCard) return;
        var counts = {}, total = 0;
        repos.forEach(function (r) {
            if (r.fork || !r.language) return;
            counts[r.language] = (counts[r.language] || 0) + 1;
            total++;
        });
        var names = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
        if (!names.length) return;

        var fallbackColors = ['#ff8c00', '#ffb347', '#ffd9a0', '#c97300', '#8a5a1f'];
        langBar.innerHTML = '';
        langList.innerHTML = '';
        names.slice(0, 6).forEach(function (n, i) {
            var pct = Math.round(counts[n] / total * 100);
            var color = LANG_COLORS[n] || fallbackColors[i % fallbackColors.length];
            var seg = document.createElement('span');
            seg.style.width = (counts[n] / total * 100) + '%';
            seg.style.background = color;
            seg.title = n + ' ' + pct + '%';
            langBar.appendChild(seg);
            var li = document.createElement('li');
            li.innerHTML = '<i style="background:' + color + '"></i>' + esc(n) + ' <em>' + pct + '%</em>';
            langList.appendChild(li);
        });
        langCard.hidden = false;
    }

    function pickRepos(repos) {
        var byName = {};
        repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
        var out = [], used = {};
        PINNED.forEach(function (n) {
            var r = byName[n.toLowerCase()];
            if (r) { out.push(r); used[r.name] = true; }
        });
        repos.filter(function (r) { return !r.fork && !used[r.name]; })
            .sort(function (a, b) {
                return (b.stargazers_count - a.stargazers_count) ||
                    (new Date(b.pushed_at) - new Date(a.pushed_at));
            })
            .forEach(function (r) { if (out.length < MAX_REPOS) out.push(r); });
        return out.slice(0, MAX_REPOS);
    }

    function repoCard(r) {
        var lang = r.language
            ? '<span><i class="gh-dot" style="background:' + (LANG_COLORS[r.language] || 'var(--main-color)') + '"></i>' + esc(r.language) + '</span>'
            : '';
        var stars = typeof r.stargazers_count === 'number' ? '<span><i class="bx bx-star"></i>' + r.stargazers_count + '</span>' : '';
        var forks = typeof r.forks_count === 'number' ? '<span><i class="bx bx-git-repo-forked"></i>' + r.forks_count + '</span>' : '';
        var url = r.html_url || ('https://github.com/' + USERNAME + '/' + r.name);
        return '<a class="gh-repo" href="' + esc(url) + '" target="_blank" rel="noopener">' +
            '<span class="gh-repo-name"><i class="bx bx-book-bookmark"></i>' + esc(r.name) + '</span>' +
            '<span class="gh-repo-desc">' + esc(r.description || 'No description yet.') + '</span>' +
            '<span class="gh-repo-meta">' + lang + stars + forks + '</span></a>';
    }

    function renderRepos(list) {
        reposEl.innerHTML = list.map(repoCard).join('');
    }

    /* ---------------- load ---------------- */
    var loaded = false;

    function load() {
        if (loaded) return;
        loaded = true;

        var apiOK = false, graphOK = false, anyCached = false;

        var pRepos = getJSON('https://api.github.com/users/' + USERNAME + '/repos?per_page=100&sort=pushed', 'gh:repos:' + USERNAME)
            .then(function (res) {
                apiOK = true; anyCached = anyCached || res.cached;
                var repos = Array.isArray(res.data) ? res.data : [];
                var own = repos.filter(function (r) { return !r.fork; });
                var stars = own.reduce(function (s, r) { return s + (r.stargazers_count || 0); }, 0);
                setStat('repos', own.length);
                setStat('stars', stars);
                renderRepos(pickRepos(repos));
                renderLanguages(repos);
            })
            .catch(function () {
                setStat('repos', '—');
                setStat('stars', '—');
                renderRepos(FALLBACK_REPOS);
            });

        var pGraph = getJSON('https://github-contributions-api.jogruber.de/v4/' + USERNAME + '?y=last', 'gh:contrib:' + USERNAME)
            .then(function (res) {
                anyCached = anyCached || res.cached;
                var days = res.data && res.data.contributions;
                if (!Array.isArray(days) || !days.length) throw new Error('bad data');
                days = days.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
                var total = 0;
                days.forEach(function (d) { total += d.count || 0; });
                var st = streaks(days);
                buildGraph(days);
                setStat('contrib', total);
                setStat('streak', st.longest + (st.longest === 1 ? ' day' : ' days'));
                graphOK = true;
            })
            .catch(function () {
                setStat('contrib', '—');
                setStat('streak', '—');
                showGraphFallback();
            });

        Promise.all([pRepos, pGraph]).then(function () {
            if (!noteEl) return;
            if (apiOK && graphOK) {
                noteEl.textContent = 'Live data from GitHub' + (anyCached ? ' (cached)' : '');
            } else {
                noteEl.textContent = 'Some live data could not be loaded — showing saved info.';
            }
        });
    }

    // skeletons while waiting
    if (reposEl && !reposEl.children.length) {
        reposEl.innerHTML = '<div class="gh-skeleton"></div><div class="gh-skeleton"></div><div class="gh-skeleton"></div>';
    }

    if (document.readyState === 'complete') setTimeout(load, 300);
    else window.addEventListener('load', function () { setTimeout(load, 800); });
})();