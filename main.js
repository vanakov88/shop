import './style.css';
import products from './products.json';

// Состояние приложения (выбранные ID товаров)
let cart = [];

const catalogGrid = document.getElementById('catalog-grid');
const cartBar = document.getElementById('cart-bar');
const cartCount = document.getElementById('cart-count');
const discountAlert = document.getElementById('discount-alert');
const saveOrderBtn = document.getElementById('save-order-btn');

// 1. Рендер карточек товаров
function renderCatalog() {
  catalogGrid.innerHTML = products.map(product => `
    <div class="bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100 flex flex-col">
      <img src="${product.image}" alt="${product.name}" class="w-full aspect-square object-cover">
      <div class="p-4 flex flex-col flex-grow justify-between">
        <h3 class="font-medium text-gray-800 text-sm mb-2">${product.name}</h3>
        <div class="flex justify-between items-center mt-auto">
          <span class="font-bold text-base">${product.price} UAH</span>
          <button data-id="${product.id}" class="add-to-cart-btn bg-gray-100 hover:bg-black hover:text-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors">
            +
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Навешиваем клики на кнопки "+"
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

// 2. Логика добавления в корзину
function addToCart(id) {
  cart.push(id);
  updateCartUI();
}

// 3. Обновление интерфейса корзины и проверка скидки (от 5 штук)
function updateCartUI() {
  cartCount.textContent = cart.length;

  if (cart.length > 0) {
    cartBar.classList.remove('translate-y-full'); // Показываем плашку
  } else {
    cartBar.classList.add('translate-y-full');
  }

  // Если выбрано 5 или более товаров — показываем инфо о скидке
  if (cart.length >= 5) {
    discountAlert.classList.remove('hidden');
  } else {
    discountAlert.classList.add('hidden');
  }
}

// 4. Формирование заказа для отправки автору
saveOrderBtn.addEventListener('click', () => {
  // Собираем читаемый список товаров по их ID
  const orderList = cart.map(id => {
    const item = products.find(p => p.id === id);
    return `- ${item.name} (${item.price} UAH)`;
  }).join('\n');

  const totalItems = cart.length;
  const isDiscount = totalItems >= 5;
  
  alert(`Ваш заказ сформирован!\n\n${orderList}\n\nВсего товаров: ${totalItems}${isDiscount ? ' (Применена скидка 10%)' : ''}\n\nСкопируйте этот список и отправьте дизайнеру.`);
});

// Инициализация
renderCatalog();
