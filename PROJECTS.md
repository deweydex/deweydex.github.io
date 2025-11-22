# Project History & Ideas

**Repository:** deweydex.github.io
**Owner:** Joshua S Aaron
**Last Updated:** November 19, 2025

This document tracks all project ideas, implementations, and future work discussed for this repository.

---

## 📋 Project Timeline

### Project 1: Notion/Coda Clone CMS ✅ COMPLETED
**Started:** Early in conversation
**Status:** ✅ Fully Implemented
**Branch:** Various

#### Goal
Create a downloadable content management system with:
- Markdown editor with live preview
- File upload and attachment support
- Hierarchical page management
- GitHub integration for publishing

#### Implementation
- Created `cms.html` with full CMS functionality
- Integrated GitHub API for one-click publishing
- Added import/export functionality
- Implemented local storage for offline editing
- Created comprehensive README.md with usage instructions

#### Files Created
- `cms.html` - Main CMS interface
- `app.js` - CMS application logic
- `style.css` - CMS styling
- `README.md` - Complete documentation

---

### Project 2: Separate Public Site from CMS ✅ COMPLETED
**Started:** After CMS completion
**Status:** ✅ Fully Implemented
**Branch:** claude/coda-notion-clone-011CUqqbMQFkXUGR1y1DRRYK

#### Goal
Create a professional public-facing website separate from the CMS editor, suitable for students and employers to browse teaching materials.

#### Implementation
- Created new `index.html` as public landing page
- Separated CMS (`cms.html`) from public site
- Added "Edit Site" button linking to CMS
- Maintained CMS as admin tool

#### Files Created
- `index.html` - Public homepage (replaced)
- Kept `cms.html` as admin interface

---

### Project 3: Integrate Coda Export Content ✅ COMPLETED
**Started:** Mid-conversation
**Status:** ✅ Mostly Implemented (~60%)
**Branch:** claude/coda-notion-clone-011CUqqbMQFkXUGR1y1DRRYK

#### Goal
Parse and integrate all content from the Coda export (`XwmZI3vjrc.txt`, 5302 lines) into the website structure.

#### Implementation
- Parsed Coda export text file for course content
- Created initial course pages with weekly content
- Migrated to proper hierarchy structure

#### Files Created
- Initial course pages in `/courses/` (later moved)
- `guides.html` - Learning guides
- `resources.html` - Resources & Recommendations

---

### Project 4: 1-to-1 Coda Structure Match ✅ COMPLETED
**Started:** Based on user feedback
**Status:** ✅ Structure Implemented, Content ~60%
**Branch:** claude/coda-notion-clone-011CUqqbMQFkXUGR1y1DRRYK

#### Goal
Restructure the entire website to exactly match the Coda document hierarchy, separating current teaching from prior teaching.

#### Implementation Phase 1: Directory Structure
- Created `/current-teaching/` for 2024-2025 courses
- Created `/teaching-materials/` hierarchy
- Created `/teaching-materials/prior-teaching/` for DCFE & BFEI
- Created `/teaching-materials/guides/` for learning guides

#### Implementation Phase 2: Current Teaching (100% Complete)
Created 6 current teaching course pages:
1. `current-teaching/communications.html` ✅
2. `current-teaching/research-study-skills.html` ✅
3. `current-teaching/ai-for-business.html` ✅
4. `current-teaching/personal-professional.html` ✅
5. `current-teaching/mathematics.html` ✅
6. `current-teaching/web-authoring-database.html` ✅

#### Implementation Phase 3: Prior Teaching (90% Complete)
- `teaching-materials/prior-teaching.html` - Consolidated page with dropdowns ✅
  - DCFE: AI for Business, Maths for IT, Web Authoring, Programming ✅
  - BFEI: Foundations of OOP ✅

#### Implementation Phase 4: Learning Guides (20% Complete)
Created guide pages:
1. `teaching-materials/guides/how-to-learn-programming.html` ✅ COMPLETE
2. `teaching-materials/guides/how-to-learn-math.html` ⚠️ Placeholder
3. `teaching-materials/guides/how-i-recommend.html` ⚠️ Partial
4. `teaching-materials/guides/how-i-think-about.html` ⚠️ Placeholder
5. `teaching-materials/guides/how-to-learn-computer.html` ⚠️ Placeholder
6. `teaching-materials/guides/learning-math-through.html` ⚠️ Placeholder

#### Implementation Phase 5: Supporting Pages
- `short-form-guides.html` - Hub for learning guides ✅
- `teaching-materials.html` - Main teaching materials hub ✅
- Updated `index.html` with proper navigation ✅

#### Files Created
- 6 current teaching course pages
- 1 consolidated prior teaching page
- 6 guide pages (1 complete, 5 placeholders)
- 2 hub pages

---

### Project 5: Comprehensive Audit ✅ COMPLETED
**Started:** November 19, 2025
**Status:** ✅ Completed
**Branch:** claude/coda-notion-clone-011CUqqbMQFkXUGR1y1DRRYK

#### Goal
Audit the entire repository against the Coda export to identify all missing content and create an actionable improvement plan.

#### Implementation
- Systematic review of all Coda export content (5302 lines)
- Comparison with current repository structure
- Identification of missing pages and content gaps
- Creation of detailed implementation plan

#### Files Created
- `AUDIT_REPORT.md` - Comprehensive audit report ✅

#### Key Findings
- **Overall Completion:** ~60%
- **Current Teaching (main):** 100% complete
- **Current Teaching (sub-pages):** 0% complete (5 missing)
- **Prior Teaching:** 90% complete
- **Learning Guides:** 20% complete (1/6 complete)
- **Teaching Materials sections:** 15% complete (6 major sections missing)

