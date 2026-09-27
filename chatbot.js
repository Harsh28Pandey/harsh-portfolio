(function () {
    'use strict';
    const externalConfig = (typeof window !== 'undefined' && window.CHATBOT_CONFIG) ? window.CHATBOT_CONFIG : {};
    const rawKey = (externalConfig.GROQ_API_KEY || "");

    const CONFIG = {
        GROQ_API_KEY: rawKey,
        GROQ_MODELS: [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "openai/gpt-oss-120b"
        ],
        GROQ_ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",
        RESUME_URL: (externalConfig.RESUME_URL),
        MAX_TOKENS: 500,
        TEMPERATURE: 0.4,
        DESKTOP_BREAKPOINT: 1024 
    };

    if (CONFIG.GROQ_API_KEY && !CONFIG.GROQ_API_KEY.startsWith("gsk_")) {
        console.warn(
            "Harsh AI chatbot: the GROQ_API_KEY in config.js doesn't start with 'gsk_' — " +
            "double-check you copied the full key correctly from console.groq.com/keys."
        );
    }

    const KNOWLEDGE_BASE = `
You are "Ask AI" — a friendly, concise assistant embedded on Harsh Pandey's personal portfolio website.
You must answer visitor questions using ONLY the information given below (Harsh's resume + portfolio content).
If something is not covered by this information, politely say you don't have that detail and suggest the visitor
contact Harsh directly via email or the Connect section, or check his resume. Never make up facts. Keep answers
short, clear, and professional, using a friendly tone. Use first-person plural style like "Harsh has..." /
"He specializes in..." — you are representing Harsh, not pretending to literally be him.

=== BASIC INFO ===
Name: Harsh Pandey
Role: Full Stack Developer (MERN Stack), Final Year B.Tech CSE Student
Location: Lal Bangla, Kanpur, Uttar Pradesh, India
Email: harsh28.knp@gmail.com
Phone: +91 95699 10421
Resume (Google Drive link): ${CONFIG.RESUME_URL}
Freelance: Available | Part-time: Available | Remote work: Available
Languages: English, Hindi

=== EDUCATION ===
- B.Tech in Computer Science & Engineering (CSE), Kanpur Institute of Technology, Sept 2023 - Present, CGPA 8.66
- Intermediate (12th), Saraswati Vidya Mandir School, 2022-2023
- High School (10th), Saraswati Vidya Mandir School, 2021-2022

=== EXPERIENCE ===
- Full Stack Developer Intern at ModelSuite.ai (July 2026 - Present) — building AI-powered automation solutions.

=== SKILLS ===
Frontend: HTML5, CSS3, JavaScript, React.js, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB, MySQL
Core CS: C++, Java, Data Structures & Algorithms (DSA), OOPs, DBMS
Tools & Others: Git, GitHub, Visual Studio, JWT Authentication, Nodemailer, Postman API, Multer, Cloudinary, GSAP

=== SERVICES OFFERED ===
1. MERN Stack Development — full-stack web apps with MongoDB, Express.js, React.js, Node.js.
2. Frontend Development (React) — interactive, responsive UIs, hooks, reusable components, state management.
3. Backend Development — RESTful APIs, JWT auth, role-based access, secure MongoDB integration.
4. Data Structures & Algorithms — strong problem solving in C++, Java, Python, JavaScript.
5. Problem Solving — debugging, optimized code, real-world coding challenges.
6. Code Optimization — clean, maintainable, scalable code following best practices.

=== PROJECTS ===
1. Interview Prep AI (Live) — AI interview prep platform with role-specific questions & real-time feedback.
   Tech: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, JWT Authentication, Gemini API.
   Live: https://prepareinterview.vercel.app/ | GitHub: https://github.com/Harsh28Pandey/Interview-Prep-AI

2. Collab Flow (Live) — Team task manager for creating, assigning and tracking tasks in real time.
   Tech: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Framer Motion, REST API, JWT + OTP Authentication.
   Live: https://collaspace.netlify.app/ | GitHub: https://github.com/Harsh28Pandey/collab-flow

3. Quick Chat App (Live) — Real-time MERN stack chat app with instant messaging.
   Tech: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, JWT Authentication, Socket.io.
   Live: https://qchatty.vercel.app/login | GitHub: https://github.com/Harsh28Pandey/QuickChat

4. Gen AI Interview Platform (Live) — Upload JD, resume & self-intro to get a resume score and personalized
   interview questions + prep plan.
   Tech: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Grok API.
   GitHub: https://github.com/Harsh28Pandey/gen-ai-interview

5. Library Management System (Completed) — Desktop app for book inventory, member records, issue/return tracking.
   Tech: Python, Tkinter, SQLite.
   GitHub: https://github.com/Harsh28Pandey/Library-Management

6. Dynamic Website (Live) — Fast, interactive website with real-time content updates.
   Tech: HTML5, CSS3, JavaScript.
   Live: https://dynamiclive.netlify.app/ | GitHub: https://github.com/Harsh28Pandey/Dynamic-Website

7. Car Purchase Website (Live) — Browse cars by category: luxury, SUV, van, electric.
   Tech: HTML5, CSS3, JavaScript.
   Live: https://car-purchase.netlify.app/ | GitHub: https://github.com/Harsh28Pandey/Car-Purchase-Website

Under active development: "RepoSense" (multi-agent LangGraph platform for README generation & PR review) and
"Think Flow" (autonomous AI agent/workflow platform) — both using React.js, Node.js, Express.js, MongoDB,
Tailwind CSS, LangChain, LangGraph, Redis, Microservices.

=== CERTIFICATIONS / ACHIEVEMENTS ===
- CyberSecurity Quiz — Unstop (March 2025)
- HTML & CSS Bootcamp — LetsUpgrade (Jan 2025)
- C++ Bootcamp — LetsUpgrade (Jan 2025)
- Python Essentials — Unstop (Jan 2025)
- SQL & Relational Databases — Cognitive Class (Jan 2025)
- Python 101 for Data Science — Cognitive Class (Dec 2024)
- Tata Cybersecurity Analyst Job Simulation — Forage (Nov 2024)
- Figma Bootcamp — LetsUpgrade (Oct 2024)

=== CODING PROFILES ===
- LeetCode: https://leetcode.com/u/harsh28pandey/ (230+ problems solved)
- GeeksForGeeks: https://www.geeksforgeeks.org/user/harsh28pandey/ (190+ problems solved)
- HackerRank: https://www.hackerrank.com/profile/harsh28pandey
- InterviewBit: https://www.interviewbit.com/profile/harsh-pandey_624/
- Coding Ninjas / Code360: https://www.naukri.com/code360/profile/hpandey
- Codolio: https://codolio.com/profile/harsh28pandey

=== SOCIAL / CONTACT LINKS ===
- GitHub: https://github.com/Harsh28Pandey
- LinkedIn: https://www.linkedin.com/in/harsh28pandey/
- Instagram: https://www.instagram.com/pandey28harsh
- X (Twitter): https://www.x.com/pandey28harsh
- YouTube: https://www.youtube.com/@harsh28pandey
- Facebook: https://www.facebook.com/pandey28harsh

=== ABOUT ===
Harsh is a highly driven CSE student at Kanpur Institute of Technology (8.66 CGPA) with a strong passion for
software engineering. He specializes in DSA (C++), OOPs, DBMS, and is a skilled MERN Stack Developer who builds
robust backends (Node.js/Express), scalable databases (MongoDB/MySQL), and high-performance React.js/Tailwind CSS
frontends. He has hands-on experience with role-based access control (RBAC), JWT authentication, and integrating
AI-driven features into real products. He has completed 12+ projects and is available for freelance, part-time,
and remote work.
`

    function isDesktop() {
        return window.innerWidth >= CONFIG.DESKTOP_BREAKPOINT;
    }

    if (!isDesktop()) {
        return;
    }

    const root = document.createElement('div');
    root.id = 'ai-chatbot-root';
    root.innerHTML = `
        <button id="chatbot-toggle-btn" type="button" aria-label="Open chat with Ask AI">
            <i class='bx bx-message-rounded-dots bx-chat-icon'></i>
            <i class='bx bx-x bx-x-icon'></i>
            <span class="chatbot-ping" id="chatbot-ping"></span>
        </button>

        <div id="chatbot-window">
            <div id="chatbot-header">
                <div class="chatbot-avatar"><i class='bx bx-bot'></i></div>
                <div class="chatbot-title-box">
                    <h4>Ask AI</h4>
                    <span>Online — ask me anything</span>
                </div>
                <button id="chatbot-close-btn" type="button" aria-label="Close chat">
                    <i class='bx bx-x'></i>
                </button>
            </div>

            <div id="chatbot-messages"></div>

            <div id="chatbot-suggestions">
                <button class="chatbot-chip" type="button" data-q="What are Harsh's main skills?">Skills?</button>
                <button class="chatbot-chip" type="button" data-q="Tell me about Harsh's best project.">Best project?</button>
                <button class="chatbot-chip" type="button" data-q="Can I see Harsh's resume?">Resume?</button>
                <button class="chatbot-chip" type="button" data-q="How can I contact Harsh?">Contact info?</button>
            </div>

            <div id="chatbot-input-row">
                <textarea id="chatbot-input" rows="1" placeholder="Ask about anything..."></textarea>
                <button id="chatbot-send-btn" type="button" aria-label="Send message">
                    <i class='bx bx-send'></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(root);

    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const messagesBox = document.getElementById('chatbot-messages');
    const suggestionsBox = document.getElementById('chatbot-suggestions');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const pingDot = document.getElementById('chatbot-ping');

    let hasOpenedOnce = false;
    let isSending = false;

    const conversationHistory = [];
    const MAX_HISTORY_MESSAGES = 12;

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s<>"]+)/g;
        return text.replace(urlRegex, (url) => {
            const clean = url.replace(/[.,)>]+$/, '');
            return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${clean}</a>`;
        });
    }

    function formatBotMessage(text) {
        let html = escapeHTML(text);
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        html = html.replace(/^[-*]{3,}$/gm, '<hr>');

        html = html.replace(/^(?:[*-]) (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>[\s\S]*?<\/li>)(\n<li>[\s\S]*?<\/li>)*/g, (m) => `<ul>${m}</ul>`);

        html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
        html = html.replace(/(<oli>[\s\S]*?<\/oli>)(\n<oli>[\s\S]*?<\/oli>)*/g, (m) => {
            return '<ol>' + m.replace(/<\/?oli>/g, match => match === '<oli>' ? '<li>' : '</li>') + '</ol>';
        });

        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        html = linkify(html);

        const blocks = html.split(/\n{2,}/);
        html = blocks.map(block => {
            block = block.trim();
            if (!block) return '';
            if (/^<(h[123]|ul|ol|hr|li)/.test(block)) return block;
            return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
        }).join('\n');

        return html;
    }

    function appendMessage(role, text) {
        const msgEl = document.createElement('div');
        msgEl.className = `chatbot-msg ${role}`;
        if (role === 'bot') {
            msgEl.innerHTML = formatBotMessage(text);
        } else {
            msgEl.innerHTML = linkify(escapeHTML(text));
        }
        messagesBox.appendChild(msgEl);
        messagesBox.scrollTop = messagesBox.scrollHeight;
        return msgEl;
    }

    function showTyping() {
        let typingEl = document.getElementById('chatbot-typing');
        if (!typingEl) {
            typingEl = document.createElement('div');
            typingEl.id = 'chatbot-typing';
            typingEl.innerHTML = '<span></span><span></span><span></span>';
        }
        messagesBox.appendChild(typingEl);
        typingEl.classList.add('show');
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    function hideTyping() {
        const typingEl = document.getElementById('chatbot-typing');
        if (typingEl) typingEl.classList.remove('show');
    }

    function setSendingState(state) {
        isSending = state;
        sendBtn.disabled = state;
        input.disabled = state;
    }

    function openChat() {
        root.classList.add('open');
        if (pingDot) pingDot.style.display = 'none';

        if (!hasOpenedOnce) {
            hasOpenedOnce = true;
            appendMessage('bot', "Hi! I'm Ask AI... Ask me anything about Harsh's skills, projects, resume, or experience.");
        }
        setTimeout(() => input.focus(), 300);
    }

    function closeChat() {
        root.classList.remove('open');
    }

    toggleBtn.addEventListener('click', () => {
        root.classList.contains('open') ? closeChat() : openChat();
    });
    closeBtn.addEventListener('click', closeChat);

    document.addEventListener('click', (e) => {
        if (!root.classList.contains('open')) return;
        if (root.contains(e.target)) return;
        closeChat();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && root.classList.contains('open')) closeChat();
    });

    suggestionsBox.addEventListener('click', (e) => {
        const chip = e.target.closest('.chatbot-chip');
        if (!chip) return;
        const question = chip.getAttribute('data-q');
        input.value = question;
        sendMessage();
    });

    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 90) + 'px';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    async function requestGroqOnce(modelId, messages) {
        let response;
        try {
            response = await fetch(CONFIG.GROQ_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: messages,
                    max_tokens: CONFIG.MAX_TOKENS,
                    temperature: CONFIG.TEMPERATURE
                })
            });
        } catch (networkErr) {
            console.error('Ask AI chatbot — network-level fetch failure:', networkErr);
            const tagged = new Error('NETWORK_ERROR');
            tagged.cause = networkErr;
            throw tagged;
        }

        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            console.error(`Ask AI chatbot — Groq responded ${response.status} for model "${modelId}":`, errBody);
            const httpErr = new Error(`GROQ_HTTP_${response.status}: ${errBody}`);
            httpErr.status = response.status;
            throw httpErr;
        }

        const data = await response.json();
        const reply = data && data.choices && data.choices[0] && data.choices[0].message
            ? data.choices[0].message.content
            : null;

        if (!reply) {
            console.error('Ask AI chatbot — unexpected Groq response shape:', data);
            throw new Error("EMPTY_RESPONSE");
        }
        return reply.trim();
    }

    async function callGroq(userMessage) {
        if (!CONFIG.GROQ_API_KEY) {
            throw new Error("MISSING_API_KEY");
        }

        const messages = [
            { role: 'system', content: KNOWLEDGE_BASE },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        let lastErr = null;

        for (const modelId of CONFIG.GROQ_MODELS) {
            try {
                return await requestGroqOnce(modelId, messages);
            } catch (err) {
                lastErr = err;
                if (err && err.status === 404) {
                    console.warn(`Ask AI chatbot — model "${modelId}" unavailable, trying next fallback...`);
                    continue;
                }
                throw err;
            }
        }

        throw lastErr || new Error("ALL_MODELS_UNAVAILABLE");
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isSending) return;

        if (suggestionsBox && !suggestionsBox.classList.contains('hidden')) {
            suggestionsBox.classList.add('hidden');
        }

        appendMessage('user', text);
        input.value = '';
        input.style.height = 'auto';
        setSendingState(true);
        showTyping();

        try {
            const reply = await callGroq(text);

            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: reply });
            while (conversationHistory.length > MAX_HISTORY_MESSAGES) {
                conversationHistory.shift();
            }

            hideTyping();
            appendMessage('bot', reply);
        } catch (err) {
            hideTyping();
            console.error('Harsh AI chatbot error:', err);

            const msg = String(err && err.message || err);
            let friendlyMsg = "Sorry, something went wrong while getting a response. Please try again in a moment. (Open DevTools > Console for the exact error.)";

            if (msg.includes('MISSING_API_KEY')) {
                friendlyMsg = "Chatbot isn't fully set up yet — a Groq API key needs to be added in config.js.";
            } else if (msg.includes('NETWORK_ERROR')) {
                friendlyMsg = "Couldn't reach the Groq server — check your internet connection, or a browser extension (ad-blocker/privacy tool) may be blocking the request. See the browser console for details.";
            } else if (msg.includes('GROQ_HTTP_401') || msg.includes('GROQ_HTTP_403')) {
                friendlyMsg = "Chatbot authentication failed — the Groq API key in config.js looks invalid or expired. Generate a fresh one at console.groq.com/keys.";
            } else if (msg.includes('GROQ_HTTP_404')) {
                friendlyMsg = "The AI model configured for this chatbot isn't available on this Groq account — trying fallback models didn't work either. Please check the GROQ_MODELS list in chatbot.js against console.groq.com/docs/models.";
            } else if (msg.includes('ALL_MODELS_UNAVAILABLE')) {
                friendlyMsg = "None of the configured AI models are available right now — please check the GROQ_MODELS list in chatbot.js against console.groq.com/docs/models.";
            } else if (msg.includes('GROQ_HTTP_429')) {
                friendlyMsg = "I'm getting a lot of requests right now — please try again in a few seconds.";
            } else if (msg.includes('GROQ_HTTP_5')) {
                friendlyMsg = "Groq's servers are having a temporary issue on their end — please try again shortly.";
            } else if (msg.includes('EMPTY_RESPONSE')) {
                friendlyMsg = "Got an unexpected empty reply from the AI model — please try asking again.";
            }

            appendMessage('error', friendlyMsg);
        } finally {
            setSendingState(false);
            input.focus();
        }
    }

    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            root.style.display = 'none';
        } else {
            root.style.display = '';
        }
    });
})();