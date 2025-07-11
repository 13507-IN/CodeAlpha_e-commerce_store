// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     const response = await fetch('http://localhost:5000/api/products');
//     const products = await response.json();
    
//     const container = document.getElementById('products');
//     container.innerHTML = '';
    
//     products.forEach(product => {
//       const card = document.createElement('div');
//       card.className = 'product-card';
      
//       card.innerHTML = `
//         <img src="${product.image}" alt="${product.title}" class="product-image">
//         <div class="product-info">
//           <h3 class="product-title">${product.title}</h3>
//           <div class="product-price">$${product.price.toFixed(2)}</div>
//           <div class="product-rating">
//             ${Array(5).fill().map((_, i) => 
//               `<i class="fas ${i < Math.floor(product.rating || 4) ? 'fa-star' : 
//                 (product.rating % 1 > 0.5 && i === Math.floor(product.rating)) ? 'fa-star-half-alt' : 'far fa-star'}"></i>`
//             ).join('')}
//             <span>(${product.ratingCount || Math.floor(Math.random() * 100) + 50})</span>
//           </div>
//           <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/</g, '\\u003c')})">
//             Add to Cart
//           </button>
//         </div>
//       `;
      
//       container.appendChild(card);
//     });
    
//     // Add filter/sort functionality
//     setupFilters(products);
//   } catch (error) {
//     console.error('Error loading products:', error);
//     document.getElementById('products').innerHTML = `
//       <div class="error-message">
//         <i class="fas fa-exclamation-triangle"></i>
//         <p>Unable to load products. Please try again later.</p>
//       </div>
//     `;
//   }
// });

// function setupFilters(products) {
//   const filterBtns = document.querySelectorAll('.filter-btn');
//   const sortSelect = document.querySelector('.sort-select');
  
//   filterBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//       filterBtns.forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       filterProducts(products);
//     });
//   });
  
//   sortSelect.addEventListener('change', () => {
//     filterProducts(products);
//   });
// }

// function filterProducts(products) {
//   const activeFilter = document.querySelector('.filter-btn.active').textContent;
//   const sortValue = document.querySelector('.sort-select').value;
  
//   let filteredProducts = [...products];
  
//   // Apply filters
//   if (activeFilter === 'Featured') {
//     filteredProducts = filteredProducts.filter(p => p.featured);
//   } else if (activeFilter === 'New Arrivals') {
//     filteredProducts = filteredProducts.filter(p => p.isNew);
//   } else if (activeFilter === 'On Sale') {
//     filteredProducts = filteredProducts.filter(p => p.onSale);
//   }
  
//   // Apply sorting
//   if (sortValue === 'price-asc') {
//     filteredProducts.sort((a, b) => a.price - b.price);
//   } else if (sortValue === 'price-desc') {
//     filteredProducts.sort((a, b) => b.price - a.price);
//   } else if (sortValue === 'rating') {
//     filteredProducts.sort((a, b) => b.rating - a.rating);
//   }
  
//   renderFilteredProducts(filteredProducts);
// }

// function renderFilteredProducts(products) {
//   const container = document.getElementById('products');
//   container.innerHTML = '';
  
//   if (products.length === 0) {
//     container.innerHTML = `
//       <div class="no-results">
//         <i class="fas fa-search"></i>
//         <p>No products match your filters</p>
//       </div>
//     `;
//     return;
//   }
  
//   products.forEach(product => {
//     const card = document.createElement('div');
//     card.className = 'product-card';
    
//     card.innerHTML = `
//       <img src="${product.image}" alt="${product.title}" class="product-image">
//       <div class="product-info">
//         <h3 class="product-title">${product.title}</h3>
//         <div class="product-price">$${product.price.toFixed(2)}</div>
//         <div class="product-rating">
//           ${Array(5).fill().map((_, i) => 
//             `<i class="fas ${i < Math.floor(product.rating || 4) ? 'fa-star' : 
//               (product.rating % 1 > 0.5 && i === Math.floor(product.rating)) ? 'fa-star-half-alt' : 'far fa-star'}"></i>`
//           ).join('')}
//           <span>(${product.ratingCount || Math.floor(Math.random() * 100) + 50})</span>
//         </div>
//         <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/</g, '\\u003c')})">
//           Add to Cart
//         </button>
//       </div>
//     `;
    
