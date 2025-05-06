document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: ['#00e5ff', '#ff00aa', '#ffcc00'] },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#00e5ff', opacity: 0.4, width: 1 },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

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

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.parentElement.previousElementSibling.lastElementChild.textContent;
        bar.style.setProperty('--width', width);
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            console.log('Formulario enviado:', data);
            contactForm.reset();
            alert('Mensaje enviado con éxito. Te contactaré pronto.');
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

    // Scroll animation for elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('aos-animate');
            }
        });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // AOS initialization
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(element => {
        const delay = element.getAttribute('data-aos-delay') || 0;
        element.style.transitionDelay = `${delay}ms`;
        element.classList.add('aos-init');
    });
});