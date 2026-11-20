import { highlight, type Lang, type Token } from '../highlight';

const kindOf = (tokens: Token[], text: string) =>
  tokens.find((token) => token.text.trim() === text)?.kind;

const node = `@defineNode({ type: 'add', label: 'Add' })
class AddNode extends Node {
  @Input({ type: 'number' })
  a = 0;

  execute() {
    this.sum = this.a + this.b; // adds
  }
}`;

const app = `import { WorkflowBuilder }
  from '@crystalflow/react';

export function App() {
  return (
    <WorkflowBuilder
      nodes={[ShoutNode]}
    />
  );
}`;

const json = `{
  "name": "Add",
  "count": 2,
  "nodes": [
    { "id": "n1", "type": "number" }
  ]
}`;

const shell = `npm install @crystalflow/core \\
            @crystalflow/react`;

describe('highlight', () => {
  it.each<[string, Lang, string]>([
    ['a node class', 'ts', node],
    ['a React component', 'ts', app],
    ['a workflow document', 'json', json],
    ['an install command', 'sh', shell],
    ['an empty line', 'ts', ''],
  ])('gives %s back unchanged when its tokens are joined', (_name, lang, code) => {
    expect(
      highlight(code, lang)
        .map((token) => token.text)
        .join('')
    ).toBe(code);
  });

  it('marks decorators, keywords, strings, numbers and comments in TypeScript', () => {
    const tokens = highlight(node, 'ts');
    expect(kindOf(tokens, '@defineNode')).toBe('dec');
    expect(kindOf(tokens, '@Input')).toBe('dec');
    expect(kindOf(tokens, 'class')).toBe('kw');
    expect(kindOf(tokens, 'extends')).toBe('kw');
    expect(kindOf(tokens, "'add'")).toBe('str');
    expect(kindOf(tokens, '0')).toBe('num');
    expect(kindOf(tokens, '// adds')).toBe('com');
  });

  it('leaves names in the ink colour', () => {
    const tokens = highlight(node, 'ts');
    expect(tokens.some((token) => !token.kind && token.text.includes('AddNode'))).toBe(true);
  });

  it('does not read a scoped package name inside a string as a decorator', () => {
    const tokens = highlight(app, 'ts');
    expect(kindOf(tokens, "'@crystalflow/react'")).toBe('str');
    expect(tokens.some((token) => token.kind === 'dec')).toBe(false);
  });

  it('tells JSON keys from string values', () => {
    const tokens = highlight(json, 'json');
    expect(tokens.some((token) => token.kind === 'str' && token.text.includes('"name"'))).toBe(
      false
    );
    expect(kindOf(tokens, '"Add"')).toBe('str');
    expect(kindOf(tokens, '2')).toBe('num');
  });

  it('marks the command and the line continuation in a shell snippet', () => {
    const tokens = highlight(shell, 'sh');
    expect(kindOf(tokens, 'npm install')).toBe('kw');
    expect(kindOf(tokens, '\\')).toBe('punct');
    expect(tokens.some((token) => token.kind === 'dec')).toBe(false);
  });
});
