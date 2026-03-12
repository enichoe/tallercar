
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
    

        

    // ============================================
    // CHATBOT DE VENTAS - AUTOTECH PRO
    // ============================================
    
    (function() {
        'use strict';
        
        // ========== CONFIGURACIÓN ==========
        const CONFIG = {
            whatsappNumber: '1234567890', // Cambiar por tu número real
            businessName: 'AutoTech Pro',
            typingDelay: 800,
            messageDelay: 1200
        };
        
        // ========== ESTADO ==========
        const state = {
            isOpen: false,
            currentStep: 'welcome',
            selectedService: null,
            userData: {},
            messageHistory: []
        };
        
        // ========== BASES DE DATOS ==========
        const SERVICES = [
            {
                id: 'diagnostico',
                name: 'Diagnostico Computarizado',
                description: 'Escaneo completo de sistemas electronicos',
                price: 'S/. 499',
                time: '30-60 min'
            },
            {
                id: 'aceite',
                name: 'Cambio de Aceite',
                description: 'Aceite premium + filtro incluido',
                price: 'S/. 899 ',
                time: '20-30 min'
            },
            {
                id: 'frenos',
                name: 'Servicio de Frenos',
                description: 'Pastillas, discos o liquido',
                price: 'Desde S/. 1,500',
                time: '1-2 horas'
            },
            {
                id: 'suspension',
                name: 'Suspension',
                description: 'Amortiguadores, rotulas, terminales',
                price: 'Cotizacion personalizada',
                time: '2-4 horas'
            },
            {
                id: 'electricidad',
                name: 'Electricidad Automotriz',
                description: 'Sistemas electricos, baterias, alternadores',
                price: 'Desde S/. 699',
                time: '1-3 horas'
            },
            {
                id: 'ac',
                name: 'Aire Acondicionado',
                description: 'Carga de gas, reparacion de compresor',
                price: 'Desde S/. 1,200',
                time: '1-2 horas'
            },
            {
                id: 'motor',
                name: 'Reparacion de Motor',
                description: 'Diagnostico y reparacion completa',
                price: 'Cotizacion personalizada',
                time: 'Variable'
            },
            {
                id: 'mantenimiento',
                name: 'Mantenimiento General',
                description: 'Revision completa del vehiculo',
                price: 'S/. 1,299',
                time: '2-3 horas'
            }
        ];
        
        // ========== FLUJO DE CONVERSACIÓN ==========
        const FLOWS = {
            welcome: {
                messages: [
                    'Hola! Soy el asistente virtual de AutoTech Pro.',
                    'Estoy aqui para ayudarte con el servicio que necesitas para tu vehiculo. ¿En que puedo asistirte hoy?'
                ],
                quickReplies: [
                    { text: 'Ver servicios', action: 'show_services' },
                    { text: 'Agendar cita', action: 'schedule_appointment' },
                    { text: 'Cotizacion rapida', action: 'quick_quote' },
                    { text: 'Hablar con asesor', action: 'contact_human' }
                ]
            },
            show_services: {
                messages: [
                    'Perfecto! Estos son nuestros servicios disponibles:',
                ],
                type: 'services_list',
                quickReplies: [
                    { text: 'Agendar cita', action: 'schedule_appointment' },
                    { text: 'Menu principal', action: 'welcome' }
                ]
            },
            schedule_appointment: {
                messages: [
                    'Excelente decision! Para agendar tu cita necesito algunos datos.',
                    'Por favor completa el siguiente formulario:'
                ],
                action: 'show_form'
            },
            quick_quote: {
                messages: [
                    'Claro! Para darte una cotizacion precisa, selecciona el servicio que necesitas:'
                ],
                type: 'services_list',
                quickReplies: [
                    { text: 'Menu principal', action: 'welcome' }
                ]
            },
            contact_human: {
                messages: [
                    'Entiendo que prefieres hablar directamente con uno de nuestros asesores.',
                    'Puedes contactarnos por WhatsApp al +1 234 567 8900 o esperar un momento y te conectare.'
                ],
                quickReplies: [
                    { text: 'Ir a WhatsApp', action: 'open_whatsapp' },
                    { text: 'Menu principal', action: 'welcome' }
                ]
            },
            service_selected: {
                messages: [
                    (ctx) => `Has seleccionado: **${ctx.selectedService?.name}**`,
                    (ctx) => `${ctx.selectedService?.description}. ${ctx.selectedService?.price}. Tiempo estimado: ${ctx.selectedService?.time}.`,
                    '¿Te gustaria agendar una cita para este servicio?'
                ],
                quickReplies: [
                    { text: 'Si, agendar', action: 'schedule_appointment' },
                    { text: 'Ver otros servicios', action: 'show_services' },
                    { text: 'Menu principal', action: 'welcome' }
                ]
            },
            form_submitted: {
                messages: [
                    'Perfecto! He recibido tus datos.',
                    'Te contactaremos en los proximos 15 minutos para confirmar tu cita.',
                    '¿Hay algo mas en lo que pueda ayudarte?'
                ],
                quickReplies: [
                    { text: 'Ir a WhatsApp', action: 'open_whatsapp' },
                    { text: 'Menu principal', action: 'welcome' }
                ]
            }
        };
        
        // ========== ELEMENTOS DOM ==========
        let elements = {};
        
        function initElements() {
            elements = {
                chatbot: document.getElementById('chatbot'),
                trigger: document.getElementById('chatbot-trigger'),
                panel: document.getElementById('chatbot-panel'),
                messages: document.getElementById('chatbot-messages'),
                quickReplies: document.getElementById('chatbot-quick-replies'),
                input: document.getElementById('chatbot-input'),
                inputArea: document.getElementById('chatbot-input-area'),
                send: document.getElementById('chatbot-send'),
                badge: document.getElementById('chatbot-badge'),
                form: document.getElementById('chatbot-form'),
                formBack: document.getElementById('chatbot-form-back'),
                formSubmit: document.getElementById('chatbot-form-submit'),
                minimize: document.getElementById('chatbot-minimize')
            };
        }
        
        // ========== UTILIDADES ==========
        function getTime() {
            return new Date().toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        
        function scrollToBottom() {
            if (elements.messages) {
                elements.messages.scrollTop = elements.messages.scrollHeight;
            }
        }
        
        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'chat-message bot';
            typing.id = 'typing-indicator';
            typing.innerHTML = `
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            elements.messages.appendChild(typing);
            scrollToBottom();
        }
        
        function hideTyping() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }
        
        // ========== RENDERIZADO ==========
        function addMessage(text, isUser = false, delay = 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    if (!isUser) showTyping();
                    
                    setTimeout(() => {
                        if (!isUser) hideTyping();
                        
                        const message = document.createElement('div');
                        message.className = `chat-message ${isUser ? 'user' : 'bot'}`;
                        message.innerHTML = `
                            <div class="chat-message-content">${escapeHtml(text)}</div>
                            <div class="chat-message-time">${getTime()}</div>
                        `;
                        elements.messages.appendChild(message);
                        scrollToBottom();
                        resolve();
                    }, isUser ? 0 : CONFIG.typingDelay);
                }, delay);
            });
        }
        
        function addServiceCard(service, delay = 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    showTyping();
                    
                    setTimeout(() => {
                        hideTyping();
                        
                        const card = document.createElement('div');
                        card.className = 'chat-message bot';
                        card.innerHTML = `
                            <div class="service-card-chat" data-service="${service.id}">
                                <h4>${service.name}</h4>
                                <p>${service.description}</p>
                                <div class="price">${service.price} • ${service.time}</div>
                            </div>
                            <div class="chat-message-time">${getTime()}</div>
                        `;
                        elements.messages.appendChild(card);
                        
                        // Click handler
                        card.querySelector('.service-card-chat').addEventListener('click', () => {
                            selectService(service.id);
                        });
                        
                        scrollToBottom();
                        resolve();
                    }, CONFIG.typingDelay);
                }, delay);
            });
        }
        
        function renderQuickReplies(replies) {
            elements.quickReplies.innerHTML = '';
            
            replies.forEach(reply => {
                const btn = document.createElement('button');
                btn.className = 'quick-reply';
                btn.textContent = reply.text;
                btn.addEventListener('click', () => handleAction(reply.action));
                elements.quickReplies.appendChild(btn);
            });
        }
        
        // ========== ACCIONES ==========
        function handleAction(action, data = null) {
            // Limpiar quick replies previos
            elements.quickReplies.innerHTML = '';
            
            switch(action) {
                case 'welcome':
                    state.currentStep = 'welcome';
                    runFlow('welcome');
                    break;
                    
                case 'show_services':
                    state.currentStep = 'show_services';
                    runFlow('show_services');
                    break;
                    
                case 'schedule_appointment':
                    state.currentStep = 'schedule_appointment';
                    runFlow('schedule_appointment');
                    break;
                    
                case 'quick_quote':
                    state.currentStep = 'quick_quote';
                    runFlow('quick_quote');
                    break;
                    
                case 'contact_human':
                    state.currentStep = 'contact_human';
                    runFlow('contact_human');
                    break;
                    
                case 'service_selected':
                    state.currentStep = 'service_selected';
                    runFlow('service_selected');
                    break;
                    
                case 'show_form':
                    showForm();
                    break;
                    
                case 'open_whatsapp':
                    openWhatsApp();
                    break;
                    
                case 'send_form':
                    submitForm();
                    break;
            }
        }
        
        function selectService(serviceId) {
            const service = SERVICES.find(s => s.id === serviceId);
            if (service) {
                state.selectedService = service;
                addMessage(service.name, true);
                setTimeout(() => handleAction('service_selected'), 500);
            }
        }
        
        function showForm() {
            elements.form.style.display = 'flex';
            elements.inputArea.style.display = 'none';
        }
        
        function hideForm() {
            elements.form.style.display = 'none';
            elements.inputArea.style.display = 'flex';
        }
        
        function submitForm() {
            const nombre = document.getElementById('form-nombre').value;
            const telefono = document.getElementById('form-telefono').value;
            const vehiculo = document.getElementById('form-vehiculo').value;
            
            if (!nombre || !telefono || !vehiculo) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            state.userData = { nombre, telefono, vehiculo };
            
            // Construir mensaje para WhatsApp
            let message = `Hola! Solicito cita en AutoTech Pro.\n\n`;
            message += `*Datos:*\n`;
            message += `Nombre: ${nombre}\n`;
            message += `Telefono: ${telefono}\n`;
            message += `Vehiculo: ${vehiculo}\n`;
            
            if (state.selectedService) {
                message += `Servicio: ${state.selectedService.name}\n`;
            }
            
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            hideForm();
            runFlow('form_submitted');
        }
        
        function openWhatsApp() {
            let message = 'Hola! Quiero informacion sobre los servicios de AutoTech Pro';
            
            if (state.selectedService) {
                message = `Hola! Me interesa el servicio de ${state.selectedService.name}`;
            }
            
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
        
        // ========== FLUJO ==========
        async function runFlow(flowName) {
            const flow = FLOWS[flowName];
            if (!flow) return;
            
            // Mensajes
            if (flow.messages) {
                let delay = 0;
                for (const msg of flow.messages) {
                    const text = typeof msg === 'function' ? msg(state) : msg;
                    await addMessage(text, false, delay);
                    delay = CONFIG.messageDelay;
                }
            }
            
            // Lista de servicios
            if (flow.type === 'services_list') {
                let delay = CONFIG.messageDelay;
                for (const service of SERVICES.slice(0, 4)) {
                    await addServiceCard(service, delay);
                    delay = 300;
                }
            }
            
            // Acción especial
            if (flow.action === 'show_form') {
                setTimeout(() => showForm(), CONFIG.messageDelay);
            }
            
            // Quick replies
            if (flow.quickReplies) {
                setTimeout(() => {
                    renderQuickReplies(flow.quickReplies);
                }, delay + CONFIG.messageDelay);
            }
        }
        
        // ========== EVENTOS ==========
        function bindEvents() {
            // Toggle chat
            elements.trigger.addEventListener('click', () => {
                state.isOpen = !state.isOpen;
                elements.chatbot.classList.toggle('active', state.isOpen);
                
                if (state.isOpen) {
                    elements.badge.classList.add('hidden');
                    
                    // Primera apertura
                    if (state.messageHistory.length === 0) {
                        runFlow('welcome');
                    }
                }
            });
            
            // Minimizar
            elements.minimize.addEventListener('click', () => {
                state.isOpen = false;
                elements.chatbot.classList.remove('active');
            });
            
            // Enviar mensaje
            function sendMessage() {
                const text = elements.input.value.trim();
                if (!text) return;
                
                addMessage(text, true);
                elements.input.value = '';
                
                // Procesar respuesta simple
                setTimeout(() => {
                    const lowerText = text.toLowerCase();
                    
                    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('cuanto')) {
                        handleAction('show_services');
                    } else if (lowerText.includes('cita') || lowerText.includes('agendar') || lowerText.includes('reservar')) {
                        handleAction('schedule_appointment');
                    } else if (lowerText.includes('servicio') || lowerText.includes('servicios')) {
                        handleAction('show_services');
                    } else if (lowerText.includes('hola') || lowerText.includes('buenas')) {
                        addMessage('Hola! ¿En que puedo ayudarte hoy?');
                        renderQuickReplies(FLOWS.welcome.quickReplies);
                    } else {
                        addMessage('Gracias por tu mensaje. Un asesor te contactara pronto. Mientras tanto, puedo ayudarte con:');
                        renderQuickReplies(FLOWS.welcome.quickReplies);
                    }
                }, 500);
            }
            
            elements.send.addEventListener('click', sendMessage);
            elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
            
            // Formulario
            elements.formBack.addEventListener('click', () => {
                hideForm();
            });
            
            elements.formSubmit.addEventListener('click', submitForm);
        }
        
        // ========== INICIALIZACIÓN ==========
        function init() {
            initElements();
            bindEvents();
        }
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
        
    })();
