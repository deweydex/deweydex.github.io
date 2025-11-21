# GitHub Authentication Setup for Editing Pages

This guide explains how to set up authentication to edit pages on your site.

## Current Authentication Method: Personal Access Token (PAT)

For a static GitHub Pages site, the simplest and most secure authentication method without a backend is using GitHub Personal Access Tokens.

### Setup Steps:

#### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: `deweydex.github.io editor`
4. Set expiration (recommended: 90 days for security)
5. Select scopes:
   - ✅ **repo** (Full control of private repositories) - This gives access to read/write repository content
6. Click "Generate token"
7. **Copy the token immediately** - you won't be able to see it again!

#### 2. Configure the Editor

1. Visit `/edit/` on your site
2. Click the ⚙️ Settings button (top right)
3. Enter your details:
   - **GitHub Token**: Paste your PAT
   - **Repository**: `deweydex/deweydex.github.io`
   - **Branch**: `main` (or your default branch)
4. Click "Save Settings"
5. You should see "Successfully connected to GitHub!"

#### 3. Start Editing

- Click the "Edit" button on any page
- Or visit `/edit/?page=path/to/page.html` directly
- Make changes using the rich text editor
- Auto-saves to GitHub after 5 seconds of inactivity

---

## How Edit Buttons Work

### On Every Page
An "Edit" button appears in the bottom-left corner of each page (except the editor and CMS themselves).

When clicked:
1. Captures the current page path (e.g., `current-teaching/communications.html`)
2. Opens `/edit/?page=current-teaching/communications.html`
3. Editor checks if page exists in storage
4. If not, fetches the page from GitHub and loads it
5. You can now edit and save back to GitHub

### Adding Edit Button to More Pages

Add this line before the closing `</body>` tag:

```html
<!-- Edit Button -->
<script src="../edit-button.js"></script>
```

For pages in subdirectories, adjust the path:
```html
<!-- For pages in root -->
<script src="edit-button.js"></script>

<!-- For pages in /current-teaching/ -->
<script src="../edit-button.js"></script>

<!-- For pages two levels deep -->
<script src="../../edit-button.js"></script>
```

The script automatically:
- Detects the current page path
- Creates a floating edit button
- Links to the editor with the correct page parameter
- Hides itself on the editor and CMS pages

---

## Security Considerations

### ✅ What's Safe:
- **PATs are user-scoped**: Only you can create them for your account
- **Browser storage**: Token stored in localStorage (browser-only, not transmitted)
- **Expiration**: Tokens expire automatically (recommended: 90 days)
- **Revocable**: Can be revoked instantly at github.com/settings/tokens

### ⚠️ Important Notes:
- **Never share your token**: It grants write access to your repository
- **Use HTTPS only**: Always access your site via https://
- **Private browsing**: Token won't persist in incognito mode (by design)
- **Shared computers**: Clear browser data after editing on shared computers

### 🔐 Best Practices:
1. **Set short expiration**: 30-90 days maximum
2. **Revoke when done**: If you finish major edits, revoke and create new later
3. **Monitor token usage**: Check Settings → Developer settings to see active tokens
4. **Fine-grained tokens** (future): GitHub is rolling out more granular permissions

---

## Alternative Authentication Methods

### Option 2: GitHub OAuth Device Flow (Future Enhancement)

**Pros**:
- Better UX (no manual token creation)
- Still works on static sites
- Proper OAuth flow

**Cons**:
- More complex implementation
- Still requires token storage

**How it would work**:
1. User clicks "Connect to GitHub"
2. App requests device code from GitHub API
3. User visits github.com/login/device
4. Enters the code shown in the app
5. Authorizes the application
6. Token returned to browser

This could be implemented in a future version.

### Option 3: OAuth with Serverless Backend (Most Secure)

**Pros**:
- Most secure
- Professional OAuth flow
- Can use refresh tokens

**Cons**:
- Requires Netlify, Vercel, or similar platform
- More complex infrastructure
- Not pure GitHub Pages

**When to use**:
If this site grows and needs more robust authentication, consider migrating to:
- Netlify (with Netlify Functions)
- Vercel (with Vercel Functions)
- Cloudflare Pages (with Workers)

These platforms can host the same static site but add serverless functions for OAuth.

---

## Troubleshooting

### "GitHub not configured"
- Open Settings and enter your PAT
- Make sure repository name is exact: `username/repo-name`

### "Failed to connect to GitHub"
- Check token hasn't expired
- Verify token has `repo` scope
- Ensure repository name is correct

### Edit button not appearing
- Check if `edit-button.js` is loaded (view page source)
- Verify the script path is correct for the page location
- Check browser console for errors

### Page won't load in editor
- Ensure you've connected to GitHub first
- Check that the page exists in the repository
- Try syncing pages in Settings

### Changes not saving
- Verify GitHub token is valid
- Check you're connected to the internet
- Look for error messages in browser console

---

## For Developers

### How the System Works

1. **Edit Button (`edit-button.js`)**:
   - Detects current page path
   - Creates floating edit button
   - Links to `/edit/?page={path}`

2. **Editor (`/edit/editor.js`)**:
   - Reads `?page` parameter from URL
   - Checks unified storage for page
   - If not found, fetches from GitHub via API
   - Parses HTML and loads into EditorJS
   - Auto-saves back to GitHub

3. **Unified Storage (`shared-storage.js`)**:
   - Single source of truth for both editors
   - Stores both markdown and EditorJS formats
   - Syncs with GitHub on load

4. **GitHub API**:
   - Uses Contents API to read/write files
   - Base64 encodes content
   - Commits directly to repository

### Data Flow

```
Page → Edit Button → /edit/?page=path.html
       ↓
Editor checks storage
       ↓
Not found? → Fetch from GitHub API → Parse HTML → Load into EditorJS
       ↓
Found? → Load from storage → Display in EditorJS
       ↓
Edit content → Auto-save (5s) → GitHub API → Commit to repo
```

### Extending the System

To add features:
- **Device Flow**: Implement in `editor.js` → `connectGithubDeviceFlow()`
- **Image uploads**: Already supported via GitHub API
- **Version history**: Use GitHub API to fetch commit history
- **Collaborative editing**: Would need backend with WebSockets
- **Draft mode**: Add `draft: true` flag to page metadata

---

## Quick Reference

| Task | Action |
|------|--------|
| Create token | github.com/settings/tokens |
| Configure editor | `/edit/` → Settings ⚙️ |
| Edit existing page | Click "Edit" button on page |
| Create new page | `/edit/` → "New Page" button |
| Import markdown | `/edit/` → 📥 Import button |
| Revoke token | github.com/settings/tokens |

---

## Support

If you encounter issues:
1. Check browser console for errors (F12 → Console)
2. Verify token permissions and expiration
3. Try clearing browser cache and localStorage
4. Create a new token and reconnect

For questions or feature requests, open an issue on the repository.
