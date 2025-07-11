fetch('http://localhost:5000/api/products?limit=10') // Adjust the limit as needed
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products');
    
    // Clear any existing content
    container.innerHTML = '';
    
    products.forEach(p => {
      // Create product card element
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Generate star rating HTML (you can replace this with actual rating data if available)
      const ratingStars = `
        <div class="product-rating">
          ${Array(5).fill().map((_, i) => 
            `<i class="fas ${i < Math.floor(p.rating || 4) ? 'fa-star' : 
              (p.rating % 1 > 0.5 && i === Math.floor(p.rating)) ? 'fa-star-half-alt' : 'far fa-star'}"></i>`
          ).join('')}
          <span>(${p.ratingCount || Math.floor(Math.random() * 100) + 50})</span>
        </div>
      `;
      
      // Set up product card HTML
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${p.title}</h3>
          <p class="product-description">${p.description || 'No description available.'}</p>
          <div class="product-price">₹${p.price.toFixed(2)}</div>

          ${ratingStars}
          <button class="add-to-cart" onclick='addToCart(${JSON.stringify(p).replace(/</g, '\\u003c')})'>
            Add to Cart
          </button>
        </div>
      `;
      
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error loading products:', error);
    document.getElementById('products').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load products. Please try again later.</p>
      </div>
    `;
  });

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart by ID
  const existingItemIndex = cart.findIndex(item => item._id === product._id);
  
  if (existingItemIndex !== -1) {
    // If product exists, increment quantity
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
  } else {
    // If new product, add with quantity 1
    product.quantity = 1;
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.title} added to cart!`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}



function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);