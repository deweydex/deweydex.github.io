/**
 * Rich Text Editor for deweydex.github.io
 * Notion/Coda-style block editor with GitHub integration
 * Using EditorJS for vanilla JavaScript compatibility
 */

class EditorApp {
    constructor() {
        this.editor = null;
        this.storage = window.SharedPageStorage; // Use unified storage
        this.currentPage = null;
        this.saveTimeout = null;
        this.autoSaveDelay = 5000; // 5 seconds
        this.isSaving = false;

        this.init();
    }

    async init() {
        // Load configuration and migrate old data if needed
        this.migrateOldData();
        this.loadGithubConfig();
        await this.loadPages();

        // Sync from GitHub if configured
        if (this.storage.githubConfig) {
            try {
                await this.storage.syncFromGithub();
                console.log('[/edit] Synced pages from GitHub');
            } catch (e) {
                console.warn('[/edit] Could not sync from GitHub:', e.message);
            }
        }

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

    // Helper properties for backward compatibility
    get pages() {
        return this.storage.getAllPages();
    }

    get githubConfig() {
        return this.storage.githubConfig;
    }

    // ========================================
    // EDITOR INITIALIZATION
    // ========================================

    async initEditor() {
        const self = this;

        // Wait for all scripts to load
        await new Promise(resolve => {
            if (window.EditorJS) resolve();
            else window.addEventListener('load', resolve);
        });

        try {
            this.editor = new EditorJS({
                holder: 'editorjs',
                placeholder: 'Type / for commands or start writing...',
                autofocus: true,

                tools: {
                    header: {
                        class: window.Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2
                        },
                        shortcut: 'CMD+SHIFT+H'
                    },
                    list: {
                        class: window.List,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+L'
                    },
                    checklist: {
                        class: window.Checklist,
                        inlineToolbar: true
                    },
                    quote: {
                        class: window.Quote,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+O',
                        config: {
                            quotePlaceholder: 'Enter a quote',
                            captionPlaceholder: 'Quote author',
                        }
                    },
                    warning: {
                        class: window.Warning,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+W',
                        config: {
                            titlePlaceholder: 'Title',
                            messagePlaceholder: 'Message',
                        }
                    },
                    delimiter: {
                        class: window.Delimiter
                    },
                    code: {
                        class: window.CodeTool,
                        shortcut: 'CMD+SHIFT+C'
                    },
                    inlineCode: {
                        class: window.InlineCode,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    table: {
                        class: window.Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                        }
                    },
                    image: {
                        class: window.ImageTool,
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
                        class: window.Embed,
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
        } catch (error) {
            console.error('Failed to initialize editor:', error);
            alert('Failed to load editor. Please refresh the page.');
        }
    }

    // ========================================
    // DATA MIGRATION
    // ========================================

    migrateOldData() {
        // Migrate old /edit data to unified storage
        try {
            const oldPages = localStorage.getItem('editor_pages');
            const oldConfig = localStorage.getItem('github_config_edit');

            if (oldPages && this.storage.getAllPages().length === 0) {
                const parsed = JSON.parse(oldPages);
                console.log('[/edit] Migrating', parsed.length, 'pages to unified storage');
                parsed.forEach(oldPage => {
                    this.storage.createPage({
                        title: oldPage.title || oldPage.name,
                        markdown: '',
                        editorjs: oldPage.content || { blocks: [] },
                        createdWith: 'edit'
                    });
                });
                localStorage.removeItem('editor_pages');
            }

            if (oldConfig && !this.storage.githubConfig) {
                const parsed = JSON.parse(oldConfig);
                this.storage.saveGithubConfig(parsed);
                localStorage.removeItem('github_config_edit');
                console.log('[/edit] Migrated GitHub config to unified storage');
            }
        } catch (e) {
            console.error('[/edit] Error during migration:', e);
        }
    }

    // ========================================
    // GITHUB INTEGRATION
    // ========================================

    loadGithubConfig() {
        // Load from unified storage
        this.storage.loadGithubConfig();
    }

    saveGithubConfig(config) {
        this.storage.saveGithubConfig(config);
        this.updateSaveIndicator('saved');
    }

    clearGithubConfig() {
        this.storage.clearGithubConfig();
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
        // Load from unified storage (already done in SharedPageStorage)
        this.storage.loadPages();
    }

    savePages() {
        // Save is handled by SharedPageStorage
        this.storage.savePages();
    }

    async loadPage(pageId) {
        const page = this.storage.getPage(pageId);
        if (!page) return;

        this.currentPage = page;

        // Update title
        document.getElementById('pageTitle').value = page.title;

        // Load content into editor from EditorJS format
        if (page.content.editorjs && page.content.editorjs.blocks) {
            await this.editor.render(page.content.editorjs);
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
        // Use unified storage
        const newPage = this.storage.createPage({
            title: 'Untitled',
            markdown: '',
            editorjs: { blocks: [] },
            createdWith: 'edit'
        });

        this.loadPage(newPage.id);
        this.updatePageDropdown();

        // Focus on title
        document.getElementById('pageTitle').focus();
    }

    async savePage() {
        if (!this.currentPage) return;

        const title = document.getElementById('pageTitle').value || 'Untitled';
        const content = await this.editor.save();

        // Update through unified storage
        this.storage.updatePage(this.currentPage.id, {
            title: title,
            editorjs: content
        });

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

        // Create full HTML page with improved styling
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title)}</title>
    <link rel="stylesheet" href="style.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #2563eb;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --background: #ffffff;
            --surface: #f8fafc;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Lora', 'Georgia', 'Times New Roman', serif;
            background: var(--background);
            color: var(--text-primary);
            line-height: 1.8;
            font-size: 18px;
        }

        header {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        nav {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 40px;
        }

        nav a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        nav a:hover {
            text-decoration: underline;
        }

        main {
            max-width: 900px;
            margin: 60px auto;
            padding: 0 40px;
        }

        article {
            background: white;
            padding: 60px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        h1 {
            font-size: 2.5rem;
            line-height: 1.2;
            margin-bottom: 30px;
            color: var(--text-primary);
            font-weight: 700;
        }

        h2 {
            font-size: 2rem;
            line-height: 1.3;
            margin: 40px 0 20px;
            color: var(--text-primary);
            font-weight: 600;
        }

        h3 {
            font-size: 1.5rem;
            line-height: 1.4;
            margin: 30px 0 15px;
            color: var(--text-primary);
            font-weight: 600;
        }

        h4 {
            font-size: 1.25rem;
            line-height: 1.4;
            margin: 25px 0 12px;
            color: var(--text-primary);
            font-weight: 600;
        }

        p {
            margin-bottom: 20px;
            color: var(--text-primary);
        }

        ul, ol {
            margin: 20px 0 20px 32px;
        }

        li {
            margin-bottom: 10px;
        }

        blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 20px;
            margin: 25px 0;
            font-style: italic;
            color: var(--text-secondary);
        }

        code {
            background: var(--surface);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9em;
        }

        pre {
            background: var(--surface);
            padding: 20px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 20px 0;
        }

        pre code {
            background: none;
            padding: 0;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            margin: 25px 0;
        }

        figure {
            margin: 30px 0;
        }

        figcaption {
            text-align: center;
            font-size: 0.9em;
            color: var(--text-secondary);
            margin-top: 10px;
            font-style: italic;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }

        th, td {
            border: 1px solid var(--border);
            padding: 12px;
            text-align: left;
        }

        th {
            background: var(--surface);
            font-weight: 600;
        }

        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }

        .warning strong {
            color: #92400e;
            display: block;
            margin-bottom: 8px;
        }

        .checklist {
            list-style: none;
            margin-left: 0;
        }

        .checklist li {
            display: flex;
            align-items: start;
            gap: 10px;
        }

        hr {
            border: none;
            border-top: 2px solid var(--border);
            margin: 40px 0;
        }

        @media (max-width: 768px) {
            body {
                font-size: 16px;
            }

            article {
                padding: 40px 24px;
            }

            main {
                padding: 0 20px;
                margin: 40px auto;
            }

            h1 {
                font-size: 2rem;
            }

            h2 {
                font-size: 1.5rem;
            }

            h3 {
                font-size: 1.25rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/">← Back to Home</a>
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

        // Markdown import
        document.getElementById('importMarkdownBtn').addEventListener('click', () => {
            this.openMarkdownImport();
        });

        document.getElementById('cancelImportMarkdown').addEventListener('click', () => {
            this.closeMarkdownImport();
        });

        document.getElementById('confirmImportMarkdown').addEventListener('click', async () => {
            await this.importMarkdown();
        });

        document.getElementById('importMarkdownModal').addEventListener('click', (e) => {
            if (e.target.id === 'importMarkdownModal') {
                this.closeMarkdownImport();
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
            await this.storage.syncFromGithub();

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
    // MARKDOWN IMPORT
    // ========================================

    openMarkdownImport() {
        document.getElementById('markdownInput').value = '';
        document.getElementById('importMarkdownModal').classList.add('active');
    }

    closeMarkdownImport() {
        document.getElementById('importMarkdownModal').classList.remove('active');
    }

    async importMarkdown() {
        const markdownText = document.getElementById('markdownInput').value.trim();

        if (!markdownText) {
            alert('Please paste some markdown content first');
            return;
        }

        try {
            // Parse markdown and convert to EditorJS blocks
            const blocks = this.parseMarkdownToBlocks(markdownText);

            // Clear current editor and load the new blocks
            await this.editor.blocks.clear();
            await this.editor.render({ blocks });

            // Trigger auto-save
            this.scheduleAutoSave();

            // Close modal
            this.closeMarkdownImport();

            console.log('Markdown imported successfully');
        } catch (error) {
            console.error('Error importing markdown:', error);
            alert('Failed to import markdown: ' + error.message);
        }
    }

    parseMarkdownToBlocks(markdown) {
        const blocks = [];
        const lines = markdown.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Skip empty lines at the start of a block
            if (!line.trim()) {
                i++;
                continue;
            }

            // Headers (# ## ###)
            const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
            if (headerMatch) {
                blocks.push({
                    type: 'header',
                    data: {
                        text: headerMatch[2].trim(),
                        level: headerMatch[1].length
                    }
                });
                i++;
                continue;
            }

            // Unordered lists (- or *)
            if (line.match(/^[-*]\s+/)) {
                const items = [];
                while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
                    items.push(lines[i].replace(/^[-*]\s+/, '').trim());
                    i++;
                }
                blocks.push({
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: items
                    }
                });
                continue;
            }

            // Ordered lists (1. 2. etc)
            if (line.match(/^\d+\.\s+/)) {
                const items = [];
                while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
                    items.push(lines[i].replace(/^\d+\.\s+/, '').trim());
                    i++;
                }
                blocks.push({
                    type: 'list',
                    data: {
                        style: 'ordered',
                        items: items
                    }
                });
                continue;
            }

            // Blockquotes (>)
            if (line.match(/^>\s+/)) {
                const quoteLines = [];
                while (i < lines.length && lines[i].match(/^>\s+/)) {
                    quoteLines.push(lines[i].replace(/^>\s+/, '').trim());
                    i++;
                }
                blocks.push({
                    type: 'quote',
                    data: {
                        text: quoteLines.join(' '),
                        caption: ''
                    }
                });
                continue;
            }

            // Code blocks (```)
            if (line.match(/^```/)) {
                const codeLines = [];
                i++; // Skip opening ```
                while (i < lines.length && !lines[i].match(/^```/)) {
                    codeLines.push(lines[i]);
                    i++;
                }
                i++; // Skip closing ```
                blocks.push({
                    type: 'code',
                    data: {
                        code: codeLines.join('\n')
                    }
                });
                continue;
            }

            // Horizontal rule (---)
            if (line.match(/^---+$/)) {
                blocks.push({
                    type: 'delimiter',
                    data: {}
                });
                i++;
                continue;
            }

            // Regular paragraph
            const paragraphLines = [];
            while (i < lines.length && lines[i].trim() &&
                   !lines[i].match(/^#{1,4}\s+/) &&
                   !lines[i].match(/^[-*]\s+/) &&
                   !lines[i].match(/^\d+\.\s+/) &&
                   !lines[i].match(/^>\s+/) &&
                   !lines[i].match(/^```/) &&
                   !lines[i].match(/^---+$/)) {
                paragraphLines.push(lines[i].trim());
                i++;
            }

            if (paragraphLines.length > 0) {
                blocks.push({
                    type: 'paragraph',
                    data: {
                        text: paragraphLines.join(' ')
                    }
                });
            }
        }

        return blocks;
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

    async loadPageFromURL() {
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');

        if (pageParam) {
            // Check if it's a page ID
            let page = this.pages.find(p => p.id === pageParam);

            // If not found by ID, try to find by path
            if (!page) {
                page = this.pages.find(p => p.path === pageParam || p.slug === pageParam);
            }

            // If still not found, try to load from GitHub
            if (!page && this.githubConfig) {
                console.log('[/edit] Page not found in storage, attempting to load from GitHub:', pageParam);
                try {
                    await this.loadPageFromGithub(pageParam);
                    return; // loadPageFromGithub will handle loading the page
                } catch (error) {
                    console.warn('[/edit] Could not load page from GitHub:', error.message);
                }
            }

            if (page) {
                this.loadPage(page.id);
                return;
            }
        }

        // Default behavior: load first page or create new one
        if (this.pages.length > 0) {
            this.loadPage(this.pages[0].id);
        } else {
            this.createNewPage();
        }
    }

    async loadPageFromGithub(pagePath) {
        if (!this.githubConfig) {
            throw new Error('GitHub not configured');
        }

        try {
            const branch = this.githubConfig.branch || 'main';

            // Fetch the HTML file from GitHub
            const response = await this.githubRequest(`contents/${pagePath}?ref=${branch}`);

            if (!response || !response.content) {
                throw new Error('File not found on GitHub');
            }

            // Decode the base64 content
            const htmlContent = atob(response.content);

            // Parse the HTML to extract title and convert to EditorJS blocks
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // Extract title
            const titleElement = doc.querySelector('h1') || doc.querySelector('title');
            const title = titleElement ? titleElement.textContent : pagePath.split('/').pop().replace('.html', '');

            // Extract main content (try to find article, main, or body)
            const contentElement = doc.querySelector('article') || doc.querySelector('main') || doc.body;

            // Convert HTML to markdown-like text (simplified)
            let contentText = '';
            if (contentElement) {
                // Extract text preserving structure
                const children = Array.from(contentElement.children);
                for (const child of children) {
                    if (child.tagName === 'H1') continue; // Skip title
                    if (child.tagName === 'HEADER') continue; // Skip header
                    if (child.tagName === 'NAV') continue; // Skip nav

                    const text = child.textContent.trim();
                    if (text) {
                        contentText += text + '\n\n';
                    }
                }
            }

            // Create a new page in storage
            const newPage = this.storage.createPage({
                title: title,
                markdown: contentText,
                editorjs: { blocks: [] },
                createdWith: 'edit'
            });

            // Update the path to match the GitHub file
            this.storage.updatePage(newPage.id, {
                path: pagePath
            });

            // Load the page
            this.loadPage(newPage.id);
            this.updatePageDropdown();

            console.log('[/edit] Successfully loaded page from GitHub:', pagePath);
        } catch (error) {
            console.error('[/edit] Error loading page from GitHub:', error);
            throw error;
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
