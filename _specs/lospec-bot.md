---
title: "Lospec Daily Bot"
slug: lospec-bot
tagline: daily pixel art palette posts from Lospec to your Discord server
og_description: A Discord bot that scrapes and posts the daily pixel art palette from Lospec.com to subscribed servers every morning at 8 AM EST.
og_image: projects/lospec-bot-ss.png

tech_stack:
  - Python — Discord.py for bot framework, Aiohttp for async HTTP requests
  - BeautifulSoup4 — HTML parsing of Lospec.com palette pages to extract daily palette slug and metadata
  - Per-server JSON persistence — subscription config stored in data/servers/{serverID}.json
  - Polling loop — 1-minute interval checks current time against 8 AM EST delivery target

links:
  - label: GitHub
    url: https://github.com/hutnerr/lospec-daily-bot
    external: true
  - label: Add to Server
    url: https://discord.com/oauth2/authorize?client_id=1457439367500009597&permissions=2147485696&integration_type=0&scope=bot
    external: true
  - label: Top.gg
    url: https://top.gg/bot/1457439367500009597
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/lospec-bot-ss.png
    alt: Lospec Daily Bot Discord screenshot
    portrait: false
---

## overview

A Discord bot that posts the daily pixel art palette from Lospec.com to any subscribed server channel every morning at 8 AM EST. It's designed for pixel art communities that want a daily creative prompt delivered automatically — no manual checking, no copy-pasting links. Not affiliated with Lospec.

Originally built for personal use and made public once it felt polished enough that others might find it useful.

## how-it-works

A background loop polls once per minute and compares the current time (in EST) against the 8 AM delivery window. When the window opens, the bot fetches the Lospec dailies page (`lospec.com/dailies/`) and uses BeautifulSoup4 to locate the `div.daily.tag` and `div.daily.palette` elements, extracting the palette slug and display metadata from the page HTML. The palette image is constructed from the CDN URL pattern `https://cdn.lospec.com/thumbnails/palette-list/{slug}-social.png`.

Per-server configuration is stored in individual JSON files under `data/servers/{serverID}.json`. Each file records the subscribed channel ID, the bot's enabled/disabled state for that server, and delivery preferences. The bot exposes 6 slash commands for server admins to configure the channel, toggle posting, and check current settings.

## challenges

Scraping Lospec requires treating the site's HTML as an external dependency — class names and structure can change without notice. The parser targets specific CSS selectors (`div.daily.tag`, `div.daily.palette`) rather than brittle positional indexing, which gives some resilience to layout changes around those elements.

Delivery timing with a polling loop rather than scheduled callbacks meant handling the edge case where the bot restarts mid-day: if the daily has already been posted for the day (tracked in state), a late restart should not re-send. Per-server state tracks whether today's palette has already been delivered, preventing duplicate posts on restart.

## takeaways

A small project, but it shipped and runs. The main value was building the full cycle: scraping, state management, slash commands, and deployment. Some key takeaways:

- Web scraping with BeautifulSoup4 — targeting stable selectors over positional parsing
- Per-server bot configuration with JSON persistence
- Discord slash command registration and interaction handling with Discord.py
- Edge case handling for stateful scheduled delivery (restart safety, duplicate prevention)
