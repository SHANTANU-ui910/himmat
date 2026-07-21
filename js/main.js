/**
 * Shri Sanvariya Laundry — Main Application
 */

const WHATSAPP_NUMBER = '916262505014';
const CALL_NUMBER = '+919993989169';
const SHOP_ADDRESS = 'Amirat Palace, Shop No. 13, Indore, Madhya Pradesh - 452010';
const UPI_ID = 'BHARATPE2W0V0X7C0C76490@unitype';

const SERVICE_CATEGORIES = [
  {
    id: 'normal-press',
    name: 'Normal Press',
    nameHi: 'नॉर्मल प्रेस',
    icon: '👔',
    items: [
      { id: 'np-shirt', name: 'Shirt / Pant', nameHi: 'शर्ट / पैंट', price: 7 },
      { id: 'np-bedsheet', name: 'Bedsheet / Saree', nameHi: 'बेडशीट / साड़ी', price: 25 },
      { id: 'np-window-curtain', name: 'Window Curtain', nameHi: 'खिड़की पर्दा', price: 30 },
      { id: 'np-door-curtain', name: 'Door Curtain', nameHi: 'दरवाजे पर्दा', price: 35 },
    ],
  },
  {
    id: 'steam-press',
    name: 'Steam Press',
    nameHi: 'स्टीम प्रेस',
    icon: '♨️',
    items: [
      { id: 'sp-shirt', name: 'Shirt / Pant', nameHi: 'शर्ट / पैंट', price: 15 },
      { id: 'sp-saree', name: 'Saree', nameHi: 'साड़ी', price: 60 },
      { id: 'sp-window-curtain', name: 'Window Curtain', nameHi: 'खिड़की पर्दा', price: 60 },
      { id: 'sp-door-curtain', name: 'Door Curtain', nameHi: 'दरवाजे पर्दा', price: 50 },
    ],
  },
  {
    id: 'premium-press',
    name: 'Premium Press',
    nameHi: 'प्रीमियम प्रेस',
    icon: '✨',
    items: [
      { id: 'pp-shirt', name: 'Shirt / Pant', nameHi: 'शर्ट / पैंट', price: 9 },
      { id: 'pp-saree', name: 'Saree', nameHi: 'साड़ी', price: 80 },
      { id: 'pp-lehenga', name: 'Lehenga-Chunni', nameHi: 'लहंगा चुन्नी', price: 120 },
    ],
  },
  {
    id: 'dry-clean',
    name: 'Dry Clean',
    nameHi: 'ड्राई क्लीन',
    icon: '🧥',
    startingFrom: true,
    items: [
      { id: 'dc-lehenga', name: 'Lehenga-Chunni', nameHi: 'लहंगा - चुन्नी', price: 300 },
      { id: 'dc-blanket', name: 'Blanket', nameHi: 'ब्लैंकेट', price: 400 },
      { id: 'dc-curtains', name: 'Curtains', nameHi: 'पर्दे', price: 120 },
      { id: 'dc-carpet', name: 'Carpet', nameHi: 'कारपेट', price: 450 },
      { id: 'dc-saree', name: 'Saree', nameHi: 'साड़ी', price: 150 },
      { id: 'dc-kurti', name: 'Kurti Palazzo Set', nameHi: 'कुर्ती प्लाजो', price: 180 },
      { id: 'dc-suit', name: 'Pant, Coat / Sherwani Suit', nameHi: 'पैंट, कोट / शेरवानी', price: 300 },
      { id: 'dc-jacket', name: 'Jerkin / Jacket', nameHi: 'जरकिन', price: 150 },
      { id: 'dc-shoes', name: 'Shoes', nameHi: 'शूज', price: 250 },
      { id: 'dc-wash', name: 'Normal Clothes Wash (1 pair)', nameHi: 'नॉर्मल कपड़े धुलाई', price: 60 },
    ],
  },
];

const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoryId: cat.id,
    categoryName: cat.name,
    categoryNameHi: cat.nameHi,
    startingFrom: cat.startingFrom || false,
    icon: cat.icon,
  }))
);

