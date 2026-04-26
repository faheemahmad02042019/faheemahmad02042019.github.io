/* ============================================================
   Faheem Ahmad — Portfolio Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation --- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    /* --- Active nav link on scroll --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* --- Scroll animations (data-aos) --- */
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    /* --- Navbar background on scroll --- */
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 28, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 15, 28, 0.85)';
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    /* --- Smooth scroll for anchor links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* --- Reduced-motion guard for JS-driven effects --- */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Animated counters on hero stats --- */
    const parseTarget = (text) => {
        const m = text.trim().match(/^([\d.]+)(.*)$/);
        if (!m) return null;
        const num = parseFloat(m[1]);
        const decimals = (m[1].split('.')[1] || '').length;
        return { num, suffix: m[2] || '', decimals };
    };

    const animateCounter = (el, target, duration = 1600) => {
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            const current = target.num * eased;
            el.textContent = current.toFixed(target.decimals) + target.suffix;
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseTarget(el.textContent);
        if (!target) return;
        el.dataset.final = el.textContent;
        if (reduceMotion) return;
        el.textContent = '0' + (target.decimals ? '.' + '0'.repeat(target.decimals) : '') + target.suffix;
    });

    if (!reduceMotion) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseTarget(el.dataset.final || el.textContent);
                    if (target) animateCounter(el, target);
                    statObserver.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
    }

    /* --- 3D tilt on cards --- */
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        const tiltCards = document.querySelectorAll('.project-card, .focus-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rx = ((y - rect.height / 2) / (rect.height / 2)) * -5;
                const ry = ((x - rect.width / 2) / (rect.width / 2)) * 5;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* --- Magnetic hover on hero buttons --- */
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.hero-actions .btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${(y * 0.25) - 2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* --- Stagger fly-in for skill pills --- */
    const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pills = entry.target.querySelectorAll('.skill-pill');
                pills.forEach((pill, i) => {
                    pill.style.transitionDelay = `${i * 45}ms`;
                    pill.classList.add('pill-in');
                });
                pillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skill-category').forEach(c => pillObserver.observe(c));

});
