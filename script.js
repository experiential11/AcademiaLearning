// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Animated counters for stats
    initCounters();
    
    // Form handling
    initContactForm();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Additional interactive elements
    initInteractiveElements();
});

// Navigation Toggle
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });

    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(20, 33, 61, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.btn[href^="#"], .btn-primary, .btn-secondary');
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle hero buttons
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.textContent.trim() === 'Get Started') {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            } else if (button.textContent.trim() === 'Learn More') {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const offsetTop = aboutSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Animated counters for statistics
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 2000; // Animation duration in milliseconds

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (speed / 16); // 16ms per frame (60fps)
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Use Intersection Observer to trigger animation when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const inputs = form.querySelectorAll('input, select, textarea');

    // Form validation
    const validateForm = () => {
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const isRequired = input.hasAttribute('required');
            
            // Remove existing error styles
            input.classList.remove('error');
            
            if (isRequired && !value) {
                input.classList.add('error');
                isValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    input.classList.add('error');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    };

    // Real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });

    // Initialize EmailJS
    (function() {
        emailjs.init("vM4XCTQee06R68Xkc");
    })();

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Prepare the email parameters
        const templateParams = {
            to_email: 'azaan@academialearning.ca',
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // Send the email using EmailJS
            await emailjs.send(
                'service_yehujg8',
                'template_morqydc',
                templateParams
            );

            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
            // Reset form labels
            inputs.forEach(input => {
                const label = input.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.top = '15px';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--text-gray)';
                }
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

// Simulate form submission
function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        font-size: 1rem;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
        hideNotification(notification);
    }, 5000);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimer);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Additional interactive elements
function initInteractiveElements() {
    // Parallax effect for hero shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });

    // Interactive service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Interactive hero cards with mouse movement
    const heroCards = document.querySelectorAll('.hero-card');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            heroCards.forEach((card, index) => {
                const xOffset = (x / rect.width - 0.5) * 20;
                const yOffset = (y / rect.height - 0.5) * 20;
                
                card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            heroCards.forEach(card => {
                card.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Dynamic gradient animation for form inputs
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const gradient = input.parentNode.querySelector('.form-gradient');
            if (gradient) {
                gradient.style.background = 'linear-gradient(90deg, #007ba7, #f7cb2d, #055c9d)';
                gradient.style.backgroundSize = '200% 100%';
                gradient.style.animation = 'gradientShift 2s ease infinite';
            }
        });
        
        input.addEventListener('blur', () => {
            const gradient = input.parentNode.querySelector('.form-gradient');
            if (gradient) {
                gradient.style.animation = 'none';
                gradient.style.background = 'linear-gradient(90deg, #007ba7, #f7cb2d)';
            }
        });
    });

    // Add CSS animation for gradient shift
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Add floating animation to contact cards
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.contact-icon');
            icon.style.transform = 'translateY(-5px) rotate(5deg)';
            icon.style.boxShadow = '0 15px 30px rgba(0, 123, 167, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.contact-icon');
            icon.style.transform = 'translateY(0) rotate(0deg)';
            icon.style.boxShadow = 'none';
        });
    });
}

// Utility function to add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Initialize ripple effect
document.addEventListener('DOMContentLoaded', addRippleEffect);