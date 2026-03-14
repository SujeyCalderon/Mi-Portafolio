document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    function startTypingEffect(element, speed = 50) {
        const text = element.getAttribute('data-type-text') || element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                
                if (entry.target.hasAttribute('data-type-text') && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    startTypingEffect(entry.target);
                }
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('section, .stack-card, .project-card, .contact-card, .timeline-item, #contactTyping');
    
    elementsToAnimate.forEach(el => {
        if (!el.hasAttribute('data-type-text')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        } else {
            el.style.visibility = 'hidden';
        }
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        startTypingEffect(heroTitle, 70);
    }

    const wrapper = document.getElementById('projectsWrapper');
    const nextBtn = document.getElementById('nextBtn');

    if (wrapper) {
        let isDown = false;
        let startX;
        let scrollLeft;
        const scrollAmount = 380;

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.classList.add('active');
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.classList.remove('active');
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.classList.remove('active');
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuIcon.classList.toggle('fa-bars');
            menuIcon.classList.toggle('fa-times');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.add('fa-bars');
                menuIcon.classList.remove('fa-times');
                document.body.style.overflow = '';
            });
        });
    }
});

function copyEmail() {
    const email = "calderonmartinezsujey@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('copyToast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
}
function initBgAnimation() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 80;
    const maxDistance = 150;
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 230, 180, 0.4)';
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 230, 180, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            const mdx = particles[i].x - mouse.x;
            const mdy = particles[i].y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 200) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 230, 180, ${0.2 * (1 - mDist / 200)})`;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    initBgAnimation();
});
