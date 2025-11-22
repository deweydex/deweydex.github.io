# Testing Guide & Future Goals

**Last Updated:** November 22, 2025
**Branch:** `claude/review-chat-ideas-attributes-01NTXz86dkJTxbhfQyNHFvN6`

---

## Table of Contents
1. [Testing the Edit Button & CMS](#testing-the-edit-button--cms)
2. [Recently Completed Goals](#recently-completed-goals)
3. [Current Goals & Ideas](#current-goals--ideas)
4. [Future Enhancement Ideas](#future-enhancement-ideas)

---

## Testing the Edit Button & CMS

### Prerequisites
Before testing, ensure you have:
- [ ] GitHub Personal Access Token (PAT) created at https://github.com/settings/tokens
- [ ] PAT has `repo` scope for read/write access
- [ ] Browser localStorage cleared (or use incognito mode for fresh testing)

### Testing the Edit Button

#### Test 1: Edit Button Appears on All Pages
**Expected:** Edit button should appear on all pages except `/edit/` and `cms.html`

**Pages to check (19 total):**

**Root-level pages (7):**
1. [ ] Visit `index.html` → Edit button visible (bottom-left)
2. [ ] Visit `faqs.html` → Edit button visible
3. [ ] Visit `norms-expectations.html` → Edit button visible
4. [ ] Visit `guides.html` → Edit button visible
5. [ ] Visit `short-form-guides.html` → Edit button visible
6. [ ] Visit `resources.html` → Edit button visible
7. [ ] Visit `teaching-materials.html` → Edit button visible

**Current-teaching pages (6):**
8. [ ] Visit `current-teaching/ai-for-business.html` → Edit button visible
9. [ ] Visit `current-teaching/communications.html` → Edit button visible
10. [ ] Visit `current-teaching/mathematics.html` → Edit button visible
11. [ ] Visit `current-teaching/personal-professional.html` → Edit button visible
12. [ ] Visit `current-teaching/research-study-skills.html` → Edit button visible
13. [ ] Visit `current-teaching/web-authoring-database.html` → Edit button visible

**Learning guide pages (6):**
14. [ ] Visit `teaching-materials/guides/how-to-learn-programming.html` → Edit button visible
15. [ ] Visit `teaching-materials/guides/how-to-learn-math.html` → Edit button visible
16. [ ] Visit `teaching-materials/guides/how-i-think-about.html` → Edit button visible
17. [ ] Visit `teaching-materials/guides/how-to-learn-computer.html` → Edit button visible
18. [ ] Visit `teaching-materials/guides/learning-math-through.html` → Edit button visible
19. [ ] Visit `teaching-materials/guides/how-i-recommend.html` → Edit button visible

**Pages where edit button should NOT appear:**
- [ ] Visit `/edit/` → No edit button (correct)
- [ ] Visit `cms.html` → No edit button (correct)

#### Test 2: Edit Button Styling & Responsiveness
1. [ ] **Desktop view:** Edit button shows icon + "Edit" text
2. [ ] **Mobile view (< 768px):** Edit button shows icon only, becomes circular
3. [ ] **Hover effect:** Button changes color and lifts slightly on hover
4. [ ] **Dark mode:** Button adapts to dark theme (if page supports dark mode)

#### Test 3: Edit Button Functionality
1. [ ] Click edit button on `index.html`
   - Should navigate to `/edit/?page=index.html`
2. [ ] Click edit button on `current-teaching/mathematics.html`
   - Should navigate to `/edit/?page=current-teaching/mathematics.html`
3. [ ] Click edit button on `teaching-materials/guides/how-to-learn-math.html`
   - Should navigate to `/edit/?page=teaching-materials/guides/how-to-learn-math.html`

---

### Testing the Rich Text Editor (`/edit/`)

#### Setup
1. [ ] Navigate to `/edit/`
2. [ ] Enter GitHub PAT when prompted
3. [ ] Verify token is saved (check browser localStorage)

#### Test 1: Loading a Page
1. [ ] Click "Load Page" button
2. [ ] Enter page path: `index.html`
3. [ ] Verify page content loads into editor
4. [ ] Check that blocks are properly formatted (headings, paragraphs, lists, etc.)

#### Test 2: Loading via URL Parameter
1. [ ] Navigate to `/edit/?page=faqs.html`
2. [ ] Verify FAQs page loads automatically
3. [ ] Check all blocks render correctly

#### Test 3: Editing Content
1. [ ] **Add new block:** Click anywhere and press `/` to open slash menu
2. [ ] **Insert heading:** Select "Heading" from menu, type text
3. [ ] **Insert paragraph:** Select "Paragraph", type text with **bold** and *italic*
4. [ ] **Insert list:** Select "List", add multiple items
5. [ ] **Insert code block:** Select "Code", add code snippet
6. [ ] **Drag and drop:** Reorder blocks by dragging
7. [ ] **Delete block:** Click delete icon on block

#### Test 4: Auto-Save
1. [ ] Make a change to content
2. [ ] Wait 5 seconds
3. [ ] Check browser console for "Auto-saved" message
4. [ ] Verify content saved to localStorage

#### Test 5: Publishing to GitHub
1. [ ] Make a small test change (e.g., add "TEST" to a heading)
2. [ ] Click "Save to GitHub" button
3. [ ] Verify success message appears
4. [ ] Check GitHub repository for new commit
5. [ ] Verify commit message is auto-generated
6. [ ] Navigate to the actual page and verify change appears

#### Test 6: Image Upload
1. [ ] Add Image block
2. [ ] Upload an image file
3. [ ] Verify image uploads to repository (`assets/images/` folder)
4. [ ] Verify image displays in editor
5. [ ] Save to GitHub and verify image shows on published page

#### Test 7: Different Block Types
Test each block type works correctly:
- [ ] Heading (H1, H2, H3, H4)
- [ ] Paragraph with inline formatting (bold, italic, links)
- [ ] Bulleted list
- [ ] Numbered list
- [ ] Checklist
- [ ] Code block with syntax highlighting
- [ ] Table
- [ ] Quote
- [ ] Warning/Callout
- [ ] Horizontal divider
- [ ] Image
- [ ] YouTube embed
- [ ] Twitter embed
- [ ] CodePen embed
- [ ] GitHub Gist embed

---

### Testing the CMS (`cms.html`)

#### Setup
1. [ ] Navigate to `cms.html`
2. [ ] Enter GitHub PAT when prompted
3. [ ] Verify connection to GitHub

#### Test 1: Viewing Existing Pages
1. [ ] View list of pages in repository
2. [ ] Click on a page to load it
3. [ ] Verify markdown/HTML displays correctly

#### Test 2: Creating a New Page
1. [ ] Click "New Page" button
2. [ ] Enter page name: `test-page.html`
3. [ ] Add some markdown content
4. [ ] Save to GitHub
5. [ ] Verify page appears in repository
6. [ ] Navigate to the new page URL and verify it displays

#### Test 3: Editing an Existing Page
1. [ ] Load an existing page (e.g., `faqs.html`)
2. [ ] Make a small change
3. [ ] Save to GitHub
4. [ ] Verify commit appears in repository
5. [ ] Check the live page for changes

#### Test 4: Markdown Support
1. [ ] Create/edit a page with markdown:
   ```markdown
   # Heading 1
   ## Heading 2
   **Bold text**
   *Italic text*
   - List item 1
   - List item 2
   ```
2. [ ] Save and verify markdown renders correctly

---

### Integration Testing

#### Test 1: Edit Button → Editor Workflow
1. [ ] Start at `index.html`
2. [ ] Click edit button
3. [ ] Verify redirects to `/edit/?page=index.html`
4. [ ] Verify page loads automatically in editor
5. [ ] Make a change
6. [ ] Save to GitHub
7. [ ] Navigate back to `index.html`
8. [ ] Verify change appears

#### Test 2: Unified Storage System
1. [ ] Edit a page in `/edit/`
2. [ ] Save to localStorage (auto-save)
3. [ ] Open `cms.html`
4. [ ] Verify the same page shows recent changes
5. [ ] Test that both editors can access shared storage

#### Test 3: GitHub Sync
1. [ ] Edit a page in `/edit/`, save to GitHub
2. [ ] Open `cms.html`, load the same page
3. [ ] Verify changes from editor appear
4. [ ] Make a different change in CMS, save to GitHub
5. [ ] Reload `/edit/` with the same page
6. [ ] Verify CMS changes appear

---

### Error Handling Tests

#### Test 1: Invalid GitHub Token
1. [ ] Enter incorrect PAT
2. [ ] Try to save to GitHub
3. [ ] Verify error message appears
4. [ ] Verify user can re-enter token

#### Test 2: Network Failure
1. [ ] Disconnect internet
2. [ ] Try to save to GitHub
3. [ ] Verify error message appears
4. [ ] Reconnect and retry
5. [ ] Verify save succeeds

#### Test 3: Large Files
1. [ ] Try to load a very large HTML file
2. [ ] Verify editor handles it gracefully
3. [ ] Check for performance issues

#### Test 4: Special Characters
1. [ ] Create content with special characters: `< > & " '`
2. [ ] Save and reload
3. [ ] Verify characters are properly escaped/encoded

---

## Recently Completed Goals

### Phase 1: Website Structure & Content (Completed Nov 22, 2025)

#### New Pages Created ✅
1. **FAQs Page** (`faqs.html`)
   - 10 comprehensive Q&A items
   - Accordion-style interface
   - Topics: AI usage, grading, reflections, due dates, check-ins, etc.

2. **Norms & Expectations Page** (`norms-expectations.html`)
   - Teaching philosophy and classroom norms
   - Based on content from Coda export
   - Covers attendance, communication, professionalism, etc.

#### Learning Guides Completed ✅
All 4 placeholder guides now have full content:

1. **How to Learn Mathematics** (`teaching-materials/guides/how-to-learn-math.html`)
   - Different approaches to math learning
   - Key principles: objects/functions, multiple representations, practice
   - Practical tips, building intuition, common misconceptions
   - Resources and tools

2. **How I Think About Teaching** (`teaching-materials/guides/how-i-think-about.html`)
   - Core philosophy: learning happens in your head
   - Progressive education, Paulo Freire-inspired pedagogy
   - Assessment philosophy, role of struggle
   - Practical implications and mutual expectations

3. **How to Learn Computer Science** (`teaching-materials/guides/how-to-learn-computer.html`)
   - CS vs Programming distinction
   - Computational thinking framework
   - Algorithms, data structures, complexity analysis
   - Learning strategies and resources

4. **Learning Math through Programming** (`teaching-materials/guides/learning-math-through.html`)
   - Why programming helps with math
   - Tools: Python, Jupyter, numpy, matplotlib, sympy
   - Learning concepts through code
   - Practical strategies and project ideas

#### Edit Button Integration ✅
**19 pages total** now have the edit button:
- 7 root-level pages
- 6 current-teaching pages
- 6 learning guide pages

Edit button features:
- Floating button (bottom-left)
- Links to `/edit/?page=<current-page>`
- Responsive (icon-only on mobile)
- Dark mode support
- Auto-hides on editor pages

#### Documentation Updates ✅
- Updated `long_chat_ideas.md` with accurate completion markers
- All pages have proper FontAwesome icons
- Consistent styling across all new pages
- All changes committed and pushed

---

## Current Goals & Ideas

### High Priority (Should Implement Next)

#### 1. Update `long_chat_ideas.md` with Latest Status
**Status:** Needs updating after recent completions

**Update needed:**
```markdown
### This Month
6. ✅ Create FAQs page (COMPLETED)
7. ✅ Create Norms & Expectations page (COMPLETED)
8. ✅ Add edit button to all pages (COMPLETED - 19 pages)
9. ✅ Complete at least 2 learning guides (COMPLETED - all 4 guides complete)
```

**Completion Status Summary needs updating:**
- Move learning guides from "Partially Completed" to "Fully Completed"
- Update edit button status
- Update FAQs and Norms pages status

#### 2. Course Sub-Pages
**Priority:** High
**Status:** Not started

Create dedicated sub-pages for course content:
- `current-teaching/communications/grants-residencies.html` - Grants & Residencies research
- `current-teaching/communications/reflections-intro.html` - Reflections on Intro Task
- `current-teaching/research/humble-banana.html` - The Humble Banana assignment
- `current-teaching/ai-business/prompt-guides.html` - Prompt engineering guides
- `current-teaching/web-authoring/programs-to-install.html` - Required software list

**Implementation approach:**
- Extract content from existing course pages where inline
- Use Coda export content where available
- Match styling of parent course pages
- Add edit buttons to all sub-pages
- Update parent pages with links to sub-pages

#### 3. Handouts and Assignments Page
**Priority:** High
**Status:** Not started
**Content reference:** Coda export lines 4802-4840

**Should include:**
- Maths for IT Problem Set 1
- End of Year Reflections template
- Independent Learning Plans sub-page
- Link to all course-specific assignments

#### 4. My Calendar Page
**Priority:** Medium
**Status:** Not started
**Content reference:** Coda export lines 3288-3296

**Should include:**
- Weekly timetable/schedule
- Office hours
- Important dates
- Links to course pages

#### 5. Assorted Teaching Materials Page
**Priority:** Medium
**Status:** Not started
**Content reference:** Coda export lines 4718-4738

**Should showcase:**
- Measuring the World (8-10th grade)
- Fun With Functions (11-12th grade)
- Comics on Exam Performance
- Socio-Emotional Learning workshops
- Other past teaching materials

### Medium Priority (Enhance UX)

#### 6. Consolidate Guide Pages
**Issue:** Both `guides.html` and `short-form-guides.html` exist

**Decision needed:**
- Determine which is canonical
- Redirect one to the other, or
- Merge content into single page
- Update all links sitewide

#### 7. Clean Up Empty Directories
**Directories to review:**
- `teaching-materials/handouts-assignments/` (empty?)
- `teaching-materials/prior-teaching/dcfe/` (empty?)
- `teaching-materials/prior-teaching/bfei/` (empty?)

**Action:** Either populate with index.html placeholders or remove

#### 8. `/courses/` Directory Decision
**Status:** Directory contains content (not redundant)
**Action:** Keep as is, or decide if it should be merged with `/current-teaching/`

### Low Priority (Polish)

#### 9. Consistent File Naming
**Issue:** Some files use hyphens, some use underscores

**Action:** Standardize on one convention (probably hyphens)

#### 10. Add "Last Updated" Dates
**Implementation:**
- Show on all pages
- Pull from git commit dates (using JavaScript or build script)
- Helps students know content freshness

---

## Future Enhancement Ideas

### Content Features

#### 1. Page Templates
**Description:** Pre-built layouts for common page types

**Templates to create:**
- Course page template (with weekly sections)
- Guide page template (with consistent styling)
- Assignment page template (with brief, resources, submission info)
- Resource list template

**Implementation:**
- Store as EditorJS JSON templates
- Add "New from Template" option in editor
- Reduces repetitive setup work

#### 2. Custom EditorJS Blocks
**Description:** Specialized blocks for educational content

**Custom blocks to build:**
- Course information block (code, level, hours, assessment breakdown)
- Assignment brief block (learning objectives, deliverables, due date)
- Learning objectives block (formatted list with icons)
- Assessment criteria block (rubric/marking scheme)
- Calendar event block (date, time, location, description)

#### 3. Content Cross-Linking
**Description:** "Related Content" sections on pages

**Features:**
- On course pages, show related guides
- On guide pages, show related courses
- Automatically suggest based on tags/keywords
- Manual curation option

#### 4. Downloadable Resource Index
**Description:** Central page listing all downloadable materials

**Should include:**
- PDFs, assignments, guides
- Filterable by course, type, topic
- Searchable
- Download statistics (optional)

#### 5. "Latest Updates" Section
**Description:** Homepage widget showing recent changes

**Features:**
- Auto-generated from git commits
- Shows last 5-10 updates
- Links to changed pages
- "What's new" for students

### Editor & CMS Features

#### 6. Version History
**Description:** View and restore previous versions of pages

**Features:**
- Use GitHub API to fetch commit history
- Show diff between versions
- Restore to previous version
- Compare any two versions side-by-side

**Implementation complexity:** Medium
**Value:** High (safety net for edits)

#### 7. Draft Mode
**Description:** Work on pages without publishing

**Features:**
- Add `draft: true` flag to page metadata
- Draft pages visible in editor but not on main site
- Preview URL for drafts
- "Publish" button to make live

**Implementation complexity:** Low
**Value:** Medium (useful for major updates)

#### 8. Search and Replace
**Description:** Find and replace across pages

**Features:**
- Search within current page
- Search across all pages
- Find and replace with preview
- Regex support (optional)

**Implementation complexity:** Medium
**Value:** High (bulk updates, fixing typos)

#### 9. Spell Check & Grammar
**Description:** Built-in writing assistance

**Options:**
- Integrate browser spell check (easy)
- Grammarly API integration (complex)
- Language Tool API (free, open source)

**Implementation complexity:** Low (browser) to High (API)
**Value:** Medium

#### 10. Export Options
**Description:** Export pages in different formats

**Formats:**
- Export to PDF (for printing, archiving)
- Export to Markdown (for backup, portability)
- Export to Word document (for students)
- Export entire site as static backup

**Implementation complexity:** Medium
**Value:** Medium (backup, student access)

### Authentication & Security

#### 11. OAuth Device Flow
**Description:** Better GitHub authentication UX

**Benefits:**
- No manual PAT creation
- Proper OAuth flow
- Still works on static sites
- Better security (automatic token rotation)

**Implementation complexity:** High
**Value:** High (much better UX)

#### 12. Fine-Grained GitHub Tokens
**Description:** Use new fine-grained PATs

**Benefits:**
- Limit to specific repository
- Minimal required permissions
- Better security
- More control

**Implementation complexity:** Low (update docs)
**Value:** Medium

#### 13. Session Timeout
**Description:** Auto-logout after inactivity

**Features:**
- Warning before timeout
- Configurable timeout period
- Re-auth without losing work

**Implementation complexity:** Low
**Value:** Medium (security)

### Visual & UX Enhancements

#### 14. Course Icons/Images
**Description:** Visual distinction between courses

**Features:**
- Icon set for subject areas
- Consistent visual language
- Color coding
- Improves scanability

**Implementation complexity:** Low
**Value:** Medium (aesthetics, UX)

#### 15. Breadcrumb Navigation
**Description:** Show page hierarchy

**Example:** `Home > Current Teaching > Communications > Grants & Residencies`

**Benefits:**
- User orientation
- Easy navigation up hierarchy
- Shows page context

**Implementation complexity:** Low
**Value:** High

#### 16. Sitemap Page
**Description:** Complete site structure overview

**Features:**
- Hierarchical view of all pages
- Grouped by section
- Searchable/filterable
- Last updated dates

**Implementation complexity:** Low
**Value:** Medium

#### 17. Client-Side Search
**Description:** Search functionality without backend

**Implementation:**
- Index all page content (JavaScript)
- Lunr.js or similar library
- Search across all pages
- Quick navigation to results

**Implementation complexity:** Medium
**Value:** High

### Accessibility

#### 18. Alt Text Audit
**Action items:**
- Audit all existing images
- Ensure all have descriptive alt text
- Document best practices
- Add validation in editor

#### 19. Color Contrast Check
**Action items:**
- Check WCAG compliance
- Ensure dark mode meets standards
- Test with contrast checker tools
- Fix any failing combinations

#### 20. Skip-to-Content Links
**Action items:**
- Add skip links for keyboard navigation
- Improve screen reader experience
- Proper focus management
- ARIA labels where needed

#### 21. Screen Reader Testing
**Action items:**
- Test with NVDA/JAWS
- Ensure proper heading hierarchy
- Fix any navigation issues
- Document accessibility features

### Deployment & Infrastructure

#### 22. Custom Domain
**Steps:**
- Purchase custom domain
- Configure DNS
- Set up SSL (automatic with GitHub Pages)
- Update site references

**Value:** Professional appearance

#### 23. CDN for Assets
**Implementation:**
- Cloudflare or similar
- Faster image loading
- Optimize performance
- Reduce bandwidth

**Value:** Better performance

#### 24. Migration to Netlify/Vercel (Optional)
**If needed for:**
- Serverless functions
- Better build pipeline
- Preview deployments
- OAuth support

**Implementation complexity:** High
**Value:** High (if serverless needed)

#### 25. Automated Backups
**Features:**
- Regular git backups to external storage
- Disaster recovery plan
- Version snapshots
- Automated testing

**Implementation complexity:** Medium
**Value:** High (safety)

### Student Engagement Features

#### 26. Interactive Code Examples
**Description:** Runnable code in pages

**Implementation:**
- CodePen embeds (already supported)
- Replit embeds
- Live Python code (Skulpt, Brython)

**Value:** High for programming courses

#### 27. Quizzes & Self-Assessment
**Description:** Optional self-check quizzes

**Features:**
- Immediate feedback
- No tracking (privacy-friendly)
- Explanations for answers
- Various question types

**Implementation complexity:** Medium
**Value:** Medium (student learning)

#### 28. Progress Indicators
**Description:** Visual progress through course

**Features:**
- Completion checkmarks (localStorage)
- Milestone celebrations
- Progress bars
- "Start here" signposting

**Implementation complexity:** Medium
**Value:** Medium (motivation)

---

## Testing Checklist Summary

### Quick Pre-Launch Checklist
- [ ] All 19 pages have edit button
- [ ] Edit button links to correct `/edit/?page=` URL
- [ ] `/edit/` loads pages from URL parameter
- [ ] Can load, edit, and save page in `/edit/`
- [ ] Can load, edit, and save page in `cms.html`
- [ ] Images upload successfully
- [ ] GitHub commits appear with auto-generated messages
- [ ] Auto-save works (5 second delay)
- [ ] All block types render correctly
- [ ] Mobile responsive (edit button becomes icon-only)
- [ ] Dark mode works (if applicable)

### Full Testing Checklist
See detailed sections above for comprehensive testing of:
- Edit button on all 19 pages
- Rich text editor functionality
- CMS functionality
- Integration between systems
- Error handling
- Edge cases

---

## Notes for Future Development

### Priority Order Recommendation
1. **Test everything** using this guide
2. **Update `long_chat_ideas.md`** with latest completions
3. **Create course sub-pages** (high student value)
4. **Add Handouts page** (referenced from multiple places)
5. **Implement version history** (safety net for edits)
6. **Add search functionality** (high usability value)
7. **Work through medium/low priority items** as time permits

### Development Principles
- **Mobile-first:** Test all features on mobile
- **Accessibility:** WCAG 2.1 AA compliance minimum
- **Privacy:** No tracking, student data stays local
- **Progressive enhancement:** Core features work without JavaScript
- **Documentation:** Update this guide as features are added

---

**End of Testing & Goals Guide**
