const productCards = [...document.querySelectorAll('.product-card')];
const filterButtons = [...document.querySelectorAll('.filter-button')];
const emptyState = document.querySelector('#empty-state');
const searchToggle = document.querySelector('#search-toggle');
const cartCount = document.querySelector('#cart-count');
const cartButton = document.querySelector('#cart-button');
const toast = document.querySelector('#toast');
const menuToggle = document.querySelector('#menu-toggle');
const mainNav = document.querySelector('#main-nav');
let activeFilter = 'All';
let searchQuery = '';
let itemCount = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

function updateProducts() {
  let visibleCount = 0;
  productCards.forEach((card) => {
    const matchesCategory = activeFilter === 'All' || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.name.toLowerCase().includes(searchQuery);
    card.hidden = !(matchesCategory && matchesSearch);
    if (!card.hidden) visibleCount += 1;
  });
  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    updateProducts();
  });
});

document.querySelectorAll('[data-category-link]').forEach((link) => {
  link.addEventListener('click', () => {
    activeFilter = link.dataset.categoryLink;
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    updateProducts();
  });
});

searchToggle.addEventListener('click', () => {
  let searchInput = document.querySelector('#product-search');
  if (!searchInput) {
    searchInput = document.createElement('input');
    searchInput.id = 'product-search';
    searchInput.type = 'search';
    searchInput.placeholder = 'Search pieces';
    searchInput.setAttribute('aria-label', 'Search products');
    searchInput.style.cssText = 'position:absolute;right:6%;top:calc(100% - 7px);z-index:2;width:min(280px,88vw);padding:13px 15px;border:1px solid #d8ddd4;background:#fff;box-shadow:0 8px 20px rgba(30,40,33,.1);font:12px "DM Sans",sans-serif';
    document.querySelector('.site-header').append(searchInput);
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      updateProducts();
    });
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        searchInput.remove();
        searchQuery = '';
        updateProducts();
        searchToggle.focus();
      }
    });
  } else {
    searchInput.remove();
    searchQuery = '';
    updateProducts();
  }
  if (searchInput.isConnected) searchInput.focus();
});

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    itemCount += 1;
    cartCount.textContent = String(itemCount);
    cartButton.setAttribute('aria-label', `Shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`);
    showToast(`${button.dataset.product} added to your bag`);
  });
});

cartButton.addEventListener('click', () => showToast(itemCount ? `Your bag has ${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'}` : 'Your bag is waiting for something good.'));

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
  if (window.lucide) window.lucide.createIcons();
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  if (window.lucide) window.lucide.createIcons();
}));

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('#form-message').textContent = `You're on the list. Watch ${email.value} for a little good.`;
  email.value = '';
});

if (window.lucide) window.lucide.createIcons();