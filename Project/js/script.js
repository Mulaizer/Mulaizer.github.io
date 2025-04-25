document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.querySelector('.burger-btn');
    const burgerMenu = document.querySelector('.burger-menu');
    const menuContent = document.querySelector('.burger-menu-content');
    const socialMenu = document.querySelector('.mobile-menu-social');
    const buttonsMenu = document.querySelector('.mobile-menu-buttons');
    const navMenu = document.querySelector('.mobile-menu-nav');
    
    // Функция для открытия меню
    function openMenu() {
        burgerMenu.classList.add('active');
        menuContent.style.display = 'flex';
        menuContent.style.opacity = '1';
        menuContent.style.maxHeight = '600px';
        menuContent.style.padding = '30px 20px';
        
        // Показываем элементы меню
        setTimeout(function() {
            socialMenu.style.opacity = '1';
            socialMenu.style.transform = 'translateY(0)';
            buttonsMenu.style.opacity = '1';
            buttonsMenu.style.transform = 'translateY(0)';
            navMenu.style.opacity = '1';
            navMenu.style.transform = 'translateY(0)';
        }, 100);
        
        document.body.classList.add('no-scroll');
    }
    
    // Функция для закрытия меню
    function closeMenu() {
        // Сначала скрываем элементы
        socialMenu.style.opacity = '0';
        socialMenu.style.transform = 'translateY(20px)';
        buttonsMenu.style.opacity = '0';
        buttonsMenu.style.transform = 'translateY(20px)';
        navMenu.style.opacity = '0';
        navMenu.style.transform = 'translateY(20px)';
        
        // Затем скрываем меню
        setTimeout(function() {
            menuContent.style.opacity = '0';
            menuContent.style.maxHeight = '0';
            menuContent.style.padding = '0 20px';
            
            // После завершения анимации убираем класс active
            setTimeout(function() {
                burgerMenu.classList.remove('active');
            }, 400);
        }, 200);
        
        document.body.classList.remove('no-scroll');
    }
    
    burgerBtn.addEventListener('click', function() {
        if (burgerMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
});

function changeImage(element) {
    // Получаем ссылку на основное изображение
    let mainImage = document.querySelector('.main-image img');
    // Меняем src основного изображения на src выбранной миниатюры
    mainImage.src = element.src;
    
    // Добавляем активный класс для выбранной миниатюры
    let thumbnails = document.querySelectorAll('.thumbnails img');
    thumbnails.forEach(img => {
        img.classList.remove('active');
    });
    element.classList.add('active');
}

// Активируем первую миниатюру при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    let firstThumbnail = document.querySelector('.thumbnails img');
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
    }
    
    // Инициализируем бургер-меню
    const burgerBtn = document.querySelector('.burger-btn');
    const burgerMenu = document.querySelector('.burger-menu');
    const menuContent = document.querySelector('.burger-menu-content');
    const socialMenu = document.querySelector('.mobile-menu-social');
    const buttonsMenu = document.querySelector('.mobile-menu-buttons');
    const navMenu = document.querySelector('.mobile-menu-nav');
});