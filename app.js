class PromptManager {
    constructor() {
        this.prompts = JSON.parse(localStorage.getItem('prompts')) || this.getDefaultPrompts();
        this.prompts.forEach(p => {
            if (p.favorite === undefined) p.favorite = false;
            if (p.usageCount === undefined) p.usageCount = 0;
        });
        this.currentView = 'grid';
        this.showFavoritesOnly = false;
        this.editingPromptId = null;

        this.applySavedTheme();
        this.initEventListeners();
        this.renderPrompts();
        categoryManager.updateCategorySelects();
        categoryManager.renderCategoryTree();
    }

    getDefaultPrompts() {
        return [
            {
                id: 1,
                title: "Code Review Assistant",
                shortDescription: "Systematische Code-Reviews mit strukturierter Ausgabe",
                fullDescription: "Dieser Prompt führt systematische Code-Reviews durch mit Fokus auf Best Practices, Sicherheit und Performance.",
                content: "Führe eine systematische Code-Review durch für den folgenden {{programmiersprache}}-Code:\n\n{{code}}\n\nAnalysiere:\n1. Code-Qualität und Best Practices\n2. Sicherheitsaspekte\n3. Performance-Optimierungen\n4. Lesbarkeit und Wartbarkeit\n\nGib strukturierte Verbesserungsvorschläge.",
                category: "coding",
                tags: ["code-review", "quality", "best-practices"],
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                favorite: false,
                usageCount: 0
            },
            {
                id: 2,
                title: "Blog Content Creator",
                shortDescription: "Erstellt SEO-optimierte Blog-Artikel zu jedem Thema",
                fullDescription: "Generiert vollständige Blog-Artikel mit SEO-Optimierung und strukturiertem Aufbau.",
                content: "Erstelle einen SEO-optimierten Blog-Artikel zum Thema '{{thema}}' mit folgenden Spezifikationen:\n\n- Zielgruppe: {{zielgruppe}}\n- Tonalität: {{tonalitaet}}\n- Länge: {{laenge}} Wörter\n\nStruktur:\n1. Catchy Headline\n2. Einleitung mit Hook\n3. Hauptteil mit Unterüberschriften\n4. Fazit mit Call-to-Action",
                category: "content",
                tags: ["blog", "seo", "content-marketing"],
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                favorite: false,
                usageCount: 0
            },
            {
                id: 3,
                title: "Data Analysis Expert",
                shortDescription: "Analysiert Datensätze und erstellt Insights",
                fullDescription: "Führt umfassende Datenanalysen durch und erstellt actionable Insights.",
                content: "Analysiere den folgenden Datensatz:\n\n{{datensatz}}\n\nFührung eine umfassende Analyse durch:\n1. Deskriptive Statistiken\n2. Trends und Muster\n3. Korrelationen\n4. Anomalien\n5. Handlungsempfehlungen",
                category: "analysis",
                tags: ["data", "statistics", "insights"],
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                favorite: false,
                usageCount: 0
            },
            {
                id: 4,
                title: "Professional Email Response",
                shortDescription: "Erstellt höfliche und professionelle E-Mail-Antworten",
                fullDescription: "Generiert professionelle E-Mail-Antworten für verschiedene Business-Kontexte.",
                content: "Erstelle eine höfliche und professionelle E-Mail-Antwort für folgende Anfrage:\n\n{{kundenanfrage}}\n\nKontext: {{kontext}}\nGewünschter Tonfall: {{tonfall}}\n\nDie Antwort soll:\n- Höflich und professionell sein\n- Das Problem/die Anfrage direkt adressieren\n- Lösungsvorschläge enthalten\n- Einen positiven Abschluss haben",
                category: "support",
                tags: ["email", "communication", "professional"],
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                favorite: false,
                usageCount: 0
            }
        ];
    }

    initEventListeners() {
        // Navigation
        document.getElementById('categoriesBtn').addEventListener('click', () => this.showCategoryDialog());
        document.getElementById('toggleViewBtn').addEventListener('click', () => this.toggleView());
        document.getElementById('newPromptBtn').addEventListener('click', () => this.showPromptDialog());
        document.getElementById('favoritesBtn').addEventListener('click', () => this.toggleFavoritesFilter());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Import/Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('exportMdBtn').addEventListener('click', () => this.exportMarkdown());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));

        // Search and Filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchPrompts(e.target.value));
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterByCategory(e.target.value));

        // Dialog Events
        document.getElementById('cancelPrompt').addEventListener('click', () => this.closePromptDialog());
        document.getElementById('promptForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });
    }

    showPromptDialog(promptId = null) {
        this.editingPromptId = promptId;
        const dialog = document.getElementById('promptDialog');

        if (promptId) {
            const prompt = this.prompts.find(p => p.id === promptId);
            this.fillForm(prompt);
        } else {
            document.getElementById('promptForm').reset();
        }

        categoryManager.updateCategorySelects();
        dialog.showModal();
    }

    closePromptDialog() {
        document.getElementById('promptDialog').close();
        this.editingPromptId = null;
    }

    fillForm(prompt) {
        document.getElementById('promptTitle').value = prompt.title;
        document.getElementById('promptCategory').value = prompt.category;
        document.getElementById('shortDescription').value = prompt.shortDescription || '';
        document.getElementById('fullDescription').value = prompt.fullDescription || '';
        document.getElementById('promptContent').value = prompt.content;
        document.getElementById('promptTags').value = prompt.tags.join(', ');
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('promptTitle').value,
            category: document.getElementById('promptCategory').value,
            shortDescription: document.getElementById('shortDescription').value,
            fullDescription: document.getElementById('fullDescription').value,
            content: document.getElementById('promptContent').value,
            tags: document.getElementById('promptTags').value.split(',').map(t => t.trim()).filter(t => t)
        };

        if (this.editingPromptId) {
            this.updatePrompt(this.editingPromptId, formData);
        } else {
            this.createPrompt(formData);
        }

        this.closePromptDialog();
    }

    createPrompt(data) {
        const newPrompt = {
            ...data,
            id: Date.now(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            favorite: false,
            usageCount: 0
        };

        this.prompts.push(newPrompt);
        this.savePrompts();
        this.renderPrompts();
        this.showToast('Prompt erstellt!');
    }

    updatePrompt(id, data) {
        const index = this.prompts.findIndex(p => p.id === id);
        if (index !== -1) {
            this.prompts[index] = {
                ...this.prompts[index],
                ...data,
                updated: new Date().toISOString()
            };
            this.savePrompts();
            this.renderPrompts();
            this.showToast('Prompt aktualisiert!');
        }
    }

    deletePrompt(id) {
        if (confirm('Prompt wirklich löschen?')) {
            this.prompts = this.prompts.filter(p => p.id !== id);
            this.savePrompts();
            this.renderPrompts();
            this.showToast('Prompt gelöscht!');
        }
    }

    toggleFavorite(id) {
        const prompt = this.prompts.find(p => p.id === id);
        if (prompt) {
            prompt.favorite = !prompt.favorite;
            this.savePrompts();
            this.renderPrompts();
        }
    }

    executeTemplate(id) {
        const prompt = this.prompts.find(p => p.id === id);
        if (!prompt) return;

        prompt.usageCount = (prompt.usageCount || 0) + 1;
        this.savePrompts();

        const variables = this.extractTemplateVariables(prompt.content);
        if (variables.length === 0) {
            // No variables, just copy content
            navigator.clipboard.writeText(prompt.content);
            this.showToast('Prompt kopiert!');
            return;
        }

        this.showTemplateDialog(prompt, variables);
    }

    extractTemplateVariables(content) {
        const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
        return [...new Set(matches.map(match => match.slice(2, -2).trim()))];
    }

    showTemplateDialog(prompt, variables) {
        const dialog = document.getElementById('templateDialog');
        const form = document.getElementById('templateForm');

        form.innerHTML = variables.map(variable => `
            <div class="form-group">
                <label for="var_${variable}">${variable}:</label>
                <input type="text" id="var_${variable}" onchange="updateTemplatePreview(${prompt.id})">
            </div>
        `).join('');

        document.getElementById('templatePreview').textContent = prompt.content;
        window.currentTemplatePrompt = prompt;
        dialog.showModal();
    }

    renderPrompts() {
        if (this.currentView === 'grid') {
            this.renderGrid();
        } else {
            this.renderTable();
        }
    }

    renderGrid() {
        const grid = document.getElementById('promptGrid');
        const table = document.getElementById('promptTable');

        grid.style.display = 'grid';
        table.style.display = 'none';

        grid.innerHTML = this.prompts.map(prompt => this.createPromptCard(prompt)).join('');
        grid.querySelectorAll('.prompt-card').forEach(card => {
            card.addEventListener('click', () => {
                grid.querySelectorAll('.prompt-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });
    }

    renderTable() {
        const grid = document.getElementById('promptGrid');
        const table = document.getElementById('promptTable');
        const tbody = table.querySelector('tbody');

        grid.style.display = 'none';
        table.style.display = 'table';

        tbody.innerHTML = this.prompts.map(prompt => this.createPromptRow(prompt)).join('');
    }

    createPromptCard(prompt) {
        const categoryPath = categoryManager.getCategoryPath(prompt.category);
        const categoryColor = categoryManager.getCategoryColor(prompt.category);
        const createdDate = new Date(prompt.created).toLocaleDateString('de-DE');

        return `
            <div class="prompt-card" style="border-top-color: ${categoryColor};">
                <div class="prompt-card-header">
                    <h3 ondblclick="promptManager.showFullDescription(${prompt.id})">${prompt.title}</h3>
                    <button class="favorite-btn ${prompt.favorite ? 'active' : 'inactive'}" onclick="promptManager.toggleFavorite(${prompt.id})">☆</button>
                </div>
                <div class="prompt-card-body">
                    <div class="prompt-meta">
                        ${this.categoryIcon(prompt.category)} ${categoryPath} - ${createdDate}
                    </div>
                    <div class="prompt-description">${prompt.shortDescription || 'Keine Kurzbeschreibung'}</div>
                    <div class="prompt-tags">
                        ${prompt.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="prompt-actions">
                        <button onclick="promptManager.executeTemplate(${prompt.id})" class="btn-execute">▶️</button>
                        <button onclick="promptManager.showPromptDialog(${prompt.id})" class="btn-edit">✏️</button>
                        <button onclick="promptManager.deletePrompt(${prompt.id})" class="btn-delete">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    createPromptRow(prompt) {
        const categoryPath = categoryManager.getCategoryPath(prompt.category);
        const createdDate = new Date(prompt.created).toLocaleDateString('de-DE');

        return `
            <tr>
                <td><button class="favorite-btn ${prompt.favorite ? 'active' : 'inactive'}" onclick="promptManager.toggleFavorite(${prompt.id})">☆</button> <strong>${prompt.title}</strong></td>
                <td>${prompt.shortDescription || 'Keine Kurzbeschreibung'}</td>
                <td>${categoryPath}</td>
                <td>${prompt.tags.join(', ')}</td>
                <td>${createdDate}</td>
                <td>
                    <button onclick="promptManager.executeTemplate(${prompt.id})">▶️</button>
                    <button onclick="promptManager.showPromptDialog(${prompt.id})">✏️</button>
                    <button onclick="promptManager.deletePrompt(${prompt.id})">🗑️</button>
                </td>
            </tr>
        `;
    }

    categoryIcon(categoryId) {
        const cat = categoryManager.categories.find(c => c.id === categoryId);
        return cat && !cat.parent ? '📁' : '';
    }

    showFullDescription(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;

        document.getElementById('modalTitle').textContent = prompt.title;
        document.getElementById('modalDescription').innerHTML = `
            <p><strong>Kurzbeschreibung:</strong> ${prompt.shortDescription || 'Keine'}</p>
            <p><strong>Beschreibung:</strong> ${prompt.fullDescription || 'Keine'}</p>
            <p><strong>Kategorie:</strong> ${categoryManager.getCategoryPath(prompt.category)}</p>
            <p><strong>Tags:</strong> ${prompt.tags.join(', ') || 'Keine'}</p>
        `;
        document.getElementById('modalContent').innerHTML = `
            <h3>Prompt-Inhalt:</h3>
            <pre>${prompt.content}</pre>
        `;

        document.getElementById('modalOverlay').classList.add('show');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('show');
    }

    showCategoryDialog() {
        categoryManager.showCategoryDialog();
    }

    toggleFavoritesFilter() {
        const btn = document.getElementById('favoritesBtn');
        this.showFavoritesOnly = !this.showFavoritesOnly;
        if (this.showFavoritesOnly) {
            btn.textContent = '★ Alle';
            this.displayPrompts(this.prompts.filter(p => p.favorite));
        } else {
            btn.textContent = '☆ Favoriten';
            this.displayPrompts(this.prompts);
        }
    }

    toggleView() {
        const button = document.getElementById('toggleViewBtn');

        if (this.currentView === 'grid') {
            this.currentView = 'table';
            button.textContent = '📊 Kartenansicht';
        } else {
            this.currentView = 'grid';
            button.textContent = '📊 Tabellenansicht';
        }

        this.renderPrompts();
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeToggleText();
    }

    applySavedTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-theme');
        }
        this.updateThemeToggleText();
    }

    updateThemeToggleText() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const isDark = document.body.classList.contains('dark-theme');
        btn.textContent = isDark ? '☀️ Helles Theme' : '🌙 Dunkles Theme';
    }

    searchPrompts(term) {
        const filtered = this.prompts.filter(prompt =>
            prompt.title.toLowerCase().includes(term.toLowerCase()) ||
            prompt.shortDescription.toLowerCase().includes(term.toLowerCase()) ||
            prompt.fullDescription.toLowerCase().includes(term.toLowerCase()) ||
            prompt.content.toLowerCase().includes(term.toLowerCase()) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
        );

        this.displayPrompts(filtered);
    }

    filterByCategory(categoryId) {
        if (!categoryId) {
            this.displayPrompts(this.prompts);
            return;
        }

        const allCategories = this.getAllDescendantCategories(categoryId);
        allCategories.push(categoryId);

        const filtered = this.prompts.filter(prompt =>
            allCategories.includes(prompt.category)
        );

        this.displayPrompts(filtered);
    }

    getAllDescendantCategories(categoryId) {
        const descendants = [];
        const category = categoryManager.categories.find(c => c.id === categoryId);

        if (category && category.children) {
            category.children.forEach(childId => {
                descendants.push(childId);
                descendants.push(...this.getAllDescendantCategories(childId));
            });
        }

        return descendants;
    }

    displayPrompts(prompts) {
        const originalPrompts = this.prompts;
        this.prompts = prompts;
        this.renderPrompts();
        this.prompts = originalPrompts;
    }

    exportData() {
        const data = {
            prompts: this.prompts,
            categories: categoryManager.categories,
            exportDate: new Date().toISOString(),
            version: '4.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-manager-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Daten exportiert!');
    }

    exportMarkdown() {
        const lines = [];
        lines.push('# Prompt Manager Export');
        lines.push(`Exportdatum: ${new Date().toLocaleDateString('de-DE')}`);
        lines.push('');

        this.prompts.forEach(prompt => {
            const categoryPath = categoryManager.getCategoryPath(prompt.category);
            lines.push(`## ${prompt.title}`);
            if (prompt.shortDescription) {
                lines.push(prompt.shortDescription);
                lines.push('');
            }
            lines.push(`- **Kategorie:** ${categoryPath}`);
            lines.push(`- **Erstellt:** ${new Date(prompt.created).toLocaleDateString('de-DE')}`);
            if (prompt.tags && prompt.tags.length) {
                lines.push(`- **Tags:** ${prompt.tags.join(', ')}`);
            }
            lines.push('');
            lines.push('```');
            lines.push(prompt.content);
            lines.push('```');
            lines.push('');
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-manager-export-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Markdown exportiert!');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.prompts && Array.isArray(data.prompts)) {
                    const replace = confirm('Möchten Sie die vorhandenen Daten ersetzen (OK) oder die importierten Daten hinzufügen (Abbrechen)?');

                    if (replace) {
                        this.prompts = data.prompts;
                        if (data.categories) {
                            categoryManager.categories = data.categories;
                        }
                    } else {
                        const maxId = Math.max(...this.prompts.map(p => p.id), 0);
                        data.prompts.forEach((prompt, index) => {
                            prompt.id = maxId + index + 1;
                            this.prompts.push(prompt);
                        });
                    }

                    this.prompts.forEach(p => {
                        if (p.favorite === undefined) p.favorite = false;
                        if (p.usageCount === undefined) p.usageCount = 0;
                    });

                    this.savePrompts();
                    categoryManager.saveCategories();
                    this.renderPrompts();
                    this.showToast('Daten importiert!');
                } else {
                    throw new Error('Ungültiges Datenformat');
                }
            } catch (error) {
                this.showToast('Fehler beim Import: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    }

    savePrompts() {
        localStorage.setItem('prompts', JSON.stringify(this.prompts));
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Global functions for template dialog
function updateTemplatePreview(promptId) {
    if (!window.currentTemplatePrompt) return;

    let content = window.currentTemplatePrompt.content;
    const variables = promptManager.extractTemplateVariables(window.currentTemplatePrompt.content);

    variables.forEach(variable => {
        const input = document.getElementById(`var_${variable}`);
        if (input) {
            const value = input.value || `{{${variable}}}`;
            content = content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
        }
    });

    document.getElementById('templatePreview').textContent = content;
}

function copyTemplateResult() {
    const content = document.getElementById('templatePreview').textContent;
    navigator.clipboard.writeText(content).then(() => {
        promptManager.showToast('Template kopiert!');
        closeTemplateDialog();
    });
}

function closeTemplateDialog() {
    document.getElementById('templateDialog').close();
    window.currentTemplatePrompt = null;
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    window.promptManager = new PromptManager();
});

// Global keydown handler to close dialogs and modal with ESC
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        document.querySelectorAll('dialog[open]').forEach(d => d.close());
        const overlay = document.getElementById('modalOverlay');
        if (overlay && overlay.classList.contains('show')) {
            overlay.classList.remove('show');
        }
    }
});
