# Website Audit Report: Coda Export vs Repository

**Date:** November 19, 2025
**Current Completion:** ~60%
**Repository:** deweydex.github.io
**Branch:** claude/coda-notion-clone-011CUqqbMQFkXUGR1y1DRRYK

## Overview
This audit compares the current repository structure against the Coda export content to identify missing pages, incomplete implementations, and areas for improvement.

## ✅ IMPLEMENTED (Complete or Mostly Complete)

### Home Page
- ✅ index.html - Main landing page with about, courses, contact
- ✅ Proper navigation structure
- ✅ About Me section
- ✅ CV & Professional Experiences content

### Current Teaching (2024-2025)
- ✅ current-teaching/communications.html
- ✅ current-teaching/research-study-skills.html
- ✅ current-teaching/ai-for-business.html
- ✅ current-teaching/personal-professional.html
- ✅ current-teaching/mathematics.html
- ✅ current-teaching/web-authoring-database.html

### Prior Teaching
- ✅ teaching-materials/prior-teaching.html (comprehensive with dropdowns)
  - ✅ DCFE: AI for Business, Maths for IT, Web Authoring, Programming Design Principles
  - ✅ BFEI: Foundations of OOP

### Learning Guides
- ✅ teaching-materials/guides/how-to-learn-programming.html (COMPLETE with full content)
- ✅ teaching-materials/guides/how-to-learn-math.html (placeholder)
- ✅ teaching-materials/guides/how-i-recommend.html (partial)
- ✅ teaching-materials/guides/how-i-think-about.html (placeholder)
- ✅ teaching-materials/guides/how-to-learn-computer.html (placeholder)
- ✅ teaching-materials/guides/learning-math-through.html (placeholder)

### Other Pages
- ✅ short-form-guides.html - Hub for learning guides
- ✅ resources.html - Resources & Recommendations
- ✅ teaching-materials.html - Main teaching materials hub

## ⚠️ PARTIALLY IMPLEMENTED (Needs Completion)

### Current Teaching Sub-Pages (MISSING)
Each current teaching course should have sub-pages:

#### Communications
- ❌ Communications > Reflections on Intro
- ❌ Communications > Grants & Residencies

#### Research & Study Skills
- ❌ Research & Study Skills > The Humble Banana

#### AI for Business
- ❌ AI for Business > Prompt Guides

#### Web Authoring & Database
- ❌ Web Authoring & Database > Programs to Install

### Current Teaching Calendar
- ❌ Current Teaching > My Calendar (calendar/timetable page)

## ❌ MISSING (Not Implemented)

### Teaching Materials Sub-Sections
These are major sections that should exist under Teaching Materials:

1. **Assorted Teaching Materials**
   - Should showcase sample teaching work
   - Measuring the World (8-10th grade)
   - Fun With Functions (11-12th grade)
   - Comics on Exam Performance
   - Socio-Emotional Learning workshops

2. **Norms & Expectations** (CONTENT EXISTS in export)
   - Introduction — Learning Happens in Your Head
   - Attendance and Punctuality
   - Illness and Other Absences
   - Communication and Professionalism
   - Submissions
   - Notes and Note Taking

3. **Assessments**
   - Currently empty in Coda export
   - Placeholder needed

4. **Writing & Reading**
   - Currently empty in Coda export
   - Placeholder needed

5. **Handouts and Assignments**
   - Content: "If there is an issue with Moodle or Brightspace or Github-Classroom..."
   - Should contain:
     - Maths for IT Problem Set 1
     - End of Year Reflections
     - Independent Learning Plans sub-page

6. **FAQs: Frequently Asked Questions**
   - Questions exist but answers are placeholders:
     - Am I allowed to use Chat GPT and other LLM/AI tools?
     - How will I be graded?
     - How can I improve my grade?
     - Do I have to do reflections?
     - Why are there no due dates on assignments?
     - What does a Check-In entail?
     - How much do I have to write for a project update?
     - How do I know when a project is done?
     - Will there be any quizzes or tests?

7. **Other Teaching**
   - Mentioned in path structure but no content found

## 🔧 STRUCTURAL ISSUES

### Old Course Files (Should be Removed)
- ❌ /courses/ directory still exists with old structure:
  - courses/ai-for-business.html
  - courses/communications.html
  - courses/maths-for-it.html
  - courses/ppd.html
  - courses/research-study-skills.html
  - courses/web-authoring.html
- These should be DELETED as they're duplicates of /current-teaching/

### Empty Directories
- teaching-materials/handouts-assignments/ (empty)
- teaching-materials/prior-teaching/dcfe/ (empty)
- teaching-materials/prior-teaching/bfei/ (empty)
- teaching-materials/prior-teaching/bfei/foundations-of-oop/ (empty)

### Broken Navigation
- Some pages still reference "../index_new.html" instead of "../index.html"
- guides.html exists but might be redundant with short-form-guides.html

## 📊 CONTENT COMPLETION STATUS

