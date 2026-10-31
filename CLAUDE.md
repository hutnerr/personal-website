# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site for Hunter Baker at https://www.hunter-baker.com. Pure HTML/CSS/JS - no frameworks, no build pipeline, no npm dependencies. Hosted on GitHub Pages.

## Building the Site

The only build step is a Python component inliner:

```bash
python3 page_bldr.py
```

This inlines `components/header.html` and `components/footer.html` into every HTML page, replacing `<div id="header">` and `<div id="footer">` placeholders with their full HTML. **Run this after editing any component or adding a new page.**

There is no dev server, test suite, or linter. Development is: edit files → run builder (if components changed) → open in browser.

## Architecture

**Component system:** Shared UI (nav, footer) lives in `components/`. Pages contain placeholder divs that `page_bldr.py` replaces with inlined HTML at build time. Never load components dynamically at runtime.

**Page hierarchy:**
- `index.html` - home page
- `pages/nav/` - top-level nav destinations (projects, contact, other)
- `pages/projects/` - individual project detail pages, including game showcases (forgotten-paths, solar-charged, massaquerade)
- `pages/other/` - secondary pages (experience, class history, documents, help pages)

**Styling:** `styles/styles.css` defines the global design system (CSS variables, typography). Other CSS files are scoped by concern: `components.css`, `sections.css`, and per-page files under `styles/pages/`. Active per-page CSS files:
- `styles/pages/homepage.css` - home page only
- `styles/pages/contact-page.css` - contact page
- `styles/pages/project-page.css` - project showcase pages (`pages/projects/`)

**JavaScript:**
- `scripts/nav-active.js` - highlights active nav link based on current URL path
- `scripts/projects-filter.js` - filters the projects grid using `data-category` attributes
- `scripts/lightbox.js` - image lightbox on click
- `scripts/game-embed.js` - lazy-loads itch.io game embeds on click
- `scripts/project-stats.js` - fills `[data-stat]` elements with live values from shields.io JSON endpoints (GitHub stars, downloads)

## Design System

Gruvbox warm palette - do not deviate from these CSS variables defined in `styles/styles.css`:

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#282828` | page background |
| `--bg-pattern` | `#1d2021` | topography SVG pattern overlay |
| `--surface` | `#3c3836` | cards, panels |
| `--surface-2` | `#504945` | hover states, inputs |
| `--border` | `#665c54` | borders |
| `--accent` | `#fabd2f` | links, highlights, hover effects |
| `--text` | `#ebdbb2` | primary text |
| `--text-muted` | `#bdae93` | secondary/descriptive text |

Font: **JetBrains Mono** everywhere (single monospace font family).

Background: `body::before` CSS mask using `/assets/background/topography.svg` — no HTML element needed.

**Card hover:** `translateY(-6px)` + box-shadow + border turns accent. More exaggerated than typical.  
**Button hover:** `translateY(-3px)` + accent fill + box-shadow.  
**Border radius:** cards 12px, buttons 6px, tags 6px, panels 12px.

**Icons:** Devicons CDN (`devicon.min.css`) is loaded on the home page for tech stack icons. Use `<i class="devicon-*-plain">` pattern.

## Page Conventions

**Hero section:** All sub-pages except project pages use a simple hero - `h1` + optional `p` directly inside `.container`, no wrapper divs:
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

**Project pages** (`pages/projects/`, styled by `styles/pages/project-page.css`; use `tip-calculator.html` as the reference):
- `section.project-hero`: two columns. Left has `h1` + cursor, `p.project-tagline` (CSS adds the `$ `), `.project-tags` (status badge + `.tech-tag`s), and `.project-actions` with 1-2 buttons (first is `.btn.btn-primary`). Right has `.project-hero-media` with the cover image; add `--icon` for square logos.
- `section.project-stats` (optional): `.stat-row` of `.stat` tiles. Tiles are static (no hover) and a third of the width each. Live values use `data-stat="https://img.shields.io/....json"`.
- `.container.project-layout`: `main.project-main` + `aside.project-sidebar`
  - Main sections each have a plain lowercase `h2`. Order: `#overview` (paragraphs, optional `<blockquote>`, `p.text-note` for muted notes), then `#features`, `#play`, `#how-to-play`, `#showcase`, and any write-up sections (`#how-it-works`, `#challenges`, `#takeaways`).
  - Features: `.feature-list` of static `.feature` cards, each an `h3` (CSS adds `▸`) + `p`. No numbers and no hover.
  - Only use feature cards when a project has several distinct features worth listing. Otherwise write a plain text section (e.g. `#gameplay`, `#usage`, `#how-it-works`).
  - Showcase: `img.project-banner` for a single wide image; `.project-gallery` (2 columns) for screenshots; add `--portrait` for phone screenshots.
  - Sidebar: a `links` panel (`ul.sidebar-links`; external links get `target="_blank"` and show ↗) and a `tech stack` panel (`.arrowed-list`).
- Body text in the main column uses `--text`; feature descriptions and notes use `--text-muted`.

**Help/walkthrough pages** use `.walkthrough-step` and `.walkthrough-img` from `components.css`:
- `.walkthrough-step` - bordered section for each step (border-bottom between steps, none on last)
- `.walkthrough-img` - styled image with accent hover border (max-width 680px; use inline `max-width: 320px` for portrait phone screenshots)

**Reusable utility classes** from `components.css`:
- `.pspacing` - adds bottom padding between `<p>` siblings
- `.sized-img` - full-width responsive image with rounded corners
- `.hover-img` - subtle scale transform on hover
- `.centered` - block-level centering
- `.table-gap` - spacing and muted color for `<td>` elements

**Home hero:** `.hero-content` two-column grid (text left, circular photo right via `.logo-wrapper`).

**Navbar:** `position: fixed` - body has `padding-top: 56px` to prevent content overlap.

**Responsive breakpoints:** 768px (tablet/mobile).

**OG tags:** Every page should include `og:title`, `og:description`, `og:image`, `og:type`, and `og:url` meta tags. Google Analytics tag (`G-4J8LXCJ31S`) is included in all pages.
