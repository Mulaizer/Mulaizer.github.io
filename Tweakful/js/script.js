document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded!');
    
    // Получаем необходимые элементы
    const burgerMenu = document.getElementById('burger-menu');
    const headerMenu = document.querySelector('.header-menu');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    console.log('Burger menu element:', burgerMenu);
    console.log('Header menu element:', headerMenu);
    console.log('Overlay element:', overlay);

    // Проверяем наличие элементов
    if (!burgerMenu) {
        console.error('Burger menu is missing');
    }
    if (!headerMenu) {
        console.error('Header menu is missing');
    }
    if (!overlay) {
        console.error('Overlay is missing');
    }
    
    if (!burgerMenu || !headerMenu || !overlay) {
        return;
    }

    // Функция переключения меню
    function toggleMenu() {
        console.log('Toggle menu triggered');
        burgerMenu.classList.toggle('active');
        headerMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        
        console.log('Menu is now:', headerMenu.classList.contains('active') ? 'open' : 'closed');
    }

    // Обработчик клика по бургер-меню
    burgerMenu.addEventListener('click', function() {
        console.log('Burger menu clicked');
        toggleMenu();
    });

    // Обработчик клика по оверлею (закрывает меню)
    overlay.addEventListener('click', function() {
        console.log('Overlay clicked');
        toggleMenu();
    });

    // Обработчик клика по ссылкам меню (закрывает меню)
    const menuLinks = document.querySelectorAll('.header-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Menu link clicked');
            if (headerMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && headerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            headerMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
    
    // === Код для слайдера историй успеха ===
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (sliderTrack && slides.length > 0 && prevBtn && nextBtn && dots.length > 0) {
        console.log('Success Stories Slider initialized with', slides.length, 'slides');
        
        let currentSlide = 0;
        const slideWidth = 100; // в процентах
        
        // Инициализация слайдера
        function initSlider() {
            slides.forEach((slide, index) => {
                slide.dataset.index = index;
            });
            
            updateSlider();
        }
        
        // Обновление положения слайдера
        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            
            // Обновление активной точки
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Переход к следующему слайду
        function nextSlide() {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
            } else {
                currentSlide = 0; // Циклический переход
            }
            updateSlider();
        }
        
        // Переход к предыдущему слайду
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = slides.length - 1; // Циклический переход
            }
            updateSlider();
        }
        
        // Переход к конкретному слайду
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        // Обработчики событий
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Запуск слайдера
        initSlider();
    } else {
        console.log('Success Stories Slider elements not found');
    }
   
});

