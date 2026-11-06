(function () {
    'use strict';

    const STUDIES = [
        {
            id: 'interview-buddy',
            name: 'Interview Buddy',
            tag: 'AI-Powered · Full Stack',
            summary:
                'An interview preparation platform that generates role-specific questions and gives instant AI feedback on answers.',
            problem:
                'Most candidates practice from generic question lists. There is no link between the role they are applying for and the questions they see, and no feedback loop to tell them whether an answer was actually good.',
            goals: [
                'Generate questions tailored to a chosen role and experience level',
                'Return structured feedback fast enough to feel interactive',
                'Keep user sessions and history private and persistent'
            ],
            arch: [
                { tier: 'Client', nodes: ['React SPA', 'Tailwind UI', 'Session & feedback views'] },
                { tier: 'API Layer', nodes: ['Express REST API', 'JWT auth middleware', 'Input validation'] },
                { tier: 'AI Service', nodes: ['Prompt builder', 'Groq API client', 'Response parser'] },
                { tier: 'Data', nodes: ['MongoDB', 'Users', 'Sessions & questions'] }
            ],
            archNote:
                'The browser never talks to the LLM directly. Every AI call goes through the backend so the API key stays server-side.',
            stack: [
                ['React.js', 'Component reuse for question cards, answer boxes and feedback panels.'],
                ['Node.js + Express', 'One language across the stack and a thin REST layer that is easy to reason about.'],
                ['MongoDB', 'Flexible documents suit AI-generated question sets whose shape can vary.'],
                ['Groq API', 'Low-latency inference keeps feedback close to real time.'],
                ['JWT', 'Stateless auth that scales without server-side session storage.'],
                ['Tailwind CSS', 'Fast, consistent UI iteration without a separate stylesheet to maintain.']
            ],
            challenges: [
                ['Unreliable LLM output', 'Model responses are not always in the expected format. Fixed with structured prompts, strict parsing and validation before anything is saved or shown, plus a retry path for malformed replies.'],
                ['Protecting the API key', 'Moved every model call behind the Express backend and kept keys in environment variables, so nothing sensitive reaches the client bundle.'],
                ['Perceived latency', 'Even fast inference takes a moment. Added clear loading states and requested only what each screen needs so the UI never feels stuck.']
            ],
            result: [
                'Live, deployed end-to-end product with authentication and persistent history',
                'Role-specific question generation with AI feedback in a single flow',
                'A reusable pattern for calling LLMs safely from a MERN backend'
            ],
            live: 'https://prepareinterview.vercel.app/',
            repo: 'https://github.com/Harsh28Pandey/Interview-Prep-AI'
        },
        {
            id: 'collab-flow',
            name: 'Collab Flow',
            tag: 'Team Productivity · Full Stack',
            summary:
                'A task manager where teams create, assign and track work with secure, OTP-verified accounts.',
            problem:
                'Small teams manage work across chats and spreadsheets. Tasks get lost, ownership is unclear, and nobody can see progress at a glance.',
            goals: [
                'One shared place to create, assign and track tasks',
                'Secure sign-up and login with email OTP verification',
                'A smooth, animated interface that stays fast on mobile'
            ],
            arch: [
                { tier: 'Client', nodes: ['React SPA', 'Framer Motion', 'Tailwind UI'] },
                { tier: 'API Layer', nodes: ['Express REST API', 'JWT + OTP auth', 'Role checks'] },
                { tier: 'Services', nodes: ['Task service', 'Nodemailer OTP mailer'] },
                { tier: 'Data', nodes: ['MongoDB', 'Users & OTPs', 'Tasks & teams'] }
            ],
            archNote:
                'Authentication is two-step: credentials are checked first, then a short-lived OTP sent by email completes verification.',
            stack: [
                ['React.js', 'Predictable state-driven UI for boards, task cards and filters.'],
                ['Framer Motion', 'Declarative animations that make state changes easy to follow.'],
                ['Express REST API', 'Clear resource-based endpoints for users, teams and tasks.'],
                ['MongoDB', 'Task documents evolve (labels, assignees, status) without painful migrations.'],
                ['JWT + OTP', 'Token auth for API access, OTP for verifying email ownership.'],
                ['Nodemailer', 'Simple, provider-agnostic email delivery for OTP codes.']
            ],
            challenges: [
                ['Making OTP verification safe', 'OTPs are short-lived, stored hashed, limited in attempts and invalidated after use, so a leaked or guessed code has very little value.'],
                ['Who can do what', 'Added middleware that checks the user\'s role and team membership on every protected route instead of trusting the client.'],
                ['Keeping the UI consistent after changes', 'Updated local state right after a successful API response and re-fetched where needed, so boards never show stale assignments.']
            ],
            result: [
                'Live app with secure onboarding and team-based task tracking',
                'Clean separation between auth, task logic and email delivery',
                'Responsive UI with motion that supports, not distracts from, the work'
            ],
            live: 'https://collaspace.netlify.app/',
            repo: 'https://github.com/Harsh28Pandey/collab-flow'
        },
        {
            id: 'orbit-os',
            name: 'Orbit OS',
            tag: 'All-in-one Workspace · Full Stack',
            summary:
                'A connected workspace for students, developers and job seekers to manage tasks, projects, study sessions and goals in one place.',
            problem:
                'Students and early-career developers juggle separate apps for to-dos, projects, study plans and goals. Context is scattered and nothing connects.',
            goals: [
                'Bring tasks, projects, planning and goals under one login',
                'Keep each user\'s data fully isolated',
                'Make adding a new module cheap as the workspace grows'
            ],
            arch: [
                { tier: 'Client', nodes: ['React workspace shell', 'Module views', 'Tailwind design tokens'] },
                { tier: 'API Layer', nodes: ['Express REST APIs', 'JWT middleware', 'Per-user scoping'] },
                { tier: 'Modules', nodes: ['Tasks', 'Projects', 'Study planner', 'Goals'] },
                { tier: 'Data', nodes: ['MongoDB', 'One collection per module'] }
            ],
            archNote:
                'Every module follows the same route / controller / model pattern, so adding a feature means adding a folder, not rewriting the app.',
            stack: [
                ['React.js', 'A shared shell with lazy module views keeps navigation instant.'],
                ['Node.js + Express', 'Consistent REST conventions across every module.'],
                ['MongoDB', 'Independent collections per module with room to evolve schemas.'],
                ['JWT', 'One token authorises access across all modules.'],
                ['Tailwind CSS', 'Shared design tokens keep every module visually consistent.']
            ],
            challenges: [
                ['Many modules, one codebase', 'Adopted a strict feature-folder structure with shared hooks and API helpers so modules stay independent but consistent.'],
                ['Data isolation', 'Every query is scoped by the authenticated user\'s id on the server, so one user can never read another\'s records.'],
                ['Consistent experience', 'Reusable layout, form and card components plus design tokens prevent each module from drifting into its own style.']
            ],
            result: [
                'Live multi-module workspace behind a single login',
                'A modular backend pattern that scales by adding folders',
                'Strong practice in authorisation and data-scoping design'
            ],
            live: 'https://orbit-os-web.vercel.app/',
            repo: ''
        }
    ];

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function copyText(text, statusEl) {
        function done() {
            if (statusEl) {
                statusEl.classList.remove('err');
                statusEl.textContent = 'Copied: ' + text.slice(0, 40);
                setTimeout(function () { statusEl.textContent = ''; }, 1800);
            }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
        } else {
            fallback();
        }
        function fallback() {
            const t = document.createElement('textarea');
            t.value = text;
            document.body.appendChild(t);
            t.select();
            try { document.execCommand('copy'); } catch (e) { /* ignore */ }
            document.body.removeChild(t);
            done();
        }
    }

    function caseHTML(c, i) {
        const arch = c.arch.map(function (t, idx) {
            return (idx ? '<div class="st-link" aria-hidden="true">&rarr;</div>' : '') +
                '<div class="st-tier"><h5>' + esc(t.tier) + '</h5>' +
                t.nodes.map(function (n) { return '<div class="st-node">' + esc(n) + '</div>'; }).join('') +
                '</div>';
        }).join('');

        return '' +
            '<article class="st-case' + (i === 0 ? ' active' : '') + '" data-case="' + c.id + '">' +
            '<div class="st-card">' +
            '<div class="st-case-head">' +
            '<h3>' + esc(c.name) + '</h3>' +
            '<span class="st-tag">' + esc(c.tag) + '</span>' +
            '<p>' + esc(c.summary) + '</p>' +
            '</div>' +

            '<div class="st-block"><h4>01 &middot; The Problem</h4><p>' + esc(c.problem) + '</p>' +
            '<ul>' + c.goals.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>' +

            '<div class="st-block"><h4>02 &middot; Architecture</h4>' +
            '<div class="st-arch">' + arch + '</div>' +
            '<p class="st-arch-note">' + esc(c.archNote) + '</p></div>' +

            '<div class="st-block"><h4>03 &middot; Tech Choices</h4><div class="st-stack">' +
            c.stack.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') +
            '</div></div>' +

            '<div class="st-block"><h4>04 &middot; Challenges &amp; Solutions</h4>' +
            c.challenges.map(function (ch) {
                return '<div class="st-challenge"><strong>' + esc(ch[0]) + '</strong><span>' + esc(ch[1]) + '</span></div>';
            }).join('') + '</div>' +

            '<div class="st-block"><h4>05 &middot; Result</h4><ul>' +
            c.result.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +

            '<div class="st-links">' +
            (c.live ? '<a class="btn" href="' + c.live + '" target="_blank" rel="noopener">Live Project</a>' : '') +
            (c.repo ? '<a class="btn" href="' + c.repo + '" target="_blank" rel="noopener">GitHub</a>' : '') +
            '</div>' +
            '</div>' +
            '</article>';
    }

    const WIDGETS_HTML = '' +
        '<div class="st-widgets">' +

        '<div class="st-card" id="stCalc">' +
        '<h3><i class="bx bx-calculator"></i>Mini Calculator</h3>' +
        '<p class="st-hint">Safe expression parser (no eval). Live preview, ^ power, &radic; root, ANS and history. Keyboard works too.</p>' +
        '<div class="st-calc-display">' +
        '<div class="st-calc-sub" id="stCalcSub"></div>' +
        '<input id="stCalcInput" type="text" inputmode="decimal" autocomplete="off" placeholder="0" aria-label="Calculator input">' +
        '</div>' +
        '<div class="st-calc-grid" id="stCalcGrid"></div>' +
        '<div class="st-history-head"><span class="st-label" style="margin:0">History</span><button class="st-link-btn" id="stCalcClear" type="button">Clear</button></div>' +
        '<div class="st-history" id="stCalcHist"></div>' +
        '</div>' +

        '<div class="st-card" id="stPass">' +
        '<h3><i class="bx bx-lock-alt"></i>Password Generator</h3>' +
        '<p class="st-hint">Uses the browser crypto API, nothing leaves your device.</p>' +
        '<div class="st-calc-display"><input id="stPassOut" type="text" readonly aria-label="Generated password" style="font-size:1.8rem"></div>' +
        '<div class="st-meter" aria-hidden="true"><span id="stPassBar" data-level="0"></span></div>' +
        '<label class="st-label" for="stPassLen">length: <span id="stPassLenVal">16</span></label>' +
        '<input type="range" id="stPassLen" min="8" max="64" value="16" style="width:100%">' +
        '<div class="st-checks">' +
        '<label class="st-check"><input type="checkbox" id="stPassU" checked> A-Z</label>' +
        '<label class="st-check"><input type="checkbox" id="stPassL" checked> a-z</label>' +
        '<label class="st-check"><input type="checkbox" id="stPassN" checked> 0-9</label>' +
        '<label class="st-check"><input type="checkbox" id="stPassS" checked> !@#</label>' +
        '<label class="st-check"><input type="checkbox" id="stPassA"> no look-alikes (0 O 1 l I)</label>' +
        '</div>' +
        '<label class="st-label" for="stPassEx">exclude characters</label>' +
        '<input class="st-input" id="stPassEx" maxlength="30" spellcheck="false" autocomplete="off" placeholder="e.g. {}[]">' +
        '<div class="st-row" style="margin-top:1.2rem"><button class="st-btn" id="stPassGen" type="button">Generate</button><button class="st-btn ghost" id="stPassCopy" type="button">Copy</button></div>' +
        '<div class="st-status" id="stPassStatus"></div>' +
        '</div>' +

        '<div class="st-card wide" id="stJson">' +
        '<h3><i class="bx bx-code-curly"></i>JSON Formatter</h3>' +
        '<p class="st-hint">Live validation with error line/column, format, minify, sort keys and download.</p>' +
        '<textarea class="st-textarea" id="stJsonInput" spellcheck="false" placeholder=\'{"name":"Harsh","skills":["React","Node"]}\'></textarea>' +
        '<div class="st-row" style="margin-top:1.2rem">' +
        '<button class="st-btn" data-json="format" type="button">Format</button>' +
        '<button class="st-btn ghost" data-json="minify" type="button">Minify</button>' +
        '<button class="st-btn ghost" data-json="sample" type="button">Sample</button>' +
        '<button class="st-btn ghost" data-json="copy" type="button">Copy</button>' +
        '<button class="st-btn ghost" data-json="download" type="button">Download</button>' +
        '<button class="st-btn ghost" data-json="clear" type="button">Clear</button>' +
        '<select class="st-select" id="stJsonIndent" style="width:auto" aria-label="Indent size">' +
        '<option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option>' +
        '</select>' +
        '<label class="st-check"><input type="checkbox" id="stJsonSort"> sort keys</label>' +
        '</div>' +
        '<div class="st-status" id="stJsonStatus"></div>' +
        '</div>' +

        '<div class="st-card wide" id="stGrad">' +
        '<h3><i class="bx bx-water"></i>CSS Gradient Generator</h3>' +
        '<p class="st-hint">Linear, radial or conic. Up to 5 color stops with positions, plus random and reverse.</p>' +
        '<div class="st-flex-layout">' +
        '<div>' +
        '<label class="st-label" for="stGType">type</label>' +
        '<select class="st-select" id="stGType"><option value="linear">linear</option><option value="radial">radial</option><option value="conic">conic</option></select>' +
        '<div id="stGAngWrap">' +
        '<label class="st-label" for="stGAng">angle: <span id="stGAngVal">135</span>deg</label>' +
        '<input type="range" id="stGAng" min="0" max="360" value="135" style="width:100%">' +
        '</div>' +
        '<label class="st-label">color stops</label>' +
        '<div id="stGStops"></div>' +
        '<div class="st-row" style="margin-top:1.2rem">' +
        '<button class="st-btn ghost" id="stGAdd" type="button">+ Stop</button>' +
        '<button class="st-btn ghost" id="stGRev" type="button">Reverse</button>' +
        '<button class="st-btn ghost" id="stGRand" type="button">Random</button>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="st-grad-prev" id="stGPrev"></div>' +
        '<pre class="st-code" id="stGCode"></pre>' +
        '<div class="st-row" style="margin-top:1rem"><button class="st-btn ghost" id="stGCopy" type="button">Copy CSS</button><span class="st-status" id="stGStatus" style="margin:0"></span></div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="st-card wide" id="stShadow">' +
        '<h3><i class="bx bx-layer"></i>Box Shadow Generator</h3>' +
        '<p class="st-hint">Stack up to 4 shadow layers, start from a preset, tweak the card and background.</p>' +
        '<div class="st-flex-layout">' +
        '<div>' +
        '<label class="st-label">presets</label>' +
        '<div class="st-chips" id="stSPresets">' +
        '<button class="st-pill st-pill-sm" data-preset="soft" type="button">Soft</button>' +
        '<button class="st-pill st-pill-sm" data-preset="sharp" type="button">Sharp</button>' +
        '<button class="st-pill st-pill-sm" data-preset="glow" type="button">Glow</button>' +
        '<button class="st-pill st-pill-sm" data-preset="layered" type="button">Layered</button>' +
        '<button class="st-pill st-pill-sm" data-preset="inset" type="button">Inset</button>' +
        '</div>' +
        '<label class="st-label">layers</label>' +
        '<div class="st-chips">' +
        '<span class="st-chips" id="stSLayers"></span>' +
        '<button class="st-pill st-pill-sm" id="stSAdd" type="button">+ Layer</button>' +
        '<button class="st-pill st-pill-sm" id="stSDel" type="button">Remove</button>' +
        '</div>' +
        '<label class="st-label" for="stSX">x offset: <span id="stSXVal">8</span>px</label>' +
        '<input type="range" id="stSX" min="-50" max="50" value="8" style="width:100%">' +
        '<label class="st-label" for="stSY">y offset: <span id="stSYVal">12</span>px</label>' +
        '<input type="range" id="stSY" min="-50" max="50" value="12" style="width:100%">' +
        '<label class="st-label" for="stSB">blur: <span id="stSBVal">30</span>px</label>' +
        '<input type="range" id="stSB" min="0" max="100" value="30" style="width:100%">' +
        '<label class="st-label" for="stSS">spread: <span id="stSSVal">0</span>px</label>' +
        '<input type="range" id="stSS" min="-30" max="50" value="0" style="width:100%">' +
        '<label class="st-label" for="stSO">opacity: <span id="stSOVal">35</span>%</label>' +
        '<input type="range" id="stSO" min="0" max="100" value="35" style="width:100%">' +
        '<label class="st-label" for="stSC">shadow color</label>' +
        '<input type="color" class="st-colorsmall" id="stSC" value="#ff8c00">' +
        '<label class="st-check" style="margin-top:1.2rem"><input type="checkbox" id="stSI"> inset</label>' +
        '<label class="st-label" for="stSR">card radius: <span id="stSRVal">20</span>px</label>' +
        '<input type="range" id="stSR" min="0" max="70" value="20" style="width:100%">' +
        '<div class="st-row" style="margin-top:1.2rem">' +
        '<label class="st-check">card <input type="color" id="stSBox" value="#ffffff" class="st-mini-color"></label>' +
        '<label class="st-check">backdrop <input type="color" id="stSStage" value="#e9e9e9" class="st-mini-color"></label>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="st-preview-box" id="stSStageBox"><div class="st-demo" id="stSDemo"></div></div>' +
        '<pre class="st-code" id="stSCode"></pre>' +
        '<div class="st-row" style="margin-top:1rem"><button class="st-btn ghost" id="stSCopy" type="button">Copy CSS</button><span class="st-status" id="stSStatus" style="margin:0"></span></div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '</div>';

    const section = document.createElement('section');
    section.className = 'studio';
    section.id = 'studio';
    section.innerHTML = '' +
        '<h2 class="heading">Engineering <span>Studio</span></h2>' +
        '<p class="st-intro">How I think and build: deep dives into three real projects, plus small interactive tools I wrote from scratch. No libraries, all vanilla JavaScript.</p>' +

        '<div class="st-switch" role="tablist">' +
        '<button class="st-pill active" data-panel="cases" role="tab">Case Studies</button>' +
        '<button class="st-pill" data-panel="tools" role="tab">Live Widgets</button>' +
        '</div>' +

        '<div class="st-panel active" data-panel="cases">' +
        '<div class="st-projects">' +
        STUDIES.map(function (c, i) {
            return '<button class="st-pill' + (i === 0 ? ' active' : '') + '" data-case="' + c.id + '">' + esc(c.name) + '</button>';
        }).join('') +
        '</div>' +
        STUDIES.map(caseHTML).join('') +
        '</div>' +

        '<div class="st-panel" data-panel="tools">' + WIDGETS_HTML + '</div>';

    const connect = document.querySelector('section.connect');
    if (connect && connect.parentNode) {
        connect.parentNode.insertBefore(section, connect);
    } else {
        document.body.appendChild(section);
    }

    section.querySelectorAll('.st-switch .st-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
            section.querySelectorAll('.st-switch .st-pill').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            section.querySelectorAll('.st-panel').forEach(function (p) {
                p.classList.toggle('active', p.getAttribute('data-panel') === btn.getAttribute('data-panel'));
            });
        });
    });

    section.querySelectorAll('.st-projects .st-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
            section.querySelectorAll('.st-projects .st-pill').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            section.querySelectorAll('.st-case').forEach(function (c) {
                c.classList.toggle('active', c.getAttribute('data-case') === btn.getAttribute('data-case'));
            });
        });
    });

    (function () {
        const display = section.querySelector('#stCalcInput');
        const sub = section.querySelector('#stCalcSub');
        const grid = section.querySelector('#stCalcGrid');
        const histEl = section.querySelector('#stCalcHist');
        const clearBtn = section.querySelector('#stCalcClear');
        let history = [];
        let lastAns = '';

        function evaluate(src) {
            const expr = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/');
            if (!expr) throw new Error('Empty');
            if (!/^[0-9+\-*/%().^√]+$/.test(expr)) throw new Error('Invalid character');
            const tokens = expr.match(/\d*\.?\d+|[()+\-*/%^√]/g) || [];
            if (tokens.join('') !== expr) throw new Error('Invalid expression');
            let pos = 0;

            function peek() { return tokens[pos]; }
            function next() { return tokens[pos++]; }

            function parseExpr() {
                let v = parseTerm();
                while (peek() === '+' || peek() === '-') {
                    const op = next();
                    const r = parseTerm();
                    v = op === '+' ? v + r : v - r;
                }
                return v;
            }
            function parseTerm() {
                let v = parseUnary();
                while (peek() === '*' || peek() === '/' || peek() === '%') {
                    const op = next();
                    const r = parseUnary();
                    if ((op === '/' || op === '%') && r === 0) throw new Error('Divide by zero');
                    v = op === '*' ? v * r : op === '/' ? v / r : v % r;
                }
                return v;
            }
            function parseUnary() {
                if (peek() === '-') { next(); return -parseUnary(); }
                if (peek() === '+') { next(); return parseUnary(); }
                return parsePower();
            }
            function parsePower() {
                const base = parsePrimary();
                if (peek() === '^') {
                    next();
                    return Math.pow(base, parseUnary());
                }
                return base;
            }
            function parsePrimary() {
                const t = next();
                if (t === undefined) throw new Error('Unexpected end');
                if (t === '(') {
                    const v = parseExpr();
                    if (next() !== ')') throw new Error('Missing )');
                    return v;
                }
                if (t === '√') {
                    const v = parsePrimary();
                    if (v < 0) throw new Error('Root of negative');
                    return Math.sqrt(v);
                }
                const n = parseFloat(t);
                if (isNaN(n)) throw new Error('Bad number');
                return n;
            }

            const result = parseExpr();
            if (pos !== tokens.length) throw new Error('Unexpected token');
            if (!isFinite(result)) throw new Error('Math error');
            return Math.round(result * 1e10) / 1e10;
        }

        function preview() {
            const raw = display.value.trim();
            if (!raw || /^[-+]?\d*\.?\d+$/.test(raw)) { sub.textContent = ''; return; }
            try { sub.textContent = '= ' + evaluate(raw); }
            catch (e) { sub.textContent = ''; }
        }

        function renderHistory() {
            histEl.innerHTML = '';
            if (!history.length) {
                const empty = document.createElement('div');
                empty.className = 'st-hist-empty';
                empty.textContent = 'No calculations yet.';
                histEl.appendChild(empty);
                return;
            }
            history.forEach(function (h) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'st-hist-item';
                const e = document.createElement('span');
                e.textContent = h.expr;
                const r = document.createElement('b');
                r.textContent = '= ' + h.result;
                b.appendChild(e);
                b.appendChild(r);
                b.addEventListener('click', function () {
                    display.value = h.result;
                    preview();
                    display.focus();
                });
                histEl.appendChild(b);
            });
        }

        function run() {
            try {
                const expr = display.value;
                const r = String(evaluate(expr));
                history.unshift({ expr: expr, result: r });
                history = history.slice(0, 6);
                lastAns = r;
                sub.textContent = expr + ' =';
                display.value = r;
                renderHistory();
            } catch (e) {
                sub.textContent = 'Error: ' + e.message;
            }
        }

        const keys = ['C', '(', ')', '⌫', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '^', '+', 'ANS', '%', '√', '='];
        keys.forEach(function (k) {
            const b = document.createElement('button');
            b.type = 'button';
            const isOp = '/*-+%^'.indexOf(k) > -1 || k === 'C' || k === '⌫' || k === '(' || k === ')' || k === '√' || k === 'ANS';
            b.className = 'st-key' + (k === '=' ? ' eq' : isOp ? ' op' : '');
            b.textContent = k === '*' ? '×' : k === '/' ? '÷' : k;
            b.addEventListener('click', function () {
                if (k === '=') { run(); display.focus(); return; }
                if (k === 'C') { display.value = ''; sub.textContent = ''; }
                else if (k === '⌫') { display.value = display.value.slice(0, -1); }
                else if (k === 'ANS') { if (lastAns) display.value += lastAns; }
                else if (k === '√') { display.value += '√('; }
                else { display.value += k; }
                preview();
                display.focus();
            });
            grid.appendChild(b);
        });

        clearBtn.addEventListener('click', function () { history = []; renderHistory(); });
        display.addEventListener('input', function () {
            const clean = display.value.replace(/[^0-9+\-*/%().^√×÷]/g, '');
            if (clean !== display.value) display.value = clean;
            preview();
        });
        display.addEventListener('keydown', function (e) {
            e.stopPropagation();
            if (e.key === 'Enter') { e.preventDefault(); run(); }
        });
        renderHistory();
    })();

    (function () {
        const $ = function (id) { return section.querySelector(id); };
        const out = $('#stPassOut'), len = $('#stPassLen'), lenVal = $('#stPassLenVal'), status = $('#stPassStatus');
        const bar = $('#stPassBar'), amb = $('#stPassA'), exc = $('#stPassEx');
        const sets = [
            { el: $('#stPassU'), chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { el: $('#stPassL'), chars: 'abcdefghijklmnopqrstuvwxyz' },
            { el: $('#stPassN'), chars: '0123456789' },
            { el: $('#stPassS'), chars: '!@#$%^&*()-_=+[]{}?' }
        ];

        function randInt(max) {
            const arr = new Uint32Array(1);
            const limit = Math.floor(4294967296 / max) * max;
            let v;
            do { crypto.getRandomValues(arr); v = arr[0]; } while (v >= limit);
            return v % max;
        }

        function generate() {
            lenVal.textContent = len.value;
            const banned = (amb.checked ? '0O1lI' : '') + exc.value;
            const active = sets
                .filter(function (s) { return s.el.checked; })
                .map(function (s) { return s.chars.split('').filter(function (ch) { return banned.indexOf(ch) < 0; }).join(''); })
                .filter(function (c) { return c.length > 0; });

            if (!active.length) {
                out.value = '';
                bar.style.width = '0%';
                bar.setAttribute('data-level', '0');
                status.classList.add('err');
                status.textContent = 'No characters left. Select a type or relax the exclusions.';
                return;
            }

            const pool = active.join('');
            const n = parseInt(len.value, 10);
            const chars = active.map(function (c) { return c[randInt(c.length)]; });
            while (chars.length < n) chars.push(pool[randInt(pool.length)]);
            for (let i = chars.length - 1; i > 0; i--) {
                const j = randInt(i + 1);
                const t = chars[i]; chars[i] = chars[j]; chars[j] = t;
            }
            out.value = chars.join('');

            const bits = n * Math.log2(pool.length);
            const level = bits < 40 ? 0 : bits < 60 ? 1 : bits < 80 ? 2 : 3;
            const label = ['Weak', 'Fair', 'Strong', 'Very strong'][level];
            bar.style.width = Math.min(100, (bits / 128) * 100) + '%';
            bar.setAttribute('data-level', String(level + 1));
            status.classList.remove('err');
            status.textContent = label + ' (~' + Math.round(bits) + ' bits)';
        }

        len.addEventListener('input', generate);
        amb.addEventListener('change', generate);
        exc.addEventListener('input', generate);
        exc.addEventListener('keydown', function (e) { e.stopPropagation(); });
        sets.forEach(function (s) { s.el.addEventListener('change', generate); });
        $('#stPassGen').addEventListener('click', generate);
        $('#stPassCopy').addEventListener('click', function () { if (out.value) copyText(out.value, status); });
        generate();
    })();

    (function () {
        const box = section.querySelector('#stJson');
        const input = section.querySelector('#stJsonInput');
        const status = section.querySelector('#stJsonStatus');
        const indentSel = section.querySelector('#stJsonIndent');
        const sortChk = section.querySelector('#stJsonSort');
        let timer;

        function indent() {
            return indentSel.value === 'tab' ? '\t' : parseInt(indentSel.value, 10);
        }
        function setStatus(msg, isErr) {
            status.textContent = msg;
            status.classList.toggle('err', !!isErr);
        }
        function bytes(text) { return new Blob([text]).size; }

        function findErrorPos(text) {
            const incomplete = /end of|EOF|unterminated/i;
            function good(n) {
                try { JSON.parse(text.slice(0, n)); return true; }
                catch (e) {
                    const m = /position (\d+)/.exec(e.message);
                    return incomplete.test(e.message) || (!!m && parseInt(m[1], 10) >= n);
                }
            }
            if (good(text.length)) return -1;
            let lo = 0, hi = text.length;
            while (hi - lo > 1) {
                const mid = (lo + hi) >> 1;
                if (good(mid)) lo = mid; else hi = mid;
            }
            return hi - 1;
        }
        function locate(text, err) {
            if (/line \d+/.test(err.message)) return '';
            const m = /position (\d+)/.exec(err.message);
            const pos = m ? parseInt(m[1], 10) : findErrorPos(text);
            if (pos < 0) return '';
            const before = text.slice(0, pos);
            return ' (line ' + (before.split('\n').length) + ', col ' + (pos - before.lastIndexOf('\n')) + ')';
        }
        function parse() {
            try { return { ok: true, value: JSON.parse(input.value) }; }
            catch (e) { setStatus('Invalid JSON: ' + e.message + locate(input.value, e), true); return { ok: false }; }
        }
        function sortKeys(v) {
            if (Array.isArray(v)) return v.map(sortKeys);
            if (v && typeof v === 'object') {
                const o = {};
                Object.keys(v).sort().forEach(function (k) {
                    Object.defineProperty(o, k, { value: sortKeys(v[k]), enumerable: true, writable: true, configurable: true });
                });
                return o;
            }
            return v;
        }
        function stats(v) {
            let keys = 0, depth = 0;
            if (v && typeof v === 'object') {
                depth = 1;
                const isArr = Array.isArray(v);
                const kids = isArr ? v : Object.keys(v).map(function (k) { return v[k]; });
                if (!isArr) keys = kids.length;
                kids.forEach(function (c) {
                    const s = stats(c);
                    keys += s.keys;
                    depth = Math.max(depth, 1 + s.depth);
                });
            }
            return { keys: keys, depth: depth };
        }
        function validate() {
            const t = input.value;
            if (!t.trim()) { setStatus('', false); return; }
            try {
                const s = stats(JSON.parse(t));
                setStatus('Valid JSON · ' + s.keys + ' keys · depth ' + s.depth + ' · ' + bytes(t) + ' bytes', false);
            } catch (e) {
                setStatus('Invalid JSON: ' + e.message + locate(t, e), true);
            }
        }

        box.querySelectorAll('[data-json]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-json');
                if (action === 'sample') {
                    input.value = '{"name":"Harsh Pandey","role":"Full Stack Developer","skills":["React","Node.js","MongoDB"],"open_to_work":true,"projects":{"count":9,"featured":["Interview Buddy","Collab Flow","Orbit OS"]}}';
                    validate();
                    return;
                }
                if (action === 'clear') { input.value = ''; setStatus('', false); return; }
                if (action === 'copy') { copyText(input.value, status); return; }
                if (action === 'download') {
                    if (!input.value.trim()) { setStatus('Nothing to download.', true); return; }
                    const url = URL.createObjectURL(new Blob([input.value], { type: 'application/json' }));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'data.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
                    return;
                }
                const p = parse();
                if (!p.ok) return;
                const before = bytes(input.value);
                const value = sortChk.checked ? sortKeys(p.value) : p.value;
                input.value = action === 'format' ? JSON.stringify(value, null, indent()) : JSON.stringify(value);
                setStatus((action === 'format' ? 'Formatted' : 'Minified') + ' · ' + before + ' → ' + bytes(input.value) + ' bytes' + (sortChk.checked ? ' · keys sorted' : ''), false);
            });
        });
        input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(validate, 250); });
        input.addEventListener('keydown', function (e) { e.stopPropagation(); });
    })();

    (function () {
        const $ = function (id) { return section.querySelector(id); };
        const type = $('#stGType'), ang = $('#stGAng'), angVal = $('#stGAngVal'), angWrap = $('#stGAngWrap');
        const list = $('#stGStops'), prev = $('#stGPrev'), code = $('#stGCode'), status = $('#stGStatus');
        const addBtn = $('#stGAdd');
        const MAX = 5;
        let stops = [{ c: '#ff8c00', p: 0 }, { c: '#1a1a1a', p: 100 }];

        function build() {
            const parts = stops.slice().sort(function (a, b) { return a.p - b.p; })
                .map(function (s) { return s.c + ' ' + s.p + '%'; }).join(', ');
            if (type.value === 'radial') return 'radial-gradient(circle, ' + parts + ')';
            if (type.value === 'conic') return 'conic-gradient(from ' + ang.value + 'deg, ' + parts + ')';
            return 'linear-gradient(' + ang.value + 'deg, ' + parts + ')';
        }

        function update() {
            angVal.textContent = ang.value;
            ang.disabled = type.value === 'radial';
            angWrap.style.opacity = ang.disabled ? '0.4' : '1';
            addBtn.disabled = stops.length >= MAX;
            const v = build();
            prev.style.background = v;
            code.textContent = 'background: ' + v + ';';
        }

        function renderStops() {
            list.innerHTML = '';
            stops.forEach(function (s, i) {
                const row = document.createElement('div');
                row.className = 'st-stop-row';

                const c = document.createElement('input');
                c.type = 'color';
                c.value = s.c;
                c.className = 'st-stop-color';
                c.setAttribute('aria-label', 'Stop ' + (i + 1) + ' color');

                const p = document.createElement('input');
                p.type = 'range';
                p.min = 0;
                p.max = 100;
                p.value = s.p;
                p.setAttribute('aria-label', 'Stop ' + (i + 1) + ' position');

                const pv = document.createElement('span');
                pv.className = 'st-stop-pos';
                pv.textContent = s.p + '%';

                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'st-btn ghost st-mini';
                rm.textContent = '×';
                rm.disabled = stops.length <= 2;
                rm.setAttribute('aria-label', 'Remove stop ' + (i + 1));

                c.addEventListener('input', function () { s.c = c.value; update(); });
                p.addEventListener('input', function () { s.p = parseInt(p.value, 10); pv.textContent = s.p + '%'; update(); });
                rm.addEventListener('click', function () { stops.splice(stops.indexOf(s), 1); renderStops(); });

                row.appendChild(c);
                row.appendChild(p);
                row.appendChild(pv);
                row.appendChild(rm);
                list.appendChild(row);
            });
            update();
        }

        function randHex() {
            return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
        }

        addBtn.addEventListener('click', function () {
            if (stops.length >= MAX) return;
            stops.push({ c: randHex(), p: 50 });
            renderStops();
        });
        $('#stGRev').addEventListener('click', function () {
            stops = stops.reverse().map(function (s) { return { c: s.c, p: 100 - s.p }; });
            renderStops();
        });
        $('#stGRand').addEventListener('click', function () {
            stops.forEach(function (s) { s.c = randHex(); });
            ang.value = Math.floor(Math.random() * 361);
            renderStops();
        });
        type.addEventListener('change', update);
        ang.addEventListener('input', update);
        $('#stGCopy').addEventListener('click', function () { copyText(code.textContent, status); });
        renderStops();
    })();

    (function () {
        const $ = function (id) { return section.querySelector(id); };
        const x = $('#stSX'), y = $('#stSY'), blur = $('#stSB'), spread = $('#stSS'), op = $('#stSO');
        const col = $('#stSC'), inset = $('#stSI'), rad = $('#stSR');
        const boxCol = $('#stSBox'), stageCol = $('#stSStage'), stage = $('#stSStageBox');
        const demo = $('#stSDemo'), code = $('#stSCode'), status = $('#stSStatus');
        const layersEl = $('#stSLayers'), addBtn = $('#stSAdd'), delBtn = $('#stSDel');
        const MAX = 4;

        function L(x, y, b, s, o, c, i) { return { x: x, y: y, b: b, s: s, o: o, c: c, i: !!i }; }
        const PRESETS = {
            soft: [L(0, 10, 30, 0, 20, '#000000')],
            sharp: [L(6, 6, 0, 0, 60, '#000000')],
            glow: [L(0, 0, 30, 2, 70, '#ff8c00')],
            layered: [L(0, 1, 2, 0, 12, '#000000'), L(0, 4, 8, 0, 12, '#000000'), L(0, 16, 32, 0, 16, '#000000')],
            inset: [L(0, 4, 14, 0, 45, '#000000', true)]
        };

        let layers = [L(8, 12, 30, 0, 35, '#ff8c00')];
        let active = 0;

        function rgba(l) {
            const n = parseInt(l.c.slice(1), 16);
            return 'rgba(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + (l.o / 100) + ')';
        }
        function layerCss(l) {
            return (l.i ? 'inset ' : '') + l.x + 'px ' + l.y + 'px ' + l.b + 'px ' + l.s + 'px ' + rgba(l);
        }

        function setControls() {
            const l = layers[active];
            x.value = l.x; y.value = l.y; blur.value = l.b; spread.value = l.s; op.value = l.o;
            col.value = l.c; inset.checked = l.i;
        }

        function renderLayerChips() {
            layersEl.innerHTML = '';
            layers.forEach(function (l, i) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'st-pill st-pill-sm' + (i === active ? ' active' : '');
                b.textContent = 'Layer ' + (i + 1);
                b.addEventListener('click', function () { active = i; setControls(); renderLayerChips(); render(); });
                layersEl.appendChild(b);
            });
            addBtn.disabled = layers.length >= MAX;
            delBtn.disabled = layers.length <= 1;
        }

        function render() {
            $('#stSXVal').textContent = x.value;
            $('#stSYVal').textContent = y.value;
            $('#stSBVal').textContent = blur.value;
            $('#stSSVal').textContent = spread.value;
            $('#stSOVal').textContent = op.value;
            $('#stSRVal').textContent = rad.value;

            const val = layers.map(layerCss).join(', ');
            demo.style.boxShadow = val;
            demo.style.borderRadius = rad.value + 'px';
            demo.style.background = boxCol.value;
            stage.style.background = stageCol.value;
            code.textContent = 'box-shadow: ' + layers.map(layerCss).join(',\n    ') + ';\nborder-radius: ' + rad.value + 'px;';
        }

        function onControl() {
            const l = layers[active];
            l.x = parseInt(x.value, 10);
            l.y = parseInt(y.value, 10);
            l.b = parseInt(blur.value, 10);
            l.s = parseInt(spread.value, 10);
            l.o = parseInt(op.value, 10);
            l.c = col.value;
            l.i = inset.checked;
            render();
        }

        [x, y, blur, spread, op, col, inset].forEach(function (el) {
            el.addEventListener('input', onControl);
            el.addEventListener('change', onControl);
        });
        [rad, boxCol, stageCol].forEach(function (el) { el.addEventListener('input', render); });

        section.querySelectorAll('#stSPresets [data-preset]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                layers = PRESETS[btn.getAttribute('data-preset')].map(function (l) { return Object.assign({}, l); });
                active = 0;
                setControls();
                renderLayerChips();
                render();
            });
        });
        addBtn.addEventListener('click', function () {
            if (layers.length >= MAX) return;
            layers.push(L(0, 8, 20, 0, 25, '#000000'));
            active = layers.length - 1;
            setControls();
            renderLayerChips();
            render();
        });
        delBtn.addEventListener('click', function () {
            if (layers.length <= 1) return;
            layers.splice(active, 1);
            active = Math.max(0, active - 1);
            setControls();
            renderLayerChips();
            render();
        });
        $('#stSCopy').addEventListener('click', function () { copyText(code.textContent, status); });

        setControls();
        renderLayerChips();
        render();
    })();

})();