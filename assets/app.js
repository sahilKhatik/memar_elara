// Main JavaScript for Memar Elara

document.addEventListener('DOMContentLoaded', function () {
    // GSAP
    gsap.registerPlugin(ScrollTrigger)
    gsap.registerPlugin(SplitText)

    // Navbar scroll effect
    initializeHomePageBannerVideo();
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
        qualitySplide.Components.Autoplay.pause();
    }

    const overlay = document.querySelector(".cq-animated-overlay");
    const overlayText = overlay.querySelector(".cq-animated-overlay-text");
    if (overlay && overlayText) {
        ScrollTrigger.create({
            trigger: "#construction-quality",
            start: "top 80%",
            once: true, // triggers only once
            onEnter: () => {
                // Timeline for overlay animation
                const tl = gsap.timeline({
                    onComplete: () => {
                        qualitySplide.Components.Autoplay.play();
                    }
                });

                tl.to(overlay, { opacity: 1, duration: 0.5, pointerEvents: "auto" })
                    .to(overlayText, { opacity: 1, duration: 2 }, "-=0.3")
                    .to({}, { duration: 2 }) // hold for 2s
                    .to(overlayText, { opacity: 0, duration: 0.5 })
                    .to(overlay, { opacity: 0, duration: 1, pointerEvents: "none" });
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
});

const baseURL = '../';

function initializeHomePageBannerVideo() {
    const video = document.getElementById("banner-video");
    if (!video) {
        console.warn("Banner video element not found");
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