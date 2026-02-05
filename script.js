/**
 * ==================== ВИРТУАЛЬНЫЙ МУЗЕЙ АРХИТЕКТУРЫ СОЧИ ====================
 * 
 * Этот файл содержит всю логику работы музея.
 * Включает: 3D просмотр, панели информации, интерактивную карту.
 */

// ==================== ДАННЫЕ ОБЪЕКТОВ ====================
/**
 * Массив объектов музея.
 * 
 * Чтобы добавить новый объект:
 * 1. Скопируйте структуру ниже
 * 2. Заполните данные
 * 3. Добавьте координаты в поле coordinates: [широта, долгота]
 * 4. Добавьте индикатор-точку в HTML (.indicator-dot)
 */

const objects = [
    {
        // ========== ОБЪЕКТ 1: Кинотеатр «Спутник» ==========
        id: 1,
        name: 'Кинотеатр «Спутник»',
        
        // Координаты для карты [широта, долгота]
        coordinates: [43.584859, 39.717951],
        
        // Путь к 3D модели
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        
        // Изображение для карточки на карте (null = заглушка)
        // Замените на путь к своему изображению: 'images/sputnik-preview.jpg'
        previewImage: null,
        
        // Краткая информация для панели "i"
        info: {
            year: '1961',
            architect: 'Е.В. Сердюков',
            style: 'Советский модернизм',
            status: 'Действующий',
            address: 'ул. Навагинская, 12, Сочи',
            description: 'Один из знаковых кинотеатров Сочи, построенный в эпоху освоения космоса. Название получил в честь первого искусственного спутника Земли.'
        },
        
        // Текст статьи
        article: {
            title: 'Кинотеатр «Спутник» — памятник эпохи космической романтики',
            paragraphs: [
                'Кинотеатр «Спутник» был построен в 1961 году, в самый разгар космической эры. Архитектор Е.В. Сердюков создал здание, которое должно было символизировать устремлённость советского народа к звёздам. Лаконичные формы, большие стеклянные поверхности и характерный козырёк над входом стали визитной карточкой здания.',
                'Интерьер кинотеатра отличался просторным фойе с мозаичными панно на космическую тематику. Зрительный зал был рассчитан на 500 мест и оснащён современным на тот момент проекционным оборудованием.',
                'В 2000-х годах здание прошло реконструкцию с сохранением исторического облика. Сегодня «Спутник» продолжает работать как кинотеатр, являясь одной из архитектурных достопримечательностей центра Сочи.'
            ]
        },
        
        // Изображения для галереи чертежей
        blueprints: [
            { url: null, caption: 'Главный фасад, 1961 г.' },
            { url: null, caption: 'План первого этажа' },
            { url: null, caption: 'Историческое фото' }
        ]
    },
    
    {
        // ========== ОБЪЕКТ 2: Кинотеатр «Родина» ==========
        id: 2,
        name: 'Кинотеатр «Родина»',
        
        // Координаты для карты [широта, долгота]
        coordinates: [43.600433, 39.721956],
        
        // Путь к 3D модели
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Horse.glb',
        
        // Изображение для карточки на карте
        previewImage: null,
        
        // Краткая информация
        info: {
            year: '1956',
            architect: 'А.И. Алёшин',
            style: 'Сталинский неоклассицизм',
            status: 'Памятник архитектуры',
            address: 'ул. Воровского, 1, Сочи',
            description: 'Величественное здание в стиле сталинского неоклассицизма, одна из главных архитектурных доминант центральной части города.'
        },
        
        // Текст статьи
        article: {
            title: 'Кинотеатр «Родина» — жемчужина сталинского ампира',
            paragraphs: [
                'Кинотеатр «Родина» был построен в 1956 году по проекту архитектора А.И. Алёшина. Здание выполнено в стиле сталинского неоклассицизма и отличается монументальным портиком с колоннами коринфского ордера.',
                'Фасад украшен лепным декором, включающим советскую символику и растительные орнаменты. Над главным входом расположен массивный фронтон с барельефом. Интерьеры кинотеатра поражали роскошью: мраморные полы, хрустальные люстры, резные потолки.',
                'После распада СССР здание пришло в упадок, однако в 2010-х годах началась его реставрация. Сегодня «Родина» признана объектом культурного наследия регионального значения и является одной из самых фотографируемых достопримечательностей Сочи.'
            ]
        },
        
        // Изображения для галереи
        blueprints: [
            { url: null, caption: 'Проект главного фасада' },
            { url: null, caption: 'Разрез здания' },
            { url: null, caption: 'Фото 1960-х годов' }
        ]
    }
    
    // ========== ДОБАВЬТЕ НОВЫЕ ОБЪЕКТЫ ЗДЕСЬ ==========
    // Скопируйте структуру выше и заполните данными
    // Не забудьте добавить coordinates: [широта, долгота]
];

