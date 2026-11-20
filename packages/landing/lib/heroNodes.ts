import { defineNode, Input, Output, Property, Node } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';

@defineNode({ type: 'hero.number', label: 'Number', category: 'Input', color: '#111111' })
export class NumberNode extends Node {
  @Property({ type: 'number', label: 'Value', defaultValue: 0 })
  inputValue: number = 0;

  @Output({ type: 'number', label: 'Value' })
  value: number = 0;

  execute(): void {
    this.value = this.inputValue;
  }
}

@defineNode({ type: 'hero.add', label: 'Add', category: 'Math', color: '#2A41FF' })
export class AddNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0 })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0 })
  b: number = 0;

  @Output({ type: 'number' })
  sum: number = 0;

  execute(): void {
    this.sum = this.a + this.b;
  }
}

@defineNode({ type: 'hero.add3', label: 'Add', category: 'Math', color: '#2A41FF' })
export class AddThreeNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0 })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0 })
  b: number = 0;

  @Input({ type: 'number', label: 'C', defaultValue: 0 })
  c: number = 0;

  @Output({ type: 'number' })
  sum: number = 0;

  execute(): void {
    this.sum = this.a + this.b + this.c;
  }
}

const numberNode = (id: string, y: number, inputValue: number) => ({
  id,
  type: 'hero.number',
  position: { x: 0, y },
  data: { id, type: 'hero.number', state: 'idle' as const, data: { inputValue } },
});

export function heroWorkflow(third: boolean): WorkflowData {
  const addType = third ? 'hero.add3' : 'hero.add';
  const numbers = third
    ? [numberNode('n1', 0, 5), numberNode('n2', 110, 3), numberNode('n3', 220, 4)]
    : [numberNode('n1', 20, 5), numberNode('n2', 200, 3)];
  return {
    version: '1.0.0',
    id: third ? 'hero-add3' : 'hero-add',
    name: 'Add',
    nodes: [
      ...numbers,
      {
        id: 'add',
        type: addType,
        position: { x: 280, y: 110 },
        data: { id: 'add', type: addType, state: 'idle' as const, data: {} },
      },
    ],
    connections: numbers.map((n, i) => ({
      id: `c${i}`,
      source: { nodeId: n.id, portId: 'value' },
      target: { nodeId: 'add', portId: ['a', 'b', 'c'][i] },
    })),
    metadata: {},
  };
}
