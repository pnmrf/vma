/**
 * ==================== ВИРТУАЛЬНЫЙ МУЗЕЙ АРХИТЕКТУРЫ СОЧИ ====================
 * 
 * Этот файл содержит всю логику работы музея.
 * Для добавления новых объектов — добавьте их в массив objects ниже.
 */

// ==================== ДАННЫЕ ОБЪЕКТОВ ====================
// Здесь хранится вся информация о музейных экспонатах.
// Чтобы добавить новый объект, скопируйте структуру и заполните данные.

const objects = [
    {
        // ========== ОБЪЕКТ 1: Кинотеатр «Спутник» ==========
        id: 1,
        name: 'Кинотеатр «Спутник»',
        
        // Путь к 3D модели (замените на свой .glb файл)
        // Для локального файла: 'models/sputnik.glb'
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        
        // Краткая информация для панели "i"
        info: {
            year: '1961',
            architect: 'Е.В. Сердюков',
            style: 'Советский модернизм',
            status: 'Действующий',
            address: 'ул. Навагинская, 12, Сочи',
            description: 'Один из знаковых кинотеатров Сочи, построенный в эпоху освоения космоса. Название получил в честь первого искусственного спутника Земли.'
        },
        
        // Текст статьи (можно добавить несколько абзацев)
        article: {
            title: 'Кинотеатр «Спутник» — памятник эпохи космической романтики',
            paragraphs: [
                'Кинотеатр «Спутник» был построен в 1961 году, в самый разгар космической эры. Архитектор Е.В. Сердюков создал здание, которое должно было символизировать устремлённость советского народа к звёздам. Лаконичные формы, большие стеклянные поверхности и характерный козырёк над входом стали визитной карточкой здания.',
                'Интерьер кинотеатра отличался просторным фойе с мозаичными панно на космическую тематику. Зрительный зал был рассчитан на 500 мест и оснащён современным на тот момент проекционным оборудованием.',
                'В 2000-х годах здание прошло реконструкцию с сохранением исторического облика. Сегодня «Спутник» продолжает работать как кинотеатр, являясь одной из архитектурных достопримечательностей центра Сочи.'
            ]
        },
        
        // Изображения для галереи чертежей
        // Замените на пути к своим изображениям: 'images/sputnik-plan.jpg'
        blueprints: [
            {
                url: null, // null = показать заглушку
                caption: 'Главный фасад, 1961 г.'
            },
            {
                url: null,
                caption: 'План первого этажа'
            },
            {
                url: null,
                caption: 'Историческое фото'
            }
        ]
    },
    
    {
        // ========== ОБЪЕКТ 2: Кинотеатр «Родина» ==========
        id: 2,
        name: 'Кинотеатр «Родина»',
        
        // Путь к 3D модели
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Horse.glb',
        
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
            {
                url: null,
                caption: 'Проект главного фасада'
            },
            {
                url: null,
                caption: 'Разрез здания'
            },
            {
                url: null,
                caption: 'Фото 1960-х годов'
            }
        ]
    }
    
    // ========== ДОБАВЬТЕ НОВЫЕ ОБЪЕКТЫ ЗДЕСЬ ==========
    // Скопируйте структуру выше и заполните данными
];

// ==================== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ====================
let currentObjectIndex = 0;

// ==================== DOM ЭЛЕМЕНТЫ ====================
const modelViewer = document.getElementById('modelViewer');
const headerTitle = document.getElementById('headerTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const infoBtn = document.getElementById('infoBtn');
const articleBtn = document.getElementById('articleBtn');
const blueprintsBtn = document.getElementById('blueprintsBtn');
const infoPanel = document.getElementById('infoPanel');
const articlePanel = document.getElementById('articlePanel');
const blueprintsPanel = document.getElementById('blueprintsPanel');
const infoContent = document.getElementById('infoContent');
const articleContent = document.getElementById('articleContent');
const blueprintsContent = document.getElementById('blueprintsContent');
const overlay = document.getElementById('overlay');
const indicatorDots = document.querySelectorAll('.indicator-dot');

// ==================== ФУНКЦИИ ====================

/**
 * Загружает данные объекта и обновляет интерфейс
 * @param {number} index - индекс объекта в массиве
 */
function loadObject(index) {
    const obj = objects[index];
    
    // Обновляем 3D модель
    modelViewer.src = obj.modelUrl;
    
    // Обновляем заголовок
    headerTitle.textContent = obj.name;
    
    // Обновляем контент панелей
    updateInfoPanel(obj);
    updateArticlePanel(obj);
    updateBlueprintsPanel(obj);
    
    // Обновляем индикаторы
    updateIndicators(index);
    
    // Обновляем состояние кнопок навигации
    updateNavigationButtons(index);
    
    // Закрываем все панели при смене объекта
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
            // Реальное изображение
            return `
                <div class="blueprint-item">
                    <img src="${bp.url}" alt="${bp.caption}">
                    <div class="blueprint-caption">${bp.caption}</div>
                </div>
            `;
        } else {
            // Заглушка
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
 * Переключает панель (открыть/закрыть)
 */
function togglePanel(panel, button) {
    if (panel.classList.contains('open')) {
        closePanel(panel, button);
    } else {
        openPanel(panel, button);
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
        closeAllPanels();
    }
});

// Навигация клавишами
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentObjectIndex > 0) {
        currentObjectIndex--;
        loadObject(currentObjectIndex);
    }
    if (e.key === 'ArrowRight' && currentObjectIndex < objects.length - 1) {
        currentObjectIndex++;
        loadObject(currentObjectIndex);
    }
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
// Загружаем первый объект при старте
document.addEventListener('DOMContentLoaded', () => {
    loadObject(0);
});
