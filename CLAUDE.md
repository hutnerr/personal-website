# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site for Hunter Baker at https://www.hunter-baker.com. Pure HTML/CSS/JS — no frameworks, no build pipeline, no npm dependencies. Hosted on GitHub Pages.

## Building the Site

The only build step is a Python component inliner:

```bash
python3 page_bldr.py
```

This inlines `components/background.html`, `components/header.html`, and `components/footer.html` into every HTML page, replacing placeholder `<div id="background">`, `<div id="header">`, and `<div id="footer">` elements. **Run this after editing any component or adding a new page.**

There is no dev server, test suite, or linter. Development is: edit files → run builder (if components changed) → open in browser.

## Architecture

**Component system:** Shared UI (nav, footer, background) lives in `components/`. Pages contain placeholder divs that `page_bldr.py` replaces with inlined HTML at build time. Never load components dynamically at runtime — the builder handles it statically.

**Page hierarchy:**
- `index.html` — home page
- `pages/nav/` — top-level nav destinations (projects, contact, other)
- `pages/projects/` — individual project detail pages
- `pages/other/` — secondary pages (experience, class history, etc.)
- `pages/games/` + `pages/devlogs/` — game showcases and dev logs

**New pages** should be copied from `templates/page.html`.

**Styling:** `styles/styles.css` defines the global design system (CSS variables, typography). Other CSS files are scoped by concern: `navigation.css`, `components.css`, `sections.css`, and per-page files under `styles/pages/`.

**JavaScript:** `scripts/anims.js` handles scroll-based section tracking (IntersectionObserver → navigation dots) and fade-up animations. `scripts/projects-filter.js` filters the projects grid using `data-category` attributes.

## Design System

Gruvbox warm palette — do not deviate from these CSS variables defined in `styles/styles.css`:

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#282828` | page background |
| `--surface` | `#3c3836` | cards, panels |
| `--surface-2` | `#504945` | hover states, inputs |
| `--border` | `#665c54` | borders |
| `--accent` | `#fabd2f` | links, highlights, hover effects |
| `--text` | `#ebdbb2` | primary text |
| `--text-muted` | `#bdae93` | secondary/descriptive text |

Font: **JetBrains Mono** everywhere (single monospace font family).

Background: `body::before` CSS mask with `/resources/images/backgrounds/topography.svg` — no HTML element needed.

**Card hover:** `translateY(-6px)` + box-shadow + border turns accent. More exaggerated than typical.  
**Button hover:** `translateY(-3px)` + accent fill + box-shadow.  
**Border radius:** cards 12px, buttons 6px, tags 6px, panels 12px.

## Page Conventions

- Sections are numbered (01., 02., …) using `.section-header` > `.section-number` + `.section-title` + `.section-line`
- Sub-page heroes use `<section id="hero" class="hero-simple">` with `.hero-content` > `.hero-text`
- Home hero uses `.hero-content` two-column grid (text left, circular photo right via `.logo-wrapper`)
- No dot navigation, no fade-up scroll animations (`anims.js` is now a no-op)
- Responsive breakpoints: 768px (tablet/mobile)
