---
title: "Personal Website"
slug: personal-website
tagline: static portfolio site with a custom Python build pipeline
og_description: Hunter Baker's personal portfolio site — built with pure HTML, CSS, and JavaScript, featuring a custom static site builder and the Gruvbox design system.
og_image: my_rat_pfp_nobg.png

tech_stack:
  - HTML/CSS/JS — no frameworks; pure hand-written markup and styles
  - Python — static site builder that inlines shared components at build time
  - CSS custom properties — Gruvbox warm palette design system
  - GitHub Pages — static hosting

links:
  - label: GitHub
    url: https://github.com/hutnerr/personal-website
    external: true
  - label: Live Site
    url: https://hunter-baker.com
    external: true

sections: [how-it-works, features]

prism: false
prism_languages: []
---

## overview

A fully hand-crafted static portfolio site with no frameworks, no npm dependencies, and no build pipeline beyond a single Python script. Pages, projects, and games are organized into a clear directory hierarchy and share UI components inlined at build time.

The design is built around the Gruvbox warm color palette using CSS custom properties, with JetBrains Mono as the sole font. Every visual pattern — card hovers, button states, section layouts — is defined once in the design system and composed across all pages.

## how-it-works

Shared UI lives in a `components/` directory: navigation header, footer, and CSS background pattern. Each HTML page contains empty placeholder `<div id="header">` elements. Running `page_bldr.py` crawls every HTML file and replaces each placeholder with the component's inlined content. The builder uses a depth-counting pass over the raw HTML string to locate the matching `</div>` for each placeholder before swapping it out — no DOM parser required.

This approach avoids the runtime penalty of fetch-on-load dynamic component loading without reaching for a full JavaScript framework. All markup is present in the HTML file on first load.

JavaScript is used sparingly and only for behaviors CSS can't handle. `projects-filter.js` reads `data-tags` attributes on project cards and applies an AND filter across independent filter groups, hiding cards that don't match every active selection. `lightbox.js` injects a single overlay element on page load and wires up all `[data-lightbox]` images to it, including keyboard Escape to dismiss. `game-embed.js` defers itch.io iframe creation until the user clicks a placeholder, avoiding up-front load cost for embeds that most visitors won't interact with.

## features

- Custom Python static site builder with depth-tracking div replacement
- Gruvbox warm palette design system via CSS custom properties
- Multi-filter project grid using `data-tags` attribute AND matching
- Vanilla JS image lightbox with Escape key support
- Click-to-load itch.io game embed lazy loader
- Fully responsive at a single 768px breakpoint
- Zero npm dependencies, no bundler, no runtime framework
