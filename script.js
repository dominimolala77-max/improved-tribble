document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Header
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // 3. Scroll Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Run animation only once
      }
    });
  }, observerOptions);

  // Select all elements to animate
  const animatableElements = document.querySelectorAll(".animate-on-scroll");
  animatableElements.forEach(el => observer.observe(el));
  
  // Call updateNavCount on load
  updateNavCount();
});

// Cart functionality
function addToCart(name, price, imageSrc, event) {
  if (event) {
    event.preventDefault();
  }
  let cart = JSON.parse(localStorage.getItem('truth_cart')) || [];
  let existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, image: imageSrc, quantity: 1 });
  }
  
  localStorage.setItem('truth_cart', JSON.stringify(cart));
  updateNavCount();
  console.log(`${name} added to cart!`);
  showCustomAlert(`${name} added to cart!`);
}

let customAlertTimeout;
function showCustomAlert(message) {
  let alertBox = document.getElementById('custom-alert-box');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'custom-alert-box';
    document.body.appendChild(alertBox);
  }
  alertBox.innerText = message;
  alertBox.classList.add('show');
  
  clearTimeout(customAlertTimeout);
  customAlertTimeout = setTimeout(() => {
    alertBox.classList.remove('show');
  }, 3000);
}

function updateNavCount() {
  const cart = JSON.parse(localStorage.getItem('truth_cart')) || [];
  let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const navCountElements = document.querySelectorAll('#cart-count-nav');
  navCountElements.forEach(el => el.innerText = totalCount);
}