const TIME_SLOTS = [
  { id: 'morning-1', label: '8:00 – 10:00 AM', start: 8 },
  { id: 'morning-2', label: '10:00 – 12:00 PM', start: 10 },
  { id: 'afternoon-1', label: '12:00 – 2:00 PM', start: 12 },
  { id: 'afternoon-2', label: '2:00 – 4:00 PM', start: 14 },
  { id: 'evening-1', label: '4:00 – 6:00 PM', start: 16 },
  { id: 'evening-2', label: '6:00 – 8:00 PM', start: 18 },
];

const bookingState = {
  date: null,
  slot: null,
  payment: 'cod',
};

const cart = new Map();

function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatPrice(price, startingFrom = false) {
  return startingFrom ? `₹${price}+` : `₹${price}`;
}

function getCartItems() {
  return Array.from(cart.entries()).map(([id, qty]) => {
    const service = ALL_SERVICES.find((s) => s.id === id);
    return service ? { ...service, quantity: qty } : null;
  }).filter(Boolean);
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
}

function addToCart(id, qty = 1) {
  cart.set(id, (cart.get(id) || 0) + qty);
  updateCartUI();
}

function removeFromCart(id) {
  cart.delete(id);
  updateCartUI();
}

function setCartQty(id, qty) {
  if (qty <= 0) cart.delete(id);
  else cart.set(id, qty);
  updateCartUI();
}

function clearCart() {
  cart.clear();
  updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBottomNav();
  initFab();
  initServicesGrid();
  initDatePicker();
  initSlotPicker();
  initPaymentPicker();
  initBookingForm();
  initModal();
  initCartDrawer();
  updateHeroNextSlot();
  setInterval(updateHeroNextSlot, 60000);
});

function initNavigation() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) setActiveNav(id);
    });
  }, { passive: true });
}

function setActiveNav(sectionId) {
  document.querySelectorAll('.nav__link, .bottom-nav__item').forEach((link) => {
    const href = link.getAttribute('href');
    const dataSection = link.dataset.section;
    link.classList.toggle('active', href === `#${sectionId}` || dataSection === sectionId);
  });
}

function initBottomNav() {
  document.querySelectorAll('.bottom-nav__item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.bottom-nav__item').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function initFab() {
  const fab = document.getElementById('fab');
  const bookSection = document.getElementById('book');
  if (!fab || !bookSection) return;
  const observer = new IntersectionObserver(
    ([entry]) => fab.classList.toggle('hidden', entry.isIntersecting),
    { threshold: 0.15, rootMargin: '-80px 0px 0px 0px' }
  );
  observer.observe(bookSection);
}

function initServicesGrid() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = SERVICE_CATEGORIES.map((cat) => `
    <div class="service-category">
      <div class="service-category__header">
        <span class="service-category__icon">${cat.icon}</span>
        <div>
          <h3 class="service-category__title">${cat.name}</h3>
          <p class="service-category__title-hi">${cat.nameHi}${cat.startingFrom ? ' (से शुरू)' : ''}</p>
        </div>
      </div>
      <ul class="service-category__list">
        ${cat.items.map((item) => {
          const svc = ALL_SERVICES.find((s) => s.id === item.id);
          const priceLabel = formatPrice(item.price, cat.startingFrom);
          return `
            <li class="service-category__item">
              <div class="service-category__item-info">
                <span class="service-category__item-name">${item.name}</span>
                <span class="service-category__item-hi">${item.nameHi}</span>
              </div>
              <div class="service-category__item-actions">
                <span class="service-category__item-price">${priceLabel}</span>
                <button type="button" class="btn-add-cart" data-id="${item.id}" aria-label="Add ${item.name} to cart">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </li>`;
        }).join('')}
      </ul>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id);
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 600);
    });
  });
}

function initDatePicker() {
  renderDatePicker();
}

function renderDatePicker() {
  const container = document.getElementById('date-picker');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isToday = i === 0;
    const selected = bookingState.date === iso || (!bookingState.date && i === 0) ? 'selected' : '';
    if (i === 0 && !bookingState.date) bookingState.date = iso;

    html += `
      <button type="button" class="date-option ${selected}" data-date="${iso}">
        <div class="date-option__day">${isToday ? 'Today' : days[date.getDay()]}</div>
        <div class="date-option__date">${date.getDate()}</div>
        <div class="date-option__month">${months[date.getMonth()]}</div>
      </button>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.date-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.date-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.date = btn.dataset.date;
      updateSlotAvailability();
    });
  });
}

function initSlotPicker() {
  renderSlots();
}

function renderSlots() {
  const container = document.getElementById('slot-picker');
  const now = new Date();
  const isToday = bookingState.date === getTodayISO();
  const currentHour = now.getHours();

  container.innerHTML = TIME_SLOTS.map((slot) => {
    const isPast = isToday && slot.start <= currentHour;
    const isSelected = bookingState.slot === slot.id;
    return `
      <button type="button"
        class="slot-option ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}"
        data-slot="${slot.id}" ${isPast ? 'disabled' : ''}>
        ${slot.label}
      </button>`;
  }).join('');

  container.querySelectorAll('.slot-option:not(.disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.slot-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.slot = btn.dataset.slot;
    });
  });

  const firstAvailable = container.querySelector('.slot-option:not(.disabled)');
  if (firstAvailable && (!bookingState.slot || container.querySelector(`[data-slot="${bookingState.slot}"]`)?.classList.contains('disabled'))) {
    container.querySelectorAll('.slot-option').forEach((b) => b.classList.remove('selected'));
    firstAvailable.classList.add('selected');
    bookingState.slot = firstAvailable.dataset.slot;
  }
}

function updateSlotAvailability() {
  bookingState.slot = null;
  renderSlots();
}

function initPaymentPicker() {
  const container = document.getElementById('payment-picker');
  const qrSection = document.getElementById('qr-payment-section');

  container.querySelectorAll('.payment-option').forEach((option) => {
    option.addEventListener('click', () => {
      container.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      bookingState.payment = option.dataset.payment;
      qrSection.hidden = bookingState.payment !== 'qr';
    });
  });
}

function initCartDrawer() {
  const toggleBtn = document.getElementById('cart-toggle');
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const closeBtn = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('cart-checkout');

  const open = () => drawer.classList.add('open');
  const close = () => drawer.classList.remove('open');

  toggleBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  checkoutBtn?.addEventListener('click', () => {
    close();
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  });

  updateCartUI();
}

