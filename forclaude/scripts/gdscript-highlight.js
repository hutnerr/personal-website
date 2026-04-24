(function () {
  var KEYWORDS = new Set([
    'func', 'var', 'const', 'class_name', 'extends', 'return',
    'if', 'else', 'elif', 'for', 'while', 'match', 'pass', 'break',
    'continue', 'and', 'or', 'not', 'in', 'is', 'as', 'null',
    'true', 'false', 'self', 'signal', 'static', 'enum',
    'preload', 'load', 'class', 'await', 'yield', 'super', 'void',
    'new', 'range', 'print'
  ]);

  var BUILTIN_TYPES = new Set([
    'int', 'float', 'bool', 'String', 'Array', 'Dictionary',
    'Vector2', 'Vector2i', 'Vector3', 'Vector3i', 'Color',
    'Node', 'Object', 'Resource', 'Callable', 'Signal',
    'Variant', 'StringName', 'NodePath',
    'GameEvent', 'GameOverEvent', 'Command', 'Entity', 'Player',
    'SimResult', 'GridManager', 'MapData', 'BattleEngine',
    'MoveCommand', 'RotateCommand', 'WaitCommand',
    'BaseTile', 'BlockedTile', 'PortalTile', 'TickTile',
    'BaseEnemy', 'StaticEnemy', 'Simulator',
    'RotationHelper', 'GridHelper', 'Consts', 'Clogger'
  ]);

  // ordered by priority - first match wins
  var PATTERNS = [
    ['comment',    /#[^\n]*/],
    ['string',     /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/],
    ['annotation', /@\w+/],
    ['number',     /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b/],
    ['word',       /[a-zA-Z_]\w*/],
    ['other',      /[\s\S]/],
  ];

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tokenize(text) {
    var out = '';
    var i = 0;
    while (i < text.length) {
      var slice = text.slice(i);
      for (var p = 0; p < PATTERNS.length; p++) {
        var type = PATTERNS[p][0];
        var m = slice.match(new RegExp(PATTERNS[p][1].source));
        if (!m || m.index !== 0) continue;

        var tok = m[0];
        if (type === 'word') {
          if (KEYWORDS.has(tok)) {
            out += '<span class="gds-keyword">' + esc(tok) + '</span>';
          } else if (BUILTIN_TYPES.has(tok)) {
            out += '<span class="gds-type">' + esc(tok) + '</span>';
          } else if (/^\s*\(/.test(text.slice(i + tok.length))) {
            out += '<span class="gds-function">' + esc(tok) + '</span>';
          } else {
            out += esc(tok);
          }
        } else if (type === 'other') {
          out += esc(tok);
        } else {
          out += '<span class="gds-' + type + '">' + esc(tok) + '</span>';
        }
        i += tok.length;
        break;
      }
    }
    return out;
  }

  function highlight() {
    document.querySelectorAll('code.language-gdscript').forEach(function (block) {
      block.innerHTML = tokenize(block.textContent);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlight);
  } else {
    highlight();
  }
})();
