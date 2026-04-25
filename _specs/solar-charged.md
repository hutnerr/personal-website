---
title: "Solar Charged"
slug: solar-charged
tagline: a resource management tower defense game where energy is currency and health
og_description: A tower defense game for Kenny Jam 2025 built in Godot 4, where solar energy serves as both your resource pool and your health — run out and you lose.
og_image: game-jams/solar-charged-1.png

tech_stack:
  - Godot 4, GDScript — game engine and scripting
  - State machine — explicit StateMachine + State base classes managing 5 game states (MainMenu, Placing, Combat, Shop, Win, Lose)
  - HealthComponent — dual-purpose energy system; depletion triggers defeat, spending builds towers
  - Weather system — 4 weighted weather states (Rain 7%, Cloudy 15%, Normal 35%, Sunny 50%) affecting energy recovery rate
  - PathFollow2D — Godot built-in for enemy movement along pre-placed paths
  - Tower upgrade system — two independent upgrade tracks per tower, each with 3 levels

links:
  - label: Game Jam Page
    url: https://itch.io/jam/kenney-jam-2025/rate/3734468
    external: true
  - label: itch.io
    url: https://hutnerr.itch.io/solarcharged
    external: true
  - label: GitHub
    url: https://github.com/Rat-Haven-Studios/kenny-jam-2025
    external: true
  - label: Rat Haven Studios
    url: https://rat-haven-studios.github.io/website/
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: gifs/game-jams/solar-charged-clouds.gif
    alt: Solar Charged gameplay
    portrait: false
---

## overview

Solar Charged is a tower defense game built with a partner for the 2025 Kenny Game Jam. The theme was "Power." Energy acts as both currency and health: you spend it to place towers, towers cost upkeep while on the field (and more while actively shooting), and solar panels recharge it over time based on weather conditions. If your energy hits zero, you lose.

Tower types include a basic shooter, a piercing laser, an area damage tower, an energy buff tower that boosts adjacent towers, and a slow tower. Each has two independent upgrade tracks with three levels each.

## how-it-works

The game is divided into five explicit game states managed by a StateMachine class: MainMenu, Placing (drag-to-place towers), Combat (waves active), Shop (between waves), and Win/Lose. Each state is a separate class inheriting from a State base, with `enter()`, `exit()`, and `update()` methods. Transitions are triggered by events (wave cleared, energy depleted, shop confirmed) and the state machine calls the appropriate lifecycle hooks.

Energy is managed through a single HealthComponent shared between the currency and health systems. Tower placement deducts from it; passive and active upkeep drain it each tick; solar recovery adds back at a rate determined by the current weather. The weather cycle transitions between Rain, Cloudy, Normal, and Sunny states using weighted random selection, giving Sunny the highest probability (50%) and Rain the lowest (7%). Weather state determines the per-tick energy recovery multiplier.

Enemy movement uses PathFollow2D nodes along pre-authored paths. Tower targeting logic checks enemies within range and prioritizes by progress along the path, hitting the one closest to the end.

## challenges

The dual-purpose energy mechanic required a single source of truth that both the economy and the health system read from. Using one HealthComponent for both meant all UI, all drain calculations, and the lose condition all pointed at the same value — which eliminated sync bugs but required careful ordering of operations each tick (apply upkeep, apply recovery, check for depletion, then allow placement).

The two-track upgrade system per tower (for example, fire rate vs. damage, or range vs. pierce count) needed to be data-driven so towers could have distinct upgrade trees without duplicating logic. Each tower defines its upgrade data as a nested structure; the upgrade panel reads from it dynamically when a tower is selected.

Time management during the jam was the main regret — not enough time remained for balance passes and playtesting once core systems were in place.

## takeaways

The first game built with explicit state machines and component-based design rather than ad-hoc singletons. The difference in maintainability was immediately apparent. Some key takeaways:

- Explicit state machine pattern for game flow management across menus, gameplay phases, and outcomes
- Component-based design — HealthComponent as a reusable, single-responsibility node
- Weighted random state transitions for weather simulation
- Tower defense fundamentals: placement, upkeep, targeting, and wave spawning
- Balancing resource drain and recovery rates as a design problem, not just a tuning problem
