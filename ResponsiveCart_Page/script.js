// Toggle Navigation Menu for Mobile
const toggleButton = document.querySelector('.toggle-button');
const nav = document.querySelector('.nav ul');

toggleButton.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Update Subtotal and Total Dynamically
document.addEventListener("DOMContentLoaded", () => {
  const quantityInputs = document.querySelectorAll('.item-quantity input');
  const subtotalElements = document.querySelectorAll('.item-total-price');
  const priceElements = document.querySelectorAll('.item-price');
  const totalPriceElement = document.querySelector('.total-price');
  const subtotalElement = document.querySelector('.price');

  function parsePrice(priceText) {
    // Remove commas and "Rs." prefix, then convert to a number
    return parseFloat(priceText.replace(/Rs\.|,/g, '').trim());
  }

  function formatPrice(price) {
    // Convert number to "Rs. xxx,xxx.xx" format
    return `Rs. ${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function updateCartTotals() {
    let total = 0;

    quantityInputs.forEach((input, index) => {
      const quantity = parseInt(input.value) || 0; // Default to 0 if invalid
      const price = parsePrice(priceElements[index].textContent); // Parse product price
      const subtotal = quantity * price;

      // Update individual product subtotal
      subtotalElements[index].textContent = formatPrice(subtotal);

      // Accumulate total price
      total += subtotal;
    });

    // Update total in the cart summary
    subtotalElement.textContent = formatPrice(total);
    totalPriceElement.textContent = formatPrice(total);
  }

  // Attach event listeners to quantity inputs
  quantityInputs.forEach(input => {
    input.addEventListener('input', updateCartTotals);
  });

  // Initial calculation on page load
  updateCartTotals();
});

document.addEventListener("DOMContentLoaded", () => {
    const cartDetailsBody = document.querySelector('.cart-details tbody');
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    const totalPriceElement = document.querySelector('.total-price');
    const subtotalElement = document.querySelector('.price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const checkoutButton = document.querySelector('.cart-totals button');
  
    let cartItems = [];
  
    function parsePrice(priceText) {
      return parseFloat(priceText.replace(/Rs\.|,/g, '').trim());
    }
  
    function formatPrice(price) {
      return `Rs. ${price.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  
    function updateCartTotals() {
      let total = 0;
  
      cartItems.forEach(item => {
        total += item.price * item.quantity;
      });
  
      subtotalElement.textContent = formatPrice(total);
      totalPriceElement.textContent = formatPrice(total);
    }
  
    function renderCart() {
      cartDetailsBody.innerHTML = ''; // Clear existing items
  
      cartItems.forEach(item => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td>
            <div class="item-details">
              <p class="item-name">${item.name}</p>
            </div>
          </td>
          <td class="item-price">${formatPrice(item.price)}</td>
          <td class="item-quantity">
            <input type="number" value="${item.quantity}" min="1" data-name="${item.name}">
          </td>
          <td class="item-total-price">${formatPrice(item.price * item.quantity)}</td>
        `;
  
        cartDetailsBody.appendChild(row);
      });
  
      // Attach event listeners to quantity inputs after rendering
      attachQuantityListeners();
    }
  
    function attachQuantityListeners() {
      const quantityInputs = document.querySelectorAll('.item-quantity input');
  
      quantityInputs.forEach(input => {
        input.addEventListener('input', event => {
          const itemName = event.target.dataset.name;
          const newQuantity = parseInt(event.target.value) || 1;
  
          // Update quantity in cart items
          const item = cartItems.find(item => item.name === itemName);
          if (item) {
            item.quantity = newQuantity;
          }
  
          // Re-render cart and update totals
          renderCart();
          updateCartTotals();
        });
      });
    }
  
    // Handle Add to Cart
    addToCartButtons.forEach(button => {
      button.addEventListener('click', event => {
        const product = event.target.closest('.product');
        const productName = product.dataset.name;
        const productPrice = parsePrice(product.dataset.price);
  
        const existingItem = cartItems.find(item => item.name === productName);
  
        if (existingItem) {
          existingItem.quantity += 1; // Increment quantity if item exists
        } else {
          cartItems.push({ name: productName, price: productPrice, quantity: 1 });
        }
  
        // Re-render cart and update totals
        renderCart();
        updateCartTotals();
      });
    });
  
    // Handle Checkout
    checkoutButton.addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
      } else {
        const total = parsePrice(totalPriceElement.textContent);
        alert(`Thank you for your purchase! Your total is ${formatPrice(total)}.`);
        cartItems = []; // Clear cart
        renderCart();
        updateCartTotals();
      }
    });
  
    // Initial Totals Update
    updateCartTotals();
  });
  // JavaScript to highlight the active page in the navigation menu
const currentPage = window.location.pathname.split('/').pop();

const links = document.querySelectorAll('.nav-link');
links.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// Adding item to the cart and updating cart data in localStorage
const addToCart = (productName, price, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.productName === productName);
  
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ productName, price, quantity });
    }
  
    // Update localStorage with the new cart data
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Update cart display
    updateCartDisplay();
  };
  
  // Function to update cart display (subtotal, items, etc.)
  const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalPriceElem = document.getElementById('subtotal-price');
    const totalPriceElem = document.getElementById('total-price');
    
    // Clear previous cart items
    cartItemsContainer.innerHTML = '';
  
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.productName}</td>
        <td>Rs. ${item.price}</td>
        <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product="${item.productName}" /></td>
        <td>Rs. ${item.price * item.quantity}</td>
      `;
      cartItemsContainer.appendChild(row);
    });
  
    // Update subtotal and total prices
    subtotalPriceElem.textContent = `Rs. ${subtotal.toFixed(2)}`;
    totalPriceElem.textContent = `Rs. ${subtotal.toFixed(2)}`;
  
    // Store updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  // Update the quantity when changed and update localStorage
  document.addEventListener('input', event => {
    if (event.target.classList.contains('quantity-input')) {
      const productName = event.target.getAttribute('data-product');
      const quantity = parseInt(event.target.value);
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      const itemIndex = cart.findIndex(item => item.productName === productName);
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
      }
    }
  });
  
  // Load the cart items on page load
  window.onload = () => {
    if (window.location.pathname.includes('checkout')) {
      updateCartDisplay();
    }
  };
  
  // Checkout button functionality
  document.getElementById('checkout-button').addEventListener('click', () => {
    window.location.href = 'checkout.html'; // Redirect to checkout page
  });

  
  

  
