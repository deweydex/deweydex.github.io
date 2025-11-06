# Content Manager - GitHub-Integrated CMS

A powerful, downloadable content management system for GitHub Pages with markdown editing, file management, and one-click publishing.

## Features

### ✨ Core Functionality
- **Markdown Editor** with live preview
- **Hierarchical Page Management** - Create, edit, delete, and nest pages
- **File Upload & Attachments** - Drag-and-drop support with preview
- **GitHub Integration** - Direct publishing to your repository
- **Search** - Find pages by title or content
- **Import/Export** - Backup and restore your content

### 🚀 Publishing
- **One-Click Deploy** - Publish all changes to GitHub with a single button
- **Auto-Generated Index** - Creates a landing page with links to all content
- **Sync Status** - Visual indicators for local vs published changes
- **GitHub Pages Ready** - Automatically compatible with GitHub Pages

### 💎 User Experience
- Clean, professional interface
- Responsive design for mobile and desktop
- Keyboard shortcuts for power users
- Auto-save to local storage
- Offline-capable (edits saved locally)

## Getting Started

### Step 1: Setup Your Repository

1. Merge this branch to your main branch (or the branch GitHub Pages uses)
2. Enable GitHub Pages in your repository settings if not already enabled

### Step 2: Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Content Manager"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

### Step 3: Connect to GitHub

1. Open your site (either locally by opening `index.html` or via GitHub Pages URL)
2. Click "Connect to GitHub" in the top banner
3. Enter your details:
   - **Token**: Your Personal Access Token from Step 2
   - **Repository**: `username/repository-name` (e.g., `deweydex/deweydex.github.io`)
   - **Branch**: Usually `main` (or whatever branch GitHub Pages uses)
4. Click "Connect" - it will test the connection first

### Step 4: Start Creating Content

1. Click "New Page" to create a page
2. Write content in Markdown in the left pane
3. See the live preview on the right
4. Upload files by clicking the paperclip icon or drag-and-drop
5. Insert links with the link button or press `Cmd/Ctrl + K`
6. Changes auto-save to your browser

### Step 5: Publish to GitHub

1. When ready, click the green "Publish to GitHub" button in the sidebar
2. Your content will be committed and pushed to your repository
3. GitHub Pages will automatically rebuild your site
4. Your changes will be live in a few minutes!

## How It Works

### Local Storage
- All changes are saved to your browser's local storage immediately
- Your content persists even if you close the browser
- You can work offline and publish later

### GitHub Publishing
When you click "Publish to GitHub", the CMS:
1. Converts each page to a markdown file (`pages/page-name.md`)
2. Generates an `index.html` with links to all pages
3. Creates a git commit with all changes
4. Pushes to your specified branch
5. GitHub Pages rebuilds your site automatically

### Content Structure
```
your-repo/
├── index.html              # Generated landing page
├── pages/
│   ├── about.md           # Your pages as markdown
│   ├── current-teaching.md
│   ├── projects.md
│   └── ...
├── app.js                 # CMS application (this file)
├── style.css              # Styles
└── README.md              # This file
```

## Usage Tips

### Keyboard Shortcuts
- `Cmd/Ctrl + N` - New page
- `Cmd/Ctrl + E` - Toggle edit/preview mode
- `Cmd/Ctrl + K` - Insert link
- `Cmd/Ctrl + S` - Manual save (auto-saves anyway)

### Organizing Content
- Use the "New Subpage" button to create nested pages
- Click the chevron icon (>) next to pages to expand/collapse children
- Search box finds pages by title or content

### Attachments
- Upload files by clicking the paperclip icon
- Or drag-and-drop files into the editor area
- Attachments are stored as base64 in your browser
- Click attachments to download them
- **Note**: Large files may slow down the app

### Backup & Restore
- Use "Import/Export" button (bottom left) to backup all content
- Export creates a JSON file with all pages and attachments
- Import can restore from a JSON file
- Useful for transferring content between devices

### Working Across Devices
1. Export your content to JSON on device A
2. Email or cloud-sync the JSON file
3. Import on device B
4. Or just connect to GitHub on both devices and use "Publish"

## Migrated Content

Your site now includes content migrated from jsaaron.com:

- **About** - Background, teaching philosophy, and areas of interest
- **Current Teaching** - Adult learning philosophy and teaching approach
- **Recommended Resources** - Curated books and materials
- **Projects** - Archetyp Cafe and research projects
- **Podcast** - Placeholder for podcast content

Feel free to edit, expand, or reorganize this content!

## Troubleshooting

### "Failed to publish" Error
- Check that your Personal Access Token has `repo` scope
- Verify the repository name format: `username/repo-name`
- Ensure the branch exists in your repository
- Check that you have push access to the repository

### Content Not Showing on GitHub Pages
- Wait 2-3 minutes for GitHub Pages to rebuild
- Check GitHub Actions tab for build status
- Verify GitHub Pages is enabled in repository settings
- Ensure you're publishing to the correct branch

### Lost Local Changes
- Content is stored in browser's localStorage
- Clearing browser data will delete local content
- Always publish to GitHub or export as backup
- Use multiple browsers/devices = multiple copies

### Large Attachments Slow Down App
- Browser localStorage has size limits (usually 5-10 MB)
- Consider uploading large files directly to GitHub
- Or use external hosting for images/videos
- Link to external files instead of embedding

## Advanced Usage

### Customizing the Published Site
The generated `index.html` is basic. To customize:
1. Create a custom template in your repository
2. Modify the `generateIndexHtml()` function in `app.js`
3. Or create your own `index.html` and don't let it be overwritten

### Using as a Standalone App
1. Download `index.html`, `app.js`, and `style.css`
2. Open `index.html` in any browser
3. Works completely offline for editing
4. Connects to GitHub only when publishing

### Multiple Contributors
- Each person can use their own token
- Changes from multiple devices sync through GitHub
- Pull latest changes before making new ones
- Consider using branches for major changes

## Security Notes

- Your GitHub token is stored in browser localStorage
- Anyone with access to your browser can publish
- Use a token with minimal required permissions
- Consider using a fine-grained token with repo-only access
- Revoke tokens you're no longer using

## Tech Stack

- Vanilla JavaScript (no frameworks!)
- [Marked.js](https://marked.js.org/) for Markdown rendering
- [Font Awesome](https://fontawesome.com/) for icons
- GitHub REST API v3 for publishing
- localStorage for persistence

## Support

Having issues? Check:
1. Browser console for error messages
2. GitHub API rate limits (60 requests/hour unauthenticated, 5000/hour authenticated)
3. Network connectivity
4. Token permissions

## License

MIT License - Feel free to modify and use as you wish!

---

**Created for**: Joshua S Aaron
**Purpose**: Managing educational content and personal website
**Repository**: deweydex.github.io
