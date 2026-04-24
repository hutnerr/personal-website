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
- `pages/games/` — game showcases (solar-charged, massaquerade, forgotten-paths)

**New pages** should be copied from the appropriate template in `templates/`:
- `templates/page.html` — generic page (hero + sections)
- `templates/project.html` — project detail page (overview + tech stack + links)
- `templates/game.html` — game showcase page (embed + overview + how to play + results)

**Styling:** `styles/styles.css` defines the global design system (CSS variables, typography). Other CSS files are scoped by concern: `components.css`, `sections.css`, and per-page files under `styles/pages/`. Active per-page CSS files:
- `styles/pages/homepage.css` — home page only
- `styles/pages/games.css` — game showcase pages
- `styles/pages/contact-page.css` — contact page

**JavaScript:**
- `scripts/projects-filter.js` — filters the projects grid using `data-category` attributes
- `scripts/lightbox.js` — image lightbox on click
- `scripts/game-embed.js` — lazy-loads itch.io game embeds on click

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

**Hero section:** All sub-pages use a simple hero — `h1` + optional `p` directly inside `.container`, no wrapper divs:
```html
<section id="hero">
    <div class="container">
        <h1>page title<span class="cursor"></span></h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">$ subtitle</p>
    </div>
</section>
```
The `#hero > .container > h1` selector in `sections.css` centers this automatically.

**Section titles:** All lowercase (e.g. `<h2>overview</h2>`, not `Overview`).

**Project pages** use a vertical layout:
- Hero with title + tagline
- Overview section with description paragraphs, tech stack as `.grid-2` lists, and link buttons
- Additional sections as needed (e.g. features, usage)
- Links use `.btn.btn-background` class: `<a href="..." class="btn btn-background" target="_blank">Label</a>`

**Help/walkthrough pages** use `.walkthrough-step` and `.walkthrough-img` from `components.css`:
- `.walkthrough-step` — bordered section for each step (border-bottom between steps, none on last)
- `.walkthrough-img` — styled image with accent hover border (max-width 680px; use inline `max-width: 320px` for portrait phone screenshots)

**Home hero:** `.hero-content` two-column grid (text left, circular photo right via `.logo-wrapper`).

**Navbar:** `position: fixed` — body has `padding-top: 56px` to prevent content overlap.

**Responsive breakpoints:** 768px (tablet/mobile).

**Dead assets:** Unreferenced files are in `resources/_unused/` for manual review before deletion.
