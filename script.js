/* ============================================
   HANSIKA MONALA — PORTFOLIO SCRIPTS
   Editorial Black & White Edition
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    }

    window.addEventListener('load', hidePreloader);
    if (document.readyState === 'complete') hidePreloader();

    // ==========================================
    // CURSOR GLOW (desktop only)
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            cursorGlow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    // Scroll effect
    function handleScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 140;
            if (window.scrollY >= top) {
                current = s.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Escape key closes mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ==========================================
    // INTERSECTION OBSERVER — SCROLL ANIMATIONS
    // ==========================================
    const animElements = document.querySelectorAll('.anim-on-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    animElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.metric-num[data-count]');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;

        const metricsSection = document.querySelector('.hero-metrics');
        if (!metricsSection) return;

        const rect = metricsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersStarted = true;

            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count, 10);
                const duration = 2200;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4); // ease-out quart
                    counter.textContent = Math.round(ease * target);

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                }

                requestAnimationFrame(tick);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    // ==========================================
    // CPA PROGRESS BAR
    // ==========================================
    const cpaFill = document.getElementById('cpaProgressFill');
    if (cpaFill) {
        const cpaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        cpaFill.classList.add('animated');
                    }, 400);
                    cpaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        cpaObserver.observe(cpaFill.parentElement);
    }

    // ==========================================
    // STAGGERED ANIMATIONS
    // ==========================================
    function staggerChildren(parentSelector, childSelector, baseDelay) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;

        const children = parent.querySelectorAll(childSelector);
        children.forEach((child, i) => {
            child.style.transitionDelay = `${baseDelay + i * 0.12}s`;
        });
    }

    staggerChildren('.cpa-nodes', '.cpa-node', 0.1);
    staggerChildren('.skills-mosaic', '.skill-block', 0.05);
    staggerChildren('.exp-cards', '.exp-card', 0.08);

    // ==========================================
    // EXPERIENCE CARDS — EXPAND/COLLAPSE
    // ==========================================
    const expCards = document.querySelectorAll('.exp-card');
    expCards.forEach(card => {
        const content = card.querySelector('.exp-content');
        if (!content) return;

        // All cards start expanded — no collapse on this version
        // But add hover highlight effect
        card.addEventListener('mouseenter', () => {
            expCards.forEach(c => {
                if (c !== card) c.style.opacity = '0.5';
            });
        });

        card.addEventListener('mouseleave', () => {
            expCards.forEach(c => c.style.opacity = '1');
        });
    });

    // ==========================================
    // PARALLAX ON HERO IMAGE
    // ==========================================
    const heroImage = document.querySelector('.hero-image-frame');
    if (heroImage && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
            }
        }, { passive: true });
    }

    // ==========================================
    // HERO CONTENT FADE ON SCROLL
    // ==========================================
    const heroLeft = document.querySelector('.hero-left');
    if (heroLeft) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const opacity = 1 - (scrollY / (window.innerHeight * 0.65));
                heroLeft.style.opacity = Math.max(opacity, 0);
            }
        }, { passive: true });
    }

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    const magneticBtns = document.querySelectorAll('.btn-main');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ==========================================
    // TEXT REVEAL — HEADING LETTERS
    // ==========================================
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        // Add a subtle shimmer on load
        heroName.addEventListener('mouseenter', () => {
            heroName.style.transition = 'text-shadow 0.4s ease';
            heroName.style.textShadow = '0 0 40px rgba(255,255,255,0.1)';
        });
        heroName.addEventListener('mouseleave', () => {
            heroName.style.textShadow = 'none';
        });
    }

    // ==========================================
    // SMOOTH SECTION BORDERS ON SCROLL
    // ==========================================
    const sectionDividers = document.querySelectorAll('.section');
    sectionDividers.forEach(section => {
        const dividerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.05 });

        dividerObserver.observe(section);
    });

    // ==========================================
    // KPI CARDS — NUMBER ANIMATION
    // ==========================================
    const kpiValues = document.querySelectorAll('.kpi-value');
    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    kpiValues.forEach(v => {
        v.style.opacity = '0';
        v.style.transform = 'translateY(20px)';
        v.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        kpiObserver.observe(v);
    });

    // Stagger KPI animations
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, i) => {
        const value = card.querySelector('.kpi-value');
        if (value) {
            value.style.transitionDelay = `${i * 0.15}s`;
        }
    });

});
