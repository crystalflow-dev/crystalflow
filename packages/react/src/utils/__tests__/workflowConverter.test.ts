/**
 * @jest-environment jsdom
 */
import 'reflect-metadata';
import { defineNode, Input, Node, Output, Property, SwitchNode } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';
import { loadWorkflowFromData, reactFlowToWorkflow } from '../workflowConverter';

@defineNode({ type: 'test.converter-number', label: 'Number' })
class ConverterNumberNode extends Node {
  @Property({ type: 'number', label: 'Value', defaultValue: 0 })
  inputValue: number = 0;

  @Input({ type: 'number', label: 'Offset', defaultValue: 0 })
  offset: number = 0;

  @Output({ type: 'number', label: 'Value' })
  value: number = 0;

  execute(): void {
    this.value = this.inputValue + this.offset;
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
    // reference the class so it is not dropped and @defineNode registers it
    expect(ConverterNumberNode).toBeDefined();
    const { nodes } = loadWorkflowFromData(workflowWith({ inputValue: 5 }));
    expect(nodes[0].data.inputValue).toBe(5);
  });

  it('keeps the property default on the React Flow node when the workflow sets none', () => {
    const { nodes } = loadWorkflowFromData(workflowWith({}));
    expect(nodes[0].data.inputValue).toBe(0);
  });

  it('keeps the input default on the React Flow node when the workflow holds an input value', () => {
    const { nodes } = loadWorkflowFromData(workflowWith({ inputValue: 5, offset: 7 }));
    expect(nodes[0].data.offset).toBe(0);
  });

  it('keeps the serialized node record off the React Flow node', () => {
    const { nodes } = loadWorkflowFromData(workflowWith({ inputValue: 5 }));
    expect(nodes[0].data.data).toBeUndefined();
    expect(nodes[0].data.state).toBeUndefined();
  });
});

describe('reactFlowToWorkflow', () => {
  const savedNodeData = (edited: Record<string, unknown>) => {
    const { nodes, edges } = loadWorkflowFromData(workflowWith({}));
    nodes[0].data = { ...nodes[0].data, ...edited };
    const saved = reactFlowToWorkflow(nodes, edges).toJSON();
    return saved.nodes[0].data.data as Record<string, unknown>;
  };

  it('saves the property value edited on the React Flow node', () => {
    expect(savedNodeData({ inputValue: 5 }).inputValue).toBe(5);
  });

  it('saves the property default when the node was never edited', () => {
    expect(savedNodeData({}).inputValue).toBe(0);
  });

  it('does not copy an input value from the React Flow node into the saved workflow', () => {
    expect(savedNodeData({ offset: 7 }).offset).toBe(0);
  });

  it('gives the edited property value back after a save and a load', () => {
    const { nodes, edges } = loadWorkflowFromData(workflowWith({}));
    nodes[0].data = { ...nodes[0].data, inputValue: 5 };
    const reloaded = loadWorkflowFromData(reactFlowToWorkflow(nodes, edges).toJSON());
    expect(reloaded.nodes[0].data.inputValue).toBe(5);
  });
});

describe('a node whose outputs depend on a property', () => {
  const switchWorkflow = (cases: unknown[]): WorkflowData => ({
    version: '1.0.0',
    id: 'switch-test',
    name: 'Switch test',
    nodes: [
      {
        id: 'switch',
        type: 'flow.switch',
        position: { x: 0, y: 0 },
        data: { id: 'switch', type: 'flow.switch', state: 'idle', data: { cases } },
      },
    ],
    connections: [],
    metadata: {},
  });
  const outputsOf = (data: WorkflowData) =>
    Object.keys(loadWorkflowFromData(data).nodes[0].data.outputs as Record<string, unknown>);

  it('loads with one output per saved case, so the wires to them have a handle', () => {
    expect(SwitchNode).toBeDefined();
    expect(outputsOf(switchWorkflow(['paid', 'pending']))).toEqual(['case_0', 'case_1', 'default']);
  });

  it('loads with the default output alone when no case is saved', () => {
    expect(outputsOf(switchWorkflow([]))).toEqual(['default']);
  });

  it('keeps the declared outputs of a node that has no dynamic ones', () => {
    expect(outputsOf(workflowWith({ inputValue: 3 }))).toEqual(['value']);
  });
});
