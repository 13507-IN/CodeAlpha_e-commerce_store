document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  try {
    // Load user data
    const res = await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();

    document.getElementById('username').textContent = user.username;
    document.getElementById('addressText').textContent = formatAddress(user.address);
    
    // Pre-fill form (but don't show it)
    if (user.address) {
      document.getElementById('house').value = user.address.house || '';
      document.getElementById('city').value = user.address.city || '';
      document.getElementById('pincode').value = user.address.pincode || '';
      document.getElementById('state').value = user.address.state || '';
      document.getElementById('country').value = user.address.country || '';
    }

    // Load orders
    const orderRes = await fetch(`http://localhost:5000/api/orders/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orders = await orderRes.json();
    displayOrders(orders);

  } catch (err) {
    console.error('Error loading profile:', err);
    showToast('Error loading profile data', 'error');
  }
});

function formatAddress(addr) {
  if (!addr) return 'No address saved';
  return `${addr.house}, ${addr.city}, ${addr.pincode}, ${addr.state}, ${addr.country}`;
}

function toggleAddressEdit() {
  const section = document.getElementById('editAddressSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
  
  // Smooth scroll to form when opening
  if (section.style.display === 'block') {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

document.getElementById('addressForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const address = {
      house: document.getElementById('house').value,
      city: document.getElementById('city').value,
      pincode: document.getElementById('pincode').value,
      state: document.getElementById('state').value,
      country: document.getElementById('country').value
    };

    const res = await fetch('http://localhost:5000/api/users/update-address', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ address })
    });

    const result = await res.json();
    document.getElementById('addressText').textContent = formatAddress(result.address);
    toggleAddressEdit(); // Hide the form after saving
    showToast('Address updated successfully!', 'success');
  } catch (err) {
    console.error('Error updating address:', err);
    showToast('Error updating address', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});

function displayOrders(orders) {
  const container = document.getElementById('ordersContainer');
  
  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="no-orders">
        <i class="fas fa-box-open"></i>
        <p>You haven't placed any orders yet</p>
        <a href="collection.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">Order #${order._id.substring(0, 8).toUpperCase()}</span>
        <span class="order-date">${new Date(order.createdAt).toLocaleDateString('en-US', {
                                     year: 'numeric',
                                     month: 'short',
                                     day: 'numeric'
        })}</span>
        <span class="order-status status-${order.status}">${order.status}</span>
      </div>
      
      <div class="order-items">
        ${order.products.map(product => `
          <div class="order-item">
            <img src="${product.image}" alt="${product.title}">
            <div class="order-item-info">
              <div class="order-item-name">${product.title}</div>
              <div class="order-item-price">₹${product.price.toFixed(2)} × ${product.quantity}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('cart');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}