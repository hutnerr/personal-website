---
title: "Pantry Panic"
slug: pantry-panic
tagline: a recipe finder for ingredients you already have
og_description: A group web project that searches the Spoonacular API for recipes based on ingredients in your pantry, with saved recipes and blob-based import/export.
og_image: projects/pantry-panic.png

tech_stack:
  - HTML, CSS, JavaScript — frontend-only single-page application
  - Spoonacular API — two-stage search: findByIngredients then informationBulk for full recipe details
  - localStorage — persists pantry items (CSV string), checkbox states (JSON), and saved recipe IDs (array)
  - Blob API — pantry import/export as downloadable files
  - APIACTIVE kill switch — boolean flag disables all API calls for local development without key

links:
  - label: GitHub
    url: https://github.com/hutnerr/pantry-panic
    external: true
  - label: Demo
    url: https://hutnerr.github.io/pantry-panic/search_by_ingredients.html
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/pantry-panic.png
    alt: Pantry Panic recipe search screenshot
    portrait: false
---

## overview

Pantry Panic is a group web development project. It lets you build a virtual pantry of ingredients you have on hand, then searches for recipes you can actually make with them. My primary role was the backend integration — wiring up the Spoonacular API and managing data flow between the API responses and the frontend state.

The project is currently non-functional because the Spoonacular API service was cancelled. The demo links to a personal fork.

## how-it-works

Recipe search uses a two-stage API flow. The first call hits `findByIngredients` with the pantry list and returns a ranked list of matching recipes along with how many ingredients each recipe uses vs. misses. The second call hits `informationBulk` with the result IDs to fetch full recipe details — title, image, instructions, nutrition — for display.

Pantry state is stored in `localStorage` across three keys: `'pantry'` as a CSV string of ingredient names, `'pantryCheckboxes'` as a JSON object tracking which ingredients are checked for the current search, and `'savedRecipes'` as an array of recipe IDs the user has bookmarked. This means state survives page reloads without any server-side storage.

The Blob API handles pantry import and export: export serializes the current pantry list to a text file the browser downloads, and import reads an uploaded file back into state. An `APIACTIVE` boolean flag at the top of the integration code disables all outbound API calls during local development, allowing UI work without consuming API quota or requiring a live key.

## challenges

The two-stage API design was driven by Spoonacular's endpoint structure rather than preference. `findByIngredients` is fast but returns minimal data; `informationBulk` returns everything but requires IDs. Coordinating the two calls — handling the case where the first returns no results, the second fails for some IDs, or the API quota is hit — required explicit error states for each stage rather than treating the whole flow as a single operation.

Working in a group on a frontend-only codebase meant merge conflicts were frequent: everyone was editing the same HTML and CSS files. Establishing which person owned which file sections early would have prevented most of them.

## takeaways

First time integrating a third-party REST API — it taught a lot about the gap between reading documentation and handling production edge cases. Some key takeaways:

- REST API integration with async JavaScript — fetch, promise chaining, and staged error handling
- localStorage as a persistence layer for frontend state across three independent keys
- Blob API for client-side file import/export without a server
- Group coordination — communication prevents most merge conflicts and missed dependencies
