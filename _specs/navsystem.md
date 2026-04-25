---
title: "Navigation System"
slug: navsystem
tagline: a real-time GPS navigation system with two routing algorithms
og_description: A Java navigation system that reads live GPGGA serial data from a USB GPS receiver, builds a road graph, and routes using both Dijkstra's and Bellman-Ford algorithms.
og_image: gifs/projects/navsys.gif

tech_stack:
  - Java 17, Swing — desktop GUI with live-updating map display
  - jSerialComm 2.11.0 — serial port communication for USB GPS hardware
  - GPGGA parsing — converts DDmm.mm NMEA format to decimal degrees for coordinate math
  - Dijkstra's (Label Setting) — with PermanentLabelBuckets optimization using 1km-width bucket bins for fast minimum extraction
  - Bellman-Ford (Label Correcting) — with early termination for graphs with no negative edges; supports comparison against Dijkstra's
  - SwingWorker — background GPS read thread publishes position updates to the Swing EDT without blocking
  - Observer, MVC, Strategy patterns — GPS data flow, display separation, and interchangeable routing algorithm selection

links:
  - label: GitHub
    url: https://github.com/hutnerr/navsystem
    external: true
  - label: Design Doc
    url: /resources/images/projects/navsystemdesign.svg
    external: false

sections: [showcase, how-it-works, challenges, takeaways]

prism: false
prism_languages: []

showcase:
  - file: gifs/projects/navsys.gif
    alt: NavSys real-time navigation demo
    portrait: false
  - file: projects/navsystemdesign.svg
    alt: NavSys system design document
    portrait: false
---

## overview

NavSys is a Java desktop application that turns a USB satellite receiver into a working navigation system. It reads raw NMEA GPGGA sentences from the serial port, parses the coordinate data, and displays live position on a map rendered in Swing. Setting a destination triggers route calculation using either Dijkstra's or Bellman-Ford on a graph of road nodes, with automatic rerouting if the current position drifts off the calculated path.

Built for CS coursework, but the scope — GPS hardware integration, real-time threading, graph pathfinding, and reroute detection — went well beyond typical academic assignments.

## how-it-works

GPS data arrives continuously on the serial port via jSerialComm. A `GPSReaderTask` extends `SwingWorker`, running the read loop on a background thread and publishing parsed coordinates to the Swing Event Dispatch Thread via `publish()`/`process()`. This keeps the UI responsive while handling a continuous byte stream.

Each GPGGA sentence encodes latitude and longitude in DDmm.mm format (degrees plus decimal minutes). The parser converts this to decimal degrees for all downstream math. The road network is stored as an adjacency list graph; each node is a GPS coordinate and each edge has a distance weight.

Route calculation runs the selected algorithm (Strategy pattern, swappable at runtime) from the current position to the destination. The Label Setting Algorithm (Dijkstra's) uses `PermanentLabelBuckets` — buckets of 1km width — instead of a standard priority queue. Nodes are partitioned into buckets by tentative distance and the minimum is found by scanning only the current bucket, reducing overhead for dense urban graphs. The Label Correcting Algorithm (Bellman-Ford) runs with early termination: if a full pass makes no relaxations, it exits before completing all iterations.

Off-route detection uses point-to-segment distance with dot product projection to find the closest point on each road segment to the current GPS position. If the nearest segment is farther than a threshold, rerouting triggers. The reroute implementation pre-computes all shortest paths from the destination rather than the source, so any new source position finds its path in O(P) time (path length) rather than rerunning the full algorithm.

## challenges

The biggest challenge going in was that I knew nothing about GPS technology. I learned about satellite receivers, NMEA sentence formats, and coordinate systems while simultaneously building the parser and integration layer — each piece of new knowledge revealed a new assumption in the code that needed fixing.

Real-time performance was the central technical constraint. GPS data arrives continuously and must not block the UI thread. The `SwingWorker` producer/consumer model solved this cleanly: the background thread reads and parses, then hands coordinate updates to the EDT through the framework's built-in handoff mechanism. This pattern also made the Observer chain from GPS → map display → route update straightforward to wire up without manual thread synchronization.

The rerouting problem looked like "just run the algorithm again" but has a hidden cost: the source changes on every reroute, so a source-rooted shortest path tree becomes stale immediately. Pre-computing the all-shortest-paths tree from the destination inverts the direction and makes rerouting a simple lookup regardless of where the current position is.

## takeaways

This project spanned hardware integration, real-time data processing, and algorithm implementation — a much broader scope than typical coursework. Some key takeaways:

- GPS hardware integration and NMEA sentence parsing from raw serial data
- Multithreaded GUI design — SwingWorker producer/consumer for smooth real-time updates
- Dijkstra's with bucket-based priority for dense graph optimization
- Bellman-Ford with early termination and its trade-offs vs. Dijkstra's
- Pre-computing destination-rooted path trees for O(P) rerouting
- MVC, Observer, and Strategy patterns applied to a real-time system
