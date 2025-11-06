// Knowledge Base Application
// A Notion/Coda-like markdown editor with page management

class KnowledgeBase {
    constructor() {
        this.pages = [];
        this.currentPage = null;
        this.editMode = true;
        this.isCreatingSubpage = false;

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderPageTree();
        this.setupMarkdownEditor();

        // If no pages exist, create a welcome page
        if (this.pages.length === 0) {
            this.createInitialContent();
        } else {
            // Load the first page by default
            if (this.pages[0]) {
                this.loadPage(this.pages[0].id);
            }
        }
    }

    // ===== DATA MANAGEMENT =====

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('knowledgeBase');
            if (stored) {
                const data = JSON.parse(stored);
                this.pages = data.pages || [];
            }
        } catch (e) {
            console.error('Error loading from storage:', e);
            this.pages = [];
        }
    }

    saveToStorage() {
        try {
            const data = {
                pages: this.pages,
                version: '1.0'
            };
            localStorage.setItem('knowledgeBase', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to storage:', e);
            alert('Failed to save data. Storage might be full.');
        }
    }

    // ===== PAGE MANAGEMENT =====

    createPage(title, parentId = null) {
        const page = {
            id: this.generateId(),
            title: title || 'Untitled Page',
            content: '',
            parentId: parentId,
            children: [],
            attachments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.pages.push(page);

        // If this is a child page, add it to parent's children array
        if (parentId) {
            const parent = this.findPage(parentId);
            if (parent) {
                parent.children.push(page.id);
            }
        }

        this.saveToStorage();
        this.renderPageTree();
        this.loadPage(page.id);

        return page;
    }

    deletePage(pageId) {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
            return;
        }

        const page = this.findPage(pageId);
        if (!page) return;

        // Remove from parent's children array
        if (page.parentId) {
            const parent = this.findPage(page.parentId);
            if (parent) {
                parent.children = parent.children.filter(id => id !== pageId);
            }
        }

        // Delete all child pages recursively
        const deleteRecursive = (id) => {
            const p = this.findPage(id);
            if (p && p.children) {
                p.children.forEach(childId => deleteRecursive(childId));
            }
            this.pages = this.pages.filter(pg => pg.id !== id);
        };

        deleteRecursive(pageId);

        this.saveToStorage();
        this.renderPageTree();

        // Load another page or show welcome
        if (this.pages.length > 0) {
            this.loadPage(this.pages[0].id);
        } else {
            this.currentPage = null;
            this.showWelcome();
        }
    }

    findPage(pageId) {
        return this.pages.find(p => p.id === pageId);
    }

    updatePage(pageId, updates) {
        const page = this.findPage(pageId);
        if (page) {
            Object.assign(page, updates);
            page.updatedAt = new Date().toISOString();
            this.saveToStorage();
        }
    }

    loadPage(pageId) {
        const page = this.findPage(pageId);
        if (!page) return;

        this.currentPage = page;

        // Update UI
        document.getElementById('pageTitle').value = page.title;
        document.getElementById('markdownEditor').value = page.content;
        this.updatePreview();
        this.renderAttachments();
        this.updateActivePageInTree();

        // Enable/disable delete button
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
                <h1>Welcome to Your Knowledge Base</h1>
                <p>Create a new page or select an existing one from the sidebar to get started.</p>
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
                this.currentPage.content = editor.value;
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
                    data: e.target.result, // Base64 data
                    uploadedAt: new Date().toISOString()
                };

                this.currentPage.attachments.push(attachment);
                this.saveToStorage();
                this.renderAttachments();
            };

            // Read file as base64
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

            // Make attachment clickable to download
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

        const content = `# ${this.currentPage.title}\n\n${this.currentPage.content}`;
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
        link.download = `knowledge-base-export-${Date.now()}.json`;
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

    // ===== INITIAL CONTENT =====

    createInitialContent() {
        // Create welcome/home page
        const homePage = this.createPage('About');
        homePage.content = `# Joshua S Aaron

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
`;

        // Create Teaching page
        const teachingPage = this.createPage('Teaching');
        teachingPage.content = `# Teaching & Curriculum

## Current Work

I am involved in developing innovative curricula that blend computer science and mathematics education with progressive pedagogical approaches.

## Educational Resources

### Workshops
- Computational Thinking for Educators
- Mathematics Through Code
- Project-Based Learning in STEM

### Curriculum Design
- Integrated CS/Math curriculum
- Progressive education methods
- Assessment and evaluation strategies

## Past Experience

### City Year - Los Angeles
Teaching and mentoring in underserved communities

### Nelson Mandela School
Mathematics and Computer Science instruction as part of my Masters program

## Educational Philosophy

My approach is heavily influenced by:
- Paulo Freire's critical pedagogy
- Constructivist learning theory
- Project-based and experiential learning
`;

        // Create Projects page
        const projectsPage = this.createPage('Projects');
        projectsPage.content = `# Projects

## Archetyp Cafe

An experiment in social business that I've helped run for the past few years. Archetyp Cafe explores how business can serve as a vehicle for community building and social impact.

### Goals
- Create inclusive community spaces
- Support local initiatives
- Explore sustainable business models
- Foster meaningful connections

## Other Projects

More projects and initiatives coming soon...

### Research Projects
- Computer Science education research
- Mathematics pedagogy studies
- Educational technology development

### Community Initiatives
- Local teaching workshops
- Mentorship programs
- Educational resource development
`;

        // Create a Podcast placeholder page
        const podcastPage = this.createPage('Podcast');
        podcastPage.content = `# Podcast

Information about podcast episodes and discussions coming soon...

## Topics
- Education and pedagogy
- Technology in learning
- Social entrepreneurship
- Progressive education

*More content will be added here soon.*
`;

        this.saveToStorage();
        this.renderPageTree();
        this.loadPage(homePage.id);
    }

    // ===== EVENT LISTENERS =====

    setupEventListeners() {
        // New page button
        document.getElementById('newPageBtn').onclick = () => this.showNewPageModal(false);

        // New subpage button
        document.getElementById('newSubPageBtn').onclick = () => {
            if (this.currentPage) {
                this.showNewPageModal(true);
            }
        };

        // Modal controls
        document.getElementById('closeModal').onclick = () => this.hideNewPageModal();
        document.getElementById('cancelNewPage').onclick = () => this.hideNewPageModal();
        document.getElementById('confirmNewPage').onclick = () => this.confirmNewPage();

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
            e.target.value = ''; // Reset input
        };

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchPages(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + S to save (already auto-saved, but give feedback)
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                this.saveToStorage();
                console.log('Saved!');
            }

            // Cmd/Ctrl + N for new page
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.showNewPageModal(false);
            }

            // Cmd/Ctrl + E to toggle edit mode
            if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
                e.preventDefault();
                this.toggleEditMode();
            }
        });

        // Modal - Enter key to confirm
        document.getElementById('newPageTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.confirmNewPage();
            }
        });

        // Sidebar toggle
        document.getElementById('toggleSidebar').onclick = () => {
            document.getElementById('sidebar').classList.toggle('collapsed');
        };

        // Drag and drop for file upload
        const editorContainer = document.querySelector('.editor-container');

        editorContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            editorContainer.style.background = 'var(--surface)';
        });

        editorContainer.addEventListener('dragleave', (e) => {
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

    showNewPageModal(isSubpage) {
        this.isCreatingSubpage = isSubpage;
        const modal = document.getElementById('newPageModal');
        const modalTitle = modal.querySelector('.modal-header h2');

        modalTitle.textContent = isSubpage ? 'Create New Subpage' : 'Create New Page';
        modal.classList.add('active');

        // Focus the input
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
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kb = new KnowledgeBase();
});
