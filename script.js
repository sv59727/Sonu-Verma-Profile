document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Toggle icon between bars and times
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Form Submission Handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(this);

            // Using FormSubmit.co AJAX endpoint
            fetch("https://formsubmit.co/ajax/vsonu4428@gmail.com", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "false" || (data.message && data.message.includes("fail"))) {
                        throw new Error(data.message || 'Submission failed');
                    }

                    Swal.fire({
                        title: 'Message Sent!',
                        text: 'Thank you for connecting with Dream Progressive Ventures. We will get back to you shortly.',
                        icon: 'success',
                        confirmButtonColor: '#1a3c34',
                        confirmButtonText: 'Great!'
                    });
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);

                    let errorMsg = 'Something went wrong. Please try again later.';

                    // Helpful message for local testing
                    if (window.location.protocol === 'file:') {
                        errorMsg = "It looks like you're running this file locally. Form submission services usually require a live web server (http/https) to specific referrers. Please upload your site to test the email feature fully.";
                    }

                    Swal.fire({
                        title: 'Submission Failed',
                        text: errorMsg,
                        icon: 'error',
                        confirmButtonColor: '#1a3c34'
                    });
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

});
