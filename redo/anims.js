document.addEventListener('DOMContentLoaded', () => {
    // Navigation dot animation
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Smooth scrolling for nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetSection = document.getElementById(dot.getAttribute('data-section'));
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Fade up animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.work-item, .about-text, .skills-list').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Terminal typing effect (optional enhancement)
    const terminalLines = document.querySelectorAll('.terminal-output, .terminal-command');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.opacity = '1';
        }, index * 200);
    });
});