---
title: "MadZip"
slug: madzip
tagline: file compression and decompression using Huffman coding
og_description: A Java file compression utility implementing Huffman coding from scratch, with a Swing GUI and up to 43% compression on text files.
og_image: projects/mad-zip.png

tech_stack:
  - Java 17, Swing — desktop GUI for file selection and compression statistics display
  - Huffman coding — custom implementation built from scratch for lossless compression
  - Data structures — HashMap for character frequency table, PriorityQueue<HuffTree> for tree construction
  - BitSequence — custom LSB-first bit packing for compact encoded output
  - Java serialization — HuffmanSave object written to .mz files to embed the tree alongside compressed data

links:
  - label: GitHub
    url: https://github.com/hutnerr/madzip
    external: true

sections: [showcase, how-it-works, takeaways]

prism: false
prism_languages: []

showcase:
  - file: projects/mad-zip.png
    alt: MadZip compression utility screenshot
    portrait: false
---

## overview

MadZip is a file compression utility that compresses and decompresses files using a custom Huffman coding implementation. Select a file through the Swing GUI, compress it to a `.mz` archive, and decompress it back to the original. After each operation the app displays compression statistics including original size, compressed size, and compression ratio — achieving up to 43% reduction on text files.

Built as an exercise in implementing a classical compression algorithm from the ground up rather than using a library.

## how-it-works

Compression starts by scanning the input file to build a character frequency table stored in a HashMap. The frequency map is loaded into a `PriorityQueue<HuffTree>` ordered by frequency, and the tree is constructed by `HuffTree.buildTree()`: repeatedly dequeue the two lowest-frequency nodes, merge them under a new internal node with their combined frequency, and re-enqueue until one root remains.

The encoding table is produced by recursively traversing the finished tree: left edges append "0" and right edges append "1", so each leaf (character) maps to a unique variable-length bit string. Shorter codes are assigned to higher-frequency characters, which is the source of the compression gain. The encoded bitstream is packed into a custom `BitSequence` using LSB-first packing to avoid alignment waste.

Decompression requires the original tree. Rather than re-encoding the tree structure separately, the `.mz` file format wraps a serialized `HuffmanSave` object using Java's built-in serialization — the tree and the compressed bytes are stored together. On open, the tree is deserialized and used to walk the bitstream back to the original characters.

## takeaways

Implementing Huffman coding from scratch made the algorithm concrete in a way that reading about it does not. Some key takeaways:

- End-to-end Huffman coding — frequency analysis, priority-queue tree construction, and encoding table derivation
- Bit-level I/O — LSB-first packing and the mechanics of reading sub-byte data from a byte stream
- Java serialization for self-contained binary file formats
- Data structure selection: why a priority queue is the right tool for incremental tree construction
