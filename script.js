const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const sections = document.querySelectorAll('section');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');

// ===== GSAP Custom Cursor Animation =====
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power3.out"
    });
});


// Optional: Add hover effect on clickable elements
const hoverTargets = document.querySelectorAll("a, button, .btn, .overview-btn");

hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", function () {
        gsap.to(cursor, {
            // scale: 4,
            backgroundColor: "orange"
        })
    });
    el.addEventListener("mouseleave", function () {
        gsap.to(cursor, {
            // scale: 1,
            backgroundColor: "orange"
        })
    }
    );
});

// GSAP Animation ends here


menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

const activePage = () => {
    const header = document.querySelector('header');
    const barsBox = document.querySelector('.bars-box');

    header.style.animationDelay = '0s';
    barsBox.style.animationDelay = '0s';

    header.classList.remove('active');
    // setTimeout(() => { // for delay to opening website
    //     header.classList.add('active');
    // }, 1100);

    header.classList.add('active'); // fast opening website


    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    barsBox.classList.remove('active');
    // setTimeout(() => { // for delay to opening website
    //     barsBox.classList.add('active');
    // }, 1100);

    barsBox.classList.add('active'); // fast opening website


    sections.forEach(section => {
        section.classList.remove('active');
        section.style.animationDelay = '0s';
    });

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
}

navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('active')) {
            activePage();
            link.classList.add('active');

            // setTimeout(() => { // for delay to opening website
            //     sections[idx].classList.add('active');
            // }, 1100);

            // sections[idx].classList.add('active'); // for fast opening
            setTimeout(() => {
                sections[idx].classList.add('active');
            }, 1200);

        }
    });
});

logoLink.addEventListener('click', () => {
    if (!navLinks[0].classList.contains('active')) {
        activePage();
        navLinks[0].classList.add('active');

        // setTimeout(() => { // for delay to opening website
        //     sections[0].classList.add('active');
        // }, 1100);

        // sections[0].classList.add('active'); // for fast opening

        setTimeout(() => {
            sections[0].classList.add('active');
        }, 1200);
    }
});

const overviewBtns = document.querySelectorAll('.overview-btn');

overviewBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const overviewDetails = document.querySelectorAll('.overview-detail');

        overviewBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        btn.classList.add('active');

        overviewDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        overviewDetails[idx].classList.add('active');
    });
});

/* ===== Overview Mobile Dropdown Logic ===== */
const overviewDropdown = document.querySelector(".overview-dropdown");
const overviewButtonsBox = document.querySelector(".overview-buttons");

if (overviewDropdown && overviewButtonsBox) {

    // Toggle dropdown
    overviewDropdown.addEventListener("click", () => {
        overviewButtonsBox.classList.toggle("open");
        overviewDropdown.classList.toggle("open");
    });

    // Close dropdown on button click (MOBILE ONLY)
    overviewBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                overviewButtonsBox.classList.remove("open");
                overviewDropdown.classList.remove("open");

                // Update dropdown title text
                const title = overviewDropdown.querySelector(".dropdown-title");
                title.textContent = btn.textContent;
            }
        });
    });
}



const arrowRight = document.querySelector('.project-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.project-box .navigation .arrow-left');

const projectDetails = document.querySelectorAll('.project-detail');
const totalItems = projectDetails.length;

let index = 0;

const activeProject = () => {
    const imgSlide = document.querySelector('.project-carousel .img-slide');


    imgSlide.style.transform = `translateX(calc(${index * -100}% - ${index * 2}rem))`;

    projectDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    projectDetails[index].classList.add('active');
    arrowLeft.classList.toggle('disabled', index === 0);
    arrowRight.classList.toggle('disabled', index === totalItems - 1);
}

arrowRight.addEventListener('click', () => {
    if (index < totalItems - 1) {
        index++;
        activeProject();
        arrowLeft.classList.remove('disabled');
    }
    else {
        // when we add a new project then update this index when we upload 12 projects the index value should be 11 (projects-1)
        // index = 19;
        index = 6;
        arrowRight.classList.add('disabled');
    }

    activeProject();
});

arrowLeft.addEventListener('click', () => {
    if (index > 1) {
        index--;
        activeProject();
        arrowRight.classList.remove('disabled');
    }
    else {
        index = 0;
        arrowLeft.classList.add('disabled');
    }

    activeProject();
});



// ================= EASTER EGG TERMINAL LOGIC =================
const terminalUI = document.getElementById('terminal-ui');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const closeTerminal = document.getElementById('close-terminal');

