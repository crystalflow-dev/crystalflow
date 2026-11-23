export type Lang = 'ts' | 'json' | 'sh';
export type TokenKind = 'dec' | 'kw' | 'str' | 'num' | 'punct' | 'com';
export type Token = { text: string; kind?: TokenKind };

const KEYWORDS = new Set([
  'class',
  'extends',
  'import',
  'from',
  'export',
  'function',
  'return',
  'this',
  'const',
  'new',
  'true',
  'false',
  'null',
]);

const STRING = `'(?:[^'\\\\\\n]|\\\\.)*'|"(?:[^"\\\\\\n]|\\\\.)*"`;
const NUMBER = `-?\\b\\d+(?:\\.\\d+)?\\b`;

// One alternative per kind, in the order of each language's KINDS list.
const RULES: Record<Lang, RegExp> = {
  ts: new RegExp(
    `(//[^\\n]*)|(${STRING})|(@[A-Za-z_$][\\w$]*)|(${NUMBER})|([A-Za-z_$][\\w$]*)|([{}()[\\];,.:=+<>/*-]+)`,
    'g'
  ),
  json: new RegExp(
    `("(?:[^"\\\\\\n]|\\\\.)*"(?=\\s*:))|(${STRING})|(${NUMBER})|(true|false|null)|([{}[\\],:]+)`,
    'g'
  ),
  sh: /(^\s*[a-z]+(?: install)?)|(\\$)/gm,
};

type Kind = TokenKind | 'word' | 'key';
const KINDS: Record<Lang, Kind[]> = {
  ts: ['com', 'str', 'dec', 'num', 'word', 'punct'],
  json: ['key', 'str', 'num', 'kw', 'punct'],
  sh: ['kw', 'punct'],
};

/** Splits a snippet into coloured tokens. Joining every token's text gives the snippet back. */
export function highlight(code: string, lang: Lang): Token[] {
  const tokens: Token[] = [];
  const push = (text: string, kind?: TokenKind) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push(kind ? { text, kind } : { text });
  };
  let at = 0;
  for (const match of code.matchAll(RULES[lang])) {
    const start = match.index;
    if (start > at) push(code.slice(at, start));
    const text = match[0];
    const kind = KINDS[lang][match.slice(1).findIndex((group) => group !== undefined)];
    if (kind === 'word') push(text, KEYWORDS.has(text) ? 'kw' : undefined);
    else if (kind === 'key') push(text);
    else push(text, kind);
    at = start + text.length;
  }
  if (at < code.length) push(code.slice(at));
  return tokens;
}
