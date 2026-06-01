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

    reveals.forEach(function (el, index) {
        el.classList.add('reveal');
        // Add staggered delays for grid items
        if (el.classList.contains('carta__plato') || el.classList.contains('sarmiento__card')) {
            // cycle through delay 1, 2, 3
            var delayClass = 'reveal-delay-' + ((index % 3) + 1);
            el.classList.add(delayClass);
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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
        revealObserver.observe(el);
    });

    // Ashes effect
    var ashContainer = document.getElementById('ash-container');
    if (ashContainer) {
        function createAsh() {
            var ash = document.createElement('div');
            ash.classList.add('ash');
            
            // Core randomization
            var isDeadAsh = Math.random() > 0.6; // 40% chance to be a dark dead ash
            var size = Math.random() * 6 + 3; // 3px to 9px
            var left = Math.random() * 100; // 0% to 100%
            var duration = Math.random() * 4000 + (isDeadAsh ? 8000 : 4000); // Dead ashes fall/rise slower (up to 12s)
            var maxOpacity = Math.random() * 0.5 + (isDeadAsh ? 0.2 : 0.5); // Dead ashes are less opaque
            
            // Depth of field (blur)
            var blurAmount = Math.random() > 0.7 ? (Math.random() * 3 + 1) : 0; // 30% chance to be out of focus
            
            // Visual styles
            if (isDeadAsh) {
                ash.style.backgroundColor = '#1a1816'; // Dark grey/brown
                ash.style.boxShadow = 'none';
            } else {
                var colors = ['#ffb732', '#ff7b00', '#ff4500'];
                var color = colors[Math.floor(Math.random() * colors.length)];
                ash.style.backgroundColor = color;
                ash.style.boxShadow = '0 0 ' + (size*1.5) + 'px ' + color + ', 0 0 ' + (size*3) + 'px #ff4500';
            }
            
            // Irregular shapes for realistic embers
            var shapes = [
                'polygon(20% 0%, 80% 10%, 100% 50%, 70% 90%, 10% 80%)',
                'polygon(0% 20%, 60% 0%, 100% 40%, 80% 100%, 20% 80%)',
                'polygon(30% 0%, 100% 20%, 80% 80%, 20% 100%, 0% 50%)',
                'polygon(10% 10%, 90% 0%, 100% 80%, 50% 100%, 0% 60%)'
            ];
            
            ash.style.width = size + 'px';
            ash.style.height = (size * (Math.random() * 0.5 + 0.8)) + 'px'; // slightly oblong
            ash.style.left = left + 'vw';
            ash.style.clipPath = shapes[Math.floor(Math.random() * shapes.length)];
            if (blurAmount > 0) ash.style.filter = 'blur(' + blurAmount + 'px)';
            
            // Drift left or right, and rotation
            var driftStart = (Math.random() * 10 - 5);
            var driftMid = driftStart + (Math.random() * 30 - 15);
            var driftEnd = driftMid + (Math.random() * 40 - 20);
            var rotStart = Math.random() * 360;
            var rotEnd = rotStart + (Math.random() * 720 - 360);
            
            ashContainer.appendChild(ash);
            
            // Web Animations API with flickering and rotation
            var animation = ash.animate([
                { transform: 'translateY(0) translateX(0) scale(0.5) rotate(' + rotStart + 'deg)', opacity: 0, offset: 0 },
                { transform: 'translateY(-20vh) translateX(' + driftStart + 'vw) scale(1) rotate(' + (rotStart + rotEnd)*0.2 + 'deg)', opacity: maxOpacity, offset: 0.2 },
                { transform: 'translateY(-50vh) translateX(' + driftMid + 'vw) scale(0.8) rotate(' + (rotStart + rotEnd)*0.5 + 'deg)', opacity: maxOpacity * (isDeadAsh ? 1 : 0.3), offset: 0.5 }, // Only bright embers flicker
                { transform: 'translateY(-80vh) translateX(' + driftEnd + 'vw) scale(1.1) rotate(' + (rotStart + rotEnd)*0.8 + 'deg)', opacity: maxOpacity, offset: 0.8 },
                { transform: 'translateY(-110vh) translateX(' + (driftEnd * 1.5) + 'vw) scale(0.2) rotate(' + rotEnd + 'deg)', opacity: 0, offset: 1 }
            ], {
                duration: duration,
                easing: 'ease-in-out',
                fill: 'forwards'
            });
            
            // Remove ash after animation completes
            animation.onfinish = function() {
                if (ash.parentNode) {
                    ash.parentNode.removeChild(ash);
                }
            };
        }

        // Spawn ashes periodically
        // Fewer ashes to keep it elegant, not overwhelming
        setInterval(createAsh, 800);
        
        // Spawn a few initial ashes so it's not empty on load
        for (var i = 0; i < 5; i++) {
            setTimeout(createAsh, Math.random() * 2000);
        }
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = nav ? nav.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

});
