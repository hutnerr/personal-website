---
title: "UnitED"
slug: united-calculator
tagline: a team-built unit conversion calculator
og_description: A collaborative Java unit conversion calculator built with a 5-person team using Scrum methodology, featuring custom unit creation, JUnit cross-product testing, and a Strategy-based operator design.
og_image: projects/united.png

tech_stack:
  - Java, Swing — desktop GUI built collaboratively across a 5-person team
  - Unit interface — base-unit conversion formula (value * from.factor / to.factor) with enum implementations for Length, Time, Weight, Volume, Power, and Money
  - BinaryOperator enum — Strategy pattern with evaluate() method for arithmetic operations between unit values
  - Operand Java record — immutable value-type pairing a numeric value with its unit
  - JUnit 5 — cross-product tests covering all unit-to-unit conversions for 4 unit type groups
  - Scrum — agile development methodology with sprint planning and a task board

links:
  - label: GitHub
    url: https://github.com/hutnerr/united
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/united.png
    alt: UnitED Calculator screenshot
    portrait: false
---

## overview

A collaborative software engineering project: a fully functional unit conversion calculator built in Java with a 5-person team using Scrum methodology. Features unit conversions across six categories (Length, Time, Weight, Volume, Power, Money), custom unit creation with CSV persistence, calculation history, and a help section.

My primary focus was the conversion engine and GUI components. The project emphasized collaborative development practices — version control, task assignment via Scrum board, and iterative delivery over multiple sprints.

## how-it-works

Each unit category is implemented as a Java enum that implements a common `Unit` interface. Every enum constant defines a `factor` — its magnitude relative to the category's base unit. Conversion between any two units in a category uses a single formula: `value * from.factor / to.factor`. For example, Length uses millimeters as the base (factor 1), so converting 1 foot (factor 304.8) to centimeters (factor 10) computes `1 * 304.8 / 10 = 30.48`.

Arithmetic between unit values goes through a `BinaryOperator` enum that implements the Strategy pattern: each operator (`ADD`, `SUBTRACT`, `MULTIPLY`, `DIVIDE`) has an `evaluate()` method that takes two `Operand` values. `Operand` is a Java record — an immutable value type pairing a number with its unit — which makes operator input/output explicit and prevents accidental mutation.

Custom units are defined by the user and persisted as CSV entries. JUnit 5 tests cover all unit-to-unit conversions for four of the six unit types, organized as cross-product test cases: every unit converted to every other unit in the same category.

## challenges

Most of my personal challenges came from working in a team at this scale for the first time. Three friction areas stood out.

Version control was the first: several team members were new to Git, which led to merge conflicts and lost work early on. Running a short training session helped, but merge issues surfaced throughout the project. The lesson was that Git fluency across the whole team needs to be established before the first commit, not treated as something people can figure out as they go.

Task dependencies caused stalls when upstream work slipped. If the component one person was building blocked three others, progress halted. We adjusted by restructuring assignments to minimize hard dependencies — where possible, people worked on self-contained modules rather than features that required another feature to exist first.

Design consistency suffered because decisions were distributed without a shared conversation. UI choices made independently by different people resulted in an inconsistent look and feel. The codebase also accumulated style divergence over time. Looking back, design should have been a standing agenda item across sprints, not assumed to converge naturally.

## takeaways

Team projects have a different failure mode than solo work. Technical debt accumulates faster when design decisions are distributed without coordination. Some key takeaways:

- Unit conversion engine design with a base-unit factor model and a single shared formula
- Strategy pattern via BinaryOperator enum for extensible arithmetic operations
- Java records as immutable value types for operand representation
- JUnit 5 cross-product test organization for exhaustive unit conversion coverage
- Team version control — Git fluency is a prerequisite, not an assumed skill
- Scrum in practice — sprint planning, task boards, and coordinating dependencies across people
