---
title: "Massaquerade"
slug: massaquerade
tagline: a murder mystery game built in 72 hours for Winter MelonJam 2025
og_description: A narrative mystery game for Winter MelonJam 2025 where players swap masks to unlock dialogue options and identify the murder target at a masquerade ball — built in 72 hours in Godot 4.
og_image: game-jams/massaquerade1.png

tech_stack:
  - Godot 4, GDScript — game engine and scripting
  - JSON dialogue trees — per-character, per-mask branching dialogue files with declarative flag conditions and flag mutations
  - Flag system — conversationState dictionary (local per-dialogue) and Data.player.actionFlags (global persistent) evaluated at each branch
  - Suspicion tracking — global integer compared against per-dialogue thresholds to gate certain responses
  - Murder mechanic — M-key input checked in dialogue context triggers accusation resolution

links:
  - label: Game Jam Page
    url: https://itch.io/jam/wmj2025/rate/4155805
    external: true
  - label: itch.io
    url: https://hutnerr.itch.io/massaquerade
    external: true
  - label: GitHub
    url: https://github.com/Rat-Haven-Studios/melon-jam-2025
    external: true
  - label: Rat Haven Studios
    url: https://rat-haven-studios.github.io/website/
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: game-jams/massaquerade1.png
    alt: Massaquerade masquerade ball scene
    portrait: false
  - file: game-jams/massaquerade-results.png
    alt: Massaquerade jam results
    portrait: false
---

## overview

Massaquerade is the third game built with a partner, for the Winter MelonJam 2025. The theme was "Mask." The player attends a masquerade ball as the murderer: talk to guests, collect clues, and identify the target. Wearing different masks unlocks different personalities and dialogue options, and each new piece of information can open up branches in conversations you've already had. Once you've decided who the target is, press M to strike.

The game ranked 36th overall out of 200 submissions, with 17th place in the Art category and 39th in Gameplay.

## how-it-works

Dialogue is driven entirely by JSON files — one file per character per mask. Each dialogue node defines the display text, response options, conditions required to show the option, flags to set when the option is chosen, and the next node to advance to. Conditions are evaluated against two scopes: `conversationState`, a dictionary local to the active conversation that accumulates flags set during the current exchange, and `Data.player.actionFlags`, the global persistent flag store that persists across all conversations.

The result is that choosing a response in one conversation can set a global flag that unlocks a new branch in an entirely different character's dialogue tree — the clue chain the player follows to identify the target. Suspicion is tracked as a global integer; dialogue nodes can check it against thresholds to reveal or hide information based on how much the player has already uncovered.

Because each character has a separate dialogue file per mask, swapping masks at the in-game mask rack literally changes which dialogue tree loads for that NPC — the same character can have a completely different conversation depending on which mask the player wears.

## challenges

Building a scalable dialogue system was the core technical challenge. A naive approach — writing dialogue state directly into scripts — would have made branching and authoring impossible to manage. The JSON tree format let dialogue content be written outside the code entirely, which was critical because in a jam the artist and programmer may not be the same person.

The two-scope flag system (local conversation vs. global) required careful design: local flags track what has been said in the current exchange (useful for preventing repeat questions), while global flags track what the player has learned across all interactions (useful for unlocking new branches after the fact). Getting the evaluation order right — check conditions, display options, then apply mutations — meant no flag changes could leak backward into the conditions that gated the current step.

The honest limitation of this jam was throughput. The main bottleneck was not systems but content: writing enough unique, coherent dialogue for multiple characters across multiple mask variants consumed most of the 72 hours. The game systems were solid; the game was smaller than planned because writing is slow.

## takeaways

The biggest learning was how much time narrative content takes relative to code. Systems that feel small to implement become enormous when multiplied by the number of characters, masks, and dialogue branches needed to make the mystery feel real. Some key takeaways:

- JSON-driven dialogue trees — separating content from logic for scriptable narrative systems
- Two-scope flag evaluation for local conversation state vs. global persistent state
- Designing for content throughput — how much dialogue can actually be written in 72 hours
- Branching narrative design — clue chains that reward exploration without requiring a walkthrough