### By Section:
- **Home & Navigation**: 95% complete
- **Current Teaching (main pages)**: 100% complete
- **Current Teaching (sub-pages)**: 0% complete (5 sub-pages missing)
- **Prior Teaching**: 90% complete (consolidated into single page)
- **Learning Guides**: 20% complete (1/6 complete, 5 placeholders)
- **Teaching Materials sections**: 15% complete (missing 6 major sections)
- **Resources**: 80% complete

### Overall Completion: ~60%

## 🎯 PRIORITY RECOMMENDATIONS

### High Priority
1. **Delete /courses/ directory** - Redundant, causes confusion
2. **Create sub-pages for current teaching courses**:
   - Grants & Residencies for Communications
   - The Humble Banana for Research & Study Skills
   - Prompt Guides for AI for Business
3. **Create Norms & Expectations page** - Content exists and is important
4. **Create FAQs page** - Framework exists, needs answers filled in
5. **Fix broken navigation links** (index_new.html references)

### Medium Priority
6. **Create My Calendar page** - Timetable/schedule
7. **Create Handouts and Assignments page** - With problem sets
8. **Complete learning guide placeholders**:
   - How to Learn Mathematics
   - How I Think About Teaching
   - How to Learn Computer Science
   - Learning Math through Programming
9. **Create Assorted Teaching Materials page** - Showcase past work

### Low Priority
10. **Create Programs to Install sub-page**
11. **Create Reflections on Intro sub-page**
12. **Clean up empty directories**
13. **Consolidate guides.html and short-form-guides.html**

## 📋 SUGGESTED IMPLEMENTATION PLAN

### Phase 1: Clean Up & Fix (Quick Wins)
**Estimated Time: 30 minutes**
1. Delete redundant /courses/ directory
2. Fix broken navigation links (index_new.html → index.html)
3. Remove empty directories or add index.html placeholders
4. Verify all current-teaching pages load correctly

### Phase 2: Critical Missing Content (High Impact)
**Estimated Time: 2-3 hours**
5. Create **Norms & Expectations** page (content exists in export)
6. Create **FAQs** page with questions (can leave answers as "Coming soon")
7. Create sub-pages for current courses:
   - The Humble Banana (Research & Study Skills)
   - Grants & Residencies (Communications)
   - Prompt Guides (AI for Business)

### Phase 3: Teaching Materials Enhancement
**Estimated Time: 2-3 hours**
8. Create **Handouts and Assignments** page with:
   - Maths for IT Problem Set 1
   - End of Year Reflections
9. Create **Assorted Teaching Materials** page showcasing past work
10. Create **My Calendar** page with timetable

### Phase 4: Complete Learning Guides
**Estimated Time: 4-6 hours**
11. Expand **How I Recommend Learning to Learn** (partial content exists)
12. Complete **How I Think About Teaching**
13. Complete **How to Learn Mathematics**
14. Complete **How to Learn Computer Science**
15. Complete **Learning Math through Programming**

### Phase 5: Polish & Enhance
**Estimated Time: 1-2 hours**
16. Add Programs to Install sub-page
17. Add Reflections on Intro sub-page
18. Review all navigation for consistency
19. Add any missing metadata/descriptions
20. Final content review

## 🔍 DETAILED CONTENT GAPS

### Content That Exists in Coda Export But Not in Website:

1. **Norms & Expectations** - Lines 4739-4791 (FULL CONTENT)
2. **FAQs Structure** - Lines 5082-5121 (Questions only)
3. **The Humble Banana** - Lines 3725+ (Full assignment details)
4. **Grants & Residencies** - Lines 3333-3362 (Full activity details)
5. **Prompt Guides** - Line 4154+ (Week 6-8 content on prompting)
6. **My Calendar** - Lines 3288-3296 (Timetable image reference)
7. **Programs to Install** - Lines 3298-3316 (Installation advice)
8. **Reflections on Intro** - Lines 3363-3423 (Video analysis prompts)
9. **Handouts and Assignments** - Lines 4802-4840 (Problem sets, reflections)
10. **Assorted Teaching Materials** - Lines 4718-4738 (Past teaching examples)

## 💡 RECOMMENDATIONS FOR IMPROVEMENT

### Navigation
- Add breadcrumb navigation to all sub-pages
- Create a sitemap page for easy navigation
- Add "Related Content" sections on course pages

### User Experience
- Add search functionality (simple client-side search)
- Create a "Latest Updates" section on homepage
- Add "Last Updated" dates to pages

### Content Organization
- Group related sub-pages under parent pages with dropdown navigation
- Add tags/categories to teaching materials
- Create a downloadable resource index

### Visual Enhancements
- Add course icons/images to make pages more visually distinct
- Include screenshots or diagrams where relevant
- Add student work examples (with permission)

### Accessibility
- Ensure all images have alt text
- Check color contrast ratios
- Add skip-to-content links
- Test with screen readers

## 📈 METRICS FOR SUCCESS

Once implementation is complete, the website should have:
- ✅ 100% of Coda export structure represented
- ✅ All navigation links functional
- ✅ No duplicate content
- ✅ Consistent styling across all pages
- ✅ Mobile-responsive design throughout
- ✅ Clear hierarchy and information architecture
- ✅ Comprehensive teaching materials available to students
