/**
 * Rich Text Editor for deweydex.github.io
 * Notion/Coda-style block editor with GitHub integration
 * Using EditorJS for vanilla JavaScript compatibility
 */

class EditorApp {
    constructor() {
        this.editor = null;
        this.githubConfig = null;
        this.currentPage = null;
        this.pages = [];
        this.saveTimeout = null;
        this.autoSaveDelay = 5000; // 5 seconds
        this.isSaving = false;

        this.init();
    }

    async init() {
        // Load configuration
        this.loadGithubConfig();
        await this.loadPages();

        // Initialize EditorJS
        await this.initEditor();

        // Setup UI event listeners
        this.setupEventListeners();

        // Load theme preference
        this.loadTheme();

        // Update UI
        this.updateUI();

        // Check if there's a page in the URL
        this.loadPageFromURL();
    }

    // ========================================
    // EDITOR INITIALIZATION
    // ========================================

    async initEditor() {
        const self = this;

        this.editor = new EditorJS({
            holder: 'editorjs',
            placeholder: 'Type / for commands or start writing...',
            autofocus: true,

            tools: {
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                        placeholder: 'Enter a header',
                        levels: [1, 2, 3, 4],
                        defaultLevel: 2
                    },
                    shortcut: 'CMD+SHIFT+H'
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+L'
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+O',
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote author',
                    }
                },
                warning: {
                    class: Warning,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+W',
                    config: {
                        titlePlaceholder: 'Title',
                        messagePlaceholder: 'Message',
                    }
                },
                delimiter: {
                    class: Delimiter
                },
                code: {
                    class: CodeTool,
                    shortcut: 'CMD+SHIFT+C'
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+M',
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: async (file) => {
                                return await self.uploadImage(file);
                            },
                            uploadByUrl: async (url) => {
                                return {
                                    success: 1,
                                    file: {
                                        url: url
                                    }
                                };
                            }
                        }
                    }
                },
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true,
                            vimeo: true,
                            twitter: true,
                            codepen: true,
                            github: true
                        }
                    }
                }
            },

            onChange: (api, event) => {
                this.scheduleAutoSave();
            },

            onReady: () => {
                console.log('Editor.js is ready!');
            }
        });
    }

    // ========================================
    // GITHUB INTEGRATION
    // ========================================

    loadGithubConfig() {
        try {
            const stored = localStorage.getItem('github_config_edit');
            if (stored) {
                this.githubConfig = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading GitHub config:', e);
        }
    }

    saveGithubConfig(config) {
        this.githubConfig = config;
        localStorage.setItem('github_config_edit', JSON.stringify(config));
        this.updateSaveIndicator('saved');
    }

    clearGithubConfig() {
        this.githubConfig = null;
        localStorage.removeItem('github_config_edit');
        this.updateSaveIndicator('disconnected');
    }

    async testGithubConnection(config) {
        try {
            const response = await fetch(`https://api.github.com/repos/${config.repo}`, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to connect to GitHub');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    async githubRequest(endpoint, method = 'GET', body = null) {
        if (!this.githubConfig) {
            throw new Error('GitHub not configured');
        }

        const url = `https://api.github.com/repos/${this.githubConfig.repo}/${endpoint}`;
        const headers = {
            'Authorization': `token ${this.githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'GitHub API request failed');
        }

        return await response.json();
    }

    // ========================================
    // PAGE MANAGEMENT
    // ========================================

    async loadPages() {
        try {
            const stored = localStorage.getItem('editor_pages');
            if (stored) {
                this.pages = JSON.parse(stored);
            }

            // Try to sync with GitHub if connected
            if (this.githubConfig) {
                await this.syncPagesFromGithub();
            }
        } catch (e) {
            console.error('Error loading pages:', e);
            this.pages = [];
        }
    }

    savePages() {
        localStorage.setItem('editor_pages', JSON.stringify(this.pages));
    }

    async syncPagesFromGithub() {
        try {
            // List all HTML files in the repo
            const contents = await this.githubRequest('contents');
            const htmlFiles = contents.filter(file =>
                file.name.endsWith('.html') &&
                file.name !== 'index.html' &&
                file.name !== 'cms.html' &&
                !file.name.includes('mockup')
            );

            // Add any files that aren't in our local list
            for (const file of htmlFiles) {
                if (!this.pages.find(p => p.path === file.name)) {
                    this.pages.push({
                        id: this.generateId(),
                        name: file.name.replace('.html', ''),
                        path: file.name,
                        lastModified: new Date().toISOString()
                    });
                }
            }

            this.savePages();
        } catch (error) {
            console.error('Error syncing pages from GitHub:', error);
        }
    }

    async loadPage(pageId) {
        const page = this.pages.find(p => p.id === pageId);
        if (!page) return;

        this.currentPage = page;

        // Update title
        document.getElementById('pageTitle').value = page.title || page.name;

        // Load content into editor
        if (page.content) {
            await this.editor.render(page.content);
        } else {
            await this.editor.blocks.clear();
        }

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('page', pageId);
        window.history.pushState({}, '', url);

        this.updateUI();
    }

    createNewPage() {
        const newPage = {
            id: this.generateId(),
            name: 'Untitled',
            title: 'Untitled',
            path: `untitled-${Date.now()}.html`,
            content: { blocks: [] },
            lastModified: new Date().toISOString()
        };

        this.pages.push(newPage);
        this.savePages();
        this.loadPage(newPage.id);
        this.updatePageDropdown();

        // Focus on title
        document.getElementById('pageTitle').focus();
    }

    async savePage() {
        if (!this.currentPage) return;

        const title = document.getElementById('pageTitle').value || 'Untitled';
        const content = await this.editor.save();

        this.currentPage.title = title;
        this.currentPage.content = content;
        this.currentPage.lastModified = new Date().toISOString();

        // Update path based on title if it's still untitled
        if (this.currentPage.name === 'Untitled') {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            this.currentPage.name = title;
            this.currentPage.path = `${slug}.html`;
        }

        this.savePages();
        this.updateUI();
    }

    // ========================================
    // AUTO-SAVE
    // ========================================

    scheduleAutoSave() {
        // Clear existing timeout
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        // Update UI to show unsaved changes
        this.updateSaveIndicator('unsaved');

        // Schedule save
        this.saveTimeout = setTimeout(() => {
            this.autoSave();
        }, this.autoSaveDelay);
    }

    async autoSave() {
        if (!this.currentPage) return;

        // Save locally
        await this.savePage();

        // Save to GitHub if connected
        if (this.githubConfig) {
            await this.saveToGithub();
        } else {
            this.updateSaveIndicator('saved-local');
        }
    }

    async saveToGithub() {
        if (this.isSaving || !this.currentPage) return;

        this.isSaving = true;
        this.updateSaveIndicator('saving');

        try {
            const branch = this.githubConfig.branch || 'main';

            // Convert EditorJS content to HTML
            const html = await this.convertToHTML();

            // Get the file SHA if it exists (for updates)
            let sha = null;
            try {
                const fileData = await this.githubRequest(`contents/${this.currentPage.path}?ref=${branch}`);
                sha = fileData.sha;
            } catch (e) {
                // File doesn't exist yet, which is fine
            }

            // Create or update the file
            const content = btoa(unescape(encodeURIComponent(html)));
            await this.githubRequest(`contents/${this.currentPage.path}`, 'PUT', {
                message: `Update ${this.currentPage.title}`,
                content: content,
                branch: branch,
                sha: sha
            });

            this.updateSaveIndicator('saved');
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            this.updateSaveIndicator('error');
            // Don't show alert for auto-save errors
            console.warn('Auto-save to GitHub failed:', error.message);
        } finally {
            this.isSaving = false;
        }
    }

    async convertToHTML() {
        const title = this.currentPage.title || 'Untitled';
        const data = await this.editor.save();

        // Convert EditorJS blocks to HTML
        let contentHTML = '';
        for (const block of data.blocks) {
            contentHTML += this.blockToHTML(block);
        }

        // Create full HTML page
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title)}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
        </nav>
    </header>
    <main>
        <article>
            <h1>${this.escapeHtml(title)}</h1>
            ${contentHTML}
        </article>
    </main>
</body>
</html>`;
    }

    blockToHTML(block) {
        const type = block.type;
        const data = block.data;

        switch (type) {
            case 'header':
                const level = data.level || 2;
                return `<h${level}>${this.escapeHtml(data.text)}</h${level}>\n`;

            case 'paragraph':
                return `<p>${data.text}</p>\n`;

            case 'list':
                const listTag = data.style === 'ordered' ? 'ol' : 'ul';
                const items = data.items.map(item => `<li>${this.escapeHtml(item)}</li>`).join('\n');
                return `<${listTag}>\n${items}\n</${listTag}>\n`;

            case 'checklist':
                const checkItems = data.items.map(item => {
                    const checked = item.checked ? 'checked' : '';
                    return `<li><input type="checkbox" ${checked} disabled> ${this.escapeHtml(item.text)}</li>`;
                }).join('\n');
                return `<ul class="checklist">\n${checkItems}\n</ul>\n`;

            case 'quote':
                return `<blockquote>${this.escapeHtml(data.text)}\n${data.caption ? `<cite>${this.escapeHtml(data.caption)}</cite>` : ''}</blockquote>\n`;

            case 'warning':
                return `<div class="warning">\n<strong>${this.escapeHtml(data.title)}</strong>\n<p>${this.escapeHtml(data.message)}</p>\n</div>\n`;

            case 'delimiter':
                return `<hr>\n`;

            case 'code':
                return `<pre><code>${this.escapeHtml(data.code)}</code></pre>\n`;

            case 'table':
                const rows = data.content.map(row => {
                    const cells = row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('');
                    return `<tr>${cells}</tr>`;
                }).join('\n');
                return `<table>\n${rows}\n</table>\n`;

            case 'image':
                const url = data.file?.url || '';
                const caption = data.caption || '';
                return `<figure>\n<img src="${url}" alt="${this.escapeHtml(caption)}">\n${caption ? `<figcaption>${this.escapeHtml(caption)}</figcaption>` : ''}\n</figure>\n`;

            case 'embed':
                return `<div class="embed">\n${data.embed || ''}\n${data.caption ? `<p>${this.escapeHtml(data.caption)}</p>` : ''}\n</div>\n`;

            default:
                return '';
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========================================
    // IMAGE UPLOAD
    // ========================================

    async uploadImage(file) {
        if (!this.githubConfig) {
            alert('Please connect to GitHub first to upload images');
            throw new Error('GitHub not configured');
        }

        try {
            const branch = this.githubConfig.branch || 'main';
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `assets/images/${timestamp}-${sanitizedName}`;

            // Read file as base64
            const base64 = await this.fileToBase64(file);
            const content = base64.split(',')[1]; // Remove data:image/... prefix

            // Upload to GitHub
            await this.githubRequest(`contents/${path}`, 'PUT', {
                message: `Upload image ${sanitizedName}`,
                content: content,
                branch: branch
            });

            // Return the URL in EditorJS format
            const repoName = this.githubConfig.repo.split('/')[1];
            const username = this.githubConfig.repo.split('/')[0];
            const repoUrl = `https://${username}.github.io/${repoName}`;

            return {
                success: 1,
                file: {
                    url: `${repoUrl}/${path}`
                }
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image: ' + error.message);
            return {
                success: 0,
                error: error.message
            };
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ========================================
    // UI UPDATES
    // ========================================

    updateUI() {
        this.updateSaveIndicator();
        this.updatePageDropdown();
        this.updateCurrentPageDisplay();
    }

    updateSaveIndicator(status = null) {
        const indicator = document.getElementById('saveIndicator');
        const text = document.getElementById('saveText');
        const icon = indicator.querySelector('i');

        indicator.className = 'save-indicator';

        if (!status) {
            status = this.githubConfig ? 'saved' : 'disconnected';
        }

        switch (status) {
            case 'saved':
                indicator.classList.add('saved');
                icon.className = 'fas fa-check-circle';
                text.textContent = 'All changes saved';
                break;
            case 'saved-local':
                indicator.classList.add('saved');
                icon.className = 'fas fa-check-circle';
                text.textContent = 'Saved locally';
                break;
            case 'saving':
                indicator.classList.add('saving');
                icon.className = 'fas fa-spinner fa-spin';
                text.textContent = 'Saving...';
                break;
            case 'unsaved':
                indicator.classList.add('saving');
                icon.className = 'fas fa-circle';
                text.textContent = 'Unsaved changes';
                break;
            case 'error':
                indicator.classList.add('saving');
                icon.className = 'fas fa-exclamation-circle';
                text.textContent = 'Save failed';
                break;
            case 'disconnected':
                indicator.classList.add('disconnected');
                icon.className = 'fas fa-unlink';
                text.textContent = 'Not connected';
                break;
        }
    }

    updatePageDropdown() {
        const pageList = document.getElementById('pageList');
        const newPageBtn = pageList.querySelector('.page-item-new');

        // Clear existing items (except new page button)
        pageList.innerHTML = '';
        pageList.appendChild(newPageBtn);

        // Add pages
        this.pages.forEach(page => {
            const item = document.createElement('div');
            item.className = 'page-item';
            if (this.currentPage && page.id === this.currentPage.id) {
                item.classList.add('active');
            }
            item.textContent = page.title || page.name;
            item.onclick = () => {
                this.loadPage(page.id);
                this.hidePageDropdown();
            };
            pageList.appendChild(item);
        });
    }

    updateCurrentPageDisplay() {
        const display = document.getElementById('currentPageName');
        if (this.currentPage) {
            display.textContent = this.currentPage.title || this.currentPage.name;
        } else {
            display.textContent = 'Select a page...';
        }
    }

    showPageDropdown() {
        document.getElementById('pageDropdown').classList.add('active');
    }

    hidePageDropdown() {
        document.getElementById('pageDropdown').classList.remove('active');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners() {
        // Page title auto-resize and save trigger
        const titleInput = document.getElementById('pageTitle');
        titleInput.addEventListener('input', () => {
            titleInput.style.height = 'auto';
            titleInput.style.height = titleInput.scrollHeight + 'px';
            this.scheduleAutoSave();
        });

        // Page selector
        document.getElementById('currentPage').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('pageDropdown');
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('pageDropdown');
            const selector = document.querySelector('.page-selector');
            if (!selector.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // New page button
        document.getElementById('newPageBtn').addEventListener('click', () => {
            this.createNewPage();
            this.hidePageDropdown();
        });

        // Home button
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = '/';
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Settings modal
        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', async () => {
            await this.saveSettings();
        });

        document.getElementById('disconnectGithub').addEventListener('click', () => {
            this.clearGithubConfig();
            this.closeSettings();
        });

        // Close modal on overlay click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });

        // Page search
        document.getElementById('pageSearch').addEventListener('input', (e) => {
            this.filterPages(e.target.value);
        });

        // Save before unload
        window.addEventListener('beforeunload', (e) => {
            if (this.saveTimeout) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
    }

    filterPages(query) {
        const items = document.querySelectorAll('.page-item:not(.page-item-new)');
        const lowerQuery = query.toLowerCase();

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(lowerQuery) ? 'block' : 'none';
        });
    }

    // ========================================
    // SETTINGS
    // ========================================

    openSettings() {
        const modal = document.getElementById('settingsModal');
        const disconnectGroup = document.getElementById('disconnectGroup');

        if (this.githubConfig) {
            document.getElementById('githubToken').value = this.githubConfig.token;
            document.getElementById('githubRepo').value = this.githubConfig.repo;
            document.getElementById('githubBranch').value = this.githubConfig.branch || 'main';
            disconnectGroup.style.display = 'block';
        } else {
            document.getElementById('githubToken').value = '';
            document.getElementById('githubRepo').value = '';
            document.getElementById('githubBranch').value = 'main';
            disconnectGroup.style.display = 'none';
        }

        modal.classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    async saveSettings() {
        const token = document.getElementById('githubToken').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();
        const branch = document.getElementById('githubBranch').value.trim() || 'main';

        if (!token || !repo) {
            alert('Please fill in all required fields');
            return;
        }

        const config = { token, repo, branch };

        try {
            // Test connection
            await this.testGithubConnection(config);

            // Save config
            this.saveGithubConfig(config);

            // Sync pages
            await this.syncPagesFromGithub();

            // Update UI
            this.updateUI();
            this.updatePageDropdown();

            // Close modal
            this.closeSettings();

            alert('Successfully connected to GitHub!');
        } catch (error) {
            alert('Failed to connect to GitHub: ' + error.message);
        }
    }

    // ========================================
    // THEME
    // ========================================

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ========================================
    // UTILITIES
    // ========================================

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadPageFromURL() {
        const params = new URLSearchParams(window.location.search);
        const pageId = params.get('page');

        if (pageId && this.pages.find(p => p.id === pageId)) {
            this.loadPage(pageId);
        } else if (this.pages.length > 0) {
            this.loadPage(this.pages[0].id);
        } else {
            // Create first page
            this.createNewPage();
        }
    }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new EditorApp();
    });
} else {
    window.app = new EditorApp();
}
