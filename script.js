document.addEventListener('DOMContentLoaded', function () {

    // Force video autoplay
    var heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
        heroVideo.play().catch(function() {});
    }

    // Nav scroll effect
    var nav = document.getElementById('nav');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        if (scrollY > 80) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');

    toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('mobile-menu--open');
        toggle.classList.toggle('nav__toggle--open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        toggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
    });

    var closeBtn = document.getElementById('mobileMenuClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            menu.classList.remove('mobile-menu--open');
            toggle.classList.remove('nav__toggle--open');
            document.body.style.overflow = '';
            toggle.setAttribute('aria-label', 'Abrir menu');
        });
    }

    // Close mobile menu on link click
    var menuLinks = menu.querySelectorAll('.mobile-menu__link');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('mobile-menu--open');
            toggle.classList.remove('nav__toggle--open');
            document.body.style.overflow = '';
        });
    });

    // Scroll reveal
    var reveals = document.querySelectorAll(
        '.section-label, .nosotros__title, .nosotros__desc, .nosotros__cita, ' +
        '.nosotros__image-frame, .nosotros__detail, ' +
        '.sarmiento__title, .sarmiento__intro, .sarmiento__card, ' +
        '.carta__header, .carta__plato, .carta__vinos, ' +
        '.bodega__image-frame, .bodega__title, .bodega__desc, .bodega__espacios, ' +
        '.contacto__info, .contacto__mapa, ' +
        '.frase__text'
    );

    reveals.forEach(function (el) {
        el.classList.add('reveal');
    });

    // Sequential stagger within each parent section
    var staggerGroups = [
        '.sarmiento__grid .sarmiento__card',
        '.carta__grid .carta__plato',
        '.bodega__espacios .bodega__espacio'
    ];
    staggerGroups.forEach(function (selector) {
        var items = document.querySelectorAll(selector);
        items.forEach(function (item, i) {
            var delayIndex = Math.min(i + 1, 6);
            item.classList.add('reveal-delay-' + delayIndex);
        });
    });

    // Frase line-by-line: wrap <br>-separated lines in spans
    document.querySelectorAll('.frase__text').forEach(function (quote) {
        var html = quote.innerHTML;
        // Split on <br> tags, wrap each part in a frase-line span
        var parts = html.split(/<br\s*\/?>/i);
        if (parts.length > 1) {
            quote.innerHTML = parts.map(function (part) {
                return '<span class="frase-line">' + part.trim() + '</span>';
            }).join('');
        }
    });

    // Shimmer delay: stagger the shimmer per plato line
    document.querySelectorAll('.carta__plato').forEach(function (plato, i) {
        var line = plato.querySelector('.carta__plato-line');
        if (line) {
            line.style.setProperty('--shimmer-delay', String(i * 0.8));
        }
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    reveals.forEach(function (el) {
        revealObserver.observe(el);
    });

    // Ember & smoke simulation
    var ashContainer = document.getElementById('ash-container');
    if (ashContainer) {
        var emberShapes = [
            'polygon(20% 0%, 80% 10%, 100% 50%, 70% 90%, 10% 80%)',
            'polygon(0% 20%, 60% 0%, 100% 40%, 80% 100%, 20% 80%)',
            'polygon(30% 0%, 100% 20%, 80% 80%, 20% 100%, 0% 50%)',
            'polygon(10% 10%, 90% 0%, 100% 80%, 50% 100%, 0% 60%)'
        ];

        function createParticle(isSmoke) {
            var el = document.createElement('div');
            el.classList.add('ash');

            // Power-law size: mostly tiny embers, rare large ones
            var size = isSmoke
                ? Math.random() * 14 + 6
                : Math.pow(Math.random(), 2.5) * 7 + 1.5;

            var left = Math.random() * 100;
            var duration = isSmoke
                ? Math.random() * 5000 + 10000
                : Math.random() * 4000 + 5000;
            var maxOpacity = isSmoke
                ? Math.random() * 0.07 + 0.02
                : Math.random() * 0.55 + 0.4;

            // Depth of field
            var blur = isSmoke
                ? Math.random() * 4 + 2
                : (Math.random() > 0.7 ? Math.random() * 2.5 + 0.5 : 0);

            el.style.width = size + 'px';
            el.style.height = (size * (Math.random() * 0.4 + 0.7)) + 'px';
            el.style.left = left + 'vw';

            if (isSmoke) {
                el.style.borderRadius = '50%';
            } else {
                el.style.clipPath = emberShapes[Math.floor(Math.random() * emberShapes.length)];
            }
            if (blur > 0) el.style.filter = 'blur(' + blur + 'px)';

            // Sinusoidal drift — 5 waypoints for wavy movement
            var w1 = Math.random() * 6 - 3;
            var w2 = w1 - (Math.random() * 8 - 4);
            var w3 = w2 + (Math.random() * 10 - 5);
            var w4 = w3 - (Math.random() * 7 - 3.5);
            var w5 = w4 + (Math.random() * 6 - 3);

            var rotA = Math.random() * 360;
            var rotB = rotA + (Math.random() * 540 - 270);

            ashContainer.appendChild(el);

            var glowBase = Math.min(size * 2, 12);
            var keyframes;

            if (isSmoke) {
                keyframes = [
                    { transform: 'translateY(0) translateX(0) scale(0.3)', opacity: 0, backgroundColor: '#2a2520', offset: 0 },
                    { transform: 'translateY(-12vh) translateX(' + w1 + 'vw) scale(0.6)', opacity: maxOpacity * 0.5, backgroundColor: '#221e1a', offset: 0.12 },
                    { transform: 'translateY(-30vh) translateX(' + w2 + 'vw) scale(1)', opacity: maxOpacity, backgroundColor: '#1a1816', offset: 0.3 },
                    { transform: 'translateY(-50vh) translateX(' + w3 + 'vw) scale(1.4)', opacity: maxOpacity * 0.7, backgroundColor: '#151311', offset: 0.55 },
                    { transform: 'translateY(-75vh) translateX(' + w4 + 'vw) scale(1.7)', opacity: maxOpacity * 0.3, backgroundColor: '#111', offset: 0.8 },
                    { transform: 'translateY(-105vh) translateX(' + w5 + 'vw) scale(2)', opacity: 0, backgroundColor: '#0f0c08', offset: 1 }
                ];
            } else {
                // Thermal lifecycle: white-hot → yellow → orange → red → dark ash
                keyframes = [
                    { transform: 'translateY(0) translateX(0) scale(0.3) rotate(' + rotA + 'deg)',
                      opacity: 0, backgroundColor: '#ffe8b0',
                      boxShadow: '0 0 ' + glowBase + 'px #ffcc66, 0 0 ' + (glowBase * 2) + 'px #ff9900', offset: 0 },
                    { transform: 'translateY(-8vh) translateX(' + w1 + 'vw) scale(1) rotate(' + (rotA + rotB * 0.1) + 'deg)',
                      opacity: maxOpacity, backgroundColor: '#ffb732',
                      boxShadow: '0 0 ' + glowBase + 'px #ff8800, 0 0 ' + (glowBase * 1.5) + 'px #ff5500', offset: 0.1 },
                    { transform: 'translateY(-22vh) translateX(' + w2 + 'vw) scale(0.85) rotate(' + (rotA + rotB * 0.25) + 'deg)',
                      opacity: maxOpacity * 0.75, backgroundColor: '#ff7b00',
                      boxShadow: '0 0 ' + (glowBase * 0.7) + 'px #ff4500', offset: 0.25 },
                    { transform: 'translateY(-40vh) translateX(' + w3 + 'vw) scale(0.65) rotate(' + (rotA + rotB * 0.5) + 'deg)',
                      opacity: maxOpacity * 0.45, backgroundColor: '#cc3a00',
                      boxShadow: '0 0 ' + (glowBase * 0.3) + 'px #8b2500', offset: 0.5 },
                    { transform: 'translateY(-65vh) translateX(' + w4 + 'vw) scale(0.45) rotate(' + (rotA + rotB * 0.8) + 'deg)',
                      opacity: maxOpacity * 0.2, backgroundColor: '#4a2a1a',
                      boxShadow: '0 0 1px #2a1a0a', offset: 0.8 },
                    { transform: 'translateY(-95vh) translateX(' + w5 + 'vw) scale(0.2) rotate(' + rotB + 'deg)',
                      opacity: 0, backgroundColor: '#1a1816',
                      boxShadow: 'none', offset: 1 }
                ];
            }

            var anim = el.animate(keyframes, {
                duration: duration,
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                fill: 'forwards'
            });

            anim.onfinish = function () {
                if (el.parentNode) el.parentNode.removeChild(el);
            };
        }

        // Micro-burst: sarmiento cracking, 2-4 embers at once
        function burst() {
            var count = Math.floor(Math.random() * 3) + 2;
            for (var i = 0; i < count; i++) {
                (function (delay) {
                    setTimeout(function () { createParticle(false); }, delay);
                })(Math.random() * 150);
            }
        }

        // Main loop: mix of embers (65%) and smoke (35%)
        setInterval(function () {
            createParticle(Math.random() < 0.35);
        }, 1200);

        // Bursts on a random recurring timer
        function scheduleBurst() {
            var delay = Math.random() * 5000 + 5000;
            setTimeout(function () {
                burst();
                scheduleBurst();
            }, delay);
        }
        scheduleBurst();

        // Initial population
        for (var i = 0; i < 4; i++) {
            (function (d) {
                setTimeout(function () { createParticle(false); }, d);
            })(Math.random() * 1500);
        }
        setTimeout(function () { createParticle(true); }, 600);
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = nav ? nav.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                var startPosition = window.scrollY;
                var distance = targetPosition - startPosition;
                var duration = 800;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = timestamp - start;
                    var t = Math.min(progress / duration, 1);
                    // easeInOutCubic
                    var ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    window.scrollTo(0, startPosition + distance * ease);
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                window.requestAnimationFrame(step);
            }
        });
    });

});
