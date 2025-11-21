// Content Manager Application with GitHub Integration
// A CMS for managing markdown pages and deploying to GitHub Pages

class ContentManager {
    constructor() {
        // Use unified storage instead of local arrays
        this.storage = window.SharedPageStorage;
        this.currentPage = null;
        this.editMode = true;
        this.isCreatingSubpage = false;
        this.hasUnsyncedChanges = false;

        this.init();
    }

    async init() {
        // Load from unified storage
        this.loadFromStorage();
        this.loadGithubConfig();

        // Sync from GitHub if configured
        if (this.storage.githubConfig) {
            try {
                await this.storage.syncFromGithub();
                console.log('Synced pages from GitHub');
            } catch (e) {
                console.warn('Could not sync from GitHub:', e.message);
            }
        }

        this.setupEventListeners();
        this.renderPageTree();
        this.setupMarkdownEditor();
        this.updateGithubBanner();

        // Get pages from unified storage
        const pages = this.storage.getAllPages();

        // If no pages exist, create initial content
        if (pages.length === 0) {
            this.createInitialContent();
        } else {
            // Load the first page by default
            if (pages[0]) {
                this.loadPage(pages[0].id);
            }
        }
    }

    // ===== DATA MANAGEMENT =====

    loadFromStorage() {
        // Migrate old CMS data to unified storage if exists
        try {
            const oldData = localStorage.getItem('contentManager');
            if (oldData) {
                const parsed = JSON.parse(oldData);
                const oldPages = parsed.pages || [];

                // Migrate to unified storage
                if (oldPages.length > 0 && this.storage.getAllPages().length === 0) {
                    console.log('Migrating', oldPages.length, 'pages to unified storage');
                    oldPages.forEach(oldPage => {
                        this.storage.createPage({
                            title: oldPage.title,
                            markdown: oldPage.content || '',
                            editorjs: { blocks: [] },
                            createdWith: 'cms',
                            parentId: oldPage.parentId
                        });
                    });
                    // Remove old storage after migration
                    localStorage.removeItem('contentManager');
                }
            }
        } catch (e) {
            console.error('Error during migration:', e);
        }

        // Load pages from unified storage
        this.storage.loadPages();
    }

    saveToStorage() {
        // Save is handled by SharedPageStorage automatically
        this.hasUnsyncedChanges = true;
        this.updateSyncStatus();
    }

    // Helper properties for backward compatibility
    get pages() {
        return this.storage.getAllPages();
    }

    get githubConfig() {
        return this.storage.githubConfig;
    }

    updateSyncStatus() {
        const status = document.getElementById('syncStatus');
        if (!status) return;

        if (this.hasUnsyncedChanges) {
            status.innerHTML = '<i class="fas fa-circle"></i><span>Changes saved locally (not published)</span>';
            status.classList.remove('syncing', 'error');
        } else {
            status.innerHTML = '<i class="fas fa-circle"></i><span>All changes published</span>';
        }
    }

    // ===== GITHUB CONFIGURATION =====

    loadGithubConfig() {
        // Migrate old GitHub config if exists
        try {
            const oldConfig = localStorage.getItem('githubConfig');
            if (oldConfig && !this.storage.githubConfig) {
                const parsed = JSON.parse(oldConfig);
                this.storage.saveGithubConfig(parsed);
                localStorage.removeItem('githubConfig');
                console.log('Migrated GitHub config to unified storage');
            }
        } catch (e) {
            console.error('Error during GitHub config migration:', e);
        }

        // Load from unified storage
        this.storage.loadGithubConfig();
    }

    saveGithubConfig(config) {
        this.storage.saveGithubConfig(config);
        this.updateGithubBanner();
    }

    clearGithubConfig() {
        this.storage.clearGithubConfig();
        this.updateGithubBanner();
    }

