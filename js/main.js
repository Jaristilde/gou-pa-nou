/* =====================================================
   GOU PA NOU - Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    
    // Close mobile nav when clicking a link
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Lazy load images
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
  
  // Form validation (Contact page)
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('input[name="name"]');
      const email = this.querySelector('input[name="email"]');
      const message = this.querySelector('textarea[name="message"]');
      
      let isValid = true;
      
      // Simple validation
      if (name && name.value.trim() === '') {
        showError(name, 'Please enter your name');
        isValid = false;
      } else if (name) {
        clearError(name);
      }
      
      if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      } else if (email) {
        clearError(email);
      }
      
      if (message && message.value.trim() === '') {
        showError(message, 'Please enter a message');
        isValid = false;
      } else if (message) {
        clearError(message);
      }
      
      if (isValid) {
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          alert('Thank you for your message! We will get back to you soon.');
          this.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let error = formGroup.querySelector('.error-message');
    
    if (!error) {
      error = document.createElement('span');
      error.className = 'error-message';
      error.style.color = '#8B1E3F';
      error.style.fontSize = '0.875rem';
      error.style.marginTop = '0.25rem';
      formGroup.appendChild(error);
    }
    
    error.textContent = message;
    input.style.borderColor = '#8B1E3F';
  }
  
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    
    if (error) {
      error.remove();
    }
    
    input.style.borderColor = '';
  }
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter__form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('.newsletter__input');
      
      if (emailInput && isValidEmail(emailInput.value)) {
        const submitBtn = this.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          alert('Thank you for subscribing to our newsletter!');
          emailInput.value = '';
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1000);
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
  
  // Animate elements on scroll
  const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
  
  if (animateOnScroll.length > 0 && 'IntersectionObserver' in window) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1
    });
    
    animateOnScroll.forEach(el => animateObserver.observe(el));
  }
});
