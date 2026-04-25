---
title: "Obsidian Attachment Plugin"
slug: obsidian-attachment-plugin
tagline: rule-based attachment placement for Obsidian.md
og_description: An officially published Obsidian community plugin that intercepts attachment creation and routes files to folder-specific destinations using configurable glob rules.
og_image: projects/obs-attachment-placement-settings.png

tech_stack:
  - TypeScript 5.8.3, Obsidian API — community plugin targeting Obsidian desktop (min version 0.15.0)
  - esbuild 0.25.5 — bundles plugin source to a single main.js for distribution
  - Monkey-patching — overrides vault.getAvailablePathForAttachments at runtime to intercept all attachment routing
  - Bottom-up folder walk — traverses ancestor directories from the active note upward to find the nearest matching rule
  - Two-level caching — ruleMap (glob→destination) and destinationCache (note path→resolved destination) invalidated on vault create/delete/rename events

links:
  - label: GitHub
    url: https://github.com/hutnerr/obsidian-attachment-placement
    external: true
  - label: Help Page
    url: /pages/other/obsidian-attachment-placement-help.html
    external: false

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/obs-attachment-placement-settings.png
    alt: Attachment Placement plugin settings panel
    portrait: false
  - file: projects/obs-attachment-example.png
    alt: Attachment Placement example configuration
    portrait: false
---

## overview

An officially published Obsidian community plugin that gives per-folder control over where attachments are saved. Instead of dumping all pasted or dropped files into a single global folder, you define placement rules per directory. When an attachment is created, the plugin walks up the folder tree from the active note and applies the first matching rule it finds.

Built out of personal frustration with Obsidian's single-destination attachment behavior in larger, organized vaults. Published to the community plugin list and available for installation directly from Obsidian.

## how-it-works

Obsidian exposes `vault.getAvailablePathForAttachments` as the hook point for attachment destination resolution. The plugin monkey-patches this method at load time, replacing it with a wrapper that runs the rule-matching logic before falling back to Obsidian's default behavior if no rule matches.

When an attachment is created, the plugin starts at the folder containing the active note and walks up the directory tree. At each level it checks the ruleMap — a Map from folder path to destination glob — for a matching entry. The first match determines the destination; if the root is reached with no match, a configurable global default applies. This bottom-up walk means more specific rules (closer to the note) take precedence over broader rules (higher in the vault).

Two caching layers avoid repeated tree walks. The ruleMap caches the parsed rule set so adding a rule doesn't re-read all rules from settings on every attachment. The destinationCache maps each note path to its resolved destination so consecutive attachments to the same note skip the walk entirely. Both caches are invalidated on vault events (`create`, `delete`, `rename`) that could change which rule applies to a given path.

Rules are configured in a settings panel with drag-and-drop reordering and folder validation — if a rule points to a folder that doesn't exist, a Notice is shown.

## challenges

The core implementation challenge was that Obsidian does not expose an official extension point for attachment routing. The only supported API at the time was `getAvailablePathForAttachments`, and the only way to intercept it without a framework-level hook was to replace the method on the vault instance at runtime — monkey-patching. This works reliably but is inherently fragile against Obsidian updates that change the method's signature or call semantics. Minimizing the patch surface (replacing the method rather than wrapping the entire vault class) reduces the exposure.

Cache invalidation required listening to three vault events that can change rule applicability: file creation (a new folder might need a rule), deletion (a folder a rule pointed to may no longer exist), and rename (paths in both the ruleMap and destinationCache can become stale). Handling all three cleanly while keeping the cache logic separate from the event handler wiring was the main design task.

## takeaways

Publishing a plugin to an official community registry raised the bar on polish, documentation, and correctness compared to personal-use tools. Some key takeaways:

- Obsidian plugin API — lifecycle hooks, vault events, and settings serialization
- Monkey-patching as a last-resort extension technique and its associated fragility trade-offs
- Two-level cache design with event-driven invalidation
- Bottom-up tree traversal for nearest-ancestor rule matching
- Community plugin publishing standards — help documentation, settings UX, and version compatibility
