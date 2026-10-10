const caseStudiesData = {
    "interview-prep-ai": {
        title: "Interview Prep AI",
        status: "Live",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT Authentication", "Gemini API"],
        problem: "Job seekers usually prepare with generic question banks that have no connection to the actual role they're applying for, and they get zero real feedback on how good their answers actually are — so prep time doesn't translate into measurable improvement.",
        approach: "Built a MERN stack platform integrated with the Gemini API that generates role-specific interview questions on demand, captures the user's answers, and returns structured, actionable feedback. JWT authentication keeps each user's session and progress private, and the UI (Tailwind CSS) is kept minimal so the focus stays on practicing, not navigating menus.",
        challenges: "The hardest part was prompt-engineering Gemini to reliably return consistent, parseable feedback instead of free-flowing text that's hard to render in a UI. On top of that, controlling API latency and cost meant adding request handling so the interface never feels frozen while waiting on a model response.",
        result: "Shipped and deployed a fully working AI-powered product (not just a demo) that generates personalized interview questions and feedback end-to-end. It's the project that best demonstrates real AI product integration — prompting, backend orchestration, and secure auth — beyond typical CRUD apps."
    },
    "collab-flow": {
        title: "Collab Flow",
        status: "Live",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Framer Motion", "Rest API", "JWT Authentication", "OTP Based Authentication"],
        problem: "Small, distributed teams need a place to see who owns what task, its current status, and its deadline — without adopting a heavyweight enterprise project-management tool that's overkill for a 3-5 person team.",
        approach: "Designed and built a MERN stack task manager with OTP-based signup for secure onboarding and JWT for session auth. Tasks can be created, assigned, and tracked in real time through REST APIs, with Framer Motion handling smooth state transitions so status changes feel instant rather than jumpy page reloads.",
        challenges: "Keeping task state in sync across multiple team members without going full WebSocket required careful API design and optimistic UI updates on the frontend. The OTP authentication flow also needed solid handling of edge cases — expired codes, resend limits, and race conditions during signup.",
        result: "A live, deployed collaboration tool that shows full ownership of a real-world product loop: secure auth, relational data modeling (users, tasks, teams), and a UI that makes collaborative work feel responsive and low-friction."
    },
    "quick-chat": {
        title: "Quick Chat App",
        status: "Live",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT Authentication", "Socket.io"],
        problem: "Real-time messaging looks simple in tutorials but is deceptively hard to get right in practice — most beginner chat apps break down around presence detection, reconnect handling, and keeping messages ordered across multiple open sessions.",
        approach: "Built a MERN stack chat application powered by Socket.io for instant, bidirectional message delivery, with JWT-secured sessions so only authenticated users can send or receive messages. Added emoji support and a clean, distraction-free chat UI on top.",
        challenges: "The core challenge was managing the socket connection lifecycle correctly — avoiding duplicate event listeners on re-renders, handling reconnects gracefully, and preventing memory leaks when components unmount. Keeping message order consistent across multiple connected clients also took careful state handling.",
        result: "A stable, live real-time chat app that demonstrates a genuinely different skill set from typical REST-only CRUD projects — WebSocket architecture, connection lifecycle management, and secure real-time auth working together."
    },
    "gen-ai-interview": {
        title: "Gen AI Interview Platform",
        status: "Live",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Groq API"],
        problem: "Candidates rarely get a personalized readiness check before an interview — most tools either just review a resume or just ask generic questions, never combining the job description, resume, and candidate's own introduction into one clear prep plan.",
        approach: "Built a MERN stack platform integrated with the Grok API that takes a job description, resume, and self-introduction as input, analyzes the profile, calculates a resume score, and generates personalized behavioral and technical questions along with a custom interview prep plan.",
        challenges: "The biggest challenge was designing a single AI pipeline that could reason over three very different inputs (JD, resume, self-intro) together and still return a consistent, structured output — a resume score plus tailored questions — instead of three disconnected results.",
        result: "A working AI-driven prep tool that goes a step further than standard question generators by tying the candidate's own resume and introduction into the plan, showing the ability to design multi-input AI pipelines, not just single-prompt features."
    },
    "stowly": {
        title: "Stowly",
        status: "Live",
        tech: ["React.js", "Vite", "Node.js", "Express.js", "MongoDB", "Mongoose", "Tailwind CSS", "JWT Authentication", "Multer"],
        problem: "Most people keep files in one app and passwords in another, and trust both providers with data they can fully read. Public cloud tools also let anyone sign up freely, which is a poor fit for a private, invite-style workspace where the owner wants control over who gets in.",
        approach: "Built a full-stack MERN platform that combines personal cloud storage, a zero-knowledge password Keyring, and private Drop Boxes in one dashboard. Files get smart collections, a recycle bin, recent and pinned views, and a storage-insights page. Every new account starts as PENDING and must be approved by an admin from a Control Room before it can sign in. Auth uses JWT in HTTP-only cookies with server-side session tracking, and the Keyring encrypts every entry in the browser before anything reaches the server.",
        challenges: "The hardest part was the Keyring: deriving a key from the master password with PBKDF2 (600,000 iterations) via the Web Crypto API, keeping it in memory only, encrypting each entry with AES-256-GCM using a fresh IV, and adding auto-lock plus clipboard clearing, so the server never sees plaintext. On the backend, the approval gate had to be re-checked on every protected call so suspending a user revokes their sessions immediately, and every file, folder and vault query needed per-user ownership checks to prevent IDOR. File uploads also needed random on-disk names, blocked executables, quota enforcement and SHA-256 duplicate detection.",
        result: "A live, deployed product with three distinct systems in one app: file storage, an encrypted password vault, and an admin-gated onboarding flow. It shows security-first engineering beyond typical CRUD: client-side cryptography, rate limiting, bcrypt, Helmet headers, session revocation, and a storage layer isolated in one module so it can be swapped to S3 or Cloudflare R2 later."
    },
    "light-brain-os": {
        title: "Light Brain OS",
        status: "In Development",
        tech: ["React.js", "Vite", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Socket.IO", "JWT Authentication", "Gemini API", "Google OAuth 2.0", "Gmail API", "Google Calendar API", "GitHub OAuth", "Electron"],
        problem: "People's daily work is split across too many disconnected tools: email in one app, calendar in another, code on GitHub, files scattered across folders. Writing and managing email eats time, the same manual steps get repeated every day, and users have little visibility into which apps can access their accounts. Existing AI assistants can chat, but they rarely act safely across a user's real tools, so people either don't trust them or still do the work by hand.",
        approach: "Built a desktop-style AI workspace that runs on the web and as a Windows app (Electron) from one React codebase, organized into seven tabs: Home, AI Assistant, Mail Studio, App Hub, Automations, File Manager, and Settings & Security. A backend AI service (Gemini API, replaceable provider) turns voice or text commands into structured actions from a fixed Action Registry, and every consequential action (sending email, creating events, deleting files) is previewed and confirmed by the user before it runs. Gmail, Calendar and GitHub connect through real OAuth flows with encrypted server-side tokens, a workflow engine runs scheduled automations, and a security center lets users see and revoke connected apps and active sessions.",
        challenges: "The hardest part is making AI actions safe: the model can only propose actions from a validated registry, every field is re-checked on the server, and confirmations are tied to the exact payload so nothing can be swapped or executed twice. Emails and documents are treated as untrusted input to resist prompt injection. Other challenges are secure OAuth (state validation, encrypted refresh tokens, handling revoked access), reliable scheduled automations that survive server restarts, and keeping one codebase working in both the browser and Electron with a locked-down preload bridge.",
        result: "Target outcome: a working AI workspace where a user can ask for an email in plain language, review and approve it, send it through Gmail, run a daily automation, and manage files and connected apps from one interface on web and desktop. (Update this line with real results, links and metrics once it ships.)"
    },
    "library-management": {
        title: "Library Management System",
        status: "Completed",
        tech: ["Python", "Tkinter", "SQLite"],
        problem: "Small libraries often still manage book inventory, member records, and issue/return tracking manually or in spreadsheets, which leads to lost records, no easy way to check what's overdue, and slow day-to-day operations.",
        approach: "Built a desktop application in Python using Tkinter for the GUI and SQLite as a lightweight local database, covering book inventory management, user records, and the full issue/return workflow in one interface.",
        challenges: "Designing a database schema that correctly tracked book availability in real time (so a book can't be issued twice) while keeping the Tkinter UI simple and responsive for non-technical staff was the main design challenge.",
        result: "A fully functional offline library management tool that automates inventory and issue/return tracking end-to-end — a good demonstration of desktop application development and relational database design outside of a typical web stack."
    },
    "dynamic-website": {
        title: "Dynamic Website",
        status: "Live",
        tech: ["HTML5", "CSS3", "JavaScript"],
        problem: "Many beginner-level websites are static — same content for every visit, no interactivity, and no real-time feel — which doesn't reflect how modern users expect a site to behave.",
        approach: "Built a fully responsive website using vanilla HTML5, CSS3, and JavaScript with dynamic content updates, interactive UI elements, and smooth navigation — without relying on any framework, to keep the core fundamentals strong.",
        challenges: "Handling dynamic content updates and interactivity using only vanilla JavaScript (no framework state management) meant carefully managing the DOM manually to avoid messy, hard-to-maintain code as features were added.",
        result: "A live, deployed website that shows strong command over core web fundamentals — HTML, CSS, and JavaScript — without leaning on a framework, which is exactly what most React/MERN portfolios skip demonstrating."
    },
    "car-purchase-website": {
        title: "Car Purchase Website",
        status: "Live",
        tech: ["HTML5", "CSS3", "JavaScript"],
        problem: "Car buyers browsing online often deal with cluttered listing sites that make it hard to compare categories (luxury, SUV, van, electric) and quickly find what fits their needs.",
        approach: "Built a clean, browsable car listing website using HTML5, CSS3, and JavaScript, organizing vehicles by category (luxury cars, SUVs, vans, electric vehicles) with a simple, fast-loading interface focused on easy browsing.",
        challenges: "Structuring the layout and CSS so that many car categories and listings stayed visually organized and consistent across screen sizes, without a framework to handle grid/layout logic automatically, took careful manual responsive design.",
        result: "A live, deployed e-commerce-style browsing site that demonstrates practical UI/UX layout skills and responsive design using only core web technologies."
    },
    "reposense": {
        title: "RepoSense",
        status: "In Development",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "LangGraph", "LangChain", "Microservices", "Redis", "Docker"],
        problem: "Developers maintaining multiple GitHub repositories waste hours writing READMEs from scratch, manually reviewing PRs for quality, and keeping documentation in sync with code changes — there's no automated system that handles all of this intelligently in one place.",
        approach: "Building a MERN stack platform powered by a LangGraph multi-agent pipeline where specialized AI agents handle distinct tasks — one generates READMEs by reading the actual codebase, another reviews PRs and flags issues, and a third tracks documentation health and repo hygiene. Microservices architecture with Redis ensures each agent runs independently and scales without blocking the others, and Docker keeps the whole system portable and reproducible.",
        challenges: "The core engineering challenge is orchestrating multiple LLM agents that need to reason over live GitHub data without stepping on each other — coordinating agent state in LangGraph, managing async workflows across microservices, and keeping token usage under control when the codebase being analyzed is large. Designing agent boundaries so each one has a clear job (not vague, overlapping roles) has been the most critical architectural decision so far.",
        result: "Currently under active development. The multi-agent architecture and MERN backend are in progress, with the README generation agent furthest along. This project pushes beyond single-prompt AI features into real agentic system design — orchestration, inter-agent communication, and production-grade infrastructure — which is the next frontier after standard AI API integration."
    },
    "think-flow": {
        title: "Think Flow",
        status: "In Development",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "LangChain", "LangGraph", "Redis", "Microservices"],
        problem: "Most AI tools answer one question at a time — they can't plan multi-step tasks, decide which tool to use next, or loop back when an earlier step fails. Developers and power users have no accessible platform to build and run these kinds of autonomous reasoning workflows without writing low-level agent code themselves.",
        approach: "Building an intelligent agent platform on top of LangGraph and LangChain that exposes automated reasoning workflows through a clean React UI. Users can define tasks and let the system plan, execute, and adapt steps autonomously. A microservices backend with Redis handles agent state persistence and task queuing so long-running workflows don't time out or lose progress.",
        challenges: "The hardest problem is building reliable reasoning loops — LLM agents that can recover from a failed step, re-plan, and continue rather than just stopping or hallucinating a result. Designing the state graph in LangGraph so each node has clear inputs, outputs, and error paths, while keeping the system observable from the frontend, requires very deliberate architecture that's still being refined.",
        result: "Currently under active development. The LangGraph agent backbone and task execution pipeline are being built out, with the React UI wired up to visualize agent state in real time. Think Flow represents a shift from building AI-assisted tools to building AI-driven systems — where the model isn't just answering, it's planning and acting."
    }
};

