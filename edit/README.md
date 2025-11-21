# Rich Text Editor for deweydex.github.io

A beautiful, Notion/Coda-style block editor for your GitHub Pages site with automatic GitHub integration.

## Features

### ✨ Modern Editing Experience
- **Block-based editor** with drag-and-drop support
- **Slash commands** (`/`) to insert any content type
- **Inline formatting toolbar** appears when you select text
- **Rich text formatting** with markdown shortcuts
- **Clean serif typography** with generous margins for readability
- **Dark/light mode** support

### 📝 Content Types
- Headings (H1-H4)
- Paragraphs with rich text
- Bulleted and numbered lists
- Checklists with checkboxes
- Code blocks with syntax highlighting
- Tables
- Quotes and blockquotes
- Images (with upload)
- Embeds (YouTube, Vimeo, Twitter, CodePen, GitHub)
- Warnings/callouts
- Horizontal dividers

### 💾 Auto-Save
- **Automatic saving** after 5 seconds of inactivity
- **Local storage** for offline editing
- **GitHub sync** when connected
- Real-time save indicator

### 🖼️ Image Upload
- **Drag-and-drop** images directly into the editor
- **Upload to GitHub** automatically
- **Paste images** from clipboard
- Images stored in `assets/images/` folder

### 🔗 GitHub Integration
- **Personal Access Token** authentication
- **Auto-publish** to your GitHub repository
- **Branch support** (main, gh-pages, etc.)
- **Multi-page management**
- Syncs existing pages from your repo

## Getting Started

### 1. Access the Editor
Navigate to: `https://deweydex.github.io/edit`

### 2. Connect to GitHub

Click the **Settings** (⚙️) button in the header and enter:

- **Personal Access Token**: [Create one here](https://github.com/settings/tokens/new?scopes=repo) with `repo` scope
- **Repository**: `username/repository` (e.g., `deweydex/deweydex.github.io`)
- **Branch**: `main` (or your preferred branch)

Click **Connect** to test the connection.

### 3. Start Editing

- Click **Select a page** to open an existing page
- Or click **Create New Page** to start fresh
- Type `/` to see all available content blocks
- Changes save automatically after 5 seconds

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open slash command menu |
| `CMD/CTRL + SHIFT + H` | Insert heading |
| `CMD/CTRL + SHIFT + L` | Create list |
| `CMD/CTRL + SHIFT + C` | Insert code block |
| `CMD/CTRL + SHIFT + M` | Inline code |
| `CMD/CTRL + B` | Bold text |
| `CMD/CTRL + I` | Italic text |
| `CMD/CTRL + K` | Insert link |

## Markdown Shortcuts

Type these at the start of a line:

- `#` + `Space` → Heading 1
- `##` + `Space` → Heading 2
- `###` + `Space` → Heading 3
- `-` + `Space` → Bulleted list
- `1.` + `Space` → Numbered list
- ` ``` ` → Code block
- `>` + `Space` → Quote

## How It Works

### Page Management
- Pages are stored in **localStorage** for offline access
- When connected to GitHub, pages sync automatically
- Each page is saved as an HTML file in your repository
- Page URLs use slugified titles (e.g., "My Page" → `my-page.html`)

### Content Storage
- Editor content is stored as **EditorJS JSON format** in localStorage
- On save, content is converted to **clean HTML**
- HTML includes your site's stylesheet for consistent design
- Images are uploaded to GitHub and referenced by URL

### Auto-Save Flow
1. You make changes in the editor
2. 5-second countdown starts
3. Content saves to localStorage
4. If GitHub is connected, pushes to repository
5. Save indicator shows status

## File Structure

```
/edit/
├── index.html          # Main editor page
├── editor.js           # Editor application logic
├── mockup.html         # Design mockup/preview
└── README.md           # This file
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires modern JavaScript features (ES6+, async/await, localStorage).

## Security Notes

⚠️ **Important Security Information:**

- Your GitHub token is stored in **browser localStorage**
- Token never leaves your browser except for GitHub API calls
- Use tokens with minimal required permissions (`repo` only)
- Consider using **fine-grained tokens** limited to specific repositories
- Revoke and regenerate tokens periodically
- Never share your token or commit it to public repos

## Tips & Best Practices

### For Best Results:
- ✅ Use descriptive page titles
- ✅ Save images in web-friendly formats (JPG, PNG, WebP)
- ✅ Keep images under 2MB for faster loading
- ✅ Test changes locally before publishing
- ✅ Use meaningful commit messages (auto-generated)

### Avoid:
- ❌ Uploading very large images (>5MB)
- ❌ Editing the same page in multiple tabs
- ❌ Sharing your GitHub token
- ❌ Using special characters in page titles

## Troubleshooting

### Editor won't load
- Check browser console for errors
- Ensure JavaScript is enabled
- Try clearing browser cache
- Disable browser extensions that might interfere

### GitHub connection fails
- Verify your token has `repo` scope
- Check repository name format (`username/repo`)
- Ensure branch name is correct
- Test token at https://github.com/settings/tokens

### Images not uploading
- Verify GitHub connection is active
- Check image file size (<2MB recommended)
- Ensure `assets/images/` folder exists in repo
- Check browser console for upload errors

### Auto-save not working
- Check GitHub connection status
- Look for error messages in save indicator
- Verify you have write permissions to the repo
- Check browser's internet connection

## Advanced Configuration

### Custom Branch
By default, changes publish to `main`. To use a different branch:
1. Open Settings
2. Change "Branch" field
3. Click Connect

### Custom Styling
The editor outputs HTML that links to `style.css`. To customize:
1. Edit your site's `style.css`
2. Styles will apply to all editor-created pages

## Future Enhancements

Planned features:
- [ ] OAuth authentication
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Page templates
- [ ] Custom blocks
- [ ] Export to PDF/Markdown
- [ ] Search and replace
- [ ] Spell check

## Support

For issues or questions:
- Open an issue on GitHub
- Check the browser console for errors
- Review GitHub API documentation

## Credits

Built with:
- [EditorJS](https://editorjs.io/) - Block-style editor
- [GitHub API](https://docs.github.com/en/rest) - Repository integration
- [Font Awesome](https://fontawesome.com/) - Icons
- [Lora](https://fonts.google.com/specimen/Lora) - Serif font

---

**Happy Writing!** 📝✨
