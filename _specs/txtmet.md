---
title: "TXTMET"
slug: txtmet
tagline: a command-line text metric utility implemented in both C and Rust
og_description: A lightweight CLI tool that counts words, sentences, paragraphs, and unique words in a text file — implemented independently in both C and Rust as a language comparison exercise.
og_image: my_rat_pfp_nobg.png

tech_stack:
  - C (standard library, getopt) — streaming fgetc character processing with lastc state tracking for word and sentence detection
  - Rust (standard library) — fs::read_to_string with in_word boolean state and match arms for the same counting logic
  - getopt — Unix-style CLI flag parsing in the C version for selecting which metrics to output

links:
  - label: GitHub
    url: https://github.com/hutnerr/txtmet
    external: true

sections: [how-it-works, challenges, takeaways]

prism: false
prism_languages: []
---

## overview

TXTMET is a lightweight CLI tool that reads a text file and outputs word count, character count, line count, sentence count, or unique word count depending on which flags are passed. Born out of frustration with tools that are either too heavy or not flexible enough for simple counting tasks.

The same utility is implemented independently in both C and Rust. The implementations are intentionally parallel — same algorithm, same metrics, two languages — making the differences in idiom and safety model visible side by side.

## how-it-works

Both implementations use the same core logic for all metrics. Word detection tracks a boolean state (`lastc` in C, `in_word` in Rust): a transition from non-whitespace to whitespace increments the word counter. Sentence detection counts terminal punctuation characters (`.`, `!`, `?`) — every punctuation mark is counted, so run-on sentences and ellipses are treated naively.

The C version processes the file one character at a time via `fgetc`, keeping memory usage flat regardless of file size. It uses `getopt` for Unix-style flag parsing, so flags can be combined freely. The Rust version reads the entire file into a string with `fs::read_to_string` and iterates over characters with `match` arms for the state transitions, relying on Rust's ownership model to guarantee the buffer is freed at scope exit.

Test files include short samples (1.txt, 7.txt, 10.txt) and a longer text (misery.txt, 1755 words) for comparison against known counts.

## challenges

The main implementation challenge in C was sentence detection: a naive count of `.` characters overcounts abbreviations, ellipses, and decimal numbers. The implementation counts all punctuation rather than attempting heuristic disambiguation — a deliberate simplification. Getting the same behavior exactly in Rust required writing the match arm logic to match the C `lastc` state machine rather than using Rust's higher-level string methods, which behave slightly differently on boundary conditions.

Implementing the same utility twice also surfaces the points where the languages diverge most visibly: C requires explicit buffer management and exit-condition handling in `fgetc`; Rust's `chars()` iterator is safe by default and the match arms are pattern-exhaustive. The gap in defensive boilerplate is measurable across the two files.

## takeaways

Implementing the same utility in two languages side by side makes idiomatic differences concrete rather than abstract. Some key takeaways:

- C file I/O — streaming fgetc processing and getopt flag parsing
- Rust ownership model and pattern matching for the same byte-level logic
- State machine character processing — tracking transitions rather than scanning for delimiters
- The practical difference in defensive boilerplate between C and Rust for the same task
