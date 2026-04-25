# Project Page Instructions

Hunter Baker's personal website lives at `/home/hutner/Dev/web-dev/personal-website` (https://www.hunter-baker.com). Project pages live at `pages/projects/`. This document drives a two-phase workflow:

- **Phase 1** — Run inside a project repo. Review the codebase, ask questions, and output a spec file.
- **Phase 2** — Run inside the website repo. Read all spec files from `_specs/` and generate the HTML pages.

Read the relevant phase fully before starting.

---

# Phase 1 — Spec Generation

*Drop this document into a project repo, then invoke Phase 1. The output is a `project-spec.md` file to be placed in the website repo's `_specs/` folder.*

## Step 1 — Ask preliminary questions first

Ask all of these in a single message. Do not proceed until you have answers.

1. **Project name and one-line description** — what it is and what it does at a high level.
2. **Links** — GitHub URL, live demo, published listing (Top.gg, Obsidian community, npm, etc.), help page, anything linkable.
3. **Screenshots** — are there any? If so, what filenames will they be stored as in the website's `/resources/images/projects/`? Note which (if any) are portrait/phone screenshots.
4. **Visibility** — is the repo public? This determines whether to link GitHub.
5. **Context to highlight** — anything Hunter wants called out (team project, class assignment, first time with a technology, personal itch being scratched, etc.).
6. **Context to omit** — anything that should be left off the page.

## Step 2 — Full codebase review

Do a thorough read of the entire repo before writing anything. The spec must reflect what the code actually does, not surface-level assumptions.

### What to read

- **Every significant source file** — not just the entry point. Trace the main flows.
- **Config files** — `package.json`, `pyproject.toml`, `Cargo.toml`, `pom.xml`, `build.gradle`, `Makefile`, `Dockerfile`, `compose.yml`, `.env.example`. These reveal the real tech stack and deployment model.
- **README and any docs** — useful for stated intent and architecture overview, but trust the code over the docs when they conflict.
- **Design patterns** — identify patterns in use (Observer, Strategy, Repository, Factory, Visitor, etc.). Name them explicitly; they're portfolio-worthy.
- **Algorithms and data structures** — if the project implements something non-trivial (compression, scheduling, parsing, caching, graph traversal), name it. These are concrete skills to surface.
- **External integrations** — every third-party API, SDK, or service. Note specifically what it's used for, not just that it's present.
- **Notable implementation decisions** — comments, structural choices, or commit messages that reveal *why* something was done a certain way. These are the raw material for the challenges section.
- **Tests** — note whether they exist and at what level (unit, integration, e2e). Mention if tests are a notable part of the project.

### What to extract

- Exact tech stack items with specifics — not "Python" but "Python — Discord.py, Aiohttp, BeautifulSoup4"
- Which optional sections are warranted (see section decision table below)
- The prose content for each section — overview description, challenges narrative, takeaway bullets
- Any implementation decision or tradeoff worth explaining on the page
- **Interesting code snippets** — look for implementations that are clever, non-obvious, or showcase a skill well. Good candidates: a core algorithm, a key design pattern in action, a tricky concurrency or I/O solution, an elegant abstraction, or anything a reader would find genuinely interesting. Pull the actual code from the file. One or two focused snippets is enough — don't include boilerplate.

## Step 3 — Choose sections

Every page has `overview` (mandatory). Optional sections and when to include them:

| Section | When to include |
|---|---|
| `showcase` | Any screenshots or images exist |
| `how-it-works` | Mechanism is non-obvious — worth explaining *how*, not just *what* |
| `features` | Meaningful feature list that doesn't fit cleanly in overview prose |
| `endpoints` + `usage` | APIs or CLIs — show request/response or command examples |
| `challenges` | Real implementation decisions worth discussing — patterns chosen, bugs that required rethinking, architectural pivots |
| `takeaways` | Project was educational or involved learning new concepts |

Don't add sections to pad the page. A simple utility may only need `overview` + `showcase`.

## Step 4 — Write the spec file

Output a single `project-spec.md` file using the format below. This file goes in the website repo at `_specs/SLUG.md`.

### Spec format

