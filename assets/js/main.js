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
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.getAttribute('data-aos');
          const delay = element.getAttribute('data-aos-delay') || 0;
          
          setTimeout(() => {
            requestAnimationFrame(() => {
              switch (animationType) {
                case 'fade-up':
                  element.classList.add('animated-fade-up');
                  break;
                case 'fade-down':
                  element.classList.add('animated-fade-down');
                  break;
                case 'fade-left':
                  element.classList.add('animated-fade-left');
                  break;
                case 'fade-right':
                  element.classList.add('animated-fade-right');
                  break;
                case 'zoom-in':
                  element.classList.add('animated-zoom-in');
                  break;
                default:
                  element.classList.add('animated-fade');
              }
            });
          }, parseInt(delay, 10));
          
          observer.unobserve(element);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
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
