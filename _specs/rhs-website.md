---
title: "Rat Haven Studios Website"
slug: rhs-website
tagline: studio website for a small indie game dev team
og_description: The official site for Rat Haven Studios — a static HTML/CSS studio website with game showcases, devlogs, a workshop, and a custom GDScript syntax highlighter.
og_image: my_rat_pfp_nobg.png

tech_stack:
  - HTML/CSS/JS — no frameworks; pure hand-written markup and styles
  - Press Start 2P + VT323 — Google Fonts retro pixel aesthetic
  - Custom GDScript syntax highlighter — vanilla JS regex tokenizer, no external library
  - GitHub Pages — static hosting

links:
  - label: GitHub
    url: https://github.com/Rat-Haven-Studios/website
    external: true

sections: [how-it-works, features]

prism: false
prism_languages: []
---

## overview

The official website for Rat Haven Studios, a small indie game studio formed by a group of friends in 2025. The site covers all studio output: game showcases with playable itch.io embeds, devlogs documenting each project, a workshop section for tutorials and writeups, and individual developer profiles.

Built with no frameworks and no build step — pure HTML, CSS, and JavaScript. The retro aesthetic uses `Press Start 2P` for headings and buttons and `VT323` for body text, on a dark navy palette with a blue accent.

## how-it-works

Each content type has its own nav listing (`games.html`, `devlogs.html`, `workshop.html`) backed by the same `filter.js` script. Cards carry `data-tags` attributes; each `.filter-group` operates independently and all active filters must match, so genre and type filters can be combined without any OR logic.

The workshop section publishes GDScript code samples, but GDScript has no Prism.js support. Rather than pulling in a general syntax highlighter and registering a grammar, a custom IIFE tokenizer (`gdscript-highlight.js`) was written from scratch. It runs a priority-ordered list of regex patterns — comments, strings, annotations, numbers, identifiers — over the raw `textContent` of each `code.language-gdscript` block and rewrites it with `<span class="gds-*">` wrappers. Keyword and built-in type lookups are `Set`-based for O(1) dispatch; function detection checks whether the next non-whitespace character after a word token is `(`. The result is loaded once and runs synchronously on `DOMContentLoaded`.

Game pages use a lazy iframe loader (`game-embed.js`): a `.game-embed-placeholder` div with a `data-src` attribute renders a thumbnail and play button; clicking it replaces the placeholder with the live itch.io iframe. The lightbox (`lightbox.js`) injects a single overlay and wires all `[data-lightbox]` images to it, with Escape-key dismiss.

## features

- Game showcase pages with hero layout, screenshot galleries, and lazy itch.io embeds
- Devlog archive with filter-by-type support
- Workshop section for tutorials, resources, and writeups with GDScript code samples
- Developer profile pages per team member
- Custom GDScript syntax highlighter — written from scratch, no Prism dependency
- Multi-group AND filter bar reused across all three nav listing pages
- Retro pixel aesthetic — Press Start 2P headings, VT323 body text
- Zero npm dependencies, no bundler, no runtime framework
