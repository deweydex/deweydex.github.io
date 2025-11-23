# Content Hierarchy and Style Guide

This document describes the organizational hierarchy, tone/style attributes, and file structure of Joshua Aaron's teaching website.

## Table of Contents

1. [Hierarchy Overview](#hierarchy-overview)
2. [Tone and Style Attributes](#tone-and-style-attributes)
3. [External File References](#external-file-references)
4. [Content Organization Issues](#content-organization-issues)
5. [Internal Links and Cross-References](#internal-links-and-cross-references)

---

## Hierarchy Overview

### Level 1: Top-Level Pages

```
pages/
├── home-page.md                    # Main landing page
├── about.md                        # About Joshua Aaron
├── podcast.md                      # Podcast information
├── projects.md                     # Projects and initiatives
├── recommended-resources.md        # Curated resource list
└── current-teaching.md             # Current teaching overview
```

### Level 2: Section Directories

#### Current Teaching (Active Courses)
```
current-teaching/
├── current-teaching-calendar.md         # Calendar
├── ai-for-business-course.md            # AI for Business
├── communications-course.md             # Communications
├── mathematics-course.md                # Mathematics
├── personal-professional-dev.md         # Personal & Professional Development
├── research-study-skills.md             # Research & Study Skills
└── web-authoring-databases.md           # Web Authoring & Databases
```

#### Resources
```
resources/
└── resources-contact.md                 # Resources and contact (needs cleanup)
```

#### Teaching Materials
```
teaching-materials/
├── teaching-materials-norms.md          # Norms & Expectations
├── end-year-reflections-questionnaire.md # End-year reflections
│
├── guides/                              # GUIDES (3-level hierarchy)
│   ├── guides.md                        # Overview/index
│   ├── faqs.md                          # FAQs
│   │
│   ├── learning-guides/                 # Subject-specific guides
│   │   ├── how-to-learn-programming.md
│   │   ├── learning-python.md
│   │   ├── how-to-learn-mathematics.md
│   │   ├── how-to-learn-computer-science.md
│   │   └── learning-math-through-programming.md
│   │
│   ├── meta-learning/                   # Meta-learning
│   │   └── how-to-learn-to-learn.md
│   │
│   └── teaching-philosophy/             # Teaching philosophy
│       └── how-i-think-about-teaching.md
│
└── prior-teaching/                      # Archive of previous work
    │
    ├── dcfe/                            # DCFE courses
    │   ├── dcfe-foundations-ai-business.md
    │   ├── dcfe-maths-for-it.md
    │   └── dcfe-web-authoring.md
    │
    └── bfei/                            # BFEI courses
        ├── bfei-foop-intro.md           # FOOP introduction
        │
        └── foop/                        # FOOP advanced topics
            ├── bfei-foop-jupyter-map.md
            ├── bfei-foop-visual-map-tutorial.md
            ├── bfei-foop-solar-system.md
            ├── bfei-foop-bonus-extensions.md
            └── bfei-foop-class-hierarchy.md
```

---

## Tone and Style Attributes

### Top-Level Pages

#### home-page.md
- **Tone**: Welcoming, informative, warm, personal
- **Voice**: First person ("I")
- **Style**: Conversational but professional
- **Audience**: Multiple (students, parents, employers, teachers)
- **Features**:
  - Addresses different audiences explicitly
  - Links to other sections
  - Contact information
  - Professional but accessible language

#### about.md
- **Tone**: Professional, philosophical, reflective
- **Voice**: First person ("I")
- **Style**: Structured with headers and bullet points
- **Audience**: General visitors, potential collaborators
- **Features**:
  - Background information
  - Teaching philosophy with core principles
  - Areas of interest
  - Contact information

#### podcast.md
- **Tone**: Brief, informative
- **Voice**: Third person/neutral
- **Style**: Minimal, under construction
- **Audience**: Podcast listeners
- **Features**: Topic list, placeholder for future content

#### projects.md
- **Tone**: Descriptive, enthusiastic
- **Voice**: Mixed (first person for some projects)
- **Style**: Organized by project type
- **Audience**: Collaborators, students, general interest
- **Features**:
  - Project descriptions
  - Goals and objectives
  - Categories (Archetyp Cafe, research, community)

#### recommended-resources.md
- **Tone**: Curated, selective
- **Voice**: First person explanatory notes
- **Style**: Categorized lists
- **Audience**: Students, educators, general learners
- **Features**:
  - Book recommendations
  - Categorized by topic
  - Focus on progressive education
  - Note about being under construction

#### current-teaching.md
- **Tone**: Reflective, philosophical
- **Voice**: First person ("I")
- **Style**: Essay-like with sections
- **Audience**: Students, parents, educators
- **Features**:
  - Philosophy on adult learning
  - Teaching approach
  - Professional background

### Current Teaching Courses

#### ai-for-business-course.md
- **Tone**: Instructional, practical, supportive
- **Voice**: First person plural ("we") and imperative
- **Style**: Weekly structure, dated entries
- **Audience**: Business students (Level 6)
- **Features**:
  - Weekly content organized chronologically
  - Tasks and activities clearly defined
  - Prompting guides and frameworks
  - Reflective questions
  - Context-Format-Tone framework emphasized
  - Links to external resources

#### communications-course.md
- **Tone**: Reflective, task-oriented, supportive
- **Voice**: First person ("I") and imperative ("you")
- **Style**: Weekly plans, detailed instructions
- **Audience**: Art, craft & design students (Level 6)
- **Features**:
  - Detailed assignment briefs (Grants & Residencies)
  - Reflective prompts
  - Practical scenarios
  - Assessment criteria clearly stated (50% skills demo, 50% collection of work)
  - Emotional awareness in task design

#### mathematics-course.md
- **Tone**: Casual, technical, encouraging
- **Voice**: First person plural ("we")
- **Style**: Dated entries, chronological
- **Audience**: Technical students
- **Features**:
  - Uses emoji and casual language ("fun", "lets")
  - Code examples and notebook links
  - Practice problems
  - Visual/graphical explanations referenced
  - Links to external resources (3Blue1Brown, Khan Academy)
  - Topics organized by date

#### personal-professional-dev.md
- **Tone**: Developmental, reflective
- **Voice**: Mixed
- **Style**: Structured activities
- **Audience**: Students developing professional identity
- **Features**:
  - Jupyter notebook references
  - Module descriptor references
  - Under construction

#### research-study-skills.md
- **Tone**: Academic, instructional
- **Voice**: Imperative and explanatory
- **Style**: Activity-based with detailed instructions
- **Audience**: Level 5 students
- **Features**:
  - Source evaluation guides
  - Assignment briefs with detailed scenarios ("Big Banana" series)
  - Document references (.docx, .pdf)
  - Module descriptor references

#### web-authoring-databases.md
- **Tone**: Technical, instructional
- **Voice**: Imperative
- **Style**: Task-based, includes code examples
- **Audience**: Web development students (Level 5)
- **Features**:
  - Assignment PDFs referenced
  - Code files (.html, .zip)
  - Jupyter notebook references
  - Step-by-step instructions
  - Module descriptors for both Web Authoring and Database Methods

### Teaching Materials

#### teaching-materials-norms.md
- **Tone**: Conversational, thoughtful, student-centered, warm
- **Voice**: Direct first person ("I") and second person ("you")
- **Style**: Long-form explanatory prose with sections
- **Audience**: Students (with subsections for employers, parents, teachers)
- **Features**:
  - Extensive use of "I/you" language
  - Philosophical framing ("Learning Happens in Your Head")
  - Explicit rejection of "rules" in favor of "norms"
  - Addresses different audiences
  - Very detailed explanations
  - Includes specific examples
  - Reflects progressive education philosophy
  - Contains assessment information
  - Has embedded content (problem sets, reflections)
  - **Note**: This file is quite long and contains multiple sub-documents that may need to be split

#### end-year-reflections-questionnaire.md
- **Tone**: Personal, reflective, emotional, supportive
- **Voice**: Direct second person ("you")
- **Style**: Questionnaire format with extended prompts
- **Audience**: Students at end of year
- **Features**:
  - Emotional framing ("e-word")
  - Open-ended reflective questions
  - Emphasizes choice (students can choose which questions)
  - Optional sharing
  - Mindfulness/settling introduction
  - Questions focus on process and growth, not grades
  - Includes "Independent Learning Plan" framework (STAR goals)

### Guides

#### guides.md (Overview)
- **Tone**: Welcoming, organizational
- **Voice**: Neutral
- **Style**: Index/navigation page with links
- **Audience**: All learners
- **Features**:
  - Clear categorization
  - Brief descriptions of each subsection
  - Link structure to subpages

#### faqs.md
- **Tone**: Under construction (mostly placeholders)
- **Voice**: Q&A format
- **Style**: Question headers with answer sections
- **Audience**: Students in Joshua's classes
- **Features**:
  - Common student questions
  - Currently has placeholder answers
  - Questions cover grading, AI use, assessments, reflections

#### learning-guides/how-to-learn-programming.md
- **Tone**: Encouraging, detailed, supportive, pragmatic
- **Voice**: First person ("I") with direct address ("you")
- **Style**: Essay format with numbered lists and sections
- **Audience**: Beginning programmers, students
- **Features**:
  - Non-prescriptive philosophy
  - Five types of programming identified
  - Step-by-step process guides
  - Emphasis on planning before coding
  - Encourages experimentation
  - Uses comments and print statements
  - Acknowledges struggle as normal
  - Emphasis on documentation use
  - "Minimum viable" approach

#### learning-guides/learning-python.md
- **Tone**: Encouraging, flexible
- **Voice**: First person ("I")
- **Style**: Brief introduction with links
- **Audience**: Python learners, ML enthusiasts
- **Features**:
  - Focus on Machine Learning context
  - Non-linear learning approach
  - Interest-driven learning philosophy
  - Jupyter Notebook based
  - Links to external tutorials

#### learning-guides/how-to-learn-mathematics.md
- **Tone**: Brief, personal
- **Voice**: First person ("I")
- **Style**: Incomplete/under construction
- **Audience**: Math learners
- **Features**:
  - Personal background reference (dropped out of high school)
  - Currently placeholder content

#### learning-guides/how-to-learn-computer-science.md
- **Tone**: Placeholder
- **Voice**: N/A
- **Style**: Under construction
- **Audience**: CS learners
- **Features**: Currently empty

#### learning-guides/learning-math-through-programming.md
- **Tone**: Placeholder
- **Voice**: N/A
- **Style**: Under construction
- **Audience**: Interdisciplinary learners
- **Features**: Currently empty

#### meta-learning/how-to-learn-to-learn.md
- **Tone**: Direct, pragmatic
- **Voice**: First person ("I") addressing reader
- **Style**: Brief note
- **Audience**: All learners
- **Features**:
  - Disclaimer about scope (not physical activities)
  - Currently minimal content

#### teaching-philosophy/how-i-think-about-teaching.md
- **Tone**: Placeholder
- **Voice**: N/A
- **Style**: Under construction
- **Audience**: Educators, students wanting to understand approach
- **Features**: Currently empty

### Prior Teaching

#### dcfe/dcfe-foundations-ai-business.md
- **Tone**: Technical, instructional
- **Voice**: Varies
- **Style**: Varies
- **Audience**: DCFE students
- **Features**: Under development

#### dcfe/dcfe-maths-for-it.md
- **Tone**: Technical, problem-based
- **Voice**: Instructional
- **Style**: Problem sets and references
- **Audience**: IT students learning mathematics
- **Features**:
  - PDF references (polynomial_practice.pdf, transformations PDF)
  - Maps and functions focus

#### dcfe/dcfe-web-authoring.md
- **Tone**: Technical, practical
- **Voice**: Instructional
- **Style**: Task-based
- **Audience**: Web development students
- **Features**:
  - Assignment PDFs
  - Jupyter notebooks
  - Python practice problems

#### bfei/bfei-foop-intro.md
- **Tone**: Technical, resource-heavy
- **Voice**: Instructional
- **Style**: Link collection and descriptions
- **Audience**: Object-oriented programming students
- **Features**:
  - Coda link reference
  - Mock exam notebooks (.ipynb)
  - Practice problem sets (C# and Python)
  - ZIP file collections
  - Primary vs. alternative learning paths
  - Resource categorization (tutorials, IDEs, videos, books, online tools)
  - Class structure table

#### bfei/foop/* (Advanced FOOP topics)
- **Tone**: Technical, project-based
- **Voice**: Instructional
- **Style**: Tutorial/guide format
- **Audience**: OOP students working on specific projects
- **Features**:
  - Code examples
  - Notebook references
  - Specific project focus (maps, solar system, etc.)

---

## External File References

These files are referenced in the markdown but need to be included in the repository structure:

### Current Teaching - AI for Business
- No direct file attachments, mostly web links

### Current Teaching - Communications
- `Communications_L6.pdf` (course brief)
- `6N1950 Communications v2.1 (rev) Aug 2025.pdf` (module descriptor)

### Current Teaching - Personal & Professional Development
- `Week1_DeveloperProfile.ipynb`
- `PersonalProfessionalDevelopment6N1949.pdf` (module descriptor)

### Current Teaching - Research & Study Skills
- `Source_Evaluation_Guide.docx`
- `Source_Evaluation_Guide_unfilled.docx`
- `ResearchAndStudySkills5N3113 v2 May 2014.pdf` (module descriptor)
- `Assignment_1_Big_Banana.pdf`
- `Assignment_2_Bananas_For_All.pdf`
- `Assignment_3_Badnana.pdf`
- `Assignment_4_BAN_Bananas.pdf`

### Current Teaching - Mathematics
- `Exploratory_Worksheets.pdf`
- Various Google Colab/Drive notebooks (linked, not embedded)

### Current Teaching - Web Authoring & Databases
- `WA_Assignment1_Level5.pdf`
- `tax_simulation_real-2.html.zip`
- `Break and Make a Website.zip` (with Readme and QuickStart)
- `sqlite_tutorial.ipynb`
- `WebAuthoring5N1910 v2 2013.pdf` (module descriptor)
- `DatabaseMethods5N0783 v2 Oct 2014.pdf` (module descriptor)

### Prior Teaching - DCFE - Maths for IT
- `transformations_on_linear_and_quadratic_equations.pdf`
- `polynomial_practice.pdf`

### Prior Teaching - DCFE - Web Authoring
- `WAAssignment1 2024.pdf`
- `Programming Design Principles Skills Demo.ipynb`
- `practice-problems-1.py`
- `practice-problems-1-solutions.py`
- `practice-problems-2.py`
- `practice-problems-3.py`
- `practice-problems-4.py`
- `practice-problems-5.py`
- `practice-problems-6.py`
- `practice-problems-7.py`
- `practice-problems-other.py`

### Prior Teaching - BFEI - FOOP
- `Foop Mock Exam Csharp With Answers.ipynb`
- `Foop Mock Exam CSharp Empty.ipynb`
- `fantasy-notebook.ipynb`
- `January Practice.ipynb`
- `FOOP Skills Demo 1 Brief Csharp.ipynb`
- `CSharp and Python Practice Problems.zip` containing:
  - `practice-problems-1.cs` through `practice-problems-7.cs`
  - `practice-problems-1.py` through `practice-problems-7.py`
  - `practice-problems-1-solutions.cs`
  - `practice-problems-1-solutions.py`
  - `practice-problems-other.py`

### Prior Teaching - BFEI - FOOP Visual Map Tutorial
- `hitchhikers-oop-notebook.ipynb`
- `jupyter-map-notebook.ipynb`
- `jupyter-notebook-oop.ipynb`
- `map_app.py`

---

## Content Organization Issues

### Issues Identified

1. **resources-contact.md is messy**
   - Contains mixed content: resources, contact info, random writings, "scratch paper"
   - Has duplicate content from `recommended-resources.md`
   - Contains what appears to be draft/working notes ("what experience do you have with teaching computer science:")
   - **Recommendation**: Split into:
     - Contact information (possibly merge into home-page.md or about.md)
     - Move clean resources content to `recommended-resources.md`
     - Move scratch/working content to a private notes folder or remove

2. **teaching-materials-norms.md is very long**
   - Contains multiple sub-documents embedded:
     - Norms & Expectations (main content)
     - End of Year Reflections (already split out)
     - Independent Learning Plan (could be separate)
     - "Maths for IT Problem Set 1" (belongs elsewhere)
     - "Assorted Teaching Materials" section
   - **Recommendation**: Consider splitting into:
     - Keep core norms content
     - Move "Assorted Teaching Materials" to its own file
     - Move specific problem sets to relevant course files

3. **Incomplete guide pages**
   - Several guide files are placeholders or very short
   - **Status**: This is OK for now, marked as "under construction"

4. **External file links**
   - Many references to PDFs, .ipynb, .zip files that need to be included
   - Some links to Google Drive/Colab that are external
   - **Recommendation**: Create a directory structure for these files (see next section)

### Recommended File Structure for External Resources

```
pages/
└── resources-files/
    ├── current-teaching/
    │   ├── ai-for-business/
    │   ├── communications/
    │   │   ├── Communications_L6.pdf
    │   │   └── 6N1950-Communications-v2.1.pdf
    │   ├── mathematics/
    │   │   └── Exploratory_Worksheets.pdf
    │   ├── personal-professional-dev/
    │   │   ├── Week1_DeveloperProfile.ipynb
    │   │   └── PersonalProfessionalDevelopment6N1949.pdf
    │   ├── research-study-skills/
    │   │   ├── Source_Evaluation_Guide.docx
    │   │   ├── Source_Evaluation_Guide_unfilled.docx
    │   │   ├── ResearchAndStudySkills5N3113-v2.pdf
    │   │   └── assignments/
    │   │       ├── Assignment_1_Big_Banana.pdf
    │   │       ├── Assignment_2_Bananas_For_All.pdf
    │   │       ├── Assignment_3_Badnana.pdf
    │   │       └── Assignment_4_BAN_Bananas.pdf
    │   └── web-authoring-databases/
    │       ├── WA_Assignment1_Level5.pdf
    │       ├── tax_simulation_real-2.html.zip
    │       ├── break-and-make-website.zip
    │       ├── sqlite_tutorial.ipynb
    │       ├── WebAuthoring5N1910-v2-2013.pdf
    │       └── DatabaseMethods5N0783-v2-2014.pdf
    │
    └── prior-teaching/
        ├── dcfe/
        │   ├── maths-for-it/
        │   │   ├── transformations_on_linear_and_quadratic_equations.pdf
        │   │   └── polynomial_practice.pdf
        │   └── web-authoring/
        │       ├── WAAssignment1-2024.pdf
        │       ├── Programming-Design-Principles-Skills-Demo.ipynb
        │       └── practice-problems/
        │           ├── practice-problems-1.py
        │           ├── practice-problems-1-solutions.py
        │           ├── practice-problems-2.py
        │           ├── practice-problems-3.py
        │           ├── practice-problems-4.py
        │           ├── practice-problems-5.py
        │           ├── practice-problems-6.py
        │           ├── practice-problems-7.py
        │           └── practice-problems-other.py
        │
        └── bfei/
            └── foop/
                ├── Foop-Mock-Exam-Csharp-With-Answers.ipynb
                ├── Foop-Mock-Exam-CSharp-Empty.ipynb
                ├── fantasy-notebook.ipynb
                ├── January-Practice.ipynb
                ├── FOOP-Skills-Demo-1-Brief-Csharp.ipynb
                ├── hitchhikers-oop-notebook.ipynb
                ├── jupyter-map-notebook.ipynb
                ├── jupyter-notebook-oop.ipynb
                ├── map_app.py
                └── practice-problems/
                    ├── practice-problems-1.cs
                    ├── practice-problems-1.py
                    ├── [... all other practice problem files]
                    └── CSharp-and-Python-Practice-Problems.zip
```

---

## Internal Links and Cross-References

### Links That Need Updating

Most internal references in the markdown files are textual references rather than proper markdown links. This needs systematic review.

### Common Reference Patterns

1. **Home page references**:
   - "Resources & Recommendations Page" → should link to `/pages/recommended-resources.md`
   - "Teaching Materials" → should link to `/pages/teaching-materials/teaching-materials-norms.md`
   - "guides section" → should link to `/pages/teaching-materials/guides/guides.md`

2. **Guide cross-references**:
   - "How I Think About Teaching" mentioned in multiple places
   - "How I Recommend Learning to Learn" mentioned in multiple places
   - "FAQs section" referenced from norms

3. **Course cross-references**:
   - Courses reference each other occasionally
   - Module descriptors referenced but not always linked

### Navigation Structure

The site would benefit from:
- Consistent navigation header/footer
- Breadcrumb structure
- "Back to..." links
- Related content links

---

## Style Guidelines Summary

### Voice and Tone Principles

1. **Student-Centered**: Content primarily addresses students directly
2. **Progressive Education**: Reflects constructivist, student-driven philosophy
3. **Transparent**: Explicitly states goals, methods, assessment criteria
4. **Supportive**: Acknowledges struggle, encourages experimentation
5. **Anti-Hierarchical**: Avoids authoritarian language, emphasizes mutual respect
6. **Reflective**: Frequently asks students to reflect on process and growth
7. **Practical**: Provides concrete steps and examples
8. **Flexible**: Acknowledges multiple paths to learning

### Common Language Patterns

- **Encouraging phrases**: "feel free", "don't be afraid", "experiment"
- **Honesty about uncertainty**: "I'm not sure", "we'll figure it out"
- **Inclusive language**: "we", "let's", "together"
- **Emotional awareness**: Acknowledges feelings, struggle, confidence
- **Meta-commentary**: Explains why things are done certain ways

### Formatting Conventions

- **Headers**: Clear hierarchical structure with #, ##, ###
- **Lists**: Frequent use of bullet points and numbered lists
- **Emphasis**: Bold for key terms and concepts
- **Questions**: Used liberally to prompt thinking
- **Examples**: Concrete examples and scenarios
- **Personal anecdotes**: Used to illustrate points

---

## Maintenance Notes

### For Future Updates

1. **Keep hierarchy documentation current**: Update this file when restructuring
2. **File naming convention**: Use lowercase, hyphens for spaces, descriptive names
3. **Date formats**: Currently inconsistent (some use "Week X", some use dates)
4. **External links**: Check periodically for broken links
5. **File attachments**: Maintain parallel structure between markdown and resource files

### Known TODO Items

1. Complete placeholder guide content
2. Clean up resources-contact.md
3. Potentially split teaching-materials-norms.md
4. Add proper markdown links throughout
5. Include all referenced external files
6. Create consistent navigation structure
7. Add breadcrumb links

---

*Last Updated: 2025-11-23*
*Maintained by: Joshua Aaron / Automated Documentation*
