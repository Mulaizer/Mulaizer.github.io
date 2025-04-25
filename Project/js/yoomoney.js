/**
 * Интеграция с платежной системой YooMoney Quickpay
 * АВАРИЙНАЯ ВЕРСИЯ 3.0
 */

// Токен Telegram бота
const TELEGRAM_BOT_TOKEN = '7328211504:AAHAj_unq_ouJeFrZa_zq8cVR1iJY6FpwNY';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// ID чата администратора
const ADMIN_CHAT_ID = '7684316506'; 

// ID кошелька YooMoney (СТРОГО без кавычек в data-атрибуте формы)
const YOOMONEY_WALLET_ID = '4100119109668476';

/**
 * YooMoney Quickpay - СВЕРХПРОСТАЯ ВЕРСИЯ v4.0
 */

// Обработчик оплаты, максимально простой
function redirectToYooMoney(formData) {
    try {
        // Базовые параметры заказа
        const orderId = Date.now(); // Уникальный ID заказа
        const service = `Аренда кинозала ${formData.serviceName || ''}`; 
        const sum = formData.totalPrice;
        
        // Формируем простую ссылку на оплату
        const paymentUrl = 'https://yoomoney.ru/quickpay/confirm.xml' + 
                           '?receiver=' + YOOMONEY_WALLET_ID + 
                           '&quickpay-form=shop' + 
                           '&targets=' + encodeURIComponent(service) + 
                           '&sum=' + sum + 
                           '&label=' + orderId + 
                           '&successURL=' + encodeURIComponent('https://kinotime-together.ru/success.html');
        
        console.log('Переход на оплату:', paymentUrl);
        
        // Сохраняем данные заказа локально
        localStorage.setItem('lastOrder', JSON.stringify({
            orderId: orderId,
            serviceName: formData.serviceName,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            date: formData.date,
            hours: formData.hours,
            hallName: formData.hallName,
            totalPrice: formData.totalPrice,
            status: 'pending'
        }));
        
        // ПРЯМОЙ ПЕРЕХОД (самый простой способ, который должен работать везде)
        window.location.replace(paymentUrl);
        
    } catch (error) {
        // Даже если что-то пошло не так, предлагаем прямую ссылку
        alert('Ошибка автоматического перехода на оплату. Свяжитесь с администратором.');
        console.error('Ошибка оплаты:', error);
    }
}

/**
 * Функция отправки данных о заказе в Telegram
 */
async function sendOrderToTelegram(orderId, formData) {
    try {
        // Формируем текст сообщения
        const messageText = `
<b>📢 НОВЫЙ ЗАКАЗ #${orderId}</b>

<b>Услуга:</b> ${formData.serviceName || 'Не указана'}
<b>Сумма заказа:</b> ${formData.totalPrice} ₽

👤 Клиент: ${formData.customerName || 'Не указано'}
📱 Телефон: ${formData.customerPhone || 'Не указано'}
🎟️ Услуга: ${formData.serviceName || 'Не указано'}
🕒 Часы: ${formData.hours || 'Не указано'}
📅 Дата: ${formData.date || 'Не указано'}
🏛️ Зал: ${formData.hallName || 'Не указано'}
💰 Сумма: ${formData.totalPrice || 'Не указано'} руб.

<b>Техническая информация:</b>
<b>ID заказа:</b> ${orderId}
<b>Дата создания:</b> ${new Date().toLocaleString()}
<b>Статус:</b> Ожидает оплаты

<i>Клиент перенаправлен на страницу оплаты YooMoney</i>
`;

        // Отправляем сообщение через Telegram API
        const response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

/**
 * Функция сохранения данных заказа в localStorage
 */
function saveOrderData(orderId, formData) {
    try {
        // Получаем текущие сохраненные заказы или создаем пустой массив
        const savedOrders = JSON.parse(localStorage.getItem('bookingOrders') || '[]');
        
        // Данные заказа с добавлением ID и статуса
        const orderData = {
            ...formData,
            orderId: orderId,
            status: 'pending', // Статус заказа: pending (ожидает оплаты)
            createdAt: new Date().toISOString()
        };
        
        // Добавляем новый заказ в массив
        savedOrders.push(orderData);
        
        // Сохраняем обновленный массив заказов
        localStorage.setItem('bookingOrders', JSON.stringify(savedOrders));
        
        // Также сохраняем текущий заказ отдельно для использования на странице успешной оплаты
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        return true;
    } catch (error) {
        console.error('Ошибка сохранения данных заказа:', error);
        return false;
    }
}