---
title: "ToneForge"
slug: tone-forge
tagline: a text lingo conversion REST API powered by Gemini
og_description: A Spring Boot REST API that uses Google's Gemini model to rewrite input text in themed tones — Pirate, Medieval, Shakespeare, and Toddler — with per-IP rate limiting and Docker deployment on AWS EC2.
og_image: my_rat_pfp_nobg.png

tech_stack:
  - Java 17, Spring Boot 4.0.5 — REST API with Spring MVC controllers and HandlerInterceptor
  - google-genai 1.46.0 — Google Gemini API for contextual text rewriting
  - Strategy pattern + enum registry — each tone is a Strategy implementation registered in a TONE_MAP; selecting a tone by name resolves to its prompt at runtime
  - Rate limiter — ConcurrentHashMap + HandlerInterceptor tracking 2 requests/min per IP using immutable RequestInfo records
  - Docker multi-stage build — compile and package stage separate from runtime image for smaller deployment artifact
  - AWS EC2 — public hosting

links:
  - label: GitHub
    url: https://github.com/hutnerr/tone-forge
    external: true
  - label: Live API
    url: http://52.207.146.61/api/strategies
    external: true

sections: [how-it-works, endpoints, usage, challenges, takeaways]

prism: true
prism_languages: [json, javascript]
---

## overview

ToneForge is a public REST API that converts text into specific lingos using AI. Send a string and a tone name — Pirate, Medieval, Shakespeare, or Toddler — and the API returns the text rewritten in that style using Google's Gemini model. The conversion is contextual rather than a word-swap, so the result reads naturally in the target tone.

Rate limits are strict because both Gemini and the EC2 instance are on free tiers. Started as a personal experiment with Spring Boot and the Gemini SDK, made public for anyone to build on top of.

## how-it-works

Each tone is implemented as a Strategy: a class that holds the tone-specific prompt template used to instruct Gemini. All tones register themselves in a static TONE_MAP keyed by name string. When a `/api/convert` request arrives, the controller looks up the tone by name from the map, constructs the prompt, and sends it to Gemini. This means adding a new tone requires only a new Strategy class and a map entry — no controller changes.

The Gemini response goes through explicit safety checking before being returned: the code inspects the finish reason and handles `SAFETY`, `RECITATION`, `MAX_TOKENS`, `STOP`, and empty-response cases separately, returning an appropriate error field in the JSON response rather than letting unexpected cases propagate as 500s.

Rate limiting is enforced by a `HandlerInterceptor` that runs before every request. It stores a `RequestInfo` record (count, window start timestamp) per IP address in a `ConcurrentHashMap`. On each request, it checks whether the count in the current 60-second window exceeds 2; if so, it returns 429 immediately. The `RequestInfo` type is immutable — each update creates a new record rather than mutating in place, which avoids race conditions on the map update.

Input is capped at 5000 characters. The API is open — no authentication required.

## endpoints

Two open endpoints, no authentication required:

- **GET** `/api/strategies` — returns a list of all available tone names
- **POST** `/api/convert` — converts text to the specified tone

## usage

Send a `POST` to `http://52.207.146.61/api/convert` with a JSON body:

### request

```json
{
    "strategy": "Pirate",
    "text": "Hello, Friend"
}
```

### response

```json
{
    "original": "Hello, Friend",
    "converted": "Ahoy Matey!",
    "lingo": "Pirate",
    "error": null
}
```

### javascript example

```javascript
const response = await fetch(
    `http://52.207.146.61/api/convert`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy, text })
    }
);
```

## challenges

The rate limiter design required care around concurrency. A mutable counter per IP in a `ConcurrentHashMap` has a check-then-act race: two requests arriving simultaneously could both read a count below the limit and both proceed. Using an immutable `RequestInfo` record and replacing the map entry atomically via `compute()` eliminates this race — the lambda passed to `compute()` runs with the map's internal lock held, so only one thread can update a given key at a time.

Response parsing from Gemini required handling more cases than the happy path. The API can return a valid HTTP 200 with a response that is still unusable: a safety block, a recitation block, a max-tokens truncation, or an empty candidates list. Treating all of these as a single "conversion failed" case would lose information the caller might need. The implementation maps each finish reason to a distinct error string in the response JSON, letting callers distinguish "blocked by safety filter" from "text was too long."

## takeaways

Building a deployed public API on a free-tier stack forced practical decisions around rate limiting, error handling, and deployment size. Some key takeaways:

- Spring Boot REST API design with HandlerInterceptor for cross-cutting concerns
- Strategy pattern + enum registry for extensible tone selection without controller coupling
- Concurrency-safe rate limiting with ConcurrentHashMap and immutable value records
- Gemini API integration — finish reason handling for all non-happy-path response cases
- Docker multi-stage build for minimal runtime image size
- AWS EC2 deployment and public API hosting
