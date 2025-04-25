<?php
/**
 * Обработчик уведомлений от платежной системы FreekKassa
 * 
 * Разместите этот файл в корне вашего сайта и укажите его URL
 * в настройках магазина в личном кабинете FreekKassa
 */

// Включаем вывод ошибок для отладки
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// Логируем получение уведомления
file_put_contents('freekassa_log.txt', date('Y-m-d H:i:s') . ' - Уведомление получено: ' . json_encode($_POST) . PHP_EOL, FILE_APPEND);

// Настройки магазина
$merchant_id = '61463'; // ID вашего магазина
$merchant_secret = '*i(}[Ly1}yU+GVu'; // Второй секретный ключ для проверки уведомлений

// Получаем данные из запроса
$merchant = isset($_POST['MERCHANT_ID']) ? $_POST['MERCHANT_ID'] : '';
$amount = isset($_POST['AMOUNT']) ? $_POST['AMOUNT'] : 0;
$order_id = isset($_POST['MERCHANT_ORDER_ID']) ? $_POST['MERCHANT_ORDER_ID'] : '';
$sign = isset($_POST['SIGN']) ? $_POST['SIGN'] : '';

// Формируем подпись для проверки
$my_sign = md5($merchant_id.':'.$amount.':'.$merchant_secret.':'.$order_id);

// Проверяем подпись и ID магазина
if ($my_sign == $sign && $merchant == $merchant_id) {
    // Дополнительные параметры заказа
    $customer_name = isset($_POST['us_name']) ? $_POST['us_name'] : 'Неизвестно';
    $customer_phone = isset($_POST['us_phone']) ? $_POST['us_phone'] : 'Неизвестно';
    $service_name = isset($_POST['us_service']) ? $_POST['us_service'] : 'Неизвестно';
    $booking_date = isset($_POST['us_date']) ? $_POST['us_date'] : 'Неизвестно';
    $booking_hours = isset($_POST['us_hours']) ? $_POST['us_hours'] : 'Неизвестно';
    $hall_name = isset($_POST['us_hall']) ? $_POST['us_hall'] : 'Неизвестно';
    
    // Здесь можно добавить код для сохранения заказа в базу данных
    // ...
    
    // Отправляем уведомление на почту администратора
    $to = 'mulaizer229@gmail.com'; // Email для получения уведомлений о платежах
    $subject = 'Новое бронирование #' . $order_id;
    
    $message = "Получен новый оплаченный заказ!\n\n";
    $message .= "Номер заказа: " . $order_id . "\n";
    $message .= "Сумма: " . $amount . " руб.\n";
    $message .= "Услуга: " . $service_name . "\n";
    $message .= "Дата бронирования: " . $booking_date . "\n";
    $message .= "Количество часов: " . $booking_hours . "\n";
    $message .= "Зал: " . $hall_name . "\n\n";
    $message .= "Информация о клиенте:\n";
    $message .= "Имя: " . $customer_name . "\n";
    $message .= "Телефон: " . $customer_phone . "\n";
    
    $headers = "From: freekassa@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    mail($to, $subject, $message, $headers);
    
    // Логируем успешную обработку
    file_put_contents('freekassa_log.txt', date('Y-m-d H:i:s') . ' - Платеж успешно обработан: ' . $order_id . PHP_EOL, FILE_APPEND);
    
    // Отвечаем системе, что уведомление принято
    echo 'YES';
} else {
    // Логируем ошибку проверки
    file_put_contents('freekassa_log.txt', date('Y-m-d H:i:s') . ' - Ошибка проверки подписи или ID магазина: ' . $my_sign . ' != ' . $sign . PHP_EOL, FILE_APPEND);
    
    // Отвечаем, что уведомление не принято
    echo 'NO';
}
?> 