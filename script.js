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

            sections[idx].classList.add('active'); // for fast opening

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

        sections[0].classList.add('active'); // for fast opening

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

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    // Fade out loader
    loader.style.opacity = "0";

    // After 500ms (transition time), hide it from layout
    setTimeout(() => {
        loader.style.visibility = "hidden";
    }, 500);
});