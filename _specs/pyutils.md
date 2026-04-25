---
title: "Python Utilities"
slug: pyutils
tagline: a personal Python utility library for logging, error handling, and common helpers
og_description: A personal Python utility library installable via pip, featuring Clogger for structured logging with stack frame inspection, Rust-inspired Option/Result types, and common helpers.
og_image: my_rat_pfp_nobg.png

tech_stack:
  - Python 3.8+ — colorama for terminal colors, python-dotenv for env loading, requests for HTTP
  - Clogger — static logger with stack frame inspection for automatic source file/line tracking
  - Clogobj — instance-based logger with module name tagging, log_errors decorator, and factory presets
  - Option, Result — Rust-inspired types using a _MISSING sentinel to distinguish Some(None) from None
  - setuptools, pyproject.toml — pip-installable directly from GitHub, version 1.0.4

links:
  - label: GitHub
    url: https://github.com/hutnerr/python-utils
    external: true

sections: [how-it-works, challenges, takeaways]

prism: true
prism_languages: [python]
---

## overview

A personal Python utility library collecting helpers I reach for repeatedly across projects. Rather than copying the same code every time, it's packaged for installation directly from GitHub via pip. Covers structured logging, typed null/error handling, environment variable access, and HTTP response validation. MIT licensed.

## how-it-works

Clogger is the library's main component — a static logger that produces structured, colored output with timestamps, log levels, and automatic source file and line number tracking. Source tracking uses Python's `inspect` module to walk the call stack at log time and extract the caller's filename and line number, so `Clogger.info("message")` prints the file and line that called it, not the logger internals.

Twelve config settings control behavior: minimum log level, color toggle, timestamp format, source file display, file write mode, and more. A `CloggerConfig` object is swapped on `Clogger.config` to change global behavior. `CloggerOverrideFactory` generates per-call override dicts that layer on top of the global config for a single log statement — `verbose()`, `file_only("path")`, `pretty()`, and `combine()` for merging multiple overrides.

`Clogobj` provides the same capabilities but as instances rather than a global. `ClogobjFactory` has presets: `verbose()`, `silent()` (useful in tests), `file_only()`, `for_module()` (prepends a name to every line), `for_file()`, and `custom()`. Instance loggers have a `log_errors` decorator that automatically routes exceptions through the logger when applied to a function.

`Option` and `Result` bring Rust-style explicit null and error handling to Python. The core challenge these types solve is distinguishing "no value was provided" from "the value is None": `Option.some(None)` is a valid present value, distinct from `Option.none()`. This is implemented via a module-level `_MISSING` sentinel object; the internal `_value` field is set to `_MISSING` for the absent case, which is the only value that `bool()` returns `False` for. `Result` uses an explicit `_is_ok` boolean rather than checking the type of the wrapped value, so `Result.ok(None)` and `Result.err(None)` are both valid and unambiguous.

## challenges

The `_MISSING` sentinel pattern for `Option` required careful thought. Python's `None` is the natural "no value" representation, but `Option.some(None)` should be a distinct state from `Option.none()` — the whole point of the type is to make absence explicit. Using a private sentinel object that is never exposed outside the module means there is no valid input that collides with it: `Option.some(None)` stores `None` in `_value`, and `Option.none()` stores `_MISSING`. The `bool()` coercion, equality checks, and `unwrap` all dispatch on whether `_value is _MISSING`, not on whether it is falsy.

Stack frame inspection for source tracking has a fixed offset problem: the number of stack frames between the log call site and the `inspect.stack()` call inside the logger depends on how many internal methods are in between. Getting the offset right required counting frames through the `make_log` factory case (which adds a wrapper frame) vs. the direct call case (which does not). The two cases need different offsets, handled by passing the frame depth as a parameter through the call chain.

## takeaways

Building a library you actually use in other projects gives immediate feedback on API design quality. Some key takeaways:

- Stack frame inspection with the `inspect` module for automatic source attribution in logging
- Sentinel object pattern to distinguish Some(None) from None in an Option type
- Python package structure with pyproject.toml and direct GitHub pip installation
- API design for layered configuration — global defaults, instance overrides, and per-call overrides
- log_errors decorator pattern for automatic exception routing through a logger instance