function updateCartUI() {
  const count = getCartCount();
  const badge = document.getElementById('cart-badge');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const summaryServices = document.getElementById('summary-services');
  const summaryTotal = document.getElementById('summary-total');

  if (badge) {
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  const items = getCartItems();
  if (itemsEl) {
    if (items.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Add services from the price list above.</p>';
    } else {
      itemsEl.innerHTML = items.map((item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__info">
            <strong>${item.name}</strong>
            <span>${item.categoryName} · ${formatPrice(item.price, item.startingFrom)}</span>
          </div>
          <div class="cart-item__controls">
            <button type="button" class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            <button type="button" class="cart-item__remove" data-id="${item.id}" aria-label="Remove">×</button>
          </div>
          <div class="cart-item__subtotal">${formatPrice(item.price * item.quantity, item.startingFrom)}</div>
        </div>
      `).join('');

      itemsEl.querySelectorAll('.qty-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const current = cart.get(id) || 0;
          setCartQty(id, btn.dataset.action === 'plus' ? current + 1 : current - 1);
        });
      });
      itemsEl.querySelectorAll('.cart-item__remove').forEach((btn) => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
      });
    }
  }

  const total = getCartTotal();
  const hasStartingFrom = items.some((i) => i.startingFrom);
  const totalLabel = hasStartingFrom ? `₹${total}+` : `₹${total}`;

  if (totalEl) totalEl.textContent = totalLabel;
  if (summaryTotal) summaryTotal.textContent = totalLabel;
  if (summaryServices) {
    summaryServices.textContent = items.length === 0
      ? 'None'
      : items.map((i) => `${i.name} ×${i.quantity}`).join(', ');
  }
}

function updateHeroNextSlot() {
  const el = document.getElementById('hero-next-slot');
  if (!el) return;
  const now = new Date();
  const currentHour = now.getHours();
  const nextSlot = TIME_SLOTS.find((s) => s.start > currentHour);
  if (nextSlot) {
    el.textContent = `Today, ${nextSlot.label}`;
  } else {
    el.textContent = `Tomorrow, ${TIME_SLOTS[0].label}`;
  }
}

function buildWhatsAppMessage(details) {
  const lines = [
    '🧺 *New Booking — Shri Sanvariya Laundry*',
    '',
    `👤 *Name:* ${details.name}`,
    `📞 *Phone:* ${details.phone}`,
    `📍 *Address:* ${details.address}`,
    '',
    `📅 *Date:* ${details.date}`,
    `⏰ *Time Slot:* ${details.slot}`,
    '',
    '🛒 *Services:*',
    ...details.cartLines,
    '',
    `💰 *Total:* ${details.total}`,
    `💳 *Payment:* ${details.payment}`,
  ];
  if (details.notes) lines.push('', `📝 *Notes:* ${details.notes}`);
  lines.push('', '— Sent via Shri Sanvariya Laundry website');
  return lines.join('\n');
}

function sendWhatsAppBooking(details) {
  const message = buildWhatsAppMessage(details);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!bookingState.date) { alert('Please select a date.'); return; }
    if (!bookingState.slot) { alert('Please select a time slot.'); return; }
    if (getCartCount() === 0) { alert('Please add at least one service to your cart.'); return; }
    if (!name || !phone || !address) { alert('Please fill in all required fields.'); return; }

    const slotLabel = TIME_SLOTS.find((s) => s.id === bookingState.slot)?.label || '';
    const items = getCartItems();
    const hasStartingFrom = items.some((i) => i.startingFrom);
    const total = getCartTotal();
    const totalLabel = hasStartingFrom ? `₹${total}+` : `₹${total}`;
    const paymentLabel = bookingState.payment === 'qr' ? 'Pay on QR (UPI)' : 'Cash on Delivery';

    const dateObj = new Date(bookingState.date + 'T00:00:00');
    const dateFormatted = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const cartLines = items.map((i) =>
      `  • ${i.name} (${i.categoryName}) × ${i.quantity} = ${formatPrice(i.price * i.quantity, i.startingFrom)}`
    );

    const details = {
      name, phone, address, notes,
      date: dateFormatted,
      slot: slotLabel,
      cartLines,
      total: totalLabel,
      payment: paymentLabel,
    };

    sendWhatsAppBooking(details);

    showSuccessModal({
      ...details,
      services: items.map((i) => `${i.name} ×${i.quantity}`).join(', '),
    });

    if (bookingState.payment === 'qr') {
      document.getElementById('qr-modal')?.classList.add('active');
    }

    form.reset();
    clearCart();
    bookingState.payment = 'cod';
    document.querySelectorAll('.payment-option').forEach((o) => {
      o.classList.toggle('selected', o.dataset.payment === 'cod');
    });
    document.getElementById('qr-payment-section').hidden = true;
  });
}

function initModal() {
  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = modal.querySelector('.modal__backdrop');
  const close = () => modal.classList.remove('active');
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  const qrModal = document.getElementById('qr-modal');
  if (qrModal) {
    const qrClose = () => qrModal.classList.remove('active');
    document.getElementById('qr-modal-close')?.addEventListener('click', qrClose);
    qrModal.querySelector('.modal__backdrop')?.addEventListener('click', qrClose);
  }
}

function showSuccessModal(details) {
  const modal = document.getElementById('success-modal');
  const detailsEl = document.getElementById('modal-details');
  const messageEl = document.getElementById('modal-message');

  messageEl.textContent = 'Your booking details have been sent to us on WhatsApp. We will confirm your slot shortly!';

  detailsEl.innerHTML = `
    <div><span>Name</span><strong>${details.name}</strong></div>
    <div><span>Phone</span><strong>${details.phone}</strong></div>
    <div><span>Date</span><strong>${details.date}</strong></div>
    <div><span>Time</span><strong>${details.slot}</strong></div>
    <div><span>Services</span><strong>${details.services}</strong></div>
    <div><span>Total</span><strong>${details.total}</strong></div>
    <div><span>Payment</span><strong>${details.payment}</strong></div>
  `;

  modal.classList.add('active');
}

// Refresh dates at midnight so slots always show current days
function scheduleMidnightRefresh() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => {
    bookingState.date = null;
    renderDatePicker();
    updateSlotAvailability();
    updateHeroNextSlot();
    scheduleMidnightRefresh();
  }, midnight - now);
}
scheduleMidnightRefresh();
