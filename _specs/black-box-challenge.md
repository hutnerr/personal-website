---
title: "Black Box Challenge"
slug: black-box-challenge
tagline: reverse-engineer mystery functions through a custom interpreter
og_description: A terminal-based coding game where players probe hidden functions and write code in a custom language to replicate their behavior.
og_image: projects/blackbox-challenge.png

tech_stack:
  - C#, .NET 9.0 — complete interpreter pipeline (lexer, parser, AST, evaluator)
  - Terminal.Gui 1.19.0 — cross-platform terminal UI with live code editing
  - Visitor pattern — separates evaluation and translation from AST node structure
  - Recursive descent parsing — 13 operator precedence levels derived from formal BNF grammar
  - Spectre.Console 0.53.0 — rich console output

links:
  - label: GitHub
    url: https://github.com/hutnerr/blackbox-challenge
    external: true

sections: [showcase, how-it-works, challenges, takeaways]

prism: true
prism_languages: [csharp]

showcase:
  - file: projects/blackbox-challenge.png
    alt: Black Box Challenge terminal UI screenshot
    portrait: false
---

## overview

The Black Box Challenge is a terminal-based coding puzzle built with a partner for CS 430. The player is presented with a hidden mystery function — they probe it by entering inputs and observing outputs, then write their own expression in a custom programming language to replicate the function's behavior. A side-by-side table shows expected vs. actual output on every run.

The project's core technical achievement is a complete interpreter pipeline built from scratch: a lexer that tokenizes source into 27 token types, a recursive descent parser enforcing 13 levels of operator precedence, a typed AST with 56 node classes, and a tree-walking evaluator. Terminal.Gui provides the live terminal UI with panels for input, code editing, and comparison output.

## how-it-works

When the app launches with a mystery function number, the corresponding `.txt` file is parsed into a reference AST. The UI presents input fields for up to three parameters and a code editor where the player writes their guess.

On Ctrl+R, two parallel evaluations happen: the user's code is lexed, parsed into its own AST, and evaluated with the entered parameter values bound as variables; the same values are fed into the pre-parsed reference AST. Both use the same `Evaluator`, which implements `IVisitor<IPrimitiveNode>` and walks each node recursively. The results are compared and displayed. The language supports integer and float arithmetic, boolean logic, bitwise operations, relational comparisons, string primitives, variables, blocks, and explicit type casts (`int()`, `float()`). All operators enforce strict type homogeneity — `5 + 5.0` is a type error; explicit casting is required.

## challenges

The most interesting design challenge was operator precedence. Rather than a runtime precedence table, the parser uses a 13-level hierarchy of `levelN()` methods, where each calls the next for higher-precedence operators. Left-associative operators loop; right-associative exponentiation recurses right instead of left.

### right-associative exponentiation

```csharp
private IAstNode level11NonTerminal()
{
    IAstNode left = level12NonTerminal();
    if (has(TokenType.EXPONENT))
    {
        advance();
        IAstNode right = level11NonTerminal(); // recurse right, not left
        left = new ExponentNode(left, right, ...);
    }
    return left;
}
```

The `-` token required context-sensitive disambiguation: the lexer always emits `SUBTRACTION_OR_NEGATION`, and the parser decides at the call site — in a unary context it becomes `NegationNode`, in a binary context it becomes `SubtractNode`. No backtracking required.

Short-circuit evaluation was implemented explicitly in the Evaluator: for `AndNode`, if the left operand evaluates to false, the right is never visited. This required making right-side evaluation conditional rather than eager, which the Visitor pattern made natural — calling `.Visit(this)` is deferred until needed.

## takeaways

Building a complete interpreter from a formal grammar illuminated how programming languages work at every layer. Some key takeaways:

- Lexer design and context-sensitive tokenization using lookahead characters
- Recursive descent parsing derived from BNF grammar with explicit operator precedence levels
- Visitor pattern to decouple evaluation, string translation, and future passes from AST node structure
- Managing operator associativity, strict type systems, and short-circuit semantics during evaluation
- Building interactive terminal UIs with Terminal.Gui
