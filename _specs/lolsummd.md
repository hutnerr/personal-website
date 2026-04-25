---
title: "LOLSUMMD"
slug: lolsummd
tagline: aggregate League of Legends champion mastery across all your accounts
og_description: A web app that aggregates champion mastery across multiple League of Legends accounts, combining points and levels per champion using the Riot API and Redis caching.
og_image: projects/lolsummd.png

tech_stack:
  - Python, Flask — backend serving templates and handling form submissions
  - Redis via Upstash — serverless Redis for 24-hour mastery data caching with auto-indexed name lookup
  - Riot Games API — 14 regional endpoints across 4 continental platforms for summoner and mastery data
  - HTML, CSS, JavaScript — frontend with clipboard paste parsing, podium widget, and JSON export
  - Vercel — serverless deployment

links:
  - label: Live Site
    url: https://lolsummd.com
    external: true
  - label: GitHub
    url: https://github.com/hutnerr/lolsummd
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/lolsummd.png
    alt: LOLSUMMD champion mastery aggregator screenshot
    portrait: false
---

## overview

LOLSUMMD solves a specific problem for multi-account League of Legends players: champion mastery history is siloed per account, so your real total for a champion you've played across multiple accounts is invisible to the client. The app lets you add up to 10 accounts by Name#Tag, fetches mastery data for each via the Riot API, and sums points and levels per champion ID to produce a unified view.

Champions can be sorted by name, total mastery points, or combined level. The top three champions are displayed in a podium widget, and the full dataset can be exported as JSON.

## how-it-works

Account lookup uses a two-stage Riot API flow. The Name#Tag pair is resolved to a PUUID via the Account API on the appropriate continental platform, then the PUUID is used to fetch per-champion mastery records from the regional endpoint. Riot exposes 14 regional APIs across 4 continental platforms (Americas, Europe, Asia, SEA), and the app maps each region to its correct pair of endpoints.

Mastery aggregation is a straightforward reduce: iterate each account's mastery list, accumulate `{champion_id: {points: N, level: N}}` into a shared dictionary, and sort the result. The frontend parses clipboard paste input splitting on the `#` separator and submits the account list as a form POST.

API responses are cached in Redis with a 24-hour TTL. Two cache key namespaces are used: `cache:accounts:{puuid}` stores mastery data for a given account, and `cache:name_index:{username}#{tag}#{region}` stores the resolved PUUID so repeated lookups for the same summoner skip the account resolution call. Cache entries are auto-indexed on write so name-based lookups can hit the cache without re-resolving.

## challenges

The Riot API's regional structure is its own complexity. Different data types live at different endpoint tiers — summoner identity at the continental level, mastery at the regional level — and the correct pairing depends on the region the account was created in. Mapping all 14 regions to their continental platforms and ensuring each request hit the right base URL required building a lookup table and validating it against every region.

XSS prevention was a non-obvious concern for a frontend that renders user-supplied summoner names directly into the DOM. The JavaScript escapes all user-provided strings through an `escHtml()` helper before inserting them, treating every Riot API response as untrusted input even though it comes from a controlled source.

## takeaways

Building around a rate-limited, multi-tier external API forced careful design of the caching layer and request routing from the start. Some key takeaways:

- Multi-tier external API design — navigating regional and continental endpoint separation
- Redis caching strategy with TTL and multi-namespace key design
- Serverless deployment on Vercel with Flask as the backend framework
- XSS prevention for user-controlled content rendered in the DOM
