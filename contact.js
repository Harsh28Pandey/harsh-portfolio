// EmailJS Initialization
(function () {
    emailjs.init("Y-B32vg7fpWgror5p");
})();

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = "Sending... <i class='bx bx-loader-alt bx-spin'></i>";

    emailjs.sendForm('service_tnug5je', 'template_hxudcel', this)
        .then(function () {
            btn.innerHTML = "Message Sent! <i class='bx bxs-check-circle'></i>";
            btn.style.backgroundColor = "#27c93f";
            btn.style.color = "#fff";
            document.getElementById('contact-form').reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }, 3000);
        }, function (error) {
            btn.innerHTML = "Failed to Send ❌";
            btn.style.backgroundColor = "#ff5f56";
            console.log('FAILED...', error);

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
            }, 3000);
        });
});