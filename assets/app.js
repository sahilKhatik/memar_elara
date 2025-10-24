// Main JavaScript for Memar Elara

document.addEventListener('DOMContentLoaded', function () {
    // GSAP
    gsap.registerPlugin(ScrollTrigger)
    gsap.registerPlugin(SplitText)

    // Navbar scroll effect
    initializeHomePageMemarVideo();

    // Initialize Splide for Hero carousel
    const heroSplideEl = document.getElementById('heroSplide');
    if (heroSplideEl && window.Splide) {
        const heroSplide = new Splide(heroSplideEl, {
            type: 'fade',
            rewind: true,
            perPage: 1,
            perMove: 1,
            gap: 0,
            speed: 1000,
            autoplay: true,
            interval: 4000,
            pauseOnHover: false,
            arrows: false,
            pagination: true,
            drag: true,
            keyboard: 'global',
            heightRatio: 1,
            height: '100%',
        });

        heroSplide.mount();
    }
    const navbar = document.getElementById('mainNavbar');

    // Function to handle scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Add scroll event listener for active link updating
    window.addEventListener('scroll', updateActiveLink);

    // Set initial active link
    updateActiveLink();

    // quality section animation
    // Initialize Splide for Construction Quality carousel
    const qualitySplideEl = document.getElementById('qualitySplide');
    let qualitySplide;
    if (qualitySplideEl && window.Splide) {
        qualitySplide = new Splide(qualitySplideEl, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1.5rem',
            speed: 700,
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: false,
            drag: true,
            keyboard: 'global',
            breakpoints: {
                992: { gap: '1rem' },
                576: { gap: '0.75rem' }
            }
        });

        // Progress bar
        const progressBar = document.getElementById('qualityProgress');
        if (progressBar) {
            qualitySplide.on('mounted move', function () {
                const end = qualitySplide.Components.Controller.getEnd() + 1;
                const rate = Math.min((qualitySplide.index + 1) / end, 1);
                progressBar.style.width = String(100 * rate) + '%';
            });
        }

        qualitySplide.mount();
        qualitySplide.root.classList.remove('is-initialized', 'is-rendered');
        qualitySplide.root.style.visibility = 'hidden';
        qualitySplide.Components.Autoplay.pause();
    }

    const overlay = document.querySelector(".cq-animated-overlay");
    const overlayText = overlay.querySelector(".cq-animated-overlay-text");
    // const cqContent = document.querySelector(".cq-content-wrapper");
    if (overlay && overlayText) {
        ScrollTrigger.create({
            trigger: "#construction-quality",
            start: "top 80%",
            once: true, // triggers only once
            onEnter: () => {
                // Timeline for overlay animation
                const tl = gsap.timeline({
                    onStart: () => {
                        setTimeout(() => {
                            document.querySelector('.cq-content-wrapper').style.visibility = 'visible';
                            qualitySplide.root.classList.add('is-initialized', 'is-rendered');
                            qualitySplide.root.style.visibility = 'visible';
                        }, 1000);
                    },
                    onComplete: () => {
                        qualitySplide.Components.Autoplay.play();
                    }
                });

                tl.to(overlay, { opacity: 1, duration: 1, pointerEvents: "auto" })
                    .to(overlayText, { opacity: 1, duration: 1 }, "-=0.3")
                    .to({}, { duration: 1 }) // hold for 2s
                    .to(overlayText, { opacity: 0, duration: 2 })
                    .to(overlay, { opacity: 0, duration: 2, pointerEvents: "none" })
            }
        });
    }

    // Initialize Splide for Testimonials carousel
    const testimonialsSplideEl = document.getElementById('testimonialsSplide');
    if (testimonialsSplideEl && window.Splide) {
        const testimonialsSplide = new Splide(testimonialsSplideEl, {
            type: 'loop',
            perPage: 2,
            perMove: 1,
            gap: '1.5rem',
            speed: 700,
            autoplay: false,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            drag: false,
            keyboard: 'global',
            breakpoints: {
                992: { gap: '1rem' },
                576: { gap: '0.75rem' }
            }
        });

        testimonialsSplide.mount();
    }

    // Function to handle animations for memar-section
    function animateMemarSection() {
        const memarTitle = document.querySelector('.memar-title');
        const memarSubtitle = document.querySelector('.memar-subtitle');

        const options = {
            root: null, // Use the viewport as root
            rootMargin: '0px',
            threshold: 0.5 // Trigger animation when 50% of the element is visible
        };

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);

        if (memarTitle) observer.observe(memarTitle);
        if (memarSubtitle) observer.observe(memarSubtitle);
    }

    // Initialize the animation
    animateMemarSection();

    // Stats counter animation
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const statLabels = document.querySelectorAll('.stat-label');

        // Set initial opacity for labels
        gsap.set(statLabels, { opacity: 0, y: 0 });

        statNumbers.forEach((statElement) => {
            // Extract the full text (e.g., "18+")
            const fullText = statElement.textContent;

            // Extract the number and any suffix (e.g., "18" and "+")
            const numberMatch = fullText.match(/(\d+\.?\d*)(.*)$/);

            if (!numberMatch) return;

            const targetValue = parseFloat(numberMatch[1]);
            const suffix = numberMatch[2]; // e.g., "+", "K", "M", etc.

            // Set initial value to 0
            statElement.textContent = '0' + suffix;

            // Create the counter object for GSAP to animate
            const counter = { value: 0 };

            // Create ScrollTrigger animation
            ScrollTrigger.create({
                trigger: '#stats',
                start: '20% 80%',
                once: true, // Only trigger once
                onEnter: () => {
                    // Animate the counter
                    gsap.to(counter, {
                        value: targetValue,
                        duration: 2, // Duration of counting animation
                        ease: 'power1.out',
                        onUpdate: function () {
                            // Update the element text with the current counter value
                            const currentValue = Math.floor(counter.value);
                            statElement.textContent = currentValue + suffix;
                        },
                        onComplete: function () {
                            // Ensure final value is exact
                            statElement.textContent = targetValue + suffix;
                        }
                    });

                    // Animate all stat labels with fade in effect
                    gsap.to(statLabels, {
                        opacity: 1,
                        y: 0,
                        duration: 2,
                        ease: 'power2.out',
                        stagger: 0.2 // Stagger effect if multiple labels
                    });
                }
            });
        });
    }

    // Initialize stats counter
    initStatsCounter();
});

const baseURL = '../';

function initializeHomePageMemarVideo() {
    const video = document.getElementById("memar-video");
    if (!video) {
        console.warn("Memar video element not found");
        return;
    }

    const videoSrc = `${baseURL}assets/images/Banner_Home.m3u8`;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log("Loading main video...");
                    loadHLS(video, videoSrc);
                    observer.unobserve(video);
                }
            });
        },
        { threshold: 0.5 }
    );

    observer.observe(video);
}

function loadHLS(videoElement, source) {
    if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 5 });
        hls.loadSource(source);
        hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = source;
    }
}