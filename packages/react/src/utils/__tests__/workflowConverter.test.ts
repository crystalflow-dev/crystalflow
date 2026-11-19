/**
 * @jest-environment jsdom
 */
import 'reflect-metadata';
import { defineNode, Node, Output, Property } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';
import { loadWorkflowFromData } from '../workflowConverter';

@defineNode({ type: 'test.converter-number', label: 'Number' })
class ConverterNumberNode extends Node {
  @Property({ type: 'number', label: 'Value', defaultValue: 0 })
  inputValue: number = 0;

  @Output({ type: 'number', label: 'Value' })
  value: number = 0;

  execute(): void {
    this.value = this.inputValue;
  }
}

const workflowWith = (data: Record<string, unknown>): WorkflowData => ({
  version: '1.0.0',
  id: 'converter-test',
  name: 'Converter test',
  nodes: [
    {
      id: 'n1',
      type: 'test.converter-number',
      position: { x: 0, y: 0 },
      data: { id: 'n1', type: 'test.converter-number', state: 'idle', data },
    },
  ],
  connections: [],
  metadata: {},
});

describe('loadWorkflowFromData', () => {
  it('uses the saved property value on the React Flow node when the workflow sets one', () => {
    expect(ConverterNumberNode).toBeDefined();
    const { nodes } = loadWorkflowFromData(workflowWith({ inputValue: 5 }));
    expect(nodes[0].data.inputValue).toBe(5);
  });

  it('keeps the property default on the React Flow node when the workflow sets none', () => {
    const { nodes } = loadWorkflowFromData(workflowWith({}));
    expect(nodes[0].data.inputValue).toBe(0);
  });
});
