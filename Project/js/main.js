// Основной файл для загрузки всех скриптов

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация скриптов...');
    
    // Инициализация модального окна
    if (typeof BookingModal !== 'undefined') {
        console.log('Инициализация модального окна...');
        
        // Если модальное окно еще не создано
        if (!window.bookingModal) {
            window.bookingModal = new BookingModal();
            window.bookingModal.init();
            console.log('Модальное окно инициализировано');
            
            // Инициализация кнопок бронирования
            BookingModal.initButtons();
            console.log('Кнопки бронирования инициализированы');
            
            // Отправляем событие инициализации
            const event = new CustomEvent('bookingModalInitialized');
            document.dispatchEvent(event);
            console.log('Событие bookingModalInitialized отправлено');
        }
    } else {
        console.error('BookingModal не найден!');
    }
    
    // Инициализация YooMoney
    console.log('Инициализация YooMoney...');
    
    // Проверяем доступность функции оплаты
    if (typeof redirectToYooMoney === 'function') {
        console.log('YooMoney успешно инициализирован');
        
        // Создаем тестовую функцию для проверки на хостинге
        window.testYooMoneyPayment = function() {
            try {
                console.log('Тестирование функции оплаты...');
                const testData = {
                    serviceName: "Тестовый заказ",
                    date: "2023-05-01",
                    hours: "2",
                    hallName: "Тестовый зал",
                    customerName: "Тестовый клиент",
                    customerPhone: "+7 (000) 000-0000",
                    totalPrice: 1
                };
                
                redirectToYooMoney(testData);
                return true;
            } catch (error) {
                console.error('Ошибка при тестировании функции оплаты:', error);
                alert('Ошибка при тестировании функции оплаты: ' + error.message);
                return false;
            }
        };
        
        console.log('Функция тестирования оплаты доступна через window.testYooMoneyPayment()');
    } else {
        console.error('ОШИБКА: Функция redirectToYooMoney не найдена!');
        alert('Критическая ошибка: функция оплаты недоступна. Пожалуйста, обратитесь к администратору сайта.');
    }
}); 