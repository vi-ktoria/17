const titleInput = document.getElementById('artifact-title');
const categoryInput = document.getElementById('artifact-category');
const imageInput = document.getElementById('artifact-image');
const addBtn = document.getElementById('add-btn');
const gallery = document.getElementById('gallery');
const filterInput = document.getElementById('artifact-filter');
const errorBanner = document.getElementById('error-banner');
const closeBanner = document.getElementById('close-banner');
const counter = document.getElementById('counter');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalCategory = document.getElementById('modal-category');
const modalDate = document.getElementById('modal-date');
const categoryTabs = document.getElementById('category-tabs');

let totalCards = 0;
let categories = new Set();

addBtn.addEventListener('click', function() {
    const cardTitle = titleInput.value.trim();
    const cardCategory = categoryInput.value.trim();
    const cardImage = imageInput.value.trim();
    
    if (!cardTitle || !cardCategory) {
        errorBanner.style.display = 'block';
        return;
    }
    
    createCard(cardTitle, cardCategory, cardImage);
    titleInput.value = "";
    categoryInput.value = "";
    imageInput.value = "";
});

closeBanner.addEventListener('click', function() {
    errorBanner.style.display = 'none';
});

function createCard(title, category, image) {
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');
    
    cardWrapper.dataset.category = category.toLowerCase();
    
    addCategoryTab(category);
    
    cardWrapper.innerHTML = `
        <div class="card">
            <button class="card-delete-btn">×</button>
            <button class="card-favorite-btn">☆</button>
            <div class="card-header">
                <h3>${title}</h3>
            </div>
            <div>
                <img class="card-img" src="${image}">
            </div>
            <div class="card-body">
                <p>Категория: ${category}</p>
            </div>
        </div>
    `;
    
    gallery.appendChild(cardWrapper);
    
    const card = cardWrapper.querySelector('.card');
    const deleteBtn = cardWrapper.querySelector('.card-delete-btn');
    const favoriteBtn = cardWrapper.querySelector('.card-favorite-btn');
    
    card.addEventListener('mouseover', function() {
        this.classList.add('hovered');
    });
    
    card.addEventListener('mouseout', function() {
        this.classList.remove('hovered');
    });
    
    card.addEventListener('click', function(e) {
        openModal(title, category, image);
    });
    
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm('Удалить эту карточку?')) {
			cardWrapper.remove();
			totalCards--;
			updateCounter();
        }
    });
    
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(cardWrapper);
    });
    
    totalCards++;
    updateCounter();
}

function addCategoryTab(category) {
    const normalizedCategory = category.toLowerCase();
    
    if (!categories.has(normalizedCategory)) {
        categories.add(normalizedCategory);
        const tab = document.createElement('button');
        tab.className = 'tab';
        tab.dataset.category = normalizedCategory;
        tab.textContent = category;
        
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterCardsByCategory(this.dataset.category);
        });
        categoryTabs.appendChild(tab);
    }
}

function filterCardsByCategory(category) {
    const cards = document.querySelectorAll('.card-wrapper');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

window.addEventListener('load', function() {
    const allTab = document.createElement('button');
    allTab.className = 'tab active';
    allTab.dataset.category = 'all';
    allTab.textContent = 'Все категории';
    allTab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        filterCardsByCategory('all');
    });
    categoryTabs.prepend(allTab);
});

function openModal(title, category, image) {
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDate.textContent = new Date().toLocaleDateString();
    modalImage.src = image;
    modal.style.display = 'flex';
}

modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
});

function updateCounter() {
    counter.textContent = `Всего артефактов: ${totalCards}`;
    counter.style.transform = 'scale(1)';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        this.textContent = 'Светлая тема';
    } else {
        this.textContent = 'Темная тема';
    }
});

filterInput.addEventListener('input', (event) => {
    const value = event.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card-wrapper');
    
    cards.forEach(card => {
        const category = card.dataset.category || '';
        
        if (category.includes(value) || value === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

function toggleFavorite(cardWrapper) {
    const card = cardWrapper.querySelector('.card');
    const favoriteBtn = cardWrapper.querySelector('.card-favorite-btn');
    
    if (card.classList.contains('favorite')) {
        card.classList.remove('favorite');
        favoriteBtn.innerHTML = '☆';
    } else {
        card.classList.add('favorite');
        favoriteBtn.innerHTML = '★';
    }
}