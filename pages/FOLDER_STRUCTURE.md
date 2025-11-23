# Pages Folder Structure

This document describes the organizational hierarchy of the pages directory, based on the content structure from Coda.

## Hierarchy Overview

```
pages/
├── home-page.md                          # Joshua Aaron's Home Page
├── about.md
├── podcast.md
├── projects.md
├── recommended-resources.md
├── current-teaching.md
│
├── current-teaching/                     # Current Teaching Section
│   ├── current-teaching-calendar.md      # My Calendar
│   ├── communications-course.md          # Communications
│   ├── research-study-skills.md          # Research & Study Skills
│   ├── ai-for-business-course.md         # AI for Business
│   ├── personal-professional-dev.md      # Personal & Professional Development
│   ├── mathematics-course.md             # Mathematics
│   └── web-authoring-databases.md        # Web Authoring & Databases
│
├── resources/                            # Resources & Recommendations
│   └── resources-contact.md
│
└── teaching-materials/                   # Teaching Materials Section
    ├── teaching-materials-norms.md       # Norms & Expectations
    ├── end-year-reflections-questionnaire.md  # FAQs / End Year Reflections
    │
    ├── guides/                           # Guides
    │   └── guides.md
    │
    └── prior-teaching/                   # Prior Teaching
        │
        ├── dcfe/                         # DCFE: Dundrum College of Further Education
        │   ├── dcfe-foundations-ai-business.md   # Foundations of AI for Business
        │   ├── dcfe-maths-for-it.md              # Maths for IT
        │   └── dcfe-web-authoring.md             # Web Authoring
        │
        └── bfei/                         # BFEI: Blackrock Further Education Institute
            ├── bfei-foop-intro.md        # Foundations of OOP (Introduction)
            │
            └── foop/                     # Foundations of OOP - Advanced Topics
                ├── bfei-foop-jupyter-map.md          # Jupyter Map Tutorial
                ├── bfei-foop-visual-map-tutorial.md  # Visual Map Tutorial
                ├── bfei-foop-solar-system.md         # Solar System Project
                ├── bfei-foop-bonus-extensions.md     # Bonus Extensions
                └── bfei-foop-class-hierarchy.md      # Class Hierarchy
```

## Navigation Structure

### Top Level
- **Home Page**: Main landing page for Joshua Aaron's website
- **Current Teaching**: Active courses and teaching calendar
- **Teaching Materials**: All teaching resources, guides, and materials
- **Resources**: Contact information and recommended resources

### Current Teaching
Contains all active course materials organized by subject:
- Communications
- Research & Study Skills
- AI for Business
- Personal & Professional Development
- Mathematics
- Web Authoring & Databases

### Teaching Materials
Organized into:
- **General Materials**: Norms, expectations, and FAQs
- **Guides**: Teaching guides and learning resources
- **Prior Teaching**: Archive of previous teaching work
  - **DCFE**: Courses from Dundrum College of Further Education
  - **BFEI**: Courses from Blackrock Further Education Institute
    - **FOOP**: Foundations of Object-Oriented Programming materials

## File Naming Convention

Files follow a consistent naming pattern:
- `[institution]-[course]-[topic].md` for course materials
- `[section]-[description].md` for general pages

Examples:
- `dcfe-maths-for-it.md` - DCFE Maths for IT course
- `bfei-foop-solar-system.md` - BFEI FOOP Solar System project
- `teaching-materials-norms.md` - Teaching materials norms and expectations
