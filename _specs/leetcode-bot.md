---
title: "beast[code]"
slug: leetcode-bot
tagline: a Discord bot that tracks LeetCode progress and runs server competitions
og_description: A Discord bot that tracks LeetCode submissions, scores server members by difficulty, and delivers scheduled problems via a 7×96 time-bucket scheduling grid.
og_image: beastcode-walkthrough/beastcode-logo.png

tech_stack:
  - Python — Discord.py for bot framework, Aiohttp for async HTTP
  - GraphQL — 6 query types against LeetCode's API (submissions, problems, user stats, contest data)
  - Requests, markdownify, pytz — sync HTTP, HTML-to-markdown conversion, timezone-aware scheduling
  - Mediator pattern — Synchronizer coordinates atomic updates across in-memory cache and JSON file storage
  - Time-bucket scheduling — 7×96 grid (7 days × 96 fifteen-minute slots) drives all timed problem delivery and notifications
  - Per-server JSON persistence — all user and server state serialized to flat files keyed by server ID

links:
  - label: GitHub
    url: https://github.com/hutnerr/leetcode-bot
    external: true
  - label: Add to Server
    url: https://discord.com/oauth2/authorize?client_id=1392738606120173719&permissions=2147616768&integration_type=0&scope=bot
    external: true
  - label: Top.gg
    url: https://top.gg/bot/1392738606120173719
    external: true
  - label: Help Page
    url: /pages/other/beastcode-help.html
    external: false

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/leetcode-bot.png
    alt: beast[code] Discord Bot Screenshot
    portrait: false
---

## overview

beast[code] is a Discord bot that turns a server into a LeetCode practice environment. Server admins configure a recurring problem schedule; users link their LeetCode accounts, submit solutions, and earn points weighted by difficulty — Easy=1, Medium=3, Hard=6. A live leaderboard tracks standings per server.

As a live service product it is continuously evolving. What started as a straightforward scheduling bot grew into a full data management system as requirements expanded to cover contest reminders, problem history, per-user submission tracking, and configurable server settings.

## how-it-works

The bot uses a 7×96 time-bucket grid — seven days, each divided into 96 fifteen-minute slots — to represent the schedule. When an admin sets a problem delivery time, it is mapped to the corresponding bucket. A background loop runs every minute, checks the current time against populated buckets, and fires any due notifications. This avoids polling individual timers and makes the schedule trivially serializable.

All data lives in per-server and per-user JSON files. Fetching LeetCode data goes through 6 GraphQL query types targeting LeetCode's private API, with 3x retry logic and exponential backoff (2^attempt seconds between retries) to handle rate limits and transient failures. Problem keys are stored in the format `serverID::problemID` to namespace them across servers.

User accounts are linked by mapping Discord user IDs to LeetCode usernames. When the bot checks for new submissions, it queries the recent submission list and compares against the set of problems issued to the server, then awards points for first solves.

## challenges

The largest challenge was storage consistency. The initial approach read from and wrote to JSON files on every operation — slow, and a concurrency hazard. I switched to an in-memory cache backed by JSON persistence, but this introduced a new problem: cache and disk could diverge if an operation failed between the two writes. The solution was a Synchronizer that wraps every state-mutating operation: it takes a `copy.deepcopy` backup of the in-memory state before any change, writes both layers, and rolls back to the backup if either step fails. This made state transitions atomic in practice.

Scheduling delivery correctly was harder than expected. The time-bucket design solved the "when to fire" problem cleanly, but getting notifications to land in the right channel, with the right problem content, for the right users, required careful coordination between server config, user config, and the LeetCode API response. I built this as a backend core first and integrated Discord second — but still found gaps mid-integration that required back-tracking and rethinking several data models.

## takeaways

Building and maintaining a live service product sharpened my understanding of system design, planning, and the real cost of shortcuts. Some key takeaways:

- Designing and shipping a complete live service product end to end
- Cache/storage consistency as a first-class design concern, not an afterthought
- GraphQL query design and retry/backoff strategies against rate-limited APIs
- Value of upfront planning — gaps discovered mid-integration are expensive to patch
- Maintaining and iterating on a deployed product over time
