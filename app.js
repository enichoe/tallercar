
        // ============================================
        // INITIALIZATION
        // ============================================
        
        // DOM Elements - Initialize first
        const loader = document.getElementById('loader');
        const loaderBar = document.getElementById('loader-bar');
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursor-dot');
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('nav-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileClose = document.getElementById('mobile-close');
        const particlesCanvas = document.getElementById('particles-canvas');
        const ctx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
        
        // Global state
        let mouseX = 0;
        let mouseY = 0;
        let particles = [];
        let loaderProgress = 0;
        let hasAnimated = {
            stats: false,
            speedometer: false
        };
        
        // Reduced motion check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // ============================================
        // LOADER
        // ============================================
        
        function updateLoader() {
            if (loaderProgress < 100) {
                loaderProgress += Math.random() * 15 + 5;
                if (loaderProgress > 100) loaderProgress = 100;
                if (loaderBar) {
                    loaderBar.style.width = loaderProgress + '%';
                }
                setTimeout(updateLoader, 150);
            } else {
                setTimeout(() => {
                    if (loader) {
                        loader.classList.add('hidden');
                    }
                    initParticles();
                }, 500);
            }
        }
        
        // Start loader
        updateLoader();
        
        // ============================================
        // CUSTOM CURSOR
        // ============================================
        
        function initCursor() {
            if (!cursor || !cursorDot) return;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            });
            
            // Hover effects
            const interactiveElements = document.querySelectorAll('a, button, .service-card, .gallery-item, .testimonial-card, input, select, textarea');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                });
            });
        }
        
        initCursor();
        
        // ============================================
        // PARTICLES
        // ============================================
        
        function initParticles() {
            if (!particlesCanvas || !ctx || prefersReducedMotion) return;
            
            function resizeCanvas() {
                particlesCanvas.width = window.innerWidth;
                particlesCanvas.height = window.innerHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            class Particle {
                constructor() {
                    this.reset();
                }
                
                reset() {
                    this.x = Math.random() * particlesCanvas.width;
                    this.y = Math.random() * particlesCanvas.height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.speedY = (Math.random() - 0.5) * 0.5;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }
                
                update() {
                    // Mouse interaction
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        this.x -= dx * force * 0.02;
                        this.y -= dy * force * 0.02;
                    }
                    
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 69, 0, ${this.opacity})`;
                    ctx.fill();
                }
            }
            
            // Create particles
            const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            
            function animateParticles() {
                ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
                
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                
                // Draw connections
                particles.forEach((p1, i) => {
                    particles.slice(i + 1).forEach(p2 => {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(255, 69, 0, ${0.1 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                });
                
                requestAnimationFrame(animateParticles);
            }
            
            animateParticles();
        }
        
        // ============================================
        // NAVIGATION
        // ============================================
        
        function initNavigation() {
            // Scroll effect
            window.addEventListener('scroll', () => {
                if (nav) {
                    if (window.scrollY > 50) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                }
            });
            
            // Mobile menu
            if (navToggle && mobileMenu) {
                navToggle.addEventListener('click', () => {
                    mobileMenu.classList.add('active');
                });
            }
            
            if (mobileClose && mobileMenu) {
                mobileClose.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                });
            }
            
            // Close mobile menu on link click
            if (mobileMenu) {
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.remove('active');
                    });
                });
            }
        }
        
        initNavigation();
        
        // ============================================
        // SCROLL ANIMATIONS
        // ============================================
        
        function initScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Service cards stagger
                        if (entry.target.classList.contains('service-card')) {
                            const delay = entry.target.dataset.delay || 0;
                            entry.target.style.transitionDelay = `${delay * 0.1}s`;
                        }
                    }
                });
            }, observerOptions);
            
            // Observe elements
            document.querySelectorAll('.reveal, .service-card, .stat-card, .gallery-item').forEach(el => {
                observer.observe(el);
            });
        }
        
        initScrollAnimations();
        
        // ============================================
        // COUNTER ANIMATION
        // ============================================
        
        function animateCounters() {
            const statCards = document.querySelectorAll('.stat-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated.stats) {
                        hasAnimated.stats = true;
                        
                        statCards.forEach(card => {
                            const valueEl = card.querySelector('.stat-value');
                            const target = parseInt(card.dataset.target) || 0;
                            const suffix = card.dataset.suffix || '';
                            const duration = 2000;
                            const startTime = Date.now();
                            
                            function updateCounter() {
                                const elapsed = Date.now() - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                                const current = Math.floor(target * easeOutQuart);
                                
                                if (valueEl) {
                                    valueEl.textContent = current.toLocaleString();
                                }
                                
                                if (progress < 1) {
                                    requestAnimationFrame(updateCounter);
                                }
                            }
                            
                            updateCounter();
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            const statsContainer = document.querySelector('.stats-container');
            if (statsContainer) {
                observer.observe(statsContainer);
            }
        }
        
        animateCounters();
        
        // ============================================
        // SPEEDOMETER ANIMATION
        // ============================================
        
        function animateSpeedometer() {
            const progress = document.getElementById('speedometer-progress');
            const valueEl = document.getElementById('speed-value');
            
            if (!progress || !valueEl) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated.speedometer) {
                        hasAnimated.speedometer = true;
                        
                        progress.classList.add('animate');
                        
                        // Animate number
                        const target = 98;
                        const duration = 2000;
                        const startTime = Date.now();
                        
                        function updateSpeed() {
                            const elapsed = Date.now() - startTime;
                            const progressVal = Math.min(elapsed / duration, 1);
                            const current = Math.floor(target * progressVal);
                            valueEl.textContent = current;
                            
                            if (progressVal < 1) {
                                requestAnimationFrame(updateSpeed);
                            }
                        }
                        
                        updateSpeed();
                    }
                });
            }, { threshold: 0.5 });
            
            const speedometerContainer = document.querySelector('.speedometer-container');
            if (speedometerContainer) {
                observer.observe(speedometerContainer);
            }
        }
        
        animateSpeedometer();
        
        // ============================================
        // FORM HANDLING
        // ============================================
        
        function initForm() {
            const form = document.getElementById('contact-form');
            
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    // Show success message (in production, send to server)
                    alert('Solicitud enviada con exito. Nos pondremos en contacto pronto.');
                    form.reset();
                });
            }
        }
        
        initForm();
        
        // ============================================
        // SMOOTH SCROLL
        // ============================================
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // ============================================
        // PARALLAX EFFECT
        // ============================================
        
        if (!prefersReducedMotion) {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const heroGrid = document.querySelector('.hero-grid');
                
                if (heroGrid) {
                    heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
                }
            });
        }
    