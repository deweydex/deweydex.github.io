/**
 * Universal Edit Button for All Pages
 * Adds a floating edit button that opens the page in /edit
 */

(function() {
    'use strict';

    // Don't show edit button on the editor itself or CMS
    if (window.location.pathname.includes('/edit/') ||
        window.location.pathname.includes('cms.html')) {
        return;
    }

    // Create edit button
    const editButton = document.createElement('a');
    editButton.className = 'page-edit-button';
    editButton.title = 'Edit this page';
    editButton.setAttribute('aria-label', 'Edit this page');

    // Get current page path
    const currentPath = window.location.pathname;
    const pagePath = currentPath.replace(/^\//, ''); // Remove leading slash

    // Link to editor with page parameter
    editButton.href = `/edit/?page=${encodeURIComponent(pagePath)}`;

    editButton.innerHTML = `
        <i class="fas fa-edit"></i>
        <span>Edit</span>
    `;

    // Add to page
    document.body.appendChild(editButton);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .page-edit-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--primary-color, #2563eb);
            color: white;
            padding: 12px 20px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
        }

        .page-edit-button:hover {
            background: var(--primary-hover, #1d4ed8);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
            transform: translateY(-2px);
            color: white;
        }

        .page-edit-button i {
            font-size: 16px;
        }

        @media (max-width: 768px) {
            .page-edit-button {
                bottom: 10px;
                left: 10px;
                padding: 10px 16px;
                font-size: 13px;
            }

            .page-edit-button span {
                display: none;
            }

            .page-edit-button {
                width: 48px;
                height: 48px;
                padding: 0;
                justify-content: center;
                border-radius: 50%;
            }
        }

        /* Dark mode support */
        [data-theme="dark"] .page-edit-button {
            background: var(--primary-color, #3b82f6);
        }

        [data-theme="dark"] .page-edit-button:hover {
            background: var(--primary-hover, #60a5fa);
        }
    `;
    document.head.appendChild(style);
})();