// Open terminal with `~` or `Ctrl + J` (Desktop open)
window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~' || (e.ctrlKey && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
        terminalUI.classList.toggle('terminal-hidden');
        if (!terminalUI.classList.contains('terminal-hidden')) {
            setTimeout(() => terminalInput.focus(), 100);
        }
    }
});

// Open terminal with Double Click/Tap on the Logo (Mobile Friendly)
document.querySelector('.logo').addEventListener('dblclick', (e) => {
    e.preventDefault();
    terminalUI.classList.toggle('terminal-hidden');
    if (!terminalUI.classList.contains('terminal-hidden')) {
        setTimeout(() => terminalInput.focus(), 100);
    }
});

// Close terminal button
closeTerminal.addEventListener('click', () => {
    terminalUI.classList.add('terminal-hidden');
});

// Execute command on Enter
terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (command) processCommand(command);
    }
});

function processCommand(cmd) {
    // Print User Command
    const newOutput = document.createElement('p');
    newOutput.innerHTML = `<span style="color:var(--main-color)">harsh@portfolio:~$</span> <span style="color:#fff">${cmd}</span>`;
    terminalBody.appendChild(newOutput);

    // Welcome message ka HTML jo clear hone ke baad bhi rahega
    const welcomeMessage = `
        <p style="color: var(--main-color);">Welcome to Harsh's Terminal! 🚀</p>
        <p>Type 'help' or 'commands' to see available commands.</p>
    `;

    const response = document.createElement('p');
    response.style.color = "#ddd";

    switch (cmd) {
        // ==========================================
        // 1. PROFILE & INFO COMMANDS
        // ==========================================
        case 'whoami':
            response.innerText = "> Harsh Pandey | B.Tech CSE | MERN Stack Developer";
            break;

        case 'skills':
            response.innerHTML = "> Tech Stack:<br>&nbsp;&nbsp; Frontend: React.js, Tailwind CSS, HTML/CSS/JS<br>&nbsp;&nbsp; Backend: Node.js, Express.js<br>&nbsp;&nbsp; Database: MongoDB, MySQL<br>&nbsp;&nbsp; Core: C++, Java, DSA";
            break;

        case 'college':
            response.innerHTML = "> Degree: B.Tech in Computer Science & Engineering (CSE)<br>> College: Kanpur Institute of Technology<br>> Duration: Sept 2023 - Present<br>> CGPA: 8.66";
            break;

        case 'school':
            response.innerHTML = "> Intermediate (12th): 2022 - 2023<br>> High School (10th): 2021 - 2022<br>> School: Saraswati Vidya Mandir School";
            break;

        case 'work':
            response.innerHTML = "> Role: Full Stack Developer Intern<br>> Company: ModelSuite.ai<br>> Duration: July 2026 - Present<br>> Work: Building AI-powered automation solutions.";
            break;

        case 'certifications':
            response.innerHTML = "> Top Certifications:<br>&nbsp;&nbsp; - CyberSecurity (Unstop)<br>&nbsp;&nbsp; - C++, HTML & CSS (LetsUpgrade)<br>&nbsp;&nbsp; - Python, SQL (Cognitive Class)<br>&nbsp;&nbsp; - Figma Bootcamp";
            break;

        case 'location':
            response.innerText = "> Current Location: Lal Bangla, Kanpur, Uttar Pradesh, India 📍";
            break;

        // ==========================================
        // 2. NAVIGATION & LINK COMMANDS
        // ==========================================
        case 'home':
            response.innerText = "> Returning to base... Navigating to Home!";
            document.querySelector('a[href="#intro"]').click();
            break;

        case 'overview':
            response.innerText = "> Fetching overview... Navigating you there!";
            document.querySelector('a[href="#overview"]').click();
            break;

        case 'projects':
            response.innerText = "> Fetching latest projects... Navigating you there!";
            document.querySelector('a[href="#project"]').click();
            break;

        case 'services':
            response.innerText = "> Fetching services... Navigating you there!";
            document.querySelector('a[href="#services"]').click();
            break;

        case 'contact':
            response.innerText = "> Opening communication channels...";
            document.querySelector('a[href="#connect"]').click();
            break;

        case 'socials':
            response.innerHTML = "> Connect with me:<br>&nbsp;&nbsp; GitHub: /Harsh28Pandey<br>&nbsp;&nbsp; LinkedIn: /in/harsh28pandey<br>&nbsp;&nbsp; X (Twitter): /pandey28harsh<br>&nbsp;&nbsp; Instagram: /pandey28harsh";
            break;

        case 'github':
            response.innerText = "> Redirecting to GitHub...";
            window.open("https://github.com/Harsh28Pandey", "_blank");
            break;

        case 'linkedin':
            response.innerText = "> Redirecting to LinkedIn...";
            window.open("https://www.linkedin.com/in/harsh28pandey/", "_blank");
            break;

        case 'resume':
        case 'cv':
            response.innerText = "> Initializing download sequence...";
            window.open("https://drive.google.com/file/d/1HFUKZR8k2OoCshMwO9cbcN1iHVHkTfWJ/view?usp=sharing", "_blank");
            break;

        // ==========================================
        // 3. SYSTEM & UTILITY COMMANDS
        // ==========================================
        case 'ls':
            response.innerHTML = "> Directory listing:<br>&nbsp;&nbsp; <span style='color: #27c93f'>intro/</span> &nbsp; <span style='color: #27c93f'>services/</span> &nbsp; <span style='color: #27c93f'>overview/</span> &nbsp; <span style='color: #27c93f'>projects/</span> &nbsp; <span style='color: #27c93f'>connect/</span>";
            break;

        case 'date':
            response.innerText = `> System Time: ${new Date().toLocaleString()}`;
            break;

        case 'pwd':
            response.innerText = "> /home/harsh28pandey/portfolio";
            break;

        case 'ping':
            response.innerText = "> Pong! 🏓 0% packet loss. Connection stable.";
            break;

        case 'theme':
            response.innerText = "> Theme is currently locked to Dark/Orange Mode by the admin. 🎃";
            break;

        case 'clear':
        case 'cls':
            terminalBody.innerHTML = welcomeMessage;
            return;

        case 'exit':
            response.innerText = "> Closing terminal...";
            terminalBody.appendChild(response);
            setTimeout(() => terminalUI.classList.add('terminal-hidden'), 500);
            return;

        // ==========================================
        // 4. DEVELOPER UTILITIES (New Section Added)
        // ==========================================
        case 'neofetch':
            response.innerHTML = `
            <div style="display:flex; gap: 15px; margin-top: 5px;">
                <div style="color: var(--main-color); font-family: monospace; line-height: 1.2;">
                    &nbsp;__&nbsp;&nbsp;__<br>
                    &nbsp;/ / / /<br>
                    / /_/ / <br>
                    / __&nbsp;&nbsp;/ <br>
                    /_/ /_/&nbsp;&nbsp;
                </div>
                <div>
                    <span style="color: var(--main-color); font-weight: bold;">harsh@portfolio</span><br>
                    -------------------------<br>
                    <span style="color: var(--main-color);">OS:</span> WebOS (Browser)<br>
                    <span style="color: var(--main-color);">Host:</span> MERN Stack Instance<br>
                    <span style="color: var(--main-color);">Packages:</span> 42 (npm)<br>
                    <span style="color: var(--main-color);">Shell:</span> Bash-like (JS)
                </div>
            </div>`;
            break;

        case 'git status':
        case 'git':
            response.innerHTML = `> On branch main<br>> Your branch is up to date with 'origin/main'.<br>> <span style="color:#27c93f;">nothing to commit, working tree clean</span>`;
            break;

        case 'uptime':
            let upSeconds = Math.floor(performance.now() / 1000);
            let upMins = Math.floor(upSeconds / 60);
            response.innerText = `> up ${upMins} minutes, ${upSeconds % 60} seconds, load average: 0.01, 0.02, 0.00`;
            break;

        case 'curl':
            response.innerHTML = `> Fetching API data...<br><span style="color:#27c93f;">{<br>&nbsp;&nbsp;"status": 200,<br>&nbsp;&nbsp;"message": "Welcome to my portfolio backend!",<br>&nbsp;&nbsp;"developer": "Harsh Pandey"<br>}</span>`;
            break;

        case 'vim':
        case 'nano':
            response.innerText = "> Warning: You cannot escape Vim. Just kidding! Use 'exit' to close terminal.";
            break;

        // ==========================================
        // 5. MINI GAMES (Fun Section)
        // ==========================================
        case 'coin':
            const toss = Math.random() < 0.5 ? 'Heads' : 'Tails';
            response.innerText = `> Tossing a coin... It's ${toss}! 🪙`;
            break;

        case 'roll':
            const dice = Math.floor(Math.random() * 6) + 1;
            response.innerText = `> Rolling a dice... You got a ${dice}! 🎲`;
            break;

        // ==========================================
        // 6. EXTRA FUN & UTILITY COMMANDS
        // ==========================================
        case 'joke':
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
                "How many programmers does it take to change a light bulb? None, that's a hardware problem. 💡",
                "There are 10 types of people in the world: those who understand binary, and those who don't. 🔢",
                "I would love to change the world, but they won't give me the source code. 🌍",
                "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?' 🍻"
            ];
            response.innerText = "> " + jokes[Math.floor(Math.random() * jokes.length)];
            break;

        case 'weather':
            response.innerHTML = "> Fetching weather for Kanpur, UP...<br>&nbsp;&nbsp; 🌤️ Status: Mostly Sunny<br>&nbsp;&nbsp; 🌡️ Temp: 32°C (Perfect for coding!)<br>&nbsp;&nbsp; 💧 Humidity: 65%<br>&nbsp;&nbsp; 💻 Recommendation: Grab a coffee and write some code.";
            break;

        case 'hire':
        case 'hireme':
            response.innerHTML = "> 🎯 <b>Why Hire Me?</b><br>> - Proficient in MERN Stack & C++<br>> - Strong Data Structures & Algorithms (DSA)<br>> - Quick learner & problem solver<br>> Type <b>'contact'</b> to get in touch!";
            break;

        // ==========================================
        // 7. HELP COMMAND (Updated with Mini Games)
        // ==========================================
        case 'help':
        case 'commands':
            response.innerHTML = `> Available commands:<br><br>
            <span style="color: var(--main-color);">// --- Profile & Info ---</span><br>
            &nbsp;&nbsp; whoami, skills, college, school, work, certifications, location<br><br>
            <span style="color: var(--main-color);">// --- Navigation & Links ---</span><br>
            &nbsp;&nbsp; home, overview, services, projects, contact, socials, github, linkedin, resume, cv<br><br>
            <span style="color: var(--main-color);">// --- Developer Utilities ---</span><br>
            &nbsp;&nbsp; neofetch, git, git status, uptime, curl, vim, nano<br><br>
            <span style="color: var(--main-color);">// --- Mini Games ---</span><br>
            &nbsp;&nbsp; coin, roll, rps [rock/paper/scissors]<br><br>
            <span style="color: var(--main-color);">// --- Fun & Extra ---</span><br>
            &nbsp;&nbsp; joke, weather, hireme<br><br>
            <span style="color: var(--main-color);">// --- System Utility ---</span><br>
            &nbsp;&nbsp; ls, date, pwd, ping, theme, echo, clear, cls, exit, help, commands`;
            break;

        // ==========================================
        // 8. DEFAULT / INVALID COMMANDS / COMPLEX GAMES
        // ==========================================
        default:
            if (cmd.startsWith("sudo ")) {
                response.style.color = "#ffbd2e";
                response.innerText = "> Nice try hacker! This incident will be reported. 🚨";
            } else if (cmd.startsWith("echo ")) {
                response.innerText = "> " + cmd.substring(5);
            } else if (cmd.startsWith("rps ")) {
                // Rock Paper Scissors Game Logic
                const userChoice = cmd.split(" ")[1];
                const choices = ['rock', 'paper', 'scissors'];

                if (!choices.includes(userChoice)) {
                    response.style.color = "#ffbd2e";
                    response.innerText = "> Invalid choice! Play by typing: rps rock, rps paper, or rps scissors";
                } else {
                    const botChoice = choices[Math.floor(Math.random() * 3)];
                    let result = "";

                    if (userChoice === botChoice) result = "It's a tie! 🤝";
                    else if (
                        (userChoice === 'rock' && botChoice === 'scissors') ||
                        (userChoice === 'paper' && botChoice === 'rock') ||
                        (userChoice === 'scissors' && botChoice === 'paper')
                    ) {
                        result = "You win! 🎉";
                        response.style.color = "#27c93f"; // Green for win
                    } else {
                        result = "I win! 😈";
                        response.style.color = "#ff5f56"; // Red for lose
                    }

                    response.innerHTML = `> You chose: <b>${userChoice}</b><br>> I chose: <b>${botChoice}</b><br>> Result: ${result}`;
                }
            } else {
                response.style.color = "#ff5f56";
                response.innerText = `> Command not found: ${cmd}. Type 'help' to see valid commands.`;
            }
    }

    terminalBody.appendChild(response);

    // Auto-scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}



// window.addEventListener("load", () => {
//     const loader = document.getElementById("loader");

//     // Fade out loader
//     loader.style.opacity = "0";

//     // After 500ms (transition time), hide it from layout
//     setTimeout(() => {
//         loader.style.visibility = "hidden";
//     }, 500);
// });