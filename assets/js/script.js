document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navigation elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Handle scroll events
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTop.classList.toggle('active', window.scrollY > 50);
        updateActiveLink();
        animateOnScroll();
        checkScroll();
    });

    // Update active navigation link
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Animate elements on scroll (excluding hero, about, and skills)
    function animateOnScroll() {
        const elements = document.querySelectorAll('.timeline-item, .project-card, .certification-card, .contact-form, .contact-info, .section-header, .timeline-content, .project-content, .certification-content, .contact-form h3, .contact-info h3');

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top >= 0 && rect.top < windowHeight * 0.75) {
                element.classList.add('fade-in');
                if (element.closest('.timeline-item')) element.classList.add('delay-1');
                if (element.closest('.project-card')) element.classList.add('delay-2');
                if (element.closest('.certification-card')) element.classList.add('delay-3');
                if (element.closest('.contact-form') || element.closest('.contact-info')) element.classList.add('delay-4');
            }
        });
    }

    // Animate skills progress bars (using data-percent attribute)
    const skillItems = document.querySelectorAll('.skill-item');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return; // Prevent re-animation
        skillsAnimated = true;

        skillItems.forEach(item => {
            const progress = item.querySelector('.skill-progress');
            const percent = item.getAttribute('data-percent');
            progress.setAttribute('data-percent', percent); // Asegura que el atributo esté aplicado
        });
    }

    // Check if skills section is in viewport to trigger animation
    function checkScroll() {
        const skillsSection = document.querySelector('#skills');
        const windowHeight = window.innerHeight;
        const skillsPosition = skillsSection.getBoundingClientRect().top;

        if (skillsPosition < windowHeight - 100) {
            animateSkills();
        }
    }

    // Contact form handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                formMessage.style.display = 'block';
                formMessage.style.color = 'red';
                formMessage.textContent = 'Por favor, completa todos los campos.';
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formMessage.style.display = 'block';
                formMessage.style.color = 'red';
                formMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
                return;
            }

            // Generar la hora actual
            const now = new Date();
            const time = now.toLocaleString('es-CO', { timeZone: 'America/Bogota' }); // Formato local para Colombia

            // Enviar correo con EmailJS
            emailjs.send('service_gufp72l', 'template_9gfcekm', {
                name: name,
                email: email,
                subject: subject,
                message: message,
                time: time // Campo time para la plantilla
            })
            .then(function(response) {
                formMessage.style.display = 'block';
                formMessage.style.color = 'green';
                formMessage.textContent = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                contactForm.reset(); // Limpia el formulario
            }, function(error) {
                formMessage.style.display = 'block';
                formMessage.style.color = 'red';
                formMessage.textContent = 'Error al enviar el mensaje. Intenta de nuevo.';
                console.error('Error:', error);
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial animation call
    animateOnScroll();

    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00e5ff' },
                shape: { type: 'circle', stroke: { width: 0, color: '#ff00aa' } },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#00e5ff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 4, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 120, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
});