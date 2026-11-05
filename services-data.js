/* =====================================================
   SERVICES POPUP DATA
   Edit each service's content here. The order matches
   the services cards in index.html.
   `match` = text of the card's <h3> (auto-matched by title)
   ===================================================== */
window.SERVICES_DATA = [
    {
        id: "full-stack",
        match: "Full Stack Development",
        icon: "bx bx-code-alt",
        title: "Full Stack Development",
        tagline: "End-to-end MERN applications, from idea to live product.",
        description:
            "I build complete web applications where the frontend, backend, and database work together seamlessly. With clean architecture, secure authentication, and a scalable structure, your product runs fast today and keeps growing tomorrow.",
        offers: [
            "Complete MERN stack web applications",
            "Authentication & role-based access control (RBAC)",
            "Real-time features with Socket.io",
            "Third-party & AI API integrations",
            "Deployment on Vercel, Netlify, or Render"
        ],
        tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Tailwind CSS", "JWT", "Socket.io"],
        process: [
            { title: "Plan", text: "Finalize requirements, features, and database design." },
            { title: "Build", text: "Develop the frontend and backend APIs in parallel." },
            { title: "Test", text: "Fix bugs through Postman and manual testing." },
            { title: "Deploy", text: "Go live, then hand over with ongoing support." }
        ],
        deliverables: ["Source code (GitHub)", "Live deployed app", "API documentation"]
    },
    {
        id: "frontend",
        match: "Frontend Development",
        icon: "bx bxs-paint",
        title: "Frontend Development",
        tagline: "Fast, responsive, and smooth user interfaces.",
        description:
            "I create modern, pixel-perfect, fully responsive UIs with React.js. With reusable components, solid state management, and smooth animations, I keep the user experience top-notch from mobile to desktop.",
        offers: [
            "Responsive UI for every screen size",
            "Reusable React components & hooks",
            "State management (Context / Redux)",
            "Animations with GSAP & Framer Motion",
            "Figma design to code conversion"
        ],
        tech: ["React.js", "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "GSAP", "Framer Motion"],
        process: [
            { title: "Understand", text: "Study the design, brand, and user flow." },
            { title: "Componentize", text: "Break the UI into reusable components." },
            { title: "Polish", text: "Add animations, accessibility, and responsiveness." },
            { title: "Optimize", text: "Improve performance and load speed." }
        ],
        deliverables: ["Responsive website / web app", "Reusable component library", "Cross-browser tested UI"]
    },
    {
        id: "backend",
        match: "Backend Development",
        icon: "bx bx-palette",
        title: "Backend Development",
        tagline: "Secure, scalable REST APIs and server logic.",
        description:
            "I build robust REST APIs with Node.js and Express.js, including JWT authentication, role-based access, and MongoDB / MySQL database integration. The focus stays on security, speed, and maintainable code.",
        offers: [
            "RESTful API design & development",
            "JWT & OTP based authentication",
            "Role-based access control",
            "MongoDB & MySQL database modelling",
            "Email services with Nodemailer"
        ],
        tech: ["Node.js", "Express.js", "MongoDB", "MySQL", "JWT", "Nodemailer", "Postman", "Redis"],
        process: [
            { title: "Design", text: "Plan the API endpoints and database schema." },
            { title: "Develop", text: "Write controllers, routes, and middleware." },
            { title: "Secure", text: "Add validation, authentication, and error handling." },
            { title: "Document", text: "Document the APIs with a Postman collection." }
        ],
        deliverables: ["Production-ready REST APIs", "Database schema", "Postman collection"]
    },
    {
        id: "dsa",
        match: "Data Structures & Algorithms",
        icon: "bx bx-target-lock",
        title: "Data Structures & Algorithms",
        tagline: "Strong problem-solving and efficient logic.",
        description:
            "A strong command of DSA in C++, Java, Python, and JavaScript. From arrays, strings, recursion, trees, and graphs to dynamic programming and time & space complexity optimization, I design efficient solutions.",
        offers: [
            "Optimized solutions with time/space analysis",
            "Arrays, strings, linked lists, stacks & queues",
            "Recursion, backtracking & dynamic programming",
            "Trees, graphs & heaps",
            "Interview-focused problem solving"
        ],
        tech: ["C++", "Java", "Python", "JavaScript", "LeetCode", "GeeksforGeeks"],
        process: [
            { title: "Analyse", text: "Understand the problem and its constraints thoroughly." },
            { title: "Approach", text: "Move from brute force to the optimal approach." },
            { title: "Implement", text: "Write clean and readable code." },
            { title: "Optimize", text: "Reduce complexity and test edge cases." }
        ],
        deliverables: ["750+ LeetCode problems solved", "250+ GFG problems solved", "Clean, commented solutions"]
    },
    {
        id: "problem-solving",
        match: "Problem Solving",
        icon: "bx bx-laptop",
        title: "Problem Solving",
        tagline: "Practical solutions to real-world coding challenges.",
        description:
            "Logical thinking, debugging, root-cause analysis, and writing optimized code are my core strengths. Whether it's fixing a bug or simplifying a complex feature, I deliver a practical, step-by-step solution.",
        offers: [
            "Bug fixing & debugging",
            "Root-cause analysis",
            "Breaking big features into small tasks",
            "Refactoring messy code",
            "Quick prototyping of ideas"
        ],
        tech: ["Debugging", "Git", "GitHub", "VS Code", "Chrome DevTools", "Postman"],
        process: [
            { title: "Reproduce", text: "Reproduce the problem to understand it." },
            { title: "Isolate", text: "Narrow it down to the exact cause." },
            { title: "Fix", text: "Implement a clean fix." },
            { title: "Verify", text: "Re-test to prevent regressions." }
        ],
        deliverables: ["Working fix", "Clear explanation of the cause", "Preventive suggestions"]
    },
    {
        id: "code-optimization",
        match: "Code Optimization",
        icon: "bx bx-cog",
        title: "Code Optimization",
        tagline: "Clean, fast, and maintainable code.",
        description:
            "I refactor existing code to boost performance, reduce complexity, and follow best practices, so your software stays scalable and easy to maintain in the future.",
        offers: [
            "Performance tuning & profiling",
            "Reducing re-renders & bundle size",
            "Database query optimization",
            "Clean code & best practices",
            "Code review & refactoring"
        ],
        tech: ["Refactoring", "Lighthouse", "React Profiler", "MongoDB Indexing", "Caching", "Redis"],
        process: [
            { title: "Audit", text: "Find the slow parts and bottlenecks." },
            { title: "Refactor", text: "Make the code simple and modular." },
            { title: "Optimize", text: "Improve queries, rendering, and assets." },
            { title: "Measure", text: "Compare performance before and after." }
        ],
        deliverables: ["Optimized codebase", "Performance report", "Best-practice recommendations"]
    }
];