    updateGithubBanner() {
        const banner = document.getElementById('githubBanner');
        const bannerText = document.getElementById('bannerText');
        const publishBtn = document.getElementById('publishBtn');

        if (this.storage.githubConfig) {
            banner.classList.add('connected');
            bannerText.textContent = `Connected to ${this.storage.githubConfig.repo}`;
            if (publishBtn) publishBtn.disabled = false;
        } else {
            banner.classList.remove('connected');
            bannerText.textContent = 'Not connected to GitHub';
            if (publishBtn) publishBtn.disabled = true;
        }
    }

    // ===== GITHUB API =====

    async githubRequest(endpoint, method = 'GET', body = null) {
        if (!this.storage.githubConfig) {
            throw new Error('GitHub not configured');
        }

        const url = `https://api.github.com/repos/${this.storage.githubConfig.repo}/${endpoint}`;
        const headers = {
            'Authorization': `token ${this.storage.githubConfig.token}`,
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

        return response.json();
    }

    async testGithubConnection(config) {
        try {
            const url = `https://api.github.com/repos/${config.repo}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to connect to repository');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async publishToGithub() {
        if (!this.githubConfig) {
            alert('Please connect to GitHub first');
            return;
        }

        this.showLoading('Publishing to GitHub...');

        try {
            const branch = this.githubConfig.branch || 'main';

            // Get the latest commit SHA
            const refData = await this.githubRequest(`git/refs/heads/${branch}`);
            const latestCommitSha = refData.object.sha;

            // Get the tree SHA from the latest commit
            const commitData = await this.githubRequest(`git/commits/${latestCommitSha}`);
            const baseTreeSha = commitData.tree.sha;

            // Create blobs for each page
            const tree = [];

            for (const page of this.pages) {
                const content = this.generateHTMLForPage(page);
                const filename = this.generateFilename(page);

                // Create blob
                const blobData = await this.githubRequest('git/blobs', 'POST', {
                    content: content,
                    encoding: 'utf-8'
                });

                tree.push({
                    path: filename,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                });
            }

            // Note: We don't overwrite index.html - it's managed separately
            // Individual content pages are published as separate HTML files

            // Create new tree
            const newTree = await this.githubRequest('git/trees', 'POST', {
                base_tree: baseTreeSha,
                tree: tree
            });

            // Create commit
            const newCommit = await this.githubRequest('git/commits', 'POST', {
                message: `Update content - ${new Date().toLocaleString()}`,
                tree: newTree.sha,
                parents: [latestCommitSha]
            });

            // Update reference
            await this.githubRequest(`git/refs/heads/${branch}`, 'PATCH', {
                sha: newCommit.sha,
                force: false
            });

            this.hasUnsyncedChanges = false;
            this.updateSyncStatus();

            this.hideLoading();
            alert('Successfully published to GitHub!');

        } catch (error) {
            this.hideLoading();
            console.error('Publish error:', error);
            alert(`Failed to publish: ${error.message}`);
        }
    }

    generateHTMLForPage(page) {
        // Convert markdown to HTML - use unified storage format
        let markdownContent = page.content.markdown || '';

        if (page.attachments && page.attachments.length > 0) {
            markdownContent += '\n\n## Attachments\n\n';
            page.attachments.forEach(att => {
                markdownContent += `- [${att.name}](${att.data})\n`;
            });
        }

        const htmlContent = marked.parse(markdownContent);

        // Wrap in full HTML template with styling
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(page.title)} - Joshua S Aaron</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="site-header">
        <div class="header-container">
            <a href="index.html" class="site-title">Joshua S Aaron</a>
            <a href="index.html" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Back to Home
            </a>
        </div>
    </header>

    <main class="container">
        <div class="course-header">
            <h1>${this.escapeHtml(page.title)}</h1>
        </div>

        <div class="course-content">
            ${htmlContent}
        </div>
    </main>

    <!-- Theme Toggle -->
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
        <i class="fas fa-moon"></i>
    </button>

    <script>
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;
        const themeIcon = themeToggle.querySelector('i');

        const currentTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    </script>
</body>
</html>`;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateFilename(page) {
        return page.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '.html';
    }

    generateIndexHtml() {
        // Generate a simple index page that links to all pages
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joshua S Aaron</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #2563eb; }
        ul { list-style: none; padding: 0; }
        li { margin: 10px 0; }
        a { color: #2563eb; text-decoration: none; padding: 8px 12px; display: inline-block; }
        a:hover { background: #f0f0f0; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Joshua S Aaron</h1>
    <h2>Pages</h2>
    <ul>\n`;

        this.pages.filter(p => !p.parentId).forEach(page => {
            const filename = this.generateFilename(page);
            html += `        <li><a href="${filename}">${this.escapeHtml(page.title)}</a></li>\n`;
        });

        html += `    </ul>
</body>
</html>`;

        return html;
    }

    // ===== PAGE MANAGEMENT =====

    createPage(title, parentId = null) {
        // Use unified storage
        const page = this.storage.createPage({
            title: title || 'Untitled Page',
            markdown: '',
            editorjs: { blocks: [] },
            createdWith: 'cms',
            parentId: parentId
        });

        this.saveToStorage();
        this.renderPageTree();
        this.loadPage(page.id);

        return page;
    }

    deletePage(pageId) {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
            return;
        }

        // Use unified storage
        const success = this.storage.deletePage(pageId);
        if (!success) return;

        this.saveToStorage();
        this.renderPageTree();

        // Load another page or show welcome
        const pages = this.storage.getAllPages();
        if (pages.length > 0) {
            this.loadPage(pages[0].id);
        } else {
            this.currentPage = null;
            this.showWelcome();
        }
    }

    findPage(pageId) {
        return this.storage.getPage(pageId);
    }

    updatePage(pageId, updates) {
        // Convert old-style updates to new format
        const updateData = {};
        if (updates.title !== undefined) {
            updateData.title = updates.title;
        }
        if (updates.content !== undefined) {
            updateData.markdown = updates.content;
        }

        this.storage.updatePage(pageId, updateData);
        this.saveToStorage();
    }

    loadPage(pageId) {
        const page = this.findPage(pageId);
        if (!page) return;

        this.currentPage = page;

        // Update UI - use markdown content from unified storage
        document.getElementById('pageTitle').value = page.title;
        document.getElementById('markdownEditor').value = page.content.markdown;
        this.updatePreview();
        this.renderAttachments();
        this.updateActivePageInTree();

        // Enable/disable buttons
        document.getElementById('deletePageBtn').disabled = false;
        document.getElementById('newSubPageBtn').disabled = false;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ===== UI RENDERING =====

    renderPageTree() {
        const tree = document.getElementById('pageTree');
        tree.innerHTML = '';

        const rootPages = this.pages.filter(p => !p.parentId);
        rootPages.forEach(page => {
            tree.appendChild(this.createPageElement(page));
        });
    }

    createPageElement(page, level = 0) {
        const div = document.createElement('div');

        const hasChildren = page.children && page.children.length > 0;

        const pageItem = document.createElement('div');
        pageItem.className = 'page-item';
        pageItem.dataset.pageId = page.id;

        if (hasChildren) {
            const toggleIcon = document.createElement('i');
            toggleIcon.className = 'fas fa-chevron-right toggle-icon';
            toggleIcon.onclick = (e) => {
                e.stopPropagation();
                this.togglePageChildren(page.id);
            };
            pageItem.appendChild(toggleIcon);
        } else {
            const spacer = document.createElement('span');
            spacer.style.width = '16px';
            spacer.style.display = 'inline-block';
            pageItem.appendChild(spacer);
        }

        const icon = document.createElement('i');
        icon.className = 'fas fa-file-alt page-icon';
        pageItem.appendChild(icon);

        const title = document.createElement('span');
        title.textContent = page.title;
        title.style.flex = '1';
        pageItem.appendChild(title);

        pageItem.onclick = () => this.loadPage(page.id);

        div.appendChild(pageItem);

        // Add children
        if (hasChildren) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'page-children';
            childrenDiv.dataset.parentId = page.id;

            page.children.forEach(childId => {
                const childPage = this.findPage(childId);
                if (childPage) {
                    childrenDiv.appendChild(this.createPageElement(childPage, level + 1));
                }
            });

            div.appendChild(childrenDiv);
        }

        return div;
    }

    togglePageChildren(pageId) {
        const childrenDiv = document.querySelector(`.page-children[data-parent-id="${pageId}"]`);
        const toggleIcon = document.querySelector(`.page-item[data-page-id="${pageId}"] .toggle-icon`);

        if (childrenDiv && toggleIcon) {
            childrenDiv.classList.toggle('expanded');
            toggleIcon.classList.toggle('expanded');
        }
    }

    updateActivePageInTree() {
        document.querySelectorAll('.page-item').forEach(el => {
            el.classList.remove('active');
        });

        if (this.currentPage) {
            const activeEl = document.querySelector(`.page-item[data-page-id="${this.currentPage.id}"]`);
            if (activeEl) {
                activeEl.classList.add('active');
            }
        }
    }

    showWelcome() {
        document.getElementById('pageTitle').value = '';
        document.getElementById('markdownEditor').value = '';
        document.getElementById('markdownPreview').innerHTML = `
            <div class="welcome-message">
                <h1>Welcome to Your Content Manager</h1>
                <p>Connect to GitHub to sync your content, or start creating pages locally.</p>
            </div>
        `;
        document.getElementById('deletePageBtn').disabled = true;
        document.getElementById('newSubPageBtn').disabled = true;
        this.updateActivePageInTree();
    }

    // ===== MARKDOWN EDITOR =====

    setupMarkdownEditor() {
        const editor = document.getElementById('markdownEditor');

        editor.addEventListener('input', () => {
            if (this.currentPage) {
                // Update through unified storage
                this.storage.updatePage(this.currentPage.id, {
                    markdown: editor.value
                });
                this.updatePreview();
                this.saveToStorage();
            }
        });
    }

    updatePreview() {
        const content = document.getElementById('markdownEditor').value;
        const preview = document.getElementById('markdownPreview');

        if (content.trim()) {
            preview.innerHTML = marked.parse(content);
        } else {
            preview.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 40px;">Start typing to see preview...</p>';
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        const editorPane = document.getElementById('editorPane');
        const previewPane = document.getElementById('previewPane');
        const toggleBtn = document.getElementById('toggleEditMode');
        const icon = toggleBtn.querySelector('i');

        if (this.editMode) {
            // Edit mode: show both panes
            editorPane.style.display = 'block';
            previewPane.style.display = 'block';
            previewPane.classList.remove('full-width');
            icon.className = 'fas fa-eye';
            toggleBtn.title = 'Toggle Edit/Preview';
        } else {
            // Preview only mode
            editorPane.style.display = 'none';
            previewPane.style.display = 'block';
            previewPane.classList.add('full-width');
            icon.className = 'fas fa-edit';
            toggleBtn.title = 'Toggle Edit/Preview';
        }
    }

    // ===== LINK INSERTION =====

    showInsertLinkModal() {
        if (!this.currentPage) {
            alert('Please select or create a page first.');
            return;
        }

        const modal = document.getElementById('insertLinkModal');
        modal.classList.add('active');

        setTimeout(() => {
            document.getElementById('linkText').focus();
        }, 100);
    }

    insertLink() {
        const text = document.getElementById('linkText').value.trim();
        const url = document.getElementById('linkUrl').value.trim();

        if (!text || !url) {
            alert('Please enter both link text and URL.');
            return;
        }

        const editor = document.getElementById('markdownEditor');
        const markdown = `[${text}](${url})`;

        // Insert at cursor position
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const currentValue = editor.value;

        editor.value = currentValue.substring(0, start) + markdown + currentValue.substring(end);
        editor.focus();

        // Update the page content through unified storage
        if (this.currentPage) {
            this.storage.updatePage(this.currentPage.id, {
                markdown: editor.value
            });
            this.updatePreview();
            this.saveToStorage();
        }

        this.hideInsertLinkModal();
    }

    hideInsertLinkModal() {
        const modal = document.getElementById('insertLinkModal');
        modal.classList.remove('active');
        document.getElementById('linkText').value = '';
        document.getElementById('linkUrl').value = '';
    }

    // ===== FILE ATTACHMENTS =====

    handleFileUpload(files) {
        if (!this.currentPage) {
            alert('Please select or create a page first.');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const attachment = {
                    id: this.generateId(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result,
                    uploadedAt: new Date().toISOString()
                };

                this.currentPage.attachments.push(attachment);
                this.saveToStorage();
                this.renderAttachments();
            };

            reader.readAsDataURL(file);
        });
    }

    removeAttachment(attachmentId) {
        if (!this.currentPage) return;

        this.currentPage.attachments = this.currentPage.attachments.filter(
            a => a.id !== attachmentId
        );
        this.saveToStorage();
        this.renderAttachments();
    }

    renderAttachments() {
        const container = document.getElementById('attachmentsList');
        const section = document.getElementById('attachmentsSection');

        if (!this.currentPage || !this.currentPage.attachments || this.currentPage.attachments.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        container.innerHTML = '';

        this.currentPage.attachments.forEach(attachment => {
            const item = document.createElement('div');
            item.className = 'attachment-item';

            const icon = document.createElement('i');
            icon.className = this.getFileIcon(attachment.type);
            item.appendChild(icon);

            const name = document.createElement('span');
            name.textContent = attachment.name;
            item.appendChild(name);

            const size = document.createElement('span');
            size.textContent = ` (${this.formatFileSize(attachment.size)})`;
            size.style.color = 'var(--text-tertiary)';
            size.style.fontSize = '0.75rem';
            item.appendChild(size);

            const removeBtn = document.createElement('i');
            removeBtn.className = 'fas fa-times remove-attachment';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeAttachment(attachment.id);
            };
            item.appendChild(removeBtn);

            item.style.cursor = 'pointer';
            item.onclick = () => this.downloadAttachment(attachment);

            container.appendChild(item);
        });
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return 'fas fa-image';
        if (mimeType.startsWith('video/')) return 'fas fa-video';
        if (mimeType.startsWith('audio/')) return 'fas fa-music';
        if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'fas fa-file-word';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fas fa-file-excel';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'fas fa-file-powerpoint';
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'fas fa-file-archive';
        return 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    downloadAttachment(attachment) {
        const link = document.createElement('a');
        link.href = attachment.data;
        link.download = attachment.name;
        link.click();
    }

    // ===== SEARCH =====

    searchPages(query) {
        query = query.toLowerCase().trim();

        const pageItems = document.querySelectorAll('.page-item');

        pageItems.forEach(item => {
            const title = item.textContent.toLowerCase();
            const pageId = item.dataset.pageId;
            const page = this.findPage(pageId);
            const content = page ? page.content.toLowerCase() : '';

            if (query === '' || title.includes(query) || content.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // ===== IMPORT/EXPORT =====

    exportPage() {
        if (!this.currentPage) return;

        const content = `# ${this.currentPage.title}\n\n${this.currentPage.content.markdown}`;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentPage.title}.md`;
        link.click();

        URL.revokeObjectURL(url);
    }

    exportAll() {
        const data = {
            pages: this.pages,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `content-export-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.pages && Array.isArray(data.pages)) {
                    if (confirm('This will replace all existing data. Continue?')) {
                        this.pages = data.pages;
                        this.saveToStorage();
                        this.renderPageTree();

                        if (this.pages.length > 0) {
                            this.loadPage(this.pages[0].id);
                        } else {
                            this.showWelcome();
                        }

                        alert('Data imported successfully!');
                    }
                } else {
                    alert('Invalid data format.');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import data. Please check the file format.');
            }
        };

        reader.readAsText(file);
    }

    // ===== LOADING OVERLAY =====

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = document.getElementById('loadingText');
        text.textContent = message;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }

    // ===== INITIAL CONTENT =====

    createInitialContent() {
        // Create About/Home page
        const aboutPage = this.createPage('About');
        this.storage.updatePage(aboutPage.id, {
            markdown: `# Joshua S Aaron

## Background

I am currently finishing a masters degree in Computer Science and Mathematics Education at the Free University. I have a background in the Tech and Startup world, have taught in Los Angeles as part of City Year, at the Nelson Mandela school as part of my Masters, and for the last few years have helped to run Archetyp Cafe, an experiment in social business.

## Teaching Philosophy

My teaching and content styles are informed by progressive education movements in both a European and American context, though are also influenced heavily by the praxis-oriented methods of Paulo Freire.

### Core Principles

- **Student-centered learning**: Empowering students to take ownership of their learning journey
- **Real-world application**: Connecting theoretical concepts to practical, meaningful projects
- **Critical thinking**: Encouraging students to question, analyze, and construct knowledge
- **Collaborative learning**: Building communities of practice where students learn from each other

## Areas of Interest

- Computer Science Education
- Mathematics Education
- Progressive Education
- Educational Technology
- Social Entrepreneurship

## Contact

Feel free to reach out for collaboration, consultation, or just to discuss education and technology!
`
        });

        // Create Current Teaching page
        const teachingPage = this.createPage('Current Teaching');
        this.storage.updatePage(teachingPage.id, {
            markdown: `# Current Teaching

## Philosophy on Adult Learning

In adult learning contexts, what habits and expectations an adult learner brings with them from their schooling is often more important than access to quality teachers or content.

## Teaching Materials

While the vast majority of work produced for organizations such as Nelson and Paper remains their property, there are a few exercises, learning materials, and workshops available with context surrounding their creation or delivery.

## Approach

My teaching and content styles are informed by:
- Progressive education movements in both European and American contexts
- Praxis-oriented methods of Paulo Freire
- Focus on what learners bring to the classroom
- Emphasis on transformative learning experiences

## Teaching Experience

### Nelson Mandela School
Teaching Mathematics and Computer Science as part of my Masters program

### City Year - Los Angeles
Working with students in underserved communities

### Archetyp Cafe
Educational workshops and community learning initiatives
`
        });

        // Create Resources page
        const resourcesPage = this.createPage('Recommended Resources');
        this.storage.updatePage(resourcesPage.id, {
            markdown: `# Recommended Resources

This section is currently under construction. Based on feedback that a long list of books and channels might not be helpful, I'm curating a more focused selection.

## Modern Progressive Education

- Dennis Littky
- Eliot Washor
- Robert P Moses
- Margaret Rasfeld

## Theory-Oriented Books

### Education and Democracy
By John Dewey - A foundational text on democratic education

### Pedagogy of the Oppressed
By Paulo Freire - Critical pedagogy and liberatory education

## Resources for Math Teaching

### Art of Problem Solving Books
Excellent resources for developing mathematical thinking

## More Coming Soon

This list will be updated with more carefully selected resources that have proven most valuable in my teaching practice.
`
        });

        // Create Projects page
        const projectsPage = this.createPage('Projects');
        this.storage.updatePage(projectsPage.id, {
            markdown: `# Projects

## Archetyp Cafe

An experiment in social business that I've helped run for the past few years. Archetyp Cafe explores how business can serve as a vehicle for community building and social impact.

### Goals
- Create inclusive community spaces
- Support local initiatives
- Explore sustainable business models
- Foster meaningful connections

## Research Projects

### Computer Science Education Research
Exploring effective methods for teaching computational thinking and programming

### Mathematics Pedagogy Studies
Investigating how students construct mathematical understanding

### Educational Technology Development
Creating tools and platforms that support progressive education

## Community Initiatives

- Local teaching workshops
- Mentorship programs
- Educational resource development
- Curriculum design projects

More projects and detailed information coming soon...
`
        });

        // Create Podcast placeholder page
        const podcastPage = this.createPage('Podcast');
        this.storage.updatePage(podcastPage.id, {
            markdown: `# Podcast

Information about podcast episodes and discussions.

## Topics
- Education and pedagogy
- Technology in learning
- Social entrepreneurship
- Progressive education
- Mathematics and Computer Science education

*Content will be added here soon.*
`;

        this.saveToStorage();
        this.renderPageTree();
        this.loadPage(aboutPage.id);
    }

    // ===== EVENT LISTENERS =====

    setupEventListeners() {
        // GitHub connect button
        document.getElementById('connectGithubBtn').onclick = () => this.showGithubModal();

        // New page button
        document.getElementById('newPageBtn').onclick = () => this.showNewPageModal(false);

        // New subpage button
        document.getElementById('newSubPageBtn').onclick = () => {
            if (this.currentPage) {
                this.showNewPageModal(true);
            }
        };

        // Publish button
        document.getElementById('publishBtn').onclick = () => this.publishToGithub();

        // Settings button
        document.getElementById('settingsBtn').onclick = () => this.showGithubModal();

        // Import/Export button
        document.getElementById('importExportBtn').onclick = () => this.showImportExportModal();

        // Modal controls - New Page
        document.getElementById('closeModal').onclick = () => this.hideNewPageModal();
        document.getElementById('cancelNewPage').onclick = () => this.hideNewPageModal();
        document.getElementById('confirmNewPage').onclick = () => this.confirmNewPage();

        // Modal controls - GitHub
        document.getElementById('closeGithubModal').onclick = () => this.hideGithubModal();
        document.getElementById('saveGithubSettings').onclick = () => this.saveGithubSettings();
        document.getElementById('disconnectGithub').onclick = () => this.disconnectGithub();

        // Modal controls - Link
        document.getElementById('closeLinkModal').onclick = () => this.hideInsertLinkModal();
        document.getElementById('cancelLink').onclick = () => this.hideInsertLinkModal();
        document.getElementById('confirmLink').onclick = () => this.insertLink();

        // Modal controls - Import/Export
        document.getElementById('closeImportExportModal').onclick = () => this.hideImportExportModal();

        // Page title input
        document.getElementById('pageTitle').addEventListener('input', (e) => {
            if (this.currentPage) {
                this.currentPage.title = e.target.value || 'Untitled Page';
                this.saveToStorage();
                this.renderPageTree();
                this.updateActivePageInTree();
            }
        });

        // Toggle edit/preview mode
        document.getElementById('toggleEditMode').onclick = () => this.toggleEditMode();

        // Insert link
        document.getElementById('insertLinkBtn').onclick = () => this.showInsertLinkModal();

        // Delete page
        document.getElementById('deletePageBtn').onclick = () => {
            if (this.currentPage) {
                this.deletePage(this.currentPage.id);
            }
        };

        // Export page
        document.getElementById('exportPageBtn').onclick = () => this.exportPage();

        // File upload
        document.getElementById('uploadFileBtn').onclick = () => {
            document.getElementById('fileInput').click();
        };

        document.getElementById('fileInput').onchange = (e) => {
            this.handleFileUpload(e.target.files);
            e.target.value = '';
        };

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchPages(e.target.value);
        });

        // Import/Export actions
        document.getElementById('exportAllBtn').onclick = () => this.exportAll();
        document.getElementById('importBtn').onclick = () => {
            document.getElementById('importFileInput').click();
        };
        document.getElementById('importFileInput').onchange = (e) => {
            if (e.target.files.length > 0) {
                this.importData(e.target.files[0]);
            }
            e.target.value = '';
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                this.saveToStorage();
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.showNewPageModal(false);
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
                e.preventDefault();
                this.toggleEditMode();
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.showInsertLinkModal();
            }
        });

        // Enter key shortcuts in modals
        document.getElementById('newPageTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.confirmNewPage();
            }
        });

        document.getElementById('linkUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.insertLink();
            }
        });

        // Sidebar toggle
        const toggleSidebarFn = () => {
            const sidebar = document.getElementById('sidebar');
            const floatingToggle = document.getElementById('floatingSidebarToggle');

            sidebar.classList.toggle('collapsed');

            // Show floating toggle when sidebar is collapsed, hide when expanded
            if (sidebar.classList.contains('collapsed')) {
                floatingToggle.style.display = 'flex';
            } else {
                floatingToggle.style.display = 'none';
            }
        };

        document.getElementById('toggleSidebar').onclick = toggleSidebarFn;

        // Floating sidebar toggle button
        const floatingToggle = document.getElementById('floatingSidebarToggle');
        if (floatingToggle) {
            floatingToggle.onclick = toggleSidebarFn;
        }

        // Drag and drop for file upload
        const editorContainer = document.querySelector('.editor-container');

        editorContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            editorContainer.style.background = 'var(--surface)';
        });

        editorContainer.addEventListener('dragleave', () => {
            editorContainer.style.background = '';
        });

        editorContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            editorContainer.style.background = '';

            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files);
            }
        });
    }

    // ===== MODAL MANAGEMENT =====

    showNewPageModal(isSubpage) {
        this.isCreatingSubpage = isSubpage;
        const modal = document.getElementById('newPageModal');
        const modalTitle = modal.querySelector('.modal-header h2');

        modalTitle.textContent = isSubpage ? 'Create New Subpage' : 'Create New Page';
        modal.classList.add('active');

        setTimeout(() => {
            document.getElementById('newPageTitle').focus();
        }, 100);
    }

    hideNewPageModal() {
        const modal = document.getElementById('newPageModal');
        modal.classList.remove('active');
        document.getElementById('newPageTitle').value = '';
    }

    confirmNewPage() {
        const title = document.getElementById('newPageTitle').value.trim();

        if (!title) {
            alert('Please enter a page title.');
            return;
        }

        const parentId = this.isCreatingSubpage && this.currentPage ? this.currentPage.id : null;
        this.createPage(title, parentId);

        this.hideNewPageModal();
    }

    showGithubModal() {
        const modal = document.getElementById('githubSettingsModal');
        modal.classList.add('active');

        if (this.githubConfig) {
            document.getElementById('githubToken').value = this.githubConfig.token;
            document.getElementById('githubRepo').value = this.githubConfig.repo;
            document.getElementById('githubBranch').value = this.githubConfig.branch || 'main';
        }
    }

    hideGithubModal() {
        const modal = document.getElementById('githubSettingsModal');
        modal.classList.remove('active');
        document.getElementById('connectionStatus').innerHTML = '';
    }

    async saveGithubSettings() {
        const token = document.getElementById('githubToken').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();
        const branch = document.getElementById('githubBranch').value.trim() || 'main';

        if (!token || !repo) {
            alert('Please enter both token and repository.');
            return;
        }

        const statusDiv = document.getElementById('connectionStatus');
        statusDiv.innerHTML = 'Testing connection...';
        statusDiv.className = 'connection-status';

        const result = await this.testGithubConnection({ token, repo, branch });

        if (result.success) {
            this.saveGithubConfig({ token, repo, branch });
            statusDiv.innerHTML = '✓ Successfully connected to GitHub!';
            statusDiv.className = 'connection-status success';

            setTimeout(() => {
                this.hideGithubModal();
            }, 1500);
        } else {
            statusDiv.innerHTML = `✗ Connection failed: ${result.error}`;
            statusDiv.className = 'connection-status error';
        }
    }

    disconnectGithub() {
        if (confirm('Disconnect from GitHub? Your local content will be preserved.')) {
            this.clearGithubConfig();
            this.hideGithubModal();
        }
    }

    showImportExportModal() {
        const modal = document.getElementById('importExportModal');
        modal.classList.add('active');
    }

    hideImportExportModal() {
        const modal = document.getElementById('importExportModal');
        modal.classList.remove('active');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cm = new ContentManager();
});
