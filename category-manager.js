class CategoryManager {
    constructor() {
        this.categories = this.loadCategories();
        this.openCategories = this.loadOpenCategories();
    }

    loadCategories() {
        const defaultCategories = [
            { id: 'coding', name: '💻 Coding', parent: null, children: [], color: '#4a90e2' },
            { id: 'content', name: '📝 Content Creation', parent: null, children: [], color: '#e74c3c' },
            { id: 'analysis', name: '📊 Analysis', parent: null, children: [], color: '#1abc9c' },
            { id: 'support', name: '🛠️ Support', parent: null, children: [], color: '#9b59b6' },
            { id: 'creative', name: '🎨 Creative', parent: null, children: [], color: '#f39c12' },
            { id: 'programming', name: '💻 Programmieren', parent: null, children: [], color: '#3498db' }
        ];

        return JSON.parse(localStorage.getItem('categories')) || defaultCategories;
    }

    loadOpenCategories() {
        const saved = JSON.parse(localStorage.getItem('openCategories'));
        if (Array.isArray(saved)) {
            return saved;
        }
        return this.getRootCategories().map(cat => cat.id);
    }

    saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
        this.updateCategorySelects();
        this.renderCategoryTree();
    }

    saveOpenCategories() {
        localStorage.setItem('openCategories', JSON.stringify(this.openCategories));
    }

    updateCategorySelects() {
        const selects = document.querySelectorAll('#promptCategory, #categoryFilter');

        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = select.id === 'categoryFilter' ? '<option value="">Alle Kategorien</option>' : '<option value="">Kategorie wählen</option>';

            this.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = this.getCategoryPath(cat.id);
                select.appendChild(option);
            });

            select.value = currentValue;
        });
    }

    renderCategoryTree() {
        const tree = document.getElementById('categoryTree');
        tree.innerHTML = this.buildTreeHTML(this.getRootCategories());
        this.attachTreeEventListeners();
    }

    toggleCategory(categoryId) {
        if (this.openCategories.includes(categoryId)) {
            this.openCategories = this.openCategories.filter(id => id !== categoryId);
        } else {
            this.openCategories.push(categoryId);
        }
        this.saveOpenCategories();
        this.renderCategoryTree();
    }

    buildTreeHTML(categories, level = 0) {
        return categories.map(cat => {
            const children = this.getChildren(cat.id);
            const promptCount = this.getPromptCount(cat.id);
            const isOpen = this.openCategories.includes(cat.id);
            const toggleBtn = children.length > 0
                ? `<button class="toggle-btn ${isOpen ? 'open' : ''}" data-toggle-id="${cat.id}">${isOpen ? '▼' : '►'}</button>`
                : '';
            const subcats = children.length > 0
                ? `<div class="subcategories ${isOpen ? 'open' : 'collapsed'}">${this.buildTreeHTML(children, level + 1)}</div>`
                : '';

            return `
                <div class="category-item category-level-${level}" data-category-id="${cat.id}">
                    <div class="category-header">${toggleBtn}<span class="category-name" style="color: ${cat.color}">${cat.name} (${promptCount})</span></div>
                    ${subcats}
                </div>
            `;
        }).join('');
    }

    attachTreeEventListeners() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryId = item.dataset.categoryId;
                this.selectCategory(categoryId);
                if (window.promptManager) {
                    window.promptManager.filterByCategory(categoryId);
                }
            });
        });

        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.toggleId;
                this.toggleCategory(id);
            });
        });
    }

    selectCategory(categoryId) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });

        const selectedItem = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }

    showCategoryDialog() {
        this.renderCategoryManagement();
        document.getElementById('categoryDialog').showModal();
    }

    renderCategoryManagement() {
        const container = document.getElementById('categoryManagement');
        container.innerHTML = this.categories.map(cat => {
            const level = this.getCategoryPath(cat.id).split(' > ').length - 1;
            return `
                <div class="category-edit-item" style="margin-left:${level * 20}px">
                    <input type="text" value="${cat.name}" onchange="categoryManager.updateCategoryName('${cat.id}', this.value)">
                    <input type="color" value="${cat.color}" onchange="categoryManager.updateCategoryColor('${cat.id}', this.value)">
                    <button onclick="addSubcategory('${cat.id}')" class="btn-add">➕</button>
                    <button onclick="categoryManager.deleteCategory('${cat.id}')" class="btn-delete">🗑️</button>
                </div>
            `;
        }).join('');
    }

    updateCategoryName(categoryId, newName) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            category.name = newName;
        }
    }

    updateCategoryColor(categoryId, newColor) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            category.color = newColor;
        }
    }

    addCategory(name, parentId = null) {
        const newCategory = {
            id: 'cat_' + Date.now(),
            name: name,
            parent: parentId,
            children: [],
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
        this.categories.push(newCategory);
        if (parentId) {
            const parent = this.categories.find(c => c.id === parentId);
            if (parent) {
                parent.children.push(newCategory.id);
            }
        }
        this.openCategories.push(newCategory.id);
        this.saveOpenCategories();
    }

    deleteCategory(categoryId) {
        if (confirm('Kategorie wirklich löschen?')) {
            this._deleteCategoryRecursive(categoryId);
            this.renderCategoryManagement();
            this.saveOpenCategories();
        }
    }

    _deleteCategoryRecursive(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        const children = this.getChildren(categoryId);
        children.forEach(child => this._deleteCategoryRecursive(child.id));

        if (category.parent) {
            const parent = this.categories.find(c => c.id === category.parent);
            if (parent) {
                parent.children = parent.children.filter(id => id !== categoryId);
            }
        }

        this.categories = this.categories.filter(c => c.id !== categoryId);
        this.openCategories = this.openCategories.filter(id => id !== categoryId);
    }

    getRootCategories() {
        return this.categories.filter(cat => !cat.parent);
    }

    getChildren(categoryId) {
        return this.categories.filter(cat => cat.parent === categoryId);
    }

    getPromptCount(categoryId) {
        if (!window.promptManager) return 0;
        const allCategories = [categoryId, ...this.getAllDescendantCategories(categoryId)];
        return window.promptManager.prompts.filter(p => allCategories.includes(p.category)).length;
    }

    getAllDescendantCategories(categoryId) {
        const descendants = [];
        const category = this.categories.find(c => c.id === categoryId);

        if (category && category.children) {
            category.children.forEach(childId => {
                descendants.push(childId);
                descendants.push(...this.getAllDescendantCategories(childId));
            });
        }

        return descendants;
    }

    getCategoryPath(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return '';

        const path = [category.name];
        let current = category;

        while (current.parent) {
            current = this.categories.find(c => c.id === current.parent);
            if (current) {
                path.unshift(current.name);
            }
        }

        return path.join(' > ');
    }

    getCategoryColor(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.color : '#ccc';
    }
}

// Global functions
function addNewCategory() {
    const name = prompt('Name der neuen Kategorie:');
    if (name) {
        categoryManager.addCategory(name);
        categoryManager.renderCategoryManagement();
    }
}

function addSubcategory(parentId) {
    const name = prompt('Name der Unterkategorie:');
    if (name) {
        categoryManager.addCategory(name, parentId);
        categoryManager.renderCategoryManagement();
    }
}

function saveCategoriesAndClose() {
    categoryManager.saveCategories();
    document.getElementById('categoryDialog').close();
    if (window.promptManager) {
        window.promptManager.showToast('Kategorien gespeichert!');
    }
}

function closeCategoryDialog() {
    document.getElementById('categoryDialog').close();
}

// Initialize
const categoryManager = new CategoryManager();
