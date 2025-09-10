document.addEventListener('componentsLoaded', () => {
    // Navigation dot animation
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = scrollY + 200; // Add offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if we're in this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        // Special case: if we're near the bottom of the page, activate the last section
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                current = lastSection.getAttribute('id');
            }
        }

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
            // Remove active class from all dots
            navDots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            dot.classList.add('active');
            
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
});