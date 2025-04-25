class BookingModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.form = null;
        this.totalPrice = 0;
        this.basePrice = 0;
        this.hallPrice = 0;
        this.dateInput = null;
        this.hoursInput = null;
        this.nameInput = null;
        this.phoneInput = null;
        this.hallSelectContainer = null;
        this.hallSelect = null;
        this.totalPriceElement = null;
        this.serviceNameInput = null;
        this.serviceType = 'hourly'; // hourly, fixed, hourly-with-hall, fixed-with-hall
        this.serviceName = '';
        this.weekdayPrice = 0;
        this.weekendPrice = 0;
        this.extraHourWeekdayPrice = 0;
        this.extraHourWeekendPrice = 0;
        this.hallOptions = {};
        this.minHours = 2; // Значение по умолчанию
    }

    init() {
        console.log('Инициализация модального окна бронирования');
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        console.log('Создание DOM элементов модального окна');
        
        // Создание оверлея
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        
        // Создание модального окна
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        
        // Создание формы и её содержимого
        let modalHTML = `
            <span class="modal-close">&times;</span>
            <h2 class="modal-title">Оформление заказа</h2>
            <form id="booking-form">
                <div class="form-row">
                    <label for="service-name">Услуга:</label>
                    <input type="text" id="service-name" readonly>
                </div>
                <div class="form-row">
                    <label for="booking-date">Дата бронирования:</label>
                    <input type="date" id="booking-date" required>
                </div>
                <div class="form-row hours-container">
                    <label for="booking-hours">Количество часов:</label>
                    <input type="number" id="booking-hours" min="2" value="2" required>
                </div>
                <div class="form-row hall-select-container hidden">
                    <label for="hall-select">Выберите зал:</label>
                    <select id="hall-select"></select>
                </div>
                <div class="form-row">
                    <label for="customer-name">Ваше имя:</label>
                    <input type="text" id="customer-name" required>
                </div>
                <div class="form-row">
                    <label for="customer-phone">Номер телефона:</label>
                    <input type="tel" id="customer-phone" required>
                </div>
                <div class="total-price">
                    Итого: <span id="total-price">0</span> ₽
                </div>
                <button type="submit" class="submit-button">Оформить заказ</button>
            </form>
        `;
        
        this.modal.innerHTML = modalHTML;
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);
        
        // Получение ссылок на элементы формы
        this.form = document.getElementById('booking-form');
        this.dateInput = document.getElementById('booking-date');
        this.hoursInput = document.getElementById('booking-hours');
        this.nameInput = document.getElementById('customer-name');
        this.phoneInput = document.getElementById('customer-phone');
        this.serviceNameInput = document.getElementById('service-name');
        this.hallSelectContainer = document.querySelector('.hall-select-container');
        this.hallSelect = document.getElementById('hall-select');
        this.totalPriceElement = document.getElementById('total-price');
        this.hoursContainer = document.querySelector('.hours-container');
        
        // Установка минимальной даты на сегодня
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        this.dateInput.min = `${yyyy}-${mm}-${dd}`;
        this.dateInput.value = `${yyyy}-${mm}-${dd}`; // Автоматически устанавливаем текущую дату
    }

    setupEventListeners() {
        console.log('Настройка обработчиков событий');
        
        // Закрытие модального окна
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        // Закрытие по клику на оверлей
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Обновление цены при изменении даты, часов или зала
        this.dateInput.addEventListener('change', () => this.updatePrice());
        this.hoursInput.addEventListener('change', () => this.updatePrice());
        this.hallSelect.addEventListener('change', () => this.updatePrice());
        
        // Добавляем обработчик для проверки минимального значения часов
        this.hoursInput.addEventListener('input', () => {
            const value = parseInt(this.hoursInput.value);
            if (value < this.minHours) {
                this.hoursInput.value = this.minHours;
            }
            this.updatePrice();
        });
        
        // Отправка формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            console.log('Попытка отправки формы бронирования');
            
            // Валидация
            if (!this.validateForm()) {
                return false;
            }
            
            // Сбор данных формы
            const formData = {
                serviceName: this.serviceNameInput.value,
                date: this.dateInput.value,
                hours: this.hoursInput.value,
                hallName: this.hallSelect.value || 'Не выбран',
                customerName: this.nameInput.value,
                customerPhone: this.phoneInput.value,
                totalPrice: this.totalPrice
            };
            
            console.log('Данные бронирования:', formData);
            
            // Спрашиваем у пользователя, хочет ли он перейти к оплате
            if (confirm('Перейти к оплате?')) {
                // Вызываем функцию перенаправления на оплату
                if (typeof redirectToYooMoney === 'function') {
                    redirectToYooMoney(formData);
                } else {
                    alert('Ошибка: функция оплаты недоступна');
                    console.error('Функция redirectToYooMoney не найдена');
                }
            } else {
                // Если пользователь отменил оплату, закрываем модальное окно
                this.close();
            }
            
            return false;
        });
    }

    validateForm() {
        console.log('Валидация формы бронирования');
        
        // Устанавливаем дату, если она пуста
        if (!this.dateInput.value) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            this.dateInput.value = `${yyyy}-${mm}-${dd}`;
            console.log('Автоматически установлена текущая дата:', this.dateInput.value);
        }
        
        if (!this.dateInput.value) {
            alert('Пожалуйста, выберите дату.');
            this.dateInput.focus();
            return false;
        }
        
        if (this.serviceType.includes('hourly') && (!this.hoursInput.value || this.hoursInput.value < this.minHours)) {
            alert(`Пожалуйста, выберите количество часов (минимум ${this.minHours}).`);
            this.hoursInput.focus();
            return false;
        }
        
        if (this.serviceType.includes('with-hall') && !this.hallSelect.value) {
            alert('Пожалуйста, выберите зал.');
            this.hallSelect.focus();
            return false;
        }
        
        if (!this.nameInput.value.trim()) {
            alert('Пожалуйста, введите ваше имя.');
            this.nameInput.focus();
            return false;
        }
        
        if (!this.phoneInput.value.trim()) {
            alert('Пожалуйста, введите номер телефона.');
            this.phoneInput.focus();
            return false;
        }
        
        return true;
    }

    updatePrice() {
        let price = 0;
        
        // Определяем базовую цену в зависимости от дня недели
        const selectedDate = new Date(this.dateInput.value);
        const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
        this.basePrice = isWeekend ? this.weekendPrice : this.weekdayPrice;
        const extraHourPrice = isWeekend ? this.extraHourWeekendPrice : this.extraHourWeekdayPrice;
        
        console.log('Обновление цены:', {
            isWeekend,
            basePrice: this.basePrice,
            extraHourPrice
        });
        
        // Рассчитываем цену в зависимости от типа услуги
        if (this.serviceType === 'hourly') {
            const hours = parseInt(this.hoursInput.value) || this.minHours;
            price = this.basePrice * hours;
        } else if (this.serviceType === 'fixed') {
            price = this.basePrice;
            // Для фиксированной цены скрываем выбор часов
            this.hoursContainer.classList.add('hidden');
        } else if (this.serviceType === 'hourly-with-hall') {
            const hours = parseInt(this.hoursInput.value) || this.minHours;
            const hallName = this.hallSelect.value;
            
            // Проверяем, используется ли минимальное количество часов
            if (this.minHours > 2) {
                // Если минимальное количество часов больше 2, используем фиксированную цену за минимальное количество часов
                // и добавляем дополнительную стоимость за каждый час сверх минимального
                price = this.basePrice; // Базовая цена за минимальное количество часов
                
                // Если часов больше минимального, добавляем стоимость доп. часов
                if (hours > this.minHours) {
                    const additionalHours = hours - this.minHours;
                    price += additionalHours * extraHourPrice;
                }
            } else {
                // Стандартная почасовая оплата
                price = this.basePrice * hours;
            }
            
            // Добавляем стоимость зала
            if (hallName && this.hallOptions[hallName] !== undefined) {
                this.hallPrice = this.hallOptions[hallName];
                price += this.hallPrice;
            }
        } else if (this.serviceType === 'fixed-with-hall') {
            price = this.basePrice;
            const hallName = this.hallSelect.value;
            
            // Для фиксированной цены скрываем выбор часов
            this.hoursContainer.classList.add('hidden');
            
            // Добавляем стоимость зала
            if (hallName && this.hallOptions[hallName] !== undefined) {
                this.hallPrice = this.hallOptions[hallName];
                price += this.hallPrice;
            }
        }
        
        // Обновляем итоговую цену и элемент отображения
        this.totalPrice = price;
        
        if (this.totalPriceElement) {
            this.totalPriceElement.textContent = price;
            console.log('Итоговая цена обновлена:', price);
        } else {
            console.error('Элемент отображения цены не найден при обновлении!');
            // Попробуем найти элемент снова
            this.totalPriceElement = document.getElementById('total-price');
            if (this.totalPriceElement) {
                this.totalPriceElement.textContent = price;
                console.log('Элемент найден и цена обновлена:', price);
            }
        }
    }

    open(config = {}) {
        console.log('Открытие модального окна с конфигурацией:', config);
        
        // Установка значений из конфигурации
        this.serviceType = config.type || 'hourly';
        this.serviceName = config.name || '';
        this.weekdayPrice = config.weekdayPrice || 0;
        this.weekendPrice = config.weekendPrice || 0;
        this.extraHourWeekdayPrice = config.extraHourWeekdayPrice || 0;
        this.extraHourWeekendPrice = config.extraHourWeekendPrice || 0;
        this.minHours = config.minHours || 2;
        this.hallOptions = config.hallOptions || {};

        // Обновление UI
        this.serviceNameInput.value = this.serviceName;
        this.hoursInput.min = this.minHours;
        this.hoursInput.value = this.minHours;
        
        // Очищаем поля имени и телефона
        this.nameInput.value = '';
        this.phoneInput.value = '';
        
        // Устанавливаем текущую дату, если элемент даты существует
        if (this.dateInput) {
            // Получаем текущую дату в формате YYYY-MM-DD
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayFormatted = `${yyyy}-${mm}-${dd}`;
            
            // Устанавливаем минимальную дату и текущее значение
            this.dateInput.min = todayFormatted;
            this.dateInput.value = todayFormatted;
            
            console.log('Установлена дата при открытии модального окна:', todayFormatted);
        }

        // Настройка выбора зала
        if (this.serviceType.includes('with-hall')) {
            this.hallSelectContainer.classList.remove('hidden');
            this.hallSelect.innerHTML = '';
            Object.entries(this.hallOptions).forEach(([hallName, price]) => {
                const option = document.createElement('option');
                option.value = hallName;
                option.textContent = `${hallName} ${price > 0 ? `(+${price} ₽)` : ''}`;
                this.hallSelect.appendChild(option);
            });
            
            // Выбираем первый зал по умолчанию, если он есть
            if (this.hallSelect.options.length > 0) {
                this.hallSelect.selectedIndex = 0;
                console.log('Выбран зал по умолчанию:', this.hallSelect.value);
            }
        } else {
            this.hallSelectContainer.classList.add('hidden');
        }

        // Показ модального окна
        this.overlay.style.display = 'flex';
        this.modal.style.display = 'block';
        
        // Обновление цены
        this.updatePrice();
    }

    close() {
        console.log('Закрытие модального окна');
        this.overlay.style.display = 'none';
        this.modal.style.display = 'none';
    }

    static initButtons() {
        console.log('Инициализация кнопок бронирования');
        const buttons = document.querySelectorAll('[data-booking="true"]');
        console.log('Найдено кнопок бронирования:', buttons.length);
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                console.log('Нажата кнопка бронирования:', button.dataset);
                
                // Парсим параметры из data-атрибутов
                const config = {
                    type: button.dataset.bookingType,
                    name: button.dataset.bookingName,
                    weekdayPrice: parseInt(button.dataset.weekdayPrice) || 0,
                    weekendPrice: parseInt(button.dataset.weekendPrice) || 0,
                    extraHourWeekdayPrice: parseInt(button.dataset.extraHourWeekdayPrice) || 0,
                    extraHourWeekendPrice: parseInt(button.dataset.extraHourWeekendPrice) || 0,
                    minHours: parseInt(button.dataset.minHours) || 2
                };
                
                // Парсим опции залов
                try {
                    if (button.dataset.hallOptions) {
                        config.hallOptions = JSON.parse(button.dataset.hallOptions);
                    }
                } catch (error) {
                    console.error('Ошибка при парсинге опций залов:', error);
                    config.hallOptions = {};
                }
                
                console.log('Конфигурация модального окна:', config);
                
                // Открываем модальное окно
                if (window.bookingModal) {
                    window.bookingModal.open(config);
                } else {
                    console.error('Модальное окно не инициализировано!');
                    alert('Ошибка: модальное окно не инициализировано');
                }
            });
        });
    }
}

// Инициализация модального окна
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: Инициализация модального окна');
    
    try {
        if (!window.bookingModal) {
            window.bookingModal = new BookingModal();
            window.bookingModal.init();
            BookingModal.initButtons();
            console.log('Модальное окно успешно инициализировано');
        } else {
            console.log('Модальное окно уже инициализировано');
        }
    } catch (error) {
        console.error('Ошибка при инициализации модального окна:', error);
    }
}); 