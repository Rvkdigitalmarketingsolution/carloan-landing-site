class HeaderCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.isAutoplay = true;
        this.autoplayDelay = 5000;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupBackgroundImages();
        this.startAutoplay();
        this.updateProgressBar();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const autoplayToggle = document.getElementById('autoplayToggle');
        
        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
        
        // Slide indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoplay();
            }
        });
        
        // Pause autoplay on hover
        const container = document.querySelector('.carousel-container');
        container.addEventListener('mouseenter', () => this.pauseAutoplay());
        container.addEventListener('mouseleave', () => {
            if (this.isAutoplay) this.startAutoplay();
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupBackgroundImages() {
        this.slides.forEach(slide => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                slide.style.backgroundImage = `url(${bgImage})`;
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const container = document.querySelector('.carousel-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Update slide classes
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');
        
        this.slides[index].classList.remove('prev');
        this.slides[index].classList.add('active');
        
        // Update indicators
        this.indicators[this.currentSlide].classList.remove('active');
        this.indicators[index].classList.add('active');
        
        // Clean up previous slide after animation
        setTimeout(() => {
            this.slides.forEach((slide, i) => {
                if (i !== index) {
                    slide.classList.remove('prev');
                }
            });
            this.isAnimating = false;
        }, 800);
        
        this.currentSlide = index;
        this.updateProgressBar();
        
        // Reset autoplay timer
        if (this.isAutoplay) {
            this.startAutoplay();
        }
    }
    
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    startAutoplay() {
        this.clearAutoplay();
        if (this.isAutoplay) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoplayDelay);
        }
    }
    
    pauseAutoplay() {
        this.clearAutoplay();
    }
    
    clearAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (this.isAutoplay) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            this.startAutoplay();
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            this.pauseAutoplay();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderCarousel();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any size-dependent elements if needed
    const progressFill = document.querySelector('.progress-fill');
    const carousel = window.headerCarousel;
    if (carousel) {
        carousel.updateProgressBar();
    }
});

// Preload images for better performance
function preloadImages() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        const bgImage = slide.dataset.bg;
        if (bgImage) {
            const img = new Image();
            img.src = bgImage;
        }
    });
}

// Call preload after DOM is loaded
document.addEventListener('DOMContentLoaded', preloadImages);


// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const loanForm = document.getElementById('loanForm');

// Calculator Elements
const loanAmountSlider = document.getElementById('loanAmount');
const interestRateSlider = document.getElementById('interestRate');
const tenureSlider = document.getElementById('tenure');

const loanAmountValue = document.getElementById('loanAmountValue');
const interestRateValue = document.getElementById('interestRateValue');
const tenureValue = document.getElementById('tenureValue');

const emiAmount = document.getElementById('emiAmount');
const principalAmount = document.getElementById('principalAmount');
const totalInterest = document.getElementById('totalInterest');
const totalAmount = document.getElementById('totalAmount');

// Navigation Toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navigation Link Click Handlers
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }
});

// Format Number with Commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format Currency
function formatCurrency(amount) {
    return `₹${formatNumber(Math.round(amount))}`;
}

// EMI Calculator Functions
function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / (12 * 100);
    const numberOfPayments = tenure * 12;
    
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return emi;
}

function updateCalculator() {
    const principal = parseInt(loanAmountSlider.value);
    const rate = parseFloat(interestRateSlider.value);
    const tenure = parseInt(tenureSlider.value);
    
    // Update display values
    loanAmountValue.textContent = formatCurrency(principal);
    interestRateValue.textContent = `${rate}%`;
    tenureValue.textContent = `${tenure} Year${tenure > 1 ? 's' : ''}`;
    
    // Calculate EMI
    const emi = calculateEMI(principal, rate, tenure);
    const totalPaid = emi * tenure * 12;
    const totalInterestPaid = totalPaid - principal;
    
    // Update result display
    emiAmount.textContent = formatCurrency(emi);
    principalAmount.textContent = formatCurrency(principal);
    totalInterest.textContent = formatCurrency(totalInterestPaid);
    totalAmount.textContent = formatCurrency(totalPaid);
}

// Calculator Event Listeners
loanAmountSlider?.addEventListener('input', updateCalculator);
interestRateSlider?.addEventListener('input', updateCalculator);
tenureSlider?.addEventListener('input', updateCalculator);

// Initialize calculator
updateCalculator();

// Form Validation
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('fullName') || formData.get('fullName').trim().length < 2) {
        errors.push('Please enter a valid full name');
    }
    
    // Mobile validation
    const mobile = formData.get('mobile');
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
        errors.push('Please enter a valid 10-digit mobile number');
    }
    
    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Loan amount validation
    const loanAmount = parseInt(formData.get('loanAmount'));
    if (!loanAmount || loanAmount < 100000 || loanAmount > 5000000) {
        errors.push('Loan amount must be between ₹1,00,000 and ₹50,00,000');
    }
    
    // Monthly income validation
    const monthlyIncome = parseInt(formData.get('monthlyIncome'));
    if (!monthlyIncome || monthlyIncome < 15000) {
        errors.push('Monthly income must be at least ₹15,000');
    }
    
    // Terms acceptance
    if (!formData.get('terms')) {
        errors.push('Please accept the terms and conditions');
    }
    
    return errors;
}

// Form Submission
loanForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        const formData = new FormData(loanForm);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        alert('Thank you for your application! We will contact you within 24 hours with the loan approval status.');
        
        // Reset form
        loanForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error processing your application. Please try again later.');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .benefit-card, .testimonial-card');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll event listener with throttling
window.addEventListener('scroll', throttle(animateOnScroll, 100));

// Initial check for elements in view
animateOnScroll();

// Phone number formatting
const mobileInput = document.getElementById('mobile');
mobileInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Loan amount formatting in form
const loanAmountFormInput = document.getElementById('loanAmountForm');
loanAmountFormInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
        // Add commas for readability
        const numValue = parseInt(value);
        if (numValue >= 100000 && numValue <= 5000000) {
            e.target.style.borderColor = 'var(--success-color)';
        } else {
            e.target.style.borderColor = 'var(--error-color)';
        }
    }
});


