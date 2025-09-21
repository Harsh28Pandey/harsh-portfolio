// Function to show loader
function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.visibility = 'visible';
    loader.style.opacity = '1';
}

// Function to hide loader with fadeout
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.visibility = 'hidden';
    }, 600);
}

// On initial page load: keep loader visible for minimum time
window.addEventListener('load', () => {
    const minDisplayTime = 1500; // ms
    const loadTime = performance.now();
    const elapsed = loadTime - performance.timing.navigationStart;
    const remaining = Math.max(minDisplayTime - elapsed, 0);

    setTimeout(() => {
        hideLoader();
    }, remaining);
});

// Add loader show/hide on nav link clicks
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault(); // Prevent default anchor behavior

        showLoader();

        // Simulate page/section load delay (e.g. 1.5 sec)
        setTimeout(() => {
            hideLoader();

            // After loader, you can add your logic to switch sections or navigate
            // For demo, we just update active class

            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Add your section switching code here if you have sections
            // Example:
            // const sections = document.querySelectorAll('section');
            // sections.forEach(s => s.classList.remove('active'));
            // sections[idx].classList.add('active');

        }, 1500);
    });
});