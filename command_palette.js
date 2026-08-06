/* ================================================= */
/* ADVANCED COMMAND PALETTE (Deep Search & AI)       */
/* ================================================= */

(function () {
    // if (window.innerWidth < 1024) return;  (works only on desktop not mobile devices)

    // 1. Create Palette HTML Elements
    const overlay = document.createElement('div');
    overlay.id = 'cmd-palette-overlay';

    overlay.innerHTML = `
        <div id="cmd-palette-modal">
            <div class="cmd-search-box">
                <i class='bx bx-search'></i>
                <input type="text" id="cmd-palette-input" placeholder="Type a command, search, or ask AI..." autocomplete="off">
                <span class="cmd-kbd">ESC</span>
            </div>
            <div id="cmd-palette-results">
                
                <!-- Inline AI Assistant Response Box -->
                <div id="cmd-ai-response" style="display: none; padding: 1.2rem 1.6rem; margin: 0.5rem 1.5rem 1.5rem 1.5rem; background: rgba(39, 201, 63, 0.08); border-radius: 1.2rem; border: 0.1rem solid rgba(39, 201, 63, 0.2); color: #ddd; font-size: 1.35rem; line-height: 1.5;">
                    <div style="display: flex; align-items: center; margin-bottom: 0.6rem; color: #27c93f; font-weight: 600; font-size: 1.45rem;">
                        <i class='bx bx-bot' style="font-size: 2rem; margin-right: 0.8rem;"></i> AI Assistant
                    </div>
                    <div id="cmd-ai-text"></div>
                </div>

                <div class="cmd-group-title">Navigation</div>
                <div class="cmd-item active" data-target="intro" data-search="intro home start beginning welcome harsh pandey">
                    <i class='bx bx-home-alt-2'></i><span class="cmd-text">Intro / Home</span><span class="cmd-shortcut">Section</span>
                </div>
                <div class="cmd-item" data-target="services" data-search="services backend frontend mern fullstack ui dev">
                    <i class='bx bx-code-block'></i><span class="cmd-text">Services</span><span class="cmd-shortcut">Section</span>
                </div>
                <div class="cmd-item" data-target="overview" data-search="overview about education experience certificates profiles achievements">
                    <i class='bx bx-compass'></i><span class="cmd-text">Overview & Details</span><span class="cmd-shortcut">Section</span>
                </div>
                <div class="cmd-item" data-target="project" data-search="projects work portfolio live apps showcase">
                    <i class='bx bx-briefcase-alt-2'></i><span class="cmd-text">Projects</span><span class="cmd-shortcut">Section</span>
                </div>
                <div class="cmd-item" data-target="nexode" data-search="nexode tech innovations explore play docs links">
                    <i class='bx bx-planet'></i><span class="cmd-text">Tech Innovations</span><span class="cmd-shortcut">Section</span>
                </div>
                <div class="cmd-item" data-target="connect" data-search="connect contact email phone message hire collaborate">
                    <i class='bx bx-envelope'></i><span class="cmd-text">Contact Me</span><span class="cmd-shortcut">Section</span>
                </div>
                
                <div class="cmd-group-title">Quick Actions & Links</div>
                <div class="cmd-item" data-action="resume" data-search="resume cv download document pdf hire info">
                    <i class='bx bx-file'></i><span class="cmd-text">Download Resume</span><span class="cmd-shortcut">Action</span>
                </div>
                <div class="cmd-item" data-action="github" data-search="github code repository profile open source">
                    <i class='bx bxl-github'></i><span class="cmd-text">GitHub Profile</span><span class="cmd-shortcut">Link</span>
                </div>
                <div class="cmd-item" data-action="linkedin" data-search="linkedin connect profile professional network">
                    <i class='bx bxl-linkedin-square'></i><span class="cmd-text">LinkedIn Profile</span><span class="cmd-shortcut">Link</span>
                </div>
                <div class="cmd-item" data-action="facebook" data-search="facebook fb social media profile">
                    <i class='bx bxl-facebook-square'></i><span class="cmd-text">Facebook Profile</span><span class="cmd-shortcut">Link</span>
                </div>
                <div class="cmd-item" data-action="instagram" data-search="instagram insta social media profile">
                    <i class='bx bxl-instagram-alt'></i><span class="cmd-text">Instagram Profile</span><span class="cmd-shortcut">Link</span>
                </div>
                <div class="cmd-item" data-action="twitter" data-search="twitter x tweet social media profile">
                    <i class='bx bxl-twitter'></i><span class="cmd-text">X (Twitter) Profile</span><span class="cmd-shortcut">Link</span>
                </div>
                <div class="cmd-item" data-action="terminal" data-search="terminal cmd console command line prompt">
                    <i class='bx bx-terminal'></i><span class="cmd-text">Open Developer Terminal</span><span class="cmd-shortcut">Action</span>
                </div>

                <div class="cmd-group-title">Utilities & Sharing</div>
                <div class="cmd-item" data-action="copy" data-value="harsh28.knp@gmail.com" data-search="copy email contact address clipboard">
                    <i class='bx bx-copy'></i><span class="cmd-text">Copy Email Address</span><span class="cmd-shortcut">Utility</span>
                </div>
                <div class="cmd-item" data-action="copy" data-value="+919569910421" data-search="copy phone number mobile contact clipboard">
                    <i class='bx bx-phone-call'></i><span class="cmd-text">Copy Phone Number</span><span class="cmd-shortcut">Utility</span>
                </div>
                <div class="cmd-item" data-action="share-whatsapp" data-search="share whatsapp send forward portfolio">
                    <i class='bx bxl-whatsapp'></i><span class="cmd-text">Share via WhatsApp</span><span class="cmd-shortcut">Share</span>
                </div>
                <div class="cmd-item" data-action="share-linkedin" data-search="share linkedin post portfolio">
                    <i class='bx bxl-linkedin'></i><span class="cmd-text">Share on LinkedIn</span><span class="cmd-shortcut">Share</span>
                </div>
                <div class="cmd-item" data-action="share-twitter" data-search="share twitter x tweet portfolio">
                    <i class='bx bxl-twitter'></i><span class="cmd-text">Share on X (Twitter)</span><span class="cmd-shortcut">Share</span>
                </div>
                
                <div id="cmd-no-results" style="display: none; padding: 3rem 2rem; text-align: center; color: var(--disabled-color); font-size: 1.4rem;">
                    <i class='bx bx-ghost' style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i><br>
                    No sections or links found. Please check the AI response above!
                </div>
            </div>
            <div class="cmd-palette-footer">
                <span>Use <b>↑</b> <b>↓</b> to navigate</span>
                <span><b>Enter</b> to select / open</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // 2. Element Selectors
    const paletteInput = document.getElementById('cmd-palette-input');
    const paletteResults = document.getElementById('cmd-palette-results');
    const items = Array.from(paletteResults.querySelectorAll('.cmd-item'));
    const noResults = document.getElementById('cmd-no-results');
    const groupTitles = paletteResults.querySelectorAll('.cmd-group-title');
    const aiResponseBox = document.getElementById('cmd-ai-response');
    const aiText = document.getElementById('cmd-ai-text');
    let currentIndex = 0;

    // 3. Open / Close Logic
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            togglePalette(true);
        }
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            togglePalette(false);
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) togglePalette(false);
    });

    function togglePalette(open) {
        if (open) {
            overlay.classList.add('active');
            paletteInput.value = '';
            filterItems('');
            setTimeout(() => paletteInput.focus(), 50);
        } else {
            overlay.classList.remove('active');
            paletteInput.blur();
        }
    }

    // 4. Advanced Deep Search & AI Logic
    paletteInput.addEventListener('input', (e) => {
        filterItems(e.target.value);
    });

    // AI Knowledge Base & Utilities Function
    function generateAIResponse(query, hasSectionMatch) {
        const q = query.toLowerCase().trim();

        // Feature 2: Inline Mini Calculator
        // Regex to check if query is a mathematical equation
        const mathRegex = /^[0-9\s\+\-\*\/\(\)\.]+$/;
        if (mathRegex.test(q) && q.match(/[0-9]/) && q.match(/[\+\-\*\/]/)) {
            try {
                // Safe math evaluation
                const result = Function('"use strict";return (' + q + ')')();
                if (result !== undefined && !isNaN(result)) {
                    return `🧮 <b>Calculator:</b> ${query} = <span style="color:var(--main-color); font-size:1.6rem; font-weight:bold;">${result}</span>`;
                }
            } catch (e) {
                // Ignore incomplete math expressions
            }
        }

        // Feature 4: Live GitHub Contribution Graph
        if (q.includes("contribut") || q.includes("graph") || (q.includes("github") && (q.includes("chart") || q.includes("stat")))) {
            // using rshah API to render graph in the orange theme (ff8c00)
            return `Here is my real-time <b>GitHub Contribution Graph</b>:<br>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.5); border-radius: 0.8rem;">
                <img src="https://ghchart.rshah.org/ff8c00/Harsh28Pandey" alt="GitHub Contributions" style="width: 100%; filter: drop-shadow(0 0 5px rgba(255,140,0,0.3));">
            </div>`;
        }

        // Standard Text Responses
        const kb = {
            skill: "My technical skills (MERN Stack, C++, DSA) are located in the <b>Overview</b> section under the 'Skills' tab.",
            tech: "My technical skills (MERN Stack, C++, DSA) are located in the <b>Overview</b> section under the 'Skills' tab.",
            educat: "My educational background (B.Tech at KIT) is detailed in the <b>Overview</b> section.",
            college: "My educational background (B.Tech at KIT) is detailed in the <b>Overview</b> section.",
            school: "My schooling details are listed in the <b>Overview</b> section under the 'Education' tab.",
            experienc: "I am a Full Stack Developer Intern at ModelSuite.ai. See the 'Experience' tab in the <b>Overview</b> section.",
            intern: "I am a Full Stack Developer Intern at ModelSuite.ai. See the 'Experience' tab in the <b>Overview</b> section.",
            certificat: "My certifications are listed under the 'Achievements' tab in the <b>Overview</b> section.",
            hire: "I am open to work! You can reach out to me via the <b>Contact Me</b> section, or use the copy utility below.",
            job: "I am open to work! You can reach out to me via the <b>Contact Me</b> section.",
            project: "You can find my latest work like 'Interview Prep AI' and 'Collab Flow' in the <b>Projects</b> section.",
            contact: "You can find my phone number, email, and a contact form in the <b>Contact Me</b> section.",
            resume: "You can download my latest CV by selecting the 'Download Resume' action below.",
            terminal: "Select the 'Open Developer Terminal' option below to launch the command line."
        };

        for (let key in kb) {
            if (q.includes(key)) return kb[key];
        }

        if (!hasSectionMatch) {
            return `I couldn't find an exact match for "<b>${query}</b>". Try searching for 'projects', 'skills', 'education', computing math (e.g. '25 * 4'), or type 'graph'.`;
        }

        return `Showing results for "<b>${query}</b>". Select an option below to navigate directly to it!`;
    }

    function filterItems(query) {
        const terms = query.toLowerCase().split(' ').filter(t => t.trim() !== '');
        let visibleItems = [];
        let hasSectionMatch = false;

        // Process Static Items
        items.forEach(item => {
            const searchText = item.getAttribute('data-search').toLowerCase();
            const titleText = item.querySelector('.cmd-text').textContent.toLowerCase();
            const fullTarget = searchText + " " + titleText;

            // Deep Search: check if all typed words exist in the target
            const isMatch = terms.every(term => fullTarget.includes(term));

            if (isMatch || terms.length === 0) {
                item.style.display = 'flex';
                visibleItems.push(item);
                hasSectionMatch = true;
            } else {
                item.style.display = 'none';
            }
        });

        // AI Response Engine Activation
        if (terms.length > 0) {
            aiResponseBox.style.display = 'block';
            aiText.innerHTML = generateAIResponse(query, hasSectionMatch);
        } else {
            aiResponseBox.style.display = 'none';
        }

        // UI toggles
        groupTitles.forEach(title => title.style.display = terms.length > 0 ? 'none' : 'block');
        noResults.style.display = (!hasSectionMatch && terms.length > 0) ? 'block' : 'none';

        // Reset Selection (Default select top actionable item)
        items.forEach(i => i.classList.remove('active'));
        if (visibleItems.length > 0) {
            currentIndex = 0;
            visibleItems[0].classList.add('active');
        }
    }

    // 5. Keyboard Navigation
    paletteInput.addEventListener('keydown', (e) => {
        const visibleItems = items.filter(i => i.style.display !== 'none');
        if (visibleItems.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % visibleItems.length;
            updateSelection(visibleItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            updateSelection(visibleItems);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (visibleItems[currentIndex]) executeItem(visibleItems[currentIndex]);
        }
    });

    function updateSelection(visibleItems) {
        items.forEach(i => i.classList.remove('active'));
        visibleItems[currentIndex].classList.add('active');
        visibleItems[currentIndex].scrollIntoView({ block: 'nearest' });
    }

    // 6. Click support
    items.forEach(item => {
        item.addEventListener('click', () => executeItem(item));
    });

    // 7. Execution Logic
    function executeItem(item) {
        const target = item.getAttribute('data-target');
        const action = item.getAttribute('data-action');

        // Feature 1: Copy to Clipboard Logic
        if (action === 'copy') {
            const valueToCopy = item.getAttribute('data-value');
            navigator.clipboard.writeText(valueToCopy);

            // Temporary Success Animation
            const textSpan = item.querySelector('.cmd-text');
            const originalText = textSpan.innerText;
            textSpan.innerHTML = `<span style="color: #27c93f; font-weight: bold;">✅ Copied to clipboard!</span>`;

            setTimeout(() => {
                togglePalette(false);
                textSpan.innerText = originalText;
            }, 1000);
            return; // Exit here so it doesn't close instantly
        }

        togglePalette(false);

        // Feature 3: Quick Share Logic
        const portfolioUrl = encodeURIComponent(window.location.href);
        const shareMsg = encodeURIComponent("Check out Harsh Pandey's Developer Portfolio! 🚀 ");

        if (action === 'share-whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${shareMsg}${portfolioUrl}`, "_blank");
        } else if (action === 'share-twitter') {
            window.open(`https://twitter.com/intent/tweet?url=${portfolioUrl}&text=${shareMsg}`, "_blank");
        } else if (action === 'share-linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${portfolioUrl}`, "_blank");
        }

        // Standard Actions
        else if (target) {
            const section = document.querySelector(`#${target}`);
            const navLink = document.querySelector(`header nav a[href="#${target}"]`);
            if (navLink) navLink.click();
            else if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'resume') {
            window.open("https://drive.google.com/file/d/1HFUKZR8k2OoCshMwO9cbcN1iHVHkTfWJ/view?usp=sharing", "_blank");
        } else if (action === 'github') {
            window.open("https://github.com/Harsh28Pandey", "_blank");
        } else if (action === 'linkedin') {
            window.open("https://www.linkedin.com/in/harsh28pandey/", "_blank");
        } else if (action === 'facebook') {
            window.open("https://www.facebook.com/pandey28harsh", "_blank");
        } else if (action === 'instagram') {
            window.open("https://www.instagram.com/pandey28harsh", "_blank");
        } else if (action === 'twitter') {
            window.open("https://www.x.com/pandey28harsh", "_blank");
        } else if (action === 'terminal') {
            const terminalUI = document.getElementById('terminal-ui');
            if (terminalUI) terminalUI.classList.remove('terminal-hidden');
        }
    }
})();