```
---
title: "Display Name"
slug: kebab-case-slug
tagline: short phrase without leading dollar sign
og_description: One complete sentence describing the project.
og_image: projects/filename.png
# If no screenshot exists, use: my_rat_pfp_nobg.png

tech_stack:
  - Language — library, framework, or specific role
  - Service — what it does in this project
  - Pattern or Algorithm — if central to the project

links:
  - label: GitHub
    url: https://github.com/hutnerr/REPO
    external: true
  - label: Live Demo
    url: https://example.com
    external: true
  - label: Help Page
    url: /pages/other/SLUG-help.html
    external: false
# Omit links block entirely if there are no links

sections: [showcase, how-it-works, challenges, takeaways]
# List only the optional sections being included, in display order

prism: false
prism_languages: []
# Set prism: true and list language slugs (json, javascript, python, bash, java, csharp, etc.)
# whenever any section contains fenced code blocks — usage, endpoints, or inline snippets in challenges/how-it-works

showcase:
  - file: projects/screenshot.png
    alt: Descriptive alt text for the image
    portrait: false
  - file: projects/screenshot2.png
    alt: Second screenshot description
    portrait: false
# portrait: true adds max-width: 320px (for phone screenshots)
# Omit showcase block if sections list does not include showcase
---

## overview

First paragraph — what it is and what it does. Be concrete and specific. Two to three sentences.

Second paragraph — motivation, context, constraints, or who it's for. Optional; omit if there's nothing meaningful to add.

## how-it-works

Explain the internal mechanism — not what the user sees, but how the system works under the hood. Prose paragraphs only.

## features

- Feature one
- Feature two
- Feature three

## endpoints

Brief intro sentence.

- **GET** `/api/route` — description
- **POST** `/api/route` — description

## usage

Intro sentence describing what to send.

### request
(fenced code block with language tag)

### response
(fenced code block with language tag)

## challenges

Opening sentence framing the challenge space.

One paragraph per significant challenge. State the problem, then how it was solved. Be specific — name the pattern, data structure, or mechanism used. No bullet points; this is prose, not a list.

If a snippet makes the solution concrete, include it directly in the section using a labeled fenced code block:

### snippet title
(fenced code block with language tag — keep it short and focused, trim boilerplate)

## takeaways

One sentence framing what the project taught or required. End with "Some key takeaways:"

- Specific concept — with brief context
- Another specific takeaway
- Keep items concrete, not generic
```

### Writing style for spec content

- **Section prose:** direct and specific. No puffery — avoid "powerful", "robust", "seamless", "leverages".
- **Tech stack items:** always `Thing — specific detail`. Design patterns and algorithms count as entries when central.
- **Challenges:** prose paragraphs, not bullets. Read like an engineering post-mortem.
- **Takeaways:** specific ("Priority queue and binary tree implementation in practice") not generic ("learned data structures").
- **First person sparingly:** acceptable in overview and challenges ("Built out of personal frustration with..." or "I switched to an in-memory cache...").
- **Tagline:** a short phrase, no punctuation at the end. It will be prefixed with `$ ` automatically in the HTML.

---

# Phase 2 — Page Generation

*Run inside the website repo (`/home/hutner/Dev/web-dev/personal-website`). Read all `.md` files in `_specs/` and generate the corresponding HTML pages.*

## Step 1 — Read all spec files

Read every `.md` file in `_specs/`. Parse the YAML frontmatter and markdown body for each. Generate all pages in one pass.

## Step 2 — Render each spec to HTML

For each spec, create `pages/projects/SLUG.html` using the rules below. The output is complete, ready-to-build HTML — `page_bldr.py` will inline the shared components at build time.