//     container.appendChild(card);
//   });
// }

// function addToCart(product) {
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const existingItem = cart.find(item => item._id === product._id);
  
//   if (existingItem) {
//     existingItem.quantity = (existingItem.quantity || 1) + 1;
//   } else {
//     product.quantity = 1;
//     cart.push(product);
//   }
  
//   localStorage.setItem('cart', JSON.stringify(cart));
//   updateCartCount();
//   showToast(`${product.title} added to cart!`);
// }

// function updateCartCount() {
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
//   document.querySelector('.cart-count').textContent = totalItems;
// }

// function showToast(message) {
//   const toast = document.createElement('div');
//   toast.className = 'toast-notification';
//   toast.innerHTML = `
//     <i class="fas fa-check-circle"></i>
//     <span>${message}</span>
//   `;
  
//   document.body.appendChild(toast);
  
//   setTimeout(() => {
//     toast.classList.add('show');
//   }, 10);
  
//   setTimeout(() => {
//     toast.classList.remove('show');
//     setTimeout(() => {
//       document.body.removeChild(toast);
//     }, 300);
//   }, 3000);
// }

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    allProducts = products;
    renderFilteredProducts(products);

    setupFilters(products);
    setupSearch();
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('products').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load products. Please try again later.</p>
      </div>
    `;
  }
});

function setupFilters(products) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.querySelector('.sort-select');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  sortSelect.addEventListener('change', applyFilters);
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

function applyFilters() {
  const activeFilter = document.querySelector('.filter-btn.active')?.textContent || '';
  const sortValue = document.querySelector('.sort-select')?.value || '';
  const searchKeyword = document.getElementById('searchInput')?.value.toLowerCase() || '';

  let filteredProducts = [...allProducts];

  // 🔍 Filter by search keyword
  if (searchKeyword) {
    filteredProducts = filteredProducts.filter(p =>
      p.title.toLowerCase().includes(searchKeyword)
    );
  }

  // 🧩 Apply tag-based filters
  if (activeFilter === 'Featured') {
    filteredProducts = filteredProducts.filter(p => p.featured);
  } else if (activeFilter === 'New Arrivals') {
    filteredProducts = filteredProducts.filter(p => p.isNew);
  } else if (activeFilter === 'On Sale') {
    filteredProducts = filteredProducts.filter(p => p.onSale);
  }

  // 📊 Apply sorting
  if (sortValue === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No products match your filters</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description || 'No description available.'}</p>
        <div class="product-price">₹${product.price.toFixed(2)}</div>
        <div class="product-rating">
          ${Array(5).fill().map((_, i) =>
            `<i class="fas ${i < Math.floor(product.rating || 4) ? 'fa-star' :
              (product.rating % 1 > 0.5 && i === Math.floor(product.rating)) ? 'fa-star-half-alt' : 'far fa-star'}"></i>`
          ).join('')}
          <span>(${product.ratingCount || Math.floor(Math.random() * 100) + 50})</span>
        </div>
        <button class="add-to-cart" onclick='addToCart(${JSON.stringify(product).replace(/</g, '\\u003c')})'> 
          Add to Cart
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// function addToCart(product) {
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const existingItem = cart.find(item => item._id === product._id);

//   if (existingItem) {
//     existingItem.quantity = (existingItem.quantity || 1) + 1;
//   } else {
//     product.quantity = 1;
//     cart.push(product);
//   }

//   localStorage.setItem('cart', JSON.stringify(cart));
//   updateCartCount();
//   showToast(`${product.title} added to cart!`);
// }

function addToCart(product) {
  try {
    // Safely get cart from localStorage
    let cart;
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      cart = [];
    }

    // Check if product has required properties
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      return;
    }

    // Find existing item
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Create a clean copy of the product with only necessary properties
      const productToAdd = {
        _id: product._id,
        title: product.title,
        price: product.price,
        // Add other necessary properties
        quantity: 1
      };
      cart.push(productToAdd);
    }

    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    showToast(`${product.title} added to cart!`);
    
    // Debugging
    console.log('Current cart:', cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelector('.cart-count').textContent = totalItems;
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
