// Состояние приложения
let cart = [];
let products = []; // Сюда загрузятся данные из JSON

// Элементы интерфейса
const catalogGrid = document.getElementById('catalog-grid');
const cartBar = document.getElementById('cart-bar');
const cartCount = document.getElementById('cart-count');
const discountAlert = document.getElementById('discount-alert');
const saveOrderBtn = document.getElementById('save-order-btn');

// 1. Инициализация приложения: загрузка JSON-файла с товарами
async function initApp() {
  try {
    // Подгружаем базу данных товаров
    const response = await fetch('./products.json');
    if (!response.ok) throw new Error('Сеть ответила с ошибкой при загрузке JSON');
    
    products = await response.json();
    renderCatalog();
  } catch (error) {
    console.error("Не удалось инициализировать каталог:", error);
    if (catalogGrid) {
      catalogGrid.innerHTML = `<p class="col-span-full text-center text-red-500 py-8">Ошибка загрузки товаров. Проверьте файл products.json</p>`;
    }
  }
}

// 2. Отрисовка карточек товаров в каталоге
function renderCatalog() {
  if (!catalogGrid) return;
  
  if (products.length === 0) {
    catalogGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">Каталог пуст</p>`;
    return;
  }

  catalogGrid.innerHTML = products.map(product => `
    <div class="bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100 flex flex-col">
      <img src="${product.image}" alt="${product.name}" class="w-full aspect-square object-cover" onerror="this.src='https://picsum.photos'">
      <div class="p-4 flex flex-col flex-grow justify-between">
        <h3 class="font-medium text-gray-800 text-sm mb-2">${product.name}</h3>
        <div class="flex justify-between items-center mt-auto">
          <span class="font-bold text-base">${product.price} UAH</span>
          <button data-id="${product.id}" class="add-to-cart-btn bg-gray-100 hover:bg-black hover:text-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors cursor-pointer">
            +
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Навешиваем обработчики клика на все кнопки "+"
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

// 3. Добавление товара в корзину
function addToCart(id) {
  cart.push(id);
  updateCartUI();
}

// 4. Обновление интерфейса нижней плашки корзины и расчет скидки
function updateCartUI() {
  if (!cartCount || !cartBar || !discountAlert) return;

  cartCount.textContent = cart.length;

  // Показываем плашку, если в корзине есть хотя бы 1 товар
  if (cart.length > 0) {
    cartBar.style.transform = 'translateY(0)';
  } else {
    cartBar.style.transform = 'translateY(100%)';
  }

  // Применяем скидку 10%, если выбрано 5 или более любых наборов
  if (cart.length >= 5) {
    discountAlert.classList.remove('hidden');
  } else {
    discountAlert.classList.add('hidden');
  }
}

// 5. Обработка клика на кнопку «Сохранить заказ»
if (saveOrderBtn) {
  saveOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    // Считаем количество вхождений каждого товара, чтобы сгруппировать их
    const counts = {};
    cart.forEach(id => { counts[id] = (counts[id] || 0) + 1; });

    let totalPrice = 0;
    let orderText = "--- МОЙ ЗАКАЗ ---\n\n";

    // Собираем текстовые строки для каждого выбранного товара
    Object.keys(counts).forEach(id => {
      const item = products.find(p => p.id === parseInt(id));
      if (item) {
        const quantity = counts[id];
        const cost = item.price * quantity;
        totalPrice += cost;
        orderText += `▪️ ${item.name} — ${quantity} шт. (${item.price} UAH/шт)\n`;
      }
    });

    const isDiscountApplied = cart.length >= 5;
    
    if (isDiscountApplied) {
      const discount = totalPrice * 0.10;
      totalPrice = totalPrice - discount;
      orderText += `\n🔥 Применена скидка 10% за заказ от 5 наборов!`;
    }

    orderText += `\n\nИТОГО К ОПЛАТЕ: ${totalPrice} UAH`;
    orderText += `\nВсего позиций: ${cart.length} шт.`;
    orderText += `\n\nСкопируйте текст выше и отправьте дизайнеру для оформления заказа.`;

    // Выводим красивое диалоговое окно
    alert(orderText);
  });
}

// Запуск приложения
initApp();