### Full page template

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="icon" href="/resources/images/my_rat_pfp_nobg.png">
    <link rel="stylesheet" href="/styles/styles.css">
    <link rel="stylesheet" href="/styles/sections.css">
    <link rel="stylesheet" href="/styles/components.css">

    {{if prism}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-gruvbox-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    {{for each prism_language}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-{{language}}.min.js"></script>
    {{end}}
    {{end}}

    <meta property="og:title" content="Hunter Baker | {{title}}">
    <meta property="og:description" content="{{og_description}}">
    <meta property="og:image" content="https://hunter-baker.com/resources/images/{{og_image}}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://hunter-baker.com/pages/projects/{{slug}}.html">

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4J8LXCJ31S"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-4J8LXCJ31S');
    </script>
    {{if showcase in sections}}
    <script src="/scripts/lightbox.js"></script>
    {{end}}
</head>

<body>
    <div id="background"></div>
    <div id="header"></div>

    <section id="hero">
        <div class="container">
            <h1>{{title lowercase}}<span class="cursor"></span></h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">$ {{tagline}}</p>
        </div>
    </section>

    {{overview section}}
    {{optional sections in order}}

    <div id="footer"></div>
</body>

</html>
```

### Overview section rendering

The overview section always renders. Tech stack and links layout depends on what's present:

**Both tech_stack and links present — two-column grid:**

```html
<section id="overview">
    <div class="container">
        <h2>overview</h2>
        <div class="pspacing">
            {{overview prose paragraphs, each wrapped in <p>}}
        </div>

        <div class="grid grid-2" style="margin-top: 24px; gap: 32px;">
            <div>
                <h3 style="margin-bottom: 12px;">tech stack</h3>
                <ul class="arrowed-list">
                    {{each tech_stack item as <li>}}
                </ul>
            </div>
            <div>
                <h3 style="margin-bottom: 12px;">links</h3>
                <ul class="arrowed-list">
                    {{each link as <li><a href="URL" target="_blank">Label</a></li> if external}}
                    {{each link as <li><a href="URL">Label</a></li> if not external}}
                </ul>
            </div>
        </div>
    </div>
</section>
```

**Only tech_stack, no links — single column:**

```html
<div style="margin-top: 24px;">
    <h3 style="margin-bottom: 12px;">tech stack</h3>
    <ul class="arrowed-list">
        {{each tech_stack item as <li>}}
    </ul>
</div>
```

### Showcase section

```html
<section id="showcase">
    <div class="container">
        <h2>showcase</h2>
        {{first image — no margin-top}}
        <img class="walkthrough-img hover-img sized-img" src="/resources/images/{{file}}" alt="{{alt}}" data-lightbox>
        {{subsequent images — add style="margin-top: 1rem;"}}
        {{if portrait — add style="max-width: 320px; margin-top: 1rem;" (or just max-width on first)}}
    </div>
</section>
```

### How it works section

```html
<section id="how-it-works">
    <div class="container">
        <h2>how it works</h2>
        <div class="pspacing">
            {{prose paragraphs, each wrapped in <p>}}
        </div>
    </div>
</section>
```

### Features section

```html
<section id="features">
    <div class="container">
        <h2>features</h2>
        <div class="pspacing">
            <ul class="arrowed-list">
                {{each bullet as <li>}}
            </ul>
        </div>
    </div>
</section>
```

### Endpoints section

```html
<section id="endpoints">
    <div class="container">
        <h2>endpoints</h2>
        <div class="pspacing">
            {{intro paragraph if present}}
            <ul class="arrowed-list">
                {{render each endpoint as: <li><strong>METHOD</strong> <code>/route</code> — description</li>}}
            </ul>
        </div>
    </div>
</section>
```

### Usage section

```html
<section id="usage">
    <div class="container">
        <h2>usage</h2>
        <div class="pspacing">
            {{intro paragraph}}
            {{for each ### subsection (request, response, etc.):}}
            <h3 style="margin-bottom: 8px;">{{subsection title}}</h3>
            <pre><code class="language-{{lang}}">{{code content}}</code></pre>
        </div>
    </div>
</section>
```

### Challenges section

```html
<section id="challenges">
    <div class="container">
        <h2>challenges &amp; solutions</h2>
        <div class="pspacing">
            {{prose paragraphs, each wrapped in <p>}}
        </div>
    </div>
</section>
```

### Takeaways section

The spec body has an intro paragraph followed by a bullet list. Render as:

```html
<section id="takeaways">
    <div class="container">
        <h2>takeaways</h2>
        <div class="pspacing">
            <p>{{intro paragraph}}</p>
            <ul class="arrowed-list">
                {{each bullet as <li>}}
            </ul>
        </div>
    </div>
</section>
```

## Step 3 — Post-generation checklist

After generating all pages:

1. Tell Hunter to run `python3 page_bldr.py` from the site root to inline the shared header, footer, and background into every new page.
2. List every new page slug and remind Hunter to add each project to the projects listing at `pages/nav/projects.html` if not already there.

---

# Design system reference

Gruvbox warm palette — never deviate, never add inline color styles that duplicate these:

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#282828` | page background |
| `--surface` | `#3c3836` | cards, panels |
| `--surface-2` | `#504945` | hover states, inputs |
| `--border` | `#665c54` | borders |
| `--accent` | `#fabd2f` | links, highlights |
| `--text` | `#ebdbb2` | primary text |
| `--text-muted` | `#bdae93` | secondary text |

Font: JetBrains Mono everywhere. All hover effects, border radii, and spacing are handled by the existing CSS — the spec and generated HTML should not duplicate or override them with inline styles except where the existing page patterns explicitly use inline styles (e.g. `style="margin-top: 24px; gap: 32px;"` on the overview grid).
