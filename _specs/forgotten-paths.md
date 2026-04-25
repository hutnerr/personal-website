---
title: "Forgotten Paths"
slug: forgotten-paths
tagline: a looping puzzle game built in 72 hours for GMTK 2025
og_description: A puzzle game for GMTK Game Jam 2025 where players program a robot with looping movement commands that execute in relative directions — built in 72 hours in Godot 4.
og_image: game-jams/fp1.png

tech_stack:
  - Godot 4, GDScript — game engine and scripting
  - Command pattern — 7 discrete command types (RIGHT/LEFT/UP/DOWN/ROTATE90/ROTATE180/ROTATE270) queued and executed sequentially
  - Relative direction transforms — matrix lookup converts absolute grid directions to robot-relative movement after rotation
  - Gridleton — global spatial index singleton for O(1) grid cell occupancy lookup
  - Loop cancellation — incrementing currentLoopId invalidates in-flight coroutines without explicit cancellation

links:
  - label: Game Jam Page
    url: https://itch.io/jam/gmtk-2025/rate/3778927
    external: true
  - label: itch.io
    url: https://hutnerr.itch.io/forgotten-paths
    external: true
  - label: GitHub
    url: https://github.com/Rat-Haven-Studios/gmtk-jam-2025
    external: true
  - label: Rat Haven Studios
    url: https://rat-haven-studios.github.io/website/
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: gifs/game-jams/fp.gif
    alt: Forgotten Paths gameplay loop
    portrait: false
  - file: game-jams/fp2.png
    alt: Forgotten Paths level screenshot
    portrait: false
  - file: game-jams/fp4.png
    alt: Forgotten Paths puzzle screenshot
    portrait: false
  - file: game-jams/forgotten-paths-results.png
    alt: Forgotten Paths jam results
    portrait: false
---

## overview

Forgotten Paths is the second game built with a partner, this time for GMTK 2025. The jam theme was "Loop." The player programs a robot with a sequence of movement commands — RIGHT, LEFT, UP, DOWN, and three rotation variants — and those commands execute repeatedly in a loop until the robot stops manually or clears the level by defeating all enemies. To win each level, all enemies must be slain.

The game ranked highly out of over 9,500 submissions in the jam, an impressive result for a second-ever game. You can play it directly on itch.io or via the embed on the project page.

## how-it-works

The robot's behavior is entirely driven by a command queue. The player selects up to several commands from the available set, then hits play. Each command is a discrete type: movement commands (RIGHT/LEFT/UP/DOWN) and rotation commands (ROTATE90/ROTATE180/ROTATE270). The robot executes them one at a time in sequence, then starts over from the first.

The rotation commands change the robot's facing direction, which affects how subsequent movement commands are interpreted. A direction transform lookup maps each absolute grid direction (UP/DOWN/LEFT/RIGHT) to the correct grid offset given the robot's current facing — so if the robot is rotated 90 degrees clockwise, a "UP" command moves it in the direction that is now "forward" from its perspective. This makes multi-step sequences with rotations non-trivially puzzling.

Grid objects (the robot, enemies, walls) are registered with a global singleton called Gridleton, which maintains a Dictionary mapping grid coordinates to objects. This gives O(1) occupancy lookup for movement validation and collision detection without scanning all objects. A separate Dictionary tracks defeated enemies so the same enemy cannot be killed twice if the loop revisits its cell.

## challenges

The trickiest implementation problem was canceling an in-flight command loop cleanly. When the player presses stop mid-execution, the current loop of coroutines needs to halt immediately — but GDScript coroutines cannot be canceled once started. The solution uses a `currentLoopId` integer that is incremented each time a new loop begins. Each coroutine captures the loop ID at start and checks after every yield whether its captured ID still matches the current one; if not, it exits silently. This makes stale coroutines self-terminate without any reference tracking or explicit cancellation API.

The relative direction system required careful thought. Players think in absolute terms ("move up"), but the commands execute relative to the robot's facing after rotations are applied. Getting the transform table right — and making it readable enough to debug — was a small but non-trivial design task.

UI was a personal focus during this jam. Conveying the command queue state, the robot's current action, and the loop status simultaneously required iteration. Having essentials like a settings menu and a quit button in place early (a lesson from the previous jam) left more time for this polish.

## takeaways

Building a puzzle game where the challenge comes from compositional command sequences — not from twitch skill — required thinking carefully about what the player sees and understands at each moment. Some key takeaways:

- Command pattern for queued, sequential game actions with loop semantics
- Coroutine lifetime management via ID invalidation as an alternative to explicit cancellation
- Global spatial indexing with a singleton registry for O(1) grid lookup
- Puzzle game UI design — communicating system state without overloading the player
- Scope discipline in a jam: essentials first, polish second
