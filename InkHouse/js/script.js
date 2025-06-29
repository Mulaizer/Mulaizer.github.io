$(document).ready(function() {
    // Обработчик клика по ссылкам меню фильтров
    $('.products-menu ul li a').click(function(e) {
        e.preventDefault(); // Предотвращаем переход по ссылке
        
        // Добавляем плавный эффект
        $('.product-card').fadeOut(200, function() {
            // Скрываем все карточки
            $('.product-card').hide();
            
            // Получаем выбранную категорию
            var selectedCategory = $('.products-menu ul li a.selected').data('category');
            
            // Показываем карточки нужной категории с эффектом проявления
            $('.product-card[data-category="' + selectedCategory + '"]').fadeIn(400);
        });
        
        // Убираем класс selected у всех ссылок
        $('.products-menu ul li a').removeClass('selected');
        
        // Добавляем класс selected к нажатой ссылке
        $(this).addClass('selected');
    });
    
    // Мобильное меню
    $('.mobile-menu-btn').click(function() {
        $(this).toggleClass('active');
        $('.header-menu nav').toggleClass('active');
        
        // Анимация кнопки бургер-меню
        if ($(this).hasClass('active')) {
            $(this).find('span:nth-child(1)').css({
                'transform': 'rotate(45deg) translate(5px, 5px)'
            });
            $(this).find('span:nth-child(2)').css({
                'opacity': '0'
            });
            $(this).find('span:nth-child(3)').css({
                'transform': 'rotate(-45deg) translate(7px, -7px)'
            });
        } else {
            $(this).find('span').css({
                'transform': 'none',
                'opacity': '1'
            });
        }
    });
    
    // Закрытие мобильного меню при клике на ссылку
    $('.header-menu nav ul li a').click(function() {
        $('.mobile-menu-btn').removeClass('active');
        $('.header-menu nav').removeClass('active');
        $('.mobile-menu-btn').find('span').css({
            'transform': 'none',
            'opacity': '1'
        });
    });
    
    // Корзина
    // Массив для хранения товаров в корзине
    let cart = [];
    
    // Открытие модального окна корзины
    $('.header-menu ul li a img[alt="cart"]').parent().click(function(e) {
        e.preventDefault();
        $('#cartModal').fadeIn(300);
        $('body').css('overflow', 'hidden'); // Блокируем прокрутку страницы
    });
    
    // Закрытие модального окна корзины
    $('.cart-modal-close').click(function() {
        $('#cartModal').fadeOut(300);
        $('body').css('overflow', 'auto'); // Возвращаем прокрутку страницы
    });
    
    // Закрытие модального окна при клике вне его содержимого
    $(window).click(function(e) {
        if ($(e.target).is('.cart-modal')) {
            $('#cartModal').fadeOut(300);
            $('body').css('overflow', 'auto');
        }
    });
    
    // Добавление товара в корзину
    $('.product-btn').click(function() {
        let card = $(this).closest('.product-card');
        let productId = card.index();
        let productImg = card.find('.product-card-img img').attr('src');
        let productTitle = card.find('.picture-title').text();
        let productAuthor = card.find('.picture-author').text();
        let productPrice = card.find('.picture-price').text();
        
        // Проверяем, есть ли уже этот товар в корзине
        let existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Если товар уже в корзине, увеличиваем количество
            existingItem.quantity++;
        } else {
            // Иначе добавляем новый товар
            cart.push({
                id: productId,
                img: productImg,
                title: productTitle,
                author: productAuthor,
                price: productPrice,
                quantity: 1
            });
        }
        
        // Обновляем отображение корзины
        updateCart();
        
        // Показываем уведомление о добавлении
        showNotification(productTitle + ' добавлен в корзину');
    });
    
    // Функция обновления отображения корзины
    function updateCart() {
        // Очищаем текущее содержимое корзины
        $('.cart-list').empty();
        
        if (cart.length === 0) {
            // Если корзина пуста, показываем сообщение
            $('.cart-empty').show();
            $('.cart-list').hide();
            $('#cartTotal').text('0 ₽');
        } else {
            // Если в корзине есть товары, скрываем сообщение о пустой корзине
            $('.cart-empty').hide();
            $('.cart-list').show();
            
            // Добавляем каждый товар в список
            let total = 0;
            
            cart.forEach(function(item, index) {
                // Извлекаем числовое значение цены
                let priceText = item.price;
                let priceValue = parseInt(priceText.replace(/\s+/g, '').replace('₽', ''));
                let itemTotal = priceValue * item.quantity;
                total += itemTotal;
                
                // Создаем элемент товара
                let cartItem = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.title}</h3>
                        <p>${item.author}</p>
                        <p>${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn quantity-minus">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" readonly>
                        <button class="quantity-btn quantity-plus">+</button>
                    </div>
                    <button class="cart-item-remove">&times;</button>
                </div>
                `;
                
                $('.cart-list').append(cartItem);
            });
            
            // Обновляем итоговую сумму
            $('#cartTotal').text(formatPrice(total) + ' ₽');
        }
    }
    
    // Функция для форматирования цены (добавляет пробелы между разрядами)
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    // Обработка изменения количества товара
    $(document).on('click', '.quantity-plus', function() {
        let itemId = $(this).closest('.cart-item').data('id');
        let item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity++;
            $(this).siblings('.quantity-input').val(item.quantity);
            updateCart();
        }
    });
    
    $(document).on('click', '.quantity-minus', function() {
        let itemId = $(this).closest('.cart-item').data('id');
        let item = cart.find(item => item.id === itemId);
        
        if (item && item.quantity > 1) {
            item.quantity--;
            $(this).siblings('.quantity-input').val(item.quantity);
            updateCart();
        }
    });
    
    // Удаление товара из корзины
    $(document).on('click', '.cart-item-remove', function() {
        let itemId = $(this).closest('.cart-item').data('id');
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    });
    
    // Оформление заказа
    $('.cart-checkout-btn').click(function() {
        if (cart.length > 0) {
            alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
            cart = [];
            updateCart();
            $('#cartModal').fadeOut(300);
            $('body').css('overflow', 'auto');
        } else {
            alert('Ваша корзина пуста. Добавьте товары перед оформлением заказа.');
        }
    });
    
    // Функция для показа уведомления о добавлении товара
    function showNotification(message) {
        // Проверяем, существует ли уже элемент уведомления
        if ($('.cart-notification').length === 0) {
            $('body').append('<div class="cart-notification"></div>');
        }
        
        // Добавляем сообщение в уведомление
        $('.cart-notification').text(message)
            .fadeIn(300)
            .delay(2000)
            .fadeOut(300);
    }
    
});
