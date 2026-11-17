// =====================================
// Мобильное меню (бургер)
// =====================================

const navToggle = document.querySelector('.site-nav__toggle');
const siteNav = document.querySelector('.site-nav');

function closeNav() {
  if (!siteNav) {
    return;
  }
  siteNav.classList.remove('site-nav--open');
  if (navToggle) {
    navToggle.classList.remove('site-nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Открыть меню');
  }
}

if (navToggle && siteNav) {
  // Открываем и закрываем меню по кнопке.
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('site-nav--open');
    navToggle.classList.toggle('site-nav__toggle--open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  // Закрываем меню после выбора пункта.
  siteNav.querySelectorAll('.site-nav__link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Закрываем меню по клавише Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  // Если экран стал шире мобильного, сбрасываем состояние меню.
  const desktopMedia = window.matchMedia('(min-width: 641px)');
  desktopMedia.addEventListener('change', (event) => {
    if (event.matches) {
      closeNav();
    }
  });
}

// =====================================
// Модальное окно заявки (index, catalog)
// =====================================

// Получаем модальное окно по id (если оно есть на странице).
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  // Получаем все кнопки заказа в карточках товаров.
  const orderButtons = document.querySelectorAll('.product-card__button');

  // Получаем кнопку закрытия модального окна.
  const closeDialogButton = document.querySelector('.order-dialog .button--secondary');

  // Получаем скрытое поле, в которое будет записан выбранный товар.
  const selectedProductInput = document.getElementById('selected-product');

  // Перебираем все кнопки «Заказать».
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем название товара в скрытое поле формы.
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Получаем форму заявки внутри модального окна.
  const orderForm = document.getElementById('order-form');

  if (orderForm) {
    // Обрабатываем отправку формы.
    orderForm.addEventListener('submit', (event) => {
      // Отменяем стандартную отправку формы,
      // потому что backend пока не подключён.
      event.preventDefault();

      // Проверяем встроенные HTML-ограничения формы.
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      // Показываем сообщение об успешной отправке.
      showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

      // Очищаем форму и закрываем модальное окно.
      orderForm.reset();
      orderDialog.close();
    });
  }
}

// =====================================
// Страница заявки (order.html)
// =====================================

const pageOrderForm = document.getElementById('page-order-form');

if (pageOrderForm) {
  // Если заявка открыта по ссылке с параметром ?product=...,
  // заранее выбираем нужную книгу в списке.
  const params = new URLSearchParams(window.location.search);
  const productFromUrl = params.get('product');

  if (productFromUrl) {
    const productSelect = document.getElementById('page-order-product');
    if (productSelect) {
      const option = Array.from(productSelect.options).find(
        (item) => item.value === productFromUrl
      );
      if (option) {
        productSelect.value = option.value;
      }
    }
  }

  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!pageOrderForm.checkValidity()) {
      pageOrderForm.reportValidity();
      return;
    }

    showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    pageOrderForm.reset();
  });
}

// =====================================
// Форма обратной связи (contacts.html)
// =====================================

const feedbackForm = document.getElementById('feedback-form');

if (feedbackForm) {
  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }

    showSuccess('Сообщение отправлено! Мы ответим вам в течение рабочего дня.');
    feedbackForm.reset();
  });
}

// =====================================
// Общее сообщение об успехе
// =====================================

const successMessage = document.getElementById('success-message');
let successTimer;

function showSuccess(text) {
  if (!successMessage) {
    return;
  }
  successMessage.textContent = text;
  successMessage.hidden = false;

  clearTimeout(successTimer);
  successTimer = setTimeout(() => {
    successMessage.hidden = true;
  }, 5000);
}