---

## 🚧 In Progress / Planned Projects

### Project 6: Complete Missing Content ⚠️ PLANNED
**Priority:** High
**Status:** Not Started
**Estimated Time:** 10-15 hours total

Based on the audit, implement missing content in phases:

#### Phase 1: Quick Wins (30 min) - HIGH PRIORITY
- [ ] Delete redundant `/courses/` directory
- [ ] Fix broken navigation links (index_new.html → index.html)
- [ ] Clean up empty directories

#### Phase 2: Critical Content (2-3 hours) - HIGH PRIORITY
- [ ] Create **Norms & Expectations** page (content exists, lines 4739-4791)
- [ ] Create **FAQs** page (questions exist, lines 5082-5121)
- [ ] Create **The Humble Banana** sub-page (lines 3725+)
- [ ] Create **Grants & Residencies** sub-page (lines 3333-3362)
- [ ] Create **Prompt Guides** sub-page (line 4154+)

#### Phase 3: Teaching Materials (2-3 hours) - MEDIUM PRIORITY
- [ ] Create **Handouts and Assignments** page (lines 4802-4840)
- [ ] Create **Assorted Teaching Materials** page (lines 4718-4738)
- [ ] Create **My Calendar** page (lines 3288-3296)

#### Phase 4: Complete Guides (4-6 hours) - MEDIUM PRIORITY
- [ ] Complete **How to Learn Mathematics** guide
- [ ] Complete **How I Think About Teaching** guide
- [ ] Complete **How to Learn Computer Science** guide
- [ ] Complete **Learning Math through Programming** guide
- [ ] Expand **How I Recommend Learning to Learn** guide

#### Phase 5: Polish (1-2 hours) - LOW PRIORITY
- [ ] Create **Programs to Install** sub-page (lines 3298-3316)
- [ ] Create **Reflections on Intro** sub-page (lines 3363-3423)
- [ ] Add breadcrumb navigation
- [ ] Final content review

---

## 💡 Future Project Ideas

### Not Yet Started

#### Search Functionality
- Add client-side search across all pages
- Search by course, topic, or keyword
- Could use Lunr.js or similar library

#### Downloadable Resources
- Create downloadable versions of guides (PDF)
- Package course materials for offline use
- Student resource bundles

#### Interactive Elements
- Add interactive coding examples (CodePen embeds?)
- Embedded Jupyter notebooks for math/programming
- Interactive quizzes or self-assessments

#### Visual Enhancements
- Add course icon images
- Include diagrams and flowcharts
- Student work showcase gallery

#### Accessibility Improvements
- Screen reader testing and fixes
- Keyboard navigation optimization
- Color contrast improvements
- Alt text for all images

#### Analytics
- Add privacy-respecting analytics (Plausible?)
- Track popular pages/resources
- Student engagement metrics

---

## 📊 Current Status Summary

### Completed Projects: 5/5 (100%)
1. ✅ Notion/Coda Clone CMS
2. ✅ Separate Public Site
3. ✅ Integrate Coda Export
4. ✅ 1-to-1 Structure Match (structure complete, content 60%)
5. ✅ Comprehensive Audit

### In Progress: 0
Currently between projects - awaiting decision on next steps

### Planned: 1
- Project 6: Complete Missing Content (5 phases outlined)

### Overall Website Completion: ~60%
- Structure: ✅ 100%
- Current Teaching Pages: ✅ 100%
- Current Teaching Sub-pages: ❌ 0%
- Prior Teaching: ✅ 90%
- Learning Guides: ⚠️ 20%
- Teaching Materials: ⚠️ 15%

---

## 📁 Repository Structure

```
deweydex.github.io/
├── index.html                          # Public homepage ✅
├── cms.html                            # CMS editor ✅
├── app.js                              # CMS logic ✅
├── style.css                           # Styling ✅
├── README.md                           # CMS documentation ✅
├── AUDIT_REPORT.md                     # Audit findings ✅
├── PROJECTS.md                         # This file ✅
│
├── current-teaching/                   # Current courses (2024-2025) ✅
│   ├── communications.html
│   ├── research-study-skills.html
│   ├── ai-for-business.html
│   ├── personal-professional.html
│   ├── mathematics.html
│   └── web-authoring-database.html
│
├── teaching-materials/                 # Teaching resources
│   ├── guides/                         # Learning guides
│   │   ├── how-to-learn-programming.html ✅
│   │   ├── how-to-learn-math.html ⚠️
│   │   ├── how-i-recommend.html ⚠️
│   │   ├── how-i-think-about.html ⚠️
│   │   ├── how-to-learn-computer.html ⚠️
│   │   └── learning-math-through.html ⚠️
│   │
│   └── prior-teaching.html             # Prior courses ✅
│
├── courses/                            # ❌ TO DELETE (redundant)
├── guides.html                         # Learning guides hub ✅
├── short-form-guides.html              # Guide directory ✅
├── resources.html                      # Resources page ✅
├── teaching-materials.html             # Materials hub ✅
│
├── materials/                          # Course materials/files
└── Coda Export Joshua Aaron's Webpage/ # Source content
    └── XwmZI3vjrc.txt                 # 5302 lines of content
```

---

## 🎯 Next Steps

Based on current status, recommended next action:

1. **Immediate:** Execute Phase 1 cleanup (30 min)
   - Delete `/courses/` directory
   - Fix broken links

2. **Short-term:** Complete Phase 2 critical content (2-3 hours)
   - Norms & Expectations
   - FAQs
   - Key sub-pages

3. **Medium-term:** Phases 3-5 as time permits
   - Teaching materials
   - Complete guides
   - Polish

Would you like to proceed with any of these phases?
