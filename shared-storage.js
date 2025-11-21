/**
 * Shared Storage Module
 * Unified data model for both CMS and /edit
 * Single source of truth for page management
 */

class SharedPageStorage {
    constructor() {
        this.storageKey = 'unified_pages';
        this.githubConfigKey = 'unified_github_config';
        this.pages = [];
        this.githubConfig = null;
    }

    // ========================================
    // PAGE MANAGEMENT
    // ========================================

    /**
     * Load all pages from localStorage
     */
    loadPages() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.pages = JSON.parse(stored);
            }
            return this.pages;
        } catch (e) {
            console.error('Error loading pages:', e);
            return [];
        }
    }

    /**
     * Save all pages to localStorage
     */
    savePages() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.pages));
            return true;
        } catch (e) {
            console.error('Error saving pages:', e);
            return false;
        }
    }

    /**
     * Get a single page by ID
     */
    getPage(pageId) {
        return this.pages.find(p => p.id === pageId);
    }

    /**
     * Get a single page by path/slug
     */
    getPageByPath(path) {
        return this.pages.find(p => p.path === path);
    }

    /**
     * Create a new page
     */
    createPage(data) {
        const page = {
            id: this.generateId(),
            title: data.title || 'Untitled',
            slug: this.generateSlug(data.title || 'Untitled'),
            path: this.generatePath(data.title || 'Untitled'),
            content: {
                markdown: data.markdown || '',
                editorjs: data.editorjs || { blocks: [] }
            },
            metadata: {
                createdWith: data.createdWith || 'cms',
                lastEditedWith: data.createdWith || 'cms',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            parentId: data.parentId || null
        };

        this.pages.push(page);
        this.savePages();
        return page;
    }

    /**
     * Update an existing page
     */
    updatePage(pageId, updates) {
        const page = this.getPage(pageId);
        if (!page) return null;

        // Update title and slug if title changed
        if (updates.title && updates.title !== page.title) {
            page.title = updates.title;
            page.slug = this.generateSlug(updates.title);
            page.path = this.generatePath(updates.title);
        }

        // Update content
        if (updates.markdown !== undefined) {
            page.content.markdown = updates.markdown;
            page.metadata.lastEditedWith = 'cms';
        }
        if (updates.editorjs !== undefined) {
            page.content.editorjs = updates.editorjs;
            page.metadata.lastEditedWith = 'edit';
        }

        // Update parent if provided
        if (updates.parentId !== undefined) {
            page.parentId = updates.parentId;
        }

        page.metadata.updatedAt = new Date().toISOString();

        this.savePages();
        return page;
    }

    /**
     * Delete a page
     */
    deletePage(pageId) {
        const index = this.pages.findIndex(p => p.id === pageId);
        if (index === -1) return false;

        this.pages.splice(index, 1);
        this.savePages();
        return true;
    }

    /**
     * Get all pages (optionally filtered)
     */
    getAllPages(filter = {}) {
        let filtered = [...this.pages];

        if (filter.parentId !== undefined) {
            filtered = filtered.filter(p => p.parentId === filter.parentId);
        }

        if (filter.createdWith) {
            filtered = filtered.filter(p => p.metadata.createdWith === filter.createdWith);
        }

        return filtered;
    }

    // ========================================
    // GITHUB INTEGRATION
    // ========================================

    /**
     * Load GitHub configuration
     */
    loadGithubConfig() {
        try {
            const stored = localStorage.getItem(this.githubConfigKey);
            if (stored) {
                this.githubConfig = JSON.parse(stored);
            }
            return this.githubConfig;
        } catch (e) {
            console.error('Error loading GitHub config:', e);
            return null;
        }
    }

    /**
     * Save GitHub configuration
     */
    saveGithubConfig(config) {
        this.githubConfig = config;
        localStorage.setItem(this.githubConfigKey, JSON.stringify(config));
        return true;
    }

    /**
     * Clear GitHub configuration
     */
    clearGithubConfig() {
        this.githubConfig = null;
        localStorage.removeItem(this.githubConfigKey);
        return true;
    }

    /**
     * Sync pages from GitHub repository
     */
    async syncFromGithub() {
        if (!this.githubConfig) {
            throw new Error('GitHub not configured');
        }

        try {
            const url = `https://api.github.com/repos/${this.githubConfig.repo}/contents`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch repository contents');
            }

            const contents = await response.json();

            // Filter for HTML files (excluding special files)
            const htmlFiles = contents.filter(file =>
                file.name.endsWith('.html') &&
                file.name !== 'index.html' &&
                file.name !== 'cms.html' &&
                !file.name.includes('mockup')
            );

            // Add/update pages that exist on GitHub
            for (const file of htmlFiles) {
                const existingPage = this.getPageByPath(file.name);

                if (!existingPage) {
                    // Create new page entry for files found on GitHub
                    const title = file.name.replace('.html', '').replace(/-/g, ' ');
                    this.createPage({
                        title: this.toTitleCase(title),
                        markdown: '', // Will be populated when opened
                        editorjs: { blocks: [] },
                        createdWith: 'github' // Mark as synced from GitHub
                    });
                }
            }

            this.savePages();
            return this.pages;
        } catch (error) {
            console.error('Error syncing from GitHub:', error);
            throw error;
        }
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Generate URL-safe slug from title
     */
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Generate file path from title
     */
    generatePath(title) {
        return this.generateSlug(title) + '.html';
    }

    /**
     * Convert slug to Title Case
     */
    toTitleCase(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Get statistics about pages
     */
    getStats() {
        return {
            total: this.pages.length,
            cms: this.pages.filter(p => p.metadata.createdWith === 'cms').length,
            edit: this.pages.filter(p => p.metadata.createdWith === 'edit').length,
            github: this.pages.filter(p => p.metadata.createdWith === 'github').length
        };
    }

    /**
     * Clear all data (for testing/reset)
     */
    clearAll() {
        this.pages = [];
        localStorage.removeItem(this.storageKey);
        return true;
    }
}

// Export as singleton
window.SharedPageStorage = window.SharedPageStorage || new SharedPageStorage();
