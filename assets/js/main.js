// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Nav Toggle
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const body = document.body;
  
  if (navbarToggle) {
    navbarToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (navbarMenu && navbarMenu.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  });
  
  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTopButton.classList.add('active');
      } else {
        backToTopButton.classList.remove('active');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize core functionality
  initCarousel();
  initAnimations();
  
  function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach((carousel, carouselIndex) => {
      const items = carousel.querySelectorAll('.carousel-item');
      const indicators = carousel.querySelectorAll('.carousel-indicator');
      const prevBtn = carousel.querySelector('.carousel-control.prev');
      const nextBtn = carousel.querySelector('.carousel-control.next');
      
      if (!items.length) return;
      
      let currentSlide = 0;
      const totalSlides = items.length;
      
      // Initialize with first slide active
      items[0].classList.add('active');
      if (indicators.length) indicators[0].classList.add('active');
      
      // Initialize autoplay
      let autoplayInterval = setInterval(() => nextSlide(), 5000);
      
      function showSlide(index) {
        // Reset active class
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Set the current slide
        currentSlide = index;
        
        // Handle edge cases
        if (currentSlide < 0) {
          currentSlide = totalSlides - 1;
        } else if (currentSlide >= totalSlides) {
          currentSlide = 0;
        }
        
        // Set active classes
        if (items[currentSlide]) {
          items[currentSlide].classList.add('active');
        }
        
        if (indicators.length && indicators[currentSlide]) {
          indicators[currentSlide].classList.add('active');
        }
        
        // Reset autoplay
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => nextSlide(), 5000);
      }
      
      function nextSlide() {
        showSlide(currentSlide + 1);
      }
      
      function prevSlide() {
        showSlide(currentSlide - 1);
      }
      
      // Event listeners for controls
      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          prevSlide();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          nextSlide();
        });
      }
      
      // Event listeners for indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
          e.preventDefault();
          showSlide(index);
        });
      });
      
      // Pause autoplay when hovering over carousel
      carousel.addEventListener('mouseenter', function() {
        clearInterval(autoplayInterval);
      });
      
      // Resume autoplay when mouse leaves
      carousel.addEventListener('mouseleave', function() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => nextSlide(), 5000);
      });
      
      // Handle touch events for mobile
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoplayInterval);
      }, { passive: true });
      
      carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        autoplayInterval = setInterval(() => nextSlide(), 5000);
      }, { passive: true });
      
      function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance < -swipeThreshold) {
          nextSlide();
        } else if (swipeDistance > swipeThreshold) {
          prevSlide();
        }
      }
      
      // Check active slide on load
      const activeSlides = carousel.querySelectorAll('.carousel-item.active');
      
      // Make sure at least one slide is active
      if (activeSlides.length === 0) {
        if (items[0]) {
          items[0].classList.add('active');
        }
        if (indicators.length && indicators[0]) {
          indicators[0].classList.add('active');
        }
      } else if (activeSlides.length > 1) {
        // Fix multiple active slides
        activeSlides.forEach((slide, index) => {
          if (index > 0) {
            slide.classList.remove('active');
          }
        });
      }
      
      // Manually trigger first slide to ensure animations work
      setTimeout(() => {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        if (activeSlide) {
          // Force a reflow
          activeSlide.classList.remove('active');
          void activeSlide.offsetWidth; // Trigger reflow
          activeSlide.classList.add('active');
        }
      }, 100);
    });
  }
  
  function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Add animation classes to elements
    addAnimationClasses();
    
    // Create intersection observer for scroll-triggered animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.animationDelay || 0;
          
          setTimeout(() => {
            requestAnimationFrame(() => {
              element.classList.add('animated');
            });
          }, parseInt(delay, 10));
          
          animationObserver.unobserve(element);
        }
      });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-up, .fade-in, .scale-in, .slide-left, .slide-right, .stagger-children, .animate-on-scroll'
    );
    
    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  }
  
  function addAnimationClasses() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
      el.classList.add('fade-up');
    });
    
    // Service cards with stagger
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
      servicesGrid.classList.add('stagger-children');
      servicesGrid.querySelectorAll('.service-card').forEach(card => {
        card.classList.add('fade-up');
      });
    }
    
    // About section
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
      aboutImage.classList.add('slide-left');
    }
    
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      aboutContent.classList.add('slide-right');
    }
    
    const aboutFeatures = document.querySelector('.about-features');
    if (aboutFeatures) {
      aboutFeatures.classList.add('stagger-children');
    }
    
    // Junk car section
    const junkCarContent = document.querySelector('.junk-car-content');
    if (junkCarContent) {
      junkCarContent.classList.add('slide-left');
    }
    
    const quoteFormWrapper = document.querySelector('.quote-form-wrapper');
    if (quoteFormWrapper) {
      quoteFormWrapper.classList.add('fade-up');
    }
    
    // Benefits
    document.querySelectorAll('.benefit').forEach((el, index) => {
      el.classList.add('fade-up');
      el.dataset.animationDelay = index * 100;
    });
    
    // Gallery carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.classList.add('scale-in');
    }
    
    // Gallery thumbnails title
    const thumbnailsTitle = document.querySelector('.thumbnails-title');
    if (thumbnailsTitle) {
      thumbnailsTitle.classList.add('fade-up');
    }
    
    // Emergency CTA
    const emergencyCta = document.querySelector('.emergency-cta');
    if (emergencyCta) {
      emergencyCta.classList.add('fade-up');
    }
    
    // Contact section
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
      contactInfo.classList.add('slide-left');
    }
    
    const contactMap = document.querySelector('.contact-map');
    if (contactMap) {
      contactMap.classList.add('slide-right');
    }
    
    // Contact cards
    document.querySelectorAll('.contact-card').forEach((el, index) => {
      el.classList.add('fade-up');
      el.dataset.animationDelay = index * 80;
    });
    
    // Rating highlight
    const ratingHighlight = document.querySelector('.rating-highlight');
    if (ratingHighlight) {
      ratingHighlight.classList.add('scale-in');
    }
    
    // Feature cards (for location pages)
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
      featuresGrid.classList.add('stagger-children');
    }
    
    // Area cards
    const areasGrid = document.querySelector('.areas-grid');
    if (areasGrid) {
      areasGrid.classList.add('stagger-children');
    }
    
    // Footer columns
    const footerGrid = document.querySelector('.footer-grid');
    if (footerGrid) {
      footerGrid.classList.add('stagger-children');
    }
  }
  
  // Detect when images are loaded
  window.addEventListener('load', function() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        // Image loaded
      }
    });
  });
  
  // Junk Car Offer Form Handling
  const offerForm = document.querySelector('.offer-form');
  if (offerForm) {
    offerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form input values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const vehicle = document.getElementById('vehicle').value.trim();
      const condition = document.getElementById('condition').value.trim();
      
      // Validate form
      let isValid = true;
      let errorMessage = '';
      
      if (!name) {
        isValid = false;
        errorMessage += 'Please enter your name.\n';
        highlightInvalidField('name');
      }
      
      if (!phone) {
        isValid = false;
        errorMessage += 'Please enter your phone number.\n';
        highlightInvalidField('phone');
      } else if (!isValidPhone(phone)) {
        isValid = false;
        errorMessage += 'Please enter a valid phone number.\n';
        highlightInvalidField('phone');
      }
      
      if (!vehicle) {
        isValid = false;
        errorMessage += 'Please enter your vehicle details.\n';
        highlightInvalidField('vehicle');
      }
      
      if (!condition) {
        isValid = false;
        errorMessage += 'Please describe the condition of your vehicle.\n';
        highlightInvalidField('condition');
      }
      
      // Handle form submission
      if (isValid) {
        // Show loading state on the submit button
        const submitBtn = offerForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          // Reset the form
          offerForm.reset();
          
          // Show success message
          const formContainer = offerForm.closest('.offer-form-container');
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success-message';
          successMessage.innerHTML = `
            <svg class="icon icon-lg"><use xlink:href="#icon-check-circle"></use></svg>
            <h3>Thank you for your submission!</h3>
            <p>We've received your request and will contact you shortly with an offer for your vehicle.</p>
            <button class="btn-primary" id="reset-form">Submit Another Request</button>
          `;
          
          // Replace form with success message
          formContainer.appendChild(successMessage);
          offerForm.style.display = 'none';
          
          // Add event listener to reset button
          document.getElementById('reset-form').addEventListener('click', function() {
            successMessage.remove();
            offerForm.style.display = 'flex';
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          });
        }, 1500);
      } else {
        // Display error message
        alert(errorMessage);
      }
    });
    
    // Helper function to validate phone number
    function isValidPhone(phone) {
      const phoneRegex = /^[\d\s\-\(\)\.]+$/;
      return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    // Helper function to highlight invalid field
    function highlightInvalidField(fieldId) {
      const field = document.getElementById(fieldId);
      field.classList.add('invalid');
      
      // Remove invalid class on focus
      field.addEventListener('focus', function() {
        this.classList.remove('invalid');
      }, { once: true });
    }
    
    // Add input event listeners for real-time validation feedback
    document.querySelectorAll('.form-floating input').forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          this.classList.add('has-content');
        } else {
          this.classList.remove('has-content');
        }
      });
    });
  }
  
  // Initialize Junk Car Form
  const junkCarForm = document.getElementById('junkCarForm');
  if (junkCarForm) {
    junkCarForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const carYear = document.getElementById('car-year').value;
      const carMake = document.getElementById('car-make').value.trim();
      const carModel = document.getElementById('car-model').value.trim();
      const name = document.getElementById('junk-name').value.trim();
      const phone = document.getElementById('junk-phone').value.trim();
      const condition = document.querySelector('input[name="condition"]:checked')?.value;

      // Validate all fields
      let valid = true;
      if (!carYear) {
        highlightInvalidField('car-year');
        valid = false;
      }
      if (!carMake) {
        highlightInvalidField('car-make');
        valid = false;
      }
      if (!carModel) {
        highlightInvalidField('car-model');
        valid = false;
      }
      if (!name) {
        highlightInvalidField('junk-name');
        valid = false;
      }
      if (!isValidPhone(phone)) {
        highlightInvalidField('junk-phone');
        valid = false;
      }
      if (!condition) {
        document.querySelector('.condition-group').classList.add('invalid');
        valid = false;
      } else {
        document.querySelector('.condition-group').classList.remove('invalid');
      }

      if (!valid) {
        return;
      }

      // Clear previous result
      clearPreviousPrice();

      // Show loading spinner
      document.getElementById('submit-btn').innerHTML = '<div class="loading-spinner"></div>';
      document.getElementById('submit-btn').disabled = true;

      // Fetch vehicle data from API for curb weight
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${carMake}/modelyear/${carYear}?format=json`)
        .then(response => response.json())
        .then(data => {
          let model = data.Results.find(m => m.Model_Name.toLowerCase().includes(carModel.toLowerCase()));
          if (!model) {
            model = data.Results[0];
          }
          
          // Simulate weight based on vehicle type
          let curbWeight;
          const lowerModel = carModel.toLowerCase();
          
          if (lowerModel.includes('truck') || lowerModel.includes('pickup')) {
            curbWeight = 4500 + Math.floor(Math.random() * 1000);
          } else if (lowerModel.includes('suv') || lowerModel.includes('crossover')) {
            curbWeight = 3800 + Math.floor(Math.random() * 800);
          } else if (lowerModel.includes('van')) {
            curbWeight = 4000 + Math.floor(Math.random() * 600);
          } else {
            curbWeight = 3000 + Math.floor(Math.random() * 1000);
          }
          
          // Calculate price based on weight and condition
          const steelPricePerPound = 0.07;
          let conditionMultiplier = 1;
          
          switch(condition) {
            case 'excellent':
              conditionMultiplier = 1.3;
              break;
            case 'good':
              conditionMultiplier = 1.1;
              break;
            case 'fair':
              conditionMultiplier = 0.9;
              break;
            case 'poor':
              conditionMultiplier = 0.7;
              break;
            default:
              conditionMultiplier = 1;
          }
          
          const price = (curbWeight * steelPricePerPound * conditionMultiplier).toFixed(2);
          
          // Update the price display
          document.getElementById('pay-price').textContent = price;
          document.getElementById('curb-weight').textContent = curbWeight;
          
          // Update vehicle information
          document.getElementById('selectedYear').textContent = carYear;
          document.getElementById('selectedMake').textContent = carMake;
          document.getElementById('selectedModel').textContent = carModel;
          
          // Return the form button to normal state
          document.getElementById('submit-btn').innerHTML = 'Get Offer';
          document.getElementById('submit-btn').disabled = false;
          
          // Show the offer
          offerMade();
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('submit-btn').innerHTML = 'Get Offer';
          document.getElementById('submit-btn').disabled = false;
          alert('There was an error calculating your offer. Please try again.');
        });
    });
  }
}); 

// Mobile menu toggle
function initMobileMenu() {
  return;
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  const scrollThreshold = 50;
  
  function checkScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

// Initialize all modules
function init() {
  initMobileMenu();
  initHeaderScroll();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Junk Car Price Calculator
document.addEventListener('DOMContentLoaded', function() {
  const steelPriceApi = "165";
  const selectedYear = document.querySelector("#selectedYear");
  const selectedMake = document.querySelector("#selectedMake");
  const selectedModel = document.querySelector("#selectedModel");
  const carResults = document.querySelector(".car-results");
  const payPrice = document.querySelector("#pay-price");
  const curbWeight = document.querySelector("#curb-weight");
  const carOffer = document.querySelector("#carOffer");
  
  // Find the offer form
  const offerForm = document.querySelector('.offer-form');
  
  if (offerForm) {
    offerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const searchedYear = document.querySelector("#selectedYearByUser").value;
      const searchedMake = document.querySelector("#selectedMakeByUser").value;
      const searchedModel = document.querySelector("#selectedModelByUser").value;
      
      // Show loading state on submit button
      const submitBtn = offerForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
      submitBtn.disabled = true;
      
      // Validate inputs
      if (!searchedYear || !searchedMake || !searchedModel) {
        alert("Please fill out all fields");
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        return false;
      }
      
      // Build API query
      const apiURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';
      const fullQuery = apiURL + searchedMake + '/modelyear/' + searchedYear + '/vehicleType/car?format=json';
      
      fetch(fullQuery)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Clear previous results
          clearPreviousPrice();
          
          // Simulate vehicle data
          const vehicleWeights = {
            "small": { min: 2500, max: 3500 },
            "medium": { min: 3500, max: 4500 },
            "large": { min: 4500, max: 6000 }
          };
          
          // Determine size category based on make and model
          let sizeCategory = "medium";
          const modelLower = searchedModel.toLowerCase();
          
          if (modelLower.includes("civic") || modelLower.includes("corolla") || modelLower.includes("focus") || modelLower.includes("fiesta")) {
            sizeCategory = "small";
          } else if (modelLower.includes("escalade") || modelLower.includes("suburban") || modelLower.includes("navigator") || modelLower.includes("expedition")) {
            sizeCategory = "large";
          }
          
          // Generate a random weight within the category range
          const minWeight = vehicleWeights[sizeCategory].min;
          const maxWeight = vehicleWeights[sizeCategory].max;
          const randomWeight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
          
          // Calculate price based on weight
          const convertedCurbWeight = randomWeight / 2000;
          const priceBeforeUnc = convertedCurbWeight * steelPriceApi;
          const payPriceReturned = priceBeforeUnc * 0.75;
          const finalPriceReturned = payPriceReturned.toFixed(2);
          
          // Update DOM with results
          curbWeight.textContent = randomWeight;
          payPrice.textContent = finalPriceReturned;
          selectedYear.textContent = searchedYear;
          selectedMake.textContent = searchedMake;
          selectedModel.textContent = searchedModel;
          
          // Show results
          carResults.classList.add("active");
          offerMade();
          
          // Reset form button
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          
          // Fallback - simulate a response
          clearPreviousPrice();
          
          // Generate random weight between 2500-5500 lbs
          const randomWeight = Math.floor(Math.random() * (5500 - 2500 + 1)) + 2500;
          
          // Calculate price based on weight
          const convertedCurbWeight = randomWeight / 2000;
          const priceBeforeUnc = convertedCurbWeight * steelPriceApi;
          const payPriceReturned = priceBeforeUnc * 0.75;
          const finalPriceReturned = payPriceReturned.toFixed(2);
          
          // Update DOM with results
          curbWeight.textContent = randomWeight;
          payPrice.textContent = finalPriceReturned;
          selectedYear.textContent = searchedYear;
          selectedMake.textContent = searchedMake;
          selectedModel.textContent = searchedModel;
          
          // Show results
          carResults.classList.add("active");
          offerMade();
          
          // Reset form button
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
      
      return false;
    });
  }
  
  // Helper function to clear previous price
  function clearPreviousPrice() {
    if (payPrice) payPrice.textContent = "";
    if (curbWeight) curbWeight.textContent = "";
    if (selectedYear) selectedYear.textContent = "";
    if (selectedMake) selectedMake.textContent = "";
    if (selectedModel) selectedModel.textContent = "";
  }
  
  // Helper function when offer is made
  function offerMade() {
    if (carOffer) {
      carOffer.classList.add("offered");
      
      // Hide the submit button when offer is displayed
      const submitBtn = document.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.style.display = 'none';
      }
    }
  }
}); 

// Global helper functions
function clearPreviousPrice() {
  const carOffer = document.getElementById('carOffer');
  if (carOffer) {
    carOffer.classList.remove('offered');
  }
}

function offerMade() {
  const carOffer = document.getElementById('carOffer');
  if (carOffer) {
    carOffer.classList.add('offered');
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.style.display = 'none';
    }
  }
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\(\)\.]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function highlightInvalidField(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add('invalid');
    
    field.addEventListener('focus', function() {
      this.classList.remove('invalid');
    }, { once: true });
  }
}

// Add input event listeners for real-time validation feedback
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.form-floating input').forEach(input => {
    input.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        this.classList.add('has-content');
      } else {
        this.classList.remove('has-content');
      }
    });
  });
});

// Lightbox Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-nav.prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-nav.next');
  const thumbnailsGrid = document.getElementById('thumbnails-grid');
  const showMoreBtn = document.getElementById('show-more-btn');
  
  if (!lightbox || !lightboxImg) return;
  
  let galleryImages = [];
  let currentImageIndex = 0;
  
  function collectGalleryImages() {
    galleryImages = [];
    const thumbnails = thumbnailsGrid?.querySelectorAll('.thumbnail-item img');
    if (thumbnails) {
      thumbnails.forEach(img => {
        if (img.src) {
          galleryImages.push(img.src);
        }
      });
    }
    console.log('Gallery images collected:', galleryImages.length);
  }
  
  collectGalleryImages();
  
  window.addEventListener('load', function() {
    collectGalleryImages();
  });
  
  function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;
    
    currentImageIndex = index;
    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight;
    lightboxImg.style.animation = 'lightboxZoom 0.3s ease-out';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    animateImageTransition();
  }
  
  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    animateImageTransition();
  }
  
  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
  }
  
  function animateImageTransition() {
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight;
    lightboxImg.style.animation = 'lightboxZoom 0.3s ease-out';
  }
  
  if (thumbnailsGrid) {
    const thumbnailItems = thumbnailsGrid.querySelectorAll('.thumbnail-item');
    thumbnailItems.forEach((item, idx) => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const img = this.querySelector('img');
        if (img && img.src) {
          let index = galleryImages.indexOf(img.src);
          if (index === -1) {
            collectGalleryImages();
            index = galleryImages.indexOf(img.src);
          }
          if (index !== -1) {
            openLightbox(index);
          } else {
            galleryImages.push(img.src);
            openLightbox(galleryImages.length - 1);
          }
        }
      });
    });
  }
  
  const carouselItems = document.querySelectorAll('.carousel-item img');
  carouselItems.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      const imgSrc = this.src;
      let index = galleryImages.indexOf(imgSrc);
      
      if (index === -1) {
        galleryImages.unshift(imgSrc);
        index = 0;
      }
      
      openLightbox(index);
    });
  });
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      showPrevImage();
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function(e) {
      e.stopPropagation();
      showNextImage();
    });
  }
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleLightboxSwipe();
  }, { passive: true });
  
  function handleLightboxSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance < -swipeThreshold) {
      showNextImage();
    } else if (swipeDistance > swipeThreshold) {
      showPrevImage();
    }
  }
  
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function() {
      const hiddenItems = thumbnailsGrid.querySelectorAll('.thumbnail-item.hidden');
      const visibleItems = thumbnailsGrid.querySelectorAll('.thumbnail-item:not(.hidden)');
      
      if (hiddenItems.length > 0) {
        hiddenItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.remove('hidden');
            item.classList.add('visible');
          }, index * 50);
        });
        
        this.classList.add('expanded');
        
        setTimeout(() => {
          collectGalleryImages();
        }, hiddenItems.length * 50 + 100);
      } else {
        const allItems = thumbnailsGrid.querySelectorAll('.thumbnail-item');
        allItems.forEach((item, index) => {
          if (index >= 8) {
            item.classList.remove('visible');
            item.classList.add('hidden');
          }
        });
        
        this.classList.remove('expanded');
        
        setTimeout(() => {
          collectGalleryImages();
        }, 100);
      }
    });
  }
});

// Reviews Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const reviewsCarousel = document.getElementById('reviews-carousel');
  if (!reviewsCarousel) return;
  
  const track = reviewsCarousel.querySelector('.reviews-track');
  const prevBtn = reviewsCarousel.querySelector('.carousel-control.prev');
  const nextBtn = reviewsCarousel.querySelector('.carousel-control.next');
  const cards = track.querySelectorAll('.review-card');
  
  if (!track || cards.length === 0) return;
  
  // Initialize show more/less functionality for reviews
  initReviewShowMore();
  
  function initReviewShowMore() {
    const reviewContents = document.querySelectorAll('.review-content');
    
    reviewContents.forEach(content => {
      const paragraph = content.querySelector('p');
      const showMoreBtn = content.querySelector('.show-more-link');
      
      if (!paragraph || !showMoreBtn) return;
      
      // Check if content is truncated (scrollHeight > clientHeight means overflow)
      function checkTruncation() {
        // Temporarily remove line-clamp to measure full height
        const originalDisplay = paragraph.style.display;
        const originalClamp = paragraph.style.webkitLineClamp;
        const originalOverflow = paragraph.style.overflow;
        
        paragraph.style.display = 'block';
        paragraph.style.webkitLineClamp = 'unset';
        paragraph.style.overflow = 'visible';
        
        const fullHeight = paragraph.scrollHeight;
        
        // Restore original styles
        paragraph.style.display = originalDisplay || '';
        paragraph.style.webkitLineClamp = originalClamp || '';
        paragraph.style.overflow = originalOverflow || '';
        
        // Get clamped height
        const clampedHeight = paragraph.clientHeight;
        
        // Show button if content is truncated (with some tolerance)
        if (fullHeight > clampedHeight + 5) {
          showMoreBtn.classList.add('visible');
        } else {
          showMoreBtn.classList.remove('visible');
        }
      }
      
      // Check on load and after fonts load
      checkTruncation();
      document.fonts?.ready.then(() => checkTruncation());
      
      // Handle click
      showMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
          content.classList.remove('expanded');
          this.textContent = 'Show more';
          this.setAttribute('aria-expanded', 'false');
        } else {
          content.classList.add('expanded');
          this.textContent = 'Show less';
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  
  let currentIndex = 0;
  
  function getCardsPerView() {
    return window.innerWidth >= 992 ? 3 : 1;
  }
  
  function getMaxIndex() {
    return Math.max(0, cards.length - getCardsPerView());
  }
  
  function getCardWidth() {
    if (cards.length === 0) return 0;
    const card = cards[0];
    const style = window.getComputedStyle(card);
    const marginRight = parseFloat(style.marginRight) || 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + (marginRight || gap);
  }
  
  function scrollToIndex(index) {
    const cardWidth = getCardWidth();
    const scrollAmount = index * cardWidth;
    track.style.transform = `translateX(-${scrollAmount}px)`;
    track.style.transition = 'transform 0.4s ease';
  }
  
  function updateButtons() {
    const maxIndex = getMaxIndex();
    if (prevBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
      nextBtn.disabled = currentIndex >= maxIndex;
    }
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        scrollToIndex(currentIndex);
        updateButtons();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
        scrollToIndex(currentIndex);
        updateButtons();
      }
    });
  }
  
  // Enable touch swiping
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    const maxIndex = getMaxIndex();
    
    if (swipeDistance < -swipeThreshold && currentIndex < maxIndex) {
      currentIndex++;
      scrollToIndex(currentIndex);
      updateButtons();
    } else if (swipeDistance > swipeThreshold && currentIndex > 0) {
      currentIndex--;
      scrollToIndex(currentIndex);
      updateButtons();
    }
  }, { passive: true });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      scrollToIndex(currentIndex);
      updateButtons();
    }, 250);
  });
  
  // Initialize
  updateButtons();
  
  // Add entrance animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Set initial state for animation
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  observer.observe(reviewsCarousel);
});

// Push-Up Challenge Video Carousel & Lightbox
document.addEventListener('DOMContentLoaded', function() {
  const videoLightbox = document.getElementById('video-lightbox');
  const lightboxVideo = document.getElementById('lightbox-video');
  const videosCarousel = document.getElementById('videos-carousel');
  const videoCards = document.querySelectorAll('.video-card');
  
  if (!videoLightbox || !lightboxVideo || videoCards.length === 0) return;
  
  const lightboxClose = videoLightbox.querySelector('.lightbox-close');
  
  // ==================
  // Video Carousel
  // ==================
  if (videosCarousel) {
    const track = videosCarousel.querySelector('.videos-track');
    const prevBtn = videosCarousel.querySelector('.carousel-control.prev');
    const nextBtn = videosCarousel.querySelector('.carousel-control.next');
    const cards = track.querySelectorAll('.video-card');
    
    let currentIndex = 1; // Start at second video
    
    function getCardsPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }
    
    function getMaxIndex() {
      return Math.max(0, cards.length - getCardsPerView());
    }
    
    function getCardWidth() {
      if (cards.length === 0) return 0;
      const card = cards[0];
      const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    }
    
    function scrollToIndex(index) {
      const cardWidth = getCardWidth();
      const scrollAmount = index * cardWidth;
      track.style.transform = `translateX(-${scrollAmount}px)`;
    }
    
    function updateButtons() {
      const maxIndex = getMaxIndex();
      if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
        nextBtn.disabled = currentIndex >= maxIndex;
      }
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          scrollToIndex(currentIndex);
          updateButtons();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
          currentIndex++;
          scrollToIndex(currentIndex);
          updateButtons();
        }
      });
    }
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      const maxIndex = getMaxIndex();
      
      if (swipeDistance < -swipeThreshold && currentIndex < maxIndex) {
        currentIndex++;
        scrollToIndex(currentIndex);
        updateButtons();
      } else if (swipeDistance > swipeThreshold && currentIndex > 0) {
        currentIndex--;
        scrollToIndex(currentIndex);
        updateButtons();
      }
    }, { passive: true });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }
        scrollToIndex(currentIndex);
        updateButtons();
      }, 250);
    });
    
    // Initialize - scroll to starting position
    scrollToIndex(currentIndex);
    updateButtons();
  }
  
  // ==================
  // Video Lightbox
  // ==================
  
  // Open video lightbox
  function openVideoLightbox(videoSrc) {
    const source = lightboxVideo.querySelector('source');
    if (source) {
      source.src = videoSrc;
      lightboxVideo.load();
    }
    videoLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto-play video
    lightboxVideo.play().catch(e => {
      console.log('Autoplay prevented:', e);
    });
  }
  
  // Close video lightbox
  function closeVideoLightbox() {
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    videoLightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Click on video cards to open lightbox
  videoCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const video = card.querySelector('video');
    const videoSrc = video?.querySelector('source')?.src;
    
    if (playBtn && videoSrc) {
      playBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openVideoLightbox(videoSrc);
      });
    }
    
    // Also allow clicking on the card itself
    card.addEventListener('click', function(e) {
      if (e.target === playBtn || playBtn.contains(e.target)) return;
      if (videoSrc) {
        openVideoLightbox(videoSrc);
      }
    });
    
    // Hover preview - play video thumbnail on hover
    card.addEventListener('mouseenter', function() {
      if (video) {
        video.play().catch(() => {});
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  });
  
  // Close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeVideoLightbox);
  }
  
  // Close on backdrop click
  videoLightbox.addEventListener('click', function(e) {
    if (e.target === videoLightbox) {
      closeVideoLightbox();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoLightbox.classList.contains('active')) {
      closeVideoLightbox();
    }
  });
});
