// Lightweight behavior for demo purposes
document.addEventListener('DOMContentLoaded', () => {
  const favCountEl = document.getElementById('favCount');
  const cartCountEl = document.getElementById('cartCount');
  const favToggles = document.querySelectorAll('.fav-toggle');
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  const cartPanel = document.getElementById('cartPanel');
  const overlay = document.getElementById('overlay');
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');


  let favorites = new Set();
  let cart = {}; // id -> {title, price, qty}


  function updateFavUI() {
    favCountEl.textContent = favorites.size;
    favToggles.forEach(btn => {
      const id = btn.closest('.product-card').dataset.id;
      const pressed = favorites.has(id);
      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      btn.textContent = pressed ? '♥' : '♡';
    });
  }


  function updateCartUI() {
    const qty = Object.values(cart).reduce((s, it) => s + it.qty, 0);
    cartCountEl.textContent = qty;
    // render list
    cartItemsEl.innerHTML = '';
    if (qty === 0) {
      cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
    } else {
      let total = 0;
      for (const id in cart) {
        const it = cart[id];
        total += it.price * it.qty;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div class="thumb">${it.title.split(' ')[0]}</div>
          <div style="flex:1">
            <div style="font-weight:600">${it.title}</div>
            <div style="color:var(--muted);font-size:0.95rem">${it.qty} × $${it.price}</div>
          </div>
          <div style="text-align:right">
            <button class="btn small ghost" data-id="${id}" data-action="minus">−</button>
            <button class="btn small gradient" data-id="${id}" data-action="plus">+</button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      }
      cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }
  }


  // Favorite toggle
  favToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const id = card.dataset.id;
      if (favorites.has(id)) favorites.delete(id);
      else favorites.add(id);
      updateFavUI();
    });
  });


  // Add to cart
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const id = card.dataset.id;
      const title = card.querySelector('.product-title').textContent.trim();
      const priceText = card.querySelector('.price').textContent.replace('$','').trim();
      const price = parseFloat(priceText) || 0;
      if (!cart[id]) cart[id] = { title, price, qty: 0 };
      cart[id].qty += 1;
      updateCartUI();
      openCart();
    });
  });


  // Cart open/close
  function openCart(){
    cartPanel.classList.add('open');
    overlay.classList.add('open');
    cartPanel.setAttribute('aria-hidden','false');
  }
  function closeCartPanel(){
    cartPanel.classList.remove('open');
    overlay.classList.remove('open');
    cartPanel.setAttribute('aria-hidden','true');
  }


  cartBtn.addEventListener('click', openCart);
  overlay.addEventListener('click', closeCartPanel);
  closeCart.addEventListener('click', closeCartPanel);


  // cart item buttons (delegate)
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (!id || !action) return;
    if (action === 'plus') cart[id].qty += 1;
    if (action === 'minus') {
      cart[id].qty -= 1;
      if (cart[id].qty <= 0) delete cart[id];
    }
    updateCartUI();
  });


  // initialize
  updateFavUI();
  updateCartUI();


  // Smooth scroll for internal nav
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
});
