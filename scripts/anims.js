document.addEventListener('componentsLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navDots = [];
    const navMenu = document.querySelector('.nav-menu');

    if (navMenu) {
        sections.forEach(section => {
            const dot = document.createElement('div');
            dot.classList.add('nav-dot');
            dot.setAttribute('data-section', section.id);
            navMenu.appendChild(dot);
            navDots.push(dot);
            dot.addEventListener('click', () => {
                navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                const targetSection = document.getElementById(dot.getAttribute('data-section'));
                const navbarHeight = 80; // Adjust this value to match your navbar height
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    if (navDots.length > 0) {
        navDots[0].classList.add('active');
    }

    // Navigation dot animation
    function handleScroll() {
        let current = '';
        const scrollPosition = scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
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
    }

    // Wait for next frame to ensure layout is ready
    requestAnimationFrame(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set initial state
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
