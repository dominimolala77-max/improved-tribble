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

  // Load products from Sanity dynamically
  loadSanityProducts();
});

async function loadSanityProducts() {
  const menuContainer = document.querySelector('.menu-container');
  if (!menuContainer) return;

  const PROJECT_ID = 'p5bp831g';
  const DATASET = 'production';
  const QUERY = encodeURIComponent('*[_type == "product"]{_id, name, price, "imageUrl": image.asset->url, description}');
  const URL = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${QUERY}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result && data.result.length > 0) {
      // Remove hardcoded static products so they don't duplicate or look stale
      document.querySelectorAll('.coffee-card').forEach(card => card.remove());

      // Try finding the Proceed button to insert before it
      const proceedBtn = document.querySelector('.coffee-card1');

      data.result.forEach(product => {
        const card = document.createElement('div');
        card.className = 'coffee-card';
        card.innerHTML = `
            <img src="${product.imageUrl ? product.imageUrl : ''}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            <p class="price">R${product.price || 0}</p>
            ${product.name}
            <div class="quantity">
                Quantity: <input type="number" min="0" value="0">
            </div>
            <button class="add-to-cart-btn"
                style="margin-top: 10px; width: 100%; padding: 8px; background-color: #c9a962; color: #1a1a1a; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; transition: background-color 0.3s;"
                onmouseover="this.style.backgroundColor='#b8944f'" onmouseout="this.style.backgroundColor='#c9a962'">
                ORDER NOW
            </button>
        `;

        // Event listener for placing the order directly
        const btn = card.querySelector('.add-to-cart-btn');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const quantityInput = card.querySelector('input[type="number"]');
          const quantity = parseInt(quantityInput.value) || 1;

          if (quantity > 0) {
            const orderItem = {
              name: product.name,
              price: 'R' + (product.price || 0),
              image: product.imageUrl || '',
              quantity: quantity
            };
            localStorage.setItem('truth_cart', JSON.stringify([orderItem]));
            window.location.href = 'waiting time.html';
          } else {
            alert('Please select a quantity greater than 0');
          }
        });

        if (proceedBtn) {
          menuContainer.insertBefore(card, proceedBtn);
        } else {
          menuContainer.appendChild(card);
        }
      });
    }
  } catch (err) {
    console.error('Error fetching Sanity products:', err);
  }
}

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

// =========================================================================
// AI CHAT LOGIC
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const chatWidget = document.getElementById('chat-widget');
  const aiChat = document.getElementById('ai-chat');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatWidget || !aiChat) return;

  // --- 1. SPEECH RECOGNITION (Speech Friendly) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    micBtn.addEventListener('click', () => {
      if (micBtn.classList.contains('active')) {
        recognition.stop();
      } else {
        recognition.start();
        micBtn.classList.add('active');
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      micBtn.classList.remove('active');
      sendMessage(); // Automatically send voiced input
    };

    recognition.onend = () => micBtn.classList.remove('active');
    recognition.onerror = () => micBtn.classList.remove('active');
  } else {
    micBtn.style.display = 'none'; // Hide if not supported
  }

  // --- 2. CONVERSATIONAL LOGIC (Flexible Understanding) ---
  chatWidget.addEventListener('click', () => {
    aiChat.classList.toggle('active');
    if (aiChat.classList.contains('active')) {
      chatInput.focus();
    }
  });

  closeChat.addEventListener('click', () => {
    aiChat.classList.remove('active');
  });

  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.textContent = '...Analyzing your request...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      const response = getBotResponse(text);
      appendMessage('bot', response);
    }, 1000);
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text.toUpperCase();
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(input) {
    const query = input.toLowerCase();

    // --- Intent: Recommendations (What the customer wants) ---
    if (query.includes('recommend') || query.includes('should i get') || query.includes('suggest') || query.includes('tired') || query.includes('sleepy')) {
      if (query.includes('tea')) return "IF YOU WANT SOMETHING SOOTHING, I RECOMMEND OUR CHAMOMILE (R45) OR BLACK TEA (R32).";
      if (query.includes('wake up') || query.includes('tired') || query.includes('sleepy') || query.includes('strong')) {
        return "YOU NEED A DOSE OF TRUTH. OUR ESPRESSO (R30) OR CORTADO (R37) WILL KICKSTART YOUR SOUL. THE RESURRECTION ROAST IS ALSO A BOLD CHOICE.";
      }
      if (query.includes('smooth') || query.includes('milk')) {
        return "THE FLAT WHITE (R42) IS OUR SPECIALTY—BALANCED, SILKY, AND BOLD. THE TRUTH STANDARD.";
      }
      return "TELL ME: DO YOU WANT SOMETHING STRONG, CREAMY, OR CAFFEINE-FREE? I'VE GOT THE PROPER ANSWER FOR EACH.";
    }

    // --- Intent: Location & Connection ---
    if (query.match(/where|find|location|address|place|hq/)) {
      return "WE ARE ANCHORED AT 36 BUITENKANT STREET, CAPE TOWN. STEAMPUNK COFFEE AT THE HIGHEST LEVEL.";
    }

    // --- Intent: Human/Contact ---
    if (query.match(/talk|person|human|whatsapp|phone|call|contact|email/)) {
      return "I'M JUST AN AI, BUT MY CREATORS AT TRUTH CAN HELP. WHATSAPP THEM AT +27 64 207 2814 OR CALL +27 21 200 0440.";
    }

    // --- Intent: Prices ---
    if (query.match(/price|cost|how much|bucks|cheap|expensive/)) {
      return "OUR DAILY COFFEES START AT R30. PREMIUM BEAN BAGS START FROM R120. TRUTH ROASTED PROPERLY.";
    }

    // --- Intent: Barista Academy ---
    if (query.match(/learn|course|academy|training|barista|teach/)) {
      return "BECOME A MASTER. OUR BARISTA ACADEMY OFFERS LEGENDARY TRAINING. VISIT THE ACADEMY PAGE.";
    }

    // --- Greetings ---
    if (query.match(/hello|hi|hey|greetings|morning|afternoon/)) {
      return "READY TO FACE THE TRUTH? HOW CAN I GUIDE YOUR COFFEE JOURNEY TODAY?";
    }

    // --- ETHOS / PHILOSOPHY ---
    if (query.match(/sustainability|fair|trade|ethical|source|eco/)) {
      return "TRUTH COFFEE ROASTING IS PASSIONATE ABOUT ETHICAL SOURCING AND SUSTAINABILITY. WE ROAST EACH BEAN TO ITS PEAK FLAVOR, NATURALLY.";
    }

    return "THAT'S AN INTRIGUING QUERY. IF YOU'RE INTERESTED IN ROASTED PROPERLY COFFEE, ASKING ABOUT OUR 'MENU' OR 'ACADEMY' IS A GOOD START.";
  }
});