// ================= MODAL LOGIC =================
(function () {
    const modal = document.getElementById('case-study-modal');
    const modalContent = document.getElementById('cs-modal-content');
    const closeBtn = document.getElementById('cs-modal-close');

    if (!modal || !modalContent || !closeBtn) return;

    function renderCaseStudy(data) {
        const techPills = data.tech.map(t => `<span>${t}</span>`).join('');

        modalContent.innerHTML = `
            <div class="cs-header">
                <h2>${data.title}</h2>
                <span class="cs-status-badge">${data.status}</span>
            </div>
            <p class="cs-tagline">A closer look at what this project actually solves, how it was built, and what got in the way.</p>

            <div class="cs-tech-stack">${techPills}</div>

            <div class="cs-block">
                <div class="cs-block-label"><i class='bx bx-error-circle'></i> Problem</div>
                <p>${data.problem}</p>
            </div>

            <div class="cs-block">
                <div class="cs-block-label"><i class='bx bx-bulb'></i> Approach</div>
                <p>${data.approach}</p>
            </div>

            <div class="cs-block">
                <div class="cs-block-label"><i class='bx bx-error'></i> Challenges Faced</div>
                <p>${data.challenges}</p>
            </div>

            <div class="cs-block">
                <div class="cs-block-label"><i class='bx bx-trophy'></i> Result</div>
                <p>${data.result}</p>
            </div>
        `;
    }

    function openModal(key) {
        const data = caseStudiesData[key];
        if (!data) return;

        renderCaseStudy(data);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalContent.scrollTop = 0;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.case-study-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            openModal(key);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();