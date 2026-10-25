# Block specification

This file describes every block that a page on jsaaron.com can contain. The build step in `tools/build.py` and the editor must both follow it. A block is plain text inside a Markdown file, so any text editor can read it.

## Rules that apply to every block

1. A page is a Markdown file with front matter at the top. Content below the front matter is Markdown plus the blocks listed here.
2. Blocks are directives, the syntax that the editor's `remark-directive` plugin reads. A block with no body is one line: `::name{key="value" key2="value"}`. A block with a body opens with `:::name{key="value"}` and closes with `:::` on its own line. A block that holds another block uses four colons on the outer one (`::::details{...}` ... `::::`).
3. Each block is a real node in the editor, with its own fields. Blocks with a body hold ordinary Markdown blocks.
4. Opening a page in the editor and saving it without a change must leave the file byte for byte the same, and must never remove or change a block. A test (`editor/scripts/roundtrip.ts`) opens every file under `content/` and a fixture that holds every block in the real editor, saves it twice, and fails if the second save differs from the first or a block line changed. The editor writes one blank line between two one-line blocks, so the files are committed in that form.
5. A directive with an unknown name, and any `:name` inside a sentence (for example `word:word`), is kept exactly as written. The editor shows an unknown block as plain text and never deletes it. The build stops on an unknown block so that it cannot go unnoticed.
6. File paths are relative to `content/` and use forward slashes, for example `downloads/maths/03a_foil_expanding.pdf`.
7. The build fails with a clear message when a block points at a file that does not exist.

## Blocks that are plain Markdown

| Block | Written as |
| --- | --- |
| Heading | `###` and `####` (the page title is already level 1 and the section title level 2) |
| Paragraph, bold, italic, link | ordinary Markdown |
| Bulleted, numbered and nested lists | ordinary Markdown |
| Quote | `>` at the start of a line |
| Table | pipe tables |
| Code | fenced with three backticks and an optional language. Code is shown and never runs. |
| Image | `![alt text](downloads/page-slug/picture.png)`. The alt text is required. |
| Maths, inline | `$x^2$` |
| Maths, display | `$$ ... $$` on its own lines |

Dated entries on class pages are ordinary headings that you type.

## Blocks that go beyond Markdown

### File card

```
::file{title="Title" path="path/to/file.ext" note="Optional note"}
```

Shows the file type, the size, and buttons. A PDF gets View (opens in a new tab) and Download. Text files (`md`, `tex`, `py`, `html`, `css`, `js`, `txt`, `csv`, `json`) get View, which opens a page on this site with the text and a Copy button, and Download. An HTML file also gets Open, which runs it in a new tab. Other files (`zip`, `docx`, `ipynb`) get Download only. If the title is empty the file name is used. In the editor, the slash command `/File` uploads a file or links one already in the project.

### Link card

```
::link{title="Title" url="https://example.org" note="Optional note"}
```

### Button

```
::button{label="Open the form" url="https://example.org"}
```

### PDF preview

```
::pdf{title="Title" path="path/to/file.pdf"}
```

### Worksheet entry

```
::sheet{title="Title" pdf="path/file.pdf" tex="path/file.tex" outline="Outline of the subject"}
```

### Callout

```
:::callout{type="tip"}
Text, with **bold**, lists and more paragraphs.
:::
```

The types are `note` (the default, written without a type), `tip`, `info` and `warning`.

### Collapsible section

```
:::details{title="Title shown while closed"}
Anything that Markdown allows, including other blocks.
:::
```

Closed on first view. It uses the browser's own details element, so it needs no script.

## Page front matter

```
---
slug: maths-worksheets          # the address of the page
title: Maths worksheets
summary: One sentence under the title and in link previews.
parent: projects                # the section that the back link returns to
draft: true                     # optional, keeps the page off the site
---
```

Section files under `content/sections/` use `id` and `title` instead of `slug`.

## Where uploaded files go

1. The editor puts an uploaded file in `downloads/<slug of the page being edited>/`.
2. You can change the folder in the upload panel before you confirm.
3. If a file with the same name exists, the editor asks whether to replace it or keep both.
4. A file chosen from the project, not uploaded, is linked by its existing path. Nothing is copied.
5. Before the editor renames or deletes a file, it lists the pages that use it.

## How the editor shows a block

A one-line block is a card with a small field for each part (title, path, note). A callout and a collapsible section are boxes that you type into like the rest of the page, with a type menu or a title field on top.

## Editor parts

| Part | Job | Reused by |
| --- | --- | --- |
| Block editor core | Markdown and the blocks above in, editable blocks on screen, the same text out | This site and dewnote |
| Repository shell | GitLab sign-in or a GitHub token, a searchable index of files, fetching one file, creating, uploading, committing straight to the main branch | Any repository that installs the `edit/` folder |
| Python cells | Cells that run code | dewnote only |

The repository shell asks first whether to edit online or on the computer. Online opens the file in the core. On the computer offers the file as a download and later accepts the edited file back with a short diff before it commits.

## Opening a page for editing

Add `?edit` to the address of any page, for example `https://deweydex.gitlab.io/jsaaron/maths-worksheets/?edit`. The page stays where it is, with its own header, type and layout, and the text that comes from its source file becomes the editor, in place. A bar at the bottom holds Save, Close and a link to the list of all files. On the front page, add `#about` or another section name after it to open that section; the rest of the front page stays as published. If you are not signed in, `?edit` first goes to the sign-in screen and returns to the page. The build writes each page's source file into the page for this purpose.

## Publishing

Every save is a commit on `main`. The pipeline in `.gitlab-ci.yml` runs `tools/build.py` and publishes `public/`, so a saved change is live in about a minute. If a block points at a file that is missing, the build stops with a message naming the page and the file, and the last good site stays up.

## Not in scope

Page icons, cover photos, a sidebar page tree, formulas and data tables from Superhuman. Renaming a file from the editor (delete it and upload it again, or rename it in GitLab; the delete screen lists the pages that use a file first). Add any of these to this file first if they come back.