// ==================== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ====================
let currentObjectIndex = 0;
let map = null;  // Экземпляр карты Leaflet
let userMarker = null;  // Маркер геолокации пользователя
let selectedObjectId = null;  // ID выбранного объекта на карте

// ==================== DOM ЭЛЕМЕНТЫ ====================
// 3D просмотр
const museumContainer = document.getElementById('museumContainer');
const modelViewer = document.getElementById('modelViewer');
const headerTitle = document.getElementById('headerTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const infoBtn = document.getElementById('infoBtn');
const articleBtn = document.getElementById('articleBtn');
const blueprintsBtn = document.getElementById('blueprintsBtn');
const mapBtn = document.getElementById('mapBtn');
const infoPanel = document.getElementById('infoPanel');
const articlePanel = document.getElementById('articlePanel');
const blueprintsPanel = document.getElementById('blueprintsPanel');
const infoContent = document.getElementById('infoContent');
const articleContent = document.getElementById('articleContent');
const blueprintsContent = document.getElementById('blueprintsContent');
const overlay = document.getElementById('overlay');
const indicatorDots = document.querySelectorAll('.indicator-dot');

// Карта
const mapContainer = document.getElementById('mapContainer');
const backToModelBtn = document.getElementById('backToModelBtn');
const mapCard = document.getElementById('mapCard');
const mapCardClose = document.getElementById('mapCardClose');
const mapCardTitle = document.getElementById('mapCardTitle');
const mapCardSubtitle = document.getElementById('mapCardSubtitle');
const mapCardImage = document.getElementById('mapCardImage');
const mapCardBtn = document.getElementById('mapCardBtn');

// ==================== ФУНКЦИИ 3D ПРОСМОТРА ====================

/**
 * Загружает данные объекта и обновляет интерфейс
 */
function loadObject(index) {
    const obj = objects[index];
    
    modelViewer.src = obj.modelUrl;
    headerTitle.textContent = obj.name;
    
    updateInfoPanel(obj);
    updateArticlePanel(obj);
    updateBlueprintsPanel(obj);
    updateIndicators(index);
    updateNavigationButtons(index);
    
    closeAllPanels();
}

/**
 * Обновляет панель информации
 */
function updateInfoPanel(obj) {
    const info = obj.info;
    infoContent.innerHTML = `
        <div class="info-item">
            <div class="info-label">Название</div>
            <div class="info-value">${obj.name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Год постройки</div>
            <div class="info-value">${info.year}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Архитектор</div>
            <div class="info-value">${info.architect}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Стиль</div>
            <div class="info-value">${info.style}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Статус</div>
            <div class="info-value">${info.status}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Адрес</div>
            <div class="info-value">${info.address}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Описание</div>
            <div class="info-value">${info.description}</div>
        </div>
    `;
}

/**
 * Обновляет панель статьи
 */
function updateArticlePanel(obj) {
    const article = obj.article;
    let paragraphsHTML = article.paragraphs
        .map(p => `<p class="article-text">${p}</p>`)
        .join('');
    
    articleContent.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        ${paragraphsHTML}
    `;
}

/**
 * Обновляет панель чертежей
 */
function updateBlueprintsPanel(obj) {
    const blueprints = obj.blueprints;
    let itemsHTML = blueprints.map((bp, i) => {
        if (bp.url) {
            return `
                <div class="blueprint-item">
                    <img src="${bp.url}" alt="${bp.caption}">
                    <div class="blueprint-caption">${bp.caption}</div>
                </div>
            `;
        } else {
            return `
                <div class="blueprint-item">
                    <div class="placeholder-image">
                        <span class="icon">🖼️</span>
                        <span>Изображение ${i + 1}</span>
                    </div>
                    <div class="blueprint-caption">${bp.caption}</div>
                </div>
            `;
        }
    }).join('');
    
    blueprintsContent.innerHTML = `
        <div class="blueprints-gallery">
            ${itemsHTML}
        </div>
    `;
}

/**
 * Обновляет индикаторы (точки)
 */
function updateIndicators(index) {
    indicatorDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

/**
 * Обновляет состояние кнопок навигации
 */
function updateNavigationButtons(index) {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === objects.length - 1;
}

/**
 * Открывает панель
 */
function openPanel(panel, button) {
    closeAllPanels();
    panel.classList.add('open');
    button.classList.add('active');
    overlay.classList.add('active');
}

/**
 * Закрывает панель
 */
function closePanel(panel, button) {
    panel.classList.remove('open');
    button.classList.remove('active');
    overlay.classList.remove('active');
}

/**
 * Закрывает все панели
 */
function closeAllPanels() {
    [infoPanel, articlePanel, blueprintsPanel].forEach(panel => {
        panel.classList.remove('open');
    });
    [infoBtn, articleBtn, blueprintsBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    overlay.classList.remove('active');
}

/**
 * Переключает панель
 */
function togglePanel(panel, button) {
    if (panel.classList.contains('open')) {
        closePanel(panel, button);
    } else {
        openPanel(panel, button);
    }
}

// ==================== ФУНКЦИИ КАРТЫ ====================

/**
 * Инициализирует карту Leaflet
 */
function initMap() {
    if (map) return; // Карта уже инициализирована
    
    // Создаём карту
    map = L.map('map', {
        zoomControl: true,
        attributionControl: true
    });
    
    // Добавляем тёмный тайловый слой (CartoDB Dark Matter без подписей)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Добавляем хотспоты объектов
    addObjectMarkers();
    
    // Масштабируем карту, чтобы все объекты были видны
    fitMapToObjects();
    
    // Запрашиваем геолокацию пользователя
    requestUserLocation();
}

/**
 * Добавляет маркеры объектов на карту
 */
function addObjectMarkers() {
    objects.forEach(obj => {
        // Создаём кастомный маркер (хотспот)
        const hotspotIcon = L.divIcon({
            className: 'map-hotspot-wrapper',
            html: '<div class="map-hotspot"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Добавляем маркер на карту
        const marker = L.marker(obj.coordinates, { icon: hotspotIcon })
            .addTo(map);
        
        // Обработчик клика по маркеру
        marker.on('click', () => {
            showMapCard(obj);
        });
        
        // Добавляем подпись (тултип) при наведении
        marker.bindTooltip(obj.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            className: 'map-tooltip'
        });
    });
}

/**
 * Масштабирует карту, чтобы все объекты были видны
 */
function fitMapToObjects() {
    const bounds = L.latLngBounds(objects.map(obj => obj.coordinates));
    map.fitBounds(bounds, {
        padding: [50, 50],  // Отступы по краям
        maxZoom: 14  // Максимальный зум при автоподгонке
    });
}

/**
 * Запрашивает геолокацию пользователя
 */
function requestUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                addUserMarker(latitude, longitude);
            },
            (error) => {
                console.log('Геолокация недоступна:', error.message);
                // Можно показать сообщение пользователю
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
        
        // Отслеживаем изменение позиции
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateUserMarker(latitude, longitude);
            },
            (error) => {
                console.log('Ошибка отслеживания геолокации:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );
    } else {
        console.log('Геолокация не поддерживается браузером');
    }
}

/**
 * Добавляет маркер пользователя на карту
 */
function addUserMarker(lat, lng) {
    const userIcon = L.divIcon({
        className: 'user-location-wrapper',
        html: '<div class="user-location"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    
    userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('Вы здесь', {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
}

/**
 * Обновляет позицию маркера пользователя
 */
function updateUserMarker(lat, lng) {
    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        addUserMarker(lat, lng);
    }
}

/**
 * Показывает карточку объекта на карте
 */
function showMapCard(obj) {
    selectedObjectId = obj.id;
    
    // Заполняем данные карточки
    mapCardTitle.textContent = obj.name;
    mapCardSubtitle.textContent = `${obj.info.year} г. • ${obj.info.architect}`;
    
    // Изображение
    if (obj.previewImage) {
        mapCardImage.innerHTML = `<img src="${obj.previewImage}" alt="${obj.name}">`;
    } else {
        mapCardImage.innerHTML = `
            <div class="placeholder-image">
                <span class="icon">🏛️</span>
            </div>
        `;
    }
    
    // Показываем карточку
    mapCard.classList.add('active');
}

/**
 * Скрывает карточку объекта
 */
function hideMapCard() {
    mapCard.classList.remove('active');
    selectedObjectId = null;
}

/**
 * Открывает экран карты
 */
function showMap() {
    mapContainer.classList.add('active');
    museumContainer.classList.add('hidden');
    mapBtn.classList.add('active');
    
    // Инициализируем карту при первом открытии
    setTimeout(() => {
        initMap();
        // Принудительно обновляем размер карты
        if (map) {
            map.invalidateSize();
        }
    }, 100);
}

/**
 * Закрывает экран карты и возвращается к 3D
 */
function hideMap() {
    mapContainer.classList.remove('active');
    museumContainer.classList.remove('hidden');
    mapBtn.classList.remove('active');
    hideMapCard();
}

/**
 * Переходит к 3D просмотру выбранного объекта
 */
function goTo3DView(objectId) {
    const index = objects.findIndex(obj => obj.id === objectId);
    if (index !== -1) {
        currentObjectIndex = index;
        loadObject(currentObjectIndex);
        hideMap();
    }
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

// Навигация между объектами
prevBtn.addEventListener('click', () => {
    if (currentObjectIndex > 0) {
        currentObjectIndex--;
        loadObject(currentObjectIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentObjectIndex < objects.length - 1) {
        currentObjectIndex++;
        loadObject(currentObjectIndex);
    }
});

// Клик по индикаторам
indicatorDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentObjectIndex = index;
        loadObject(currentObjectIndex);
    });
});

// Кнопки панелей
infoBtn.addEventListener('click', () => togglePanel(infoPanel, infoBtn));
articleBtn.addEventListener('click', () => togglePanel(articlePanel, articleBtn));
blueprintsBtn.addEventListener('click', () => togglePanel(blueprintsPanel, blueprintsBtn));

// Кнопка карты
mapBtn.addEventListener('click', () => {
    closeAllPanels();
    showMap();
});

// Кнопка возврата с карты
backToModelBtn.addEventListener('click', hideMap);

// Закрытие карточки на карте
mapCardClose.addEventListener('click', hideMapCard);

// Кнопка "Смотреть в 3D" на карточке
mapCardBtn.addEventListener('click', () => {
    if (selectedObjectId) {
        goTo3DView(selectedObjectId);
    }
});

// Кнопки закрытия панелей
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const panelId = btn.dataset.panel;
        const panel = document.getElementById(panelId);
        const actionBtn = {
            'infoPanel': infoBtn,
            'articlePanel': articleBtn,
            'blueprintsPanel': blueprintsBtn
        }[panelId];
        closePanel(panel, actionBtn);
    });
});

// Закрытие по клику на overlay
overlay.addEventListener('click', closeAllPanels);

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mapContainer.classList.contains('active')) {
            if (mapCard.classList.contains('active')) {
                hideMapCard();
            } else {
                hideMap();
            }
        } else {
            closeAllPanels();
        }
    }
});

// Навигация клавишами (стрелки)
document.addEventListener('keydown', (e) => {
    // Только если карта закрыта
    if (!mapContainer.classList.contains('active')) {
        if (e.key === 'ArrowLeft' && currentObjectIndex > 0) {
            currentObjectIndex--;
            loadObject(currentObjectIndex);
        }
        if (e.key === 'ArrowRight' && currentObjectIndex < objects.length - 1) {
            currentObjectIndex++;
            loadObject(currentObjectIndex);
        }
    }
});

// Клик по карте закрывает карточку
document.getElementById('map')?.addEventListener('click', (e) => {
    // Закрываем карточку только если клик не по маркеру
    if (!e.target.closest('.map-hotspot-wrapper')) {
        // Небольшая задержка, чтобы не конфликтовать с кликом по маркеру
        setTimeout(() => {
            if (mapCard.classList.contains('active') && !e.target.closest('.map-card')) {
                // hideMapCard(); // Раскомментируйте, если хотите закрывать по клику на карту
            }
        }, 100);
    }
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    loadObject(0);
});
