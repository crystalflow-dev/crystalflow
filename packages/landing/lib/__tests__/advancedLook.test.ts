import { canvasCount, resultLine } from '../advancedLook';

describe('the line under a node name in the advanced example', () => {
  it('says what the node does before a run', () => {
    expect(resultLine({ type: 'triage.hold', description: 'Holds a large order' })).toBe(
      'Holds a large order'
    );
    expect(resultLine({ type: 'triage.hold', executionOutputs: {} })).toBe('triage.hold');
  });

  it('shows the message an action wrote', () => {
    expect(resultLine({ executionOutputs: { message: 'Receipt to Harbor Tea' } })).toBe(
      'Receipt to Harbor Tea'
    );
  });

  it('puts the answer of the limit check in words', () => {
    expect(resultLine({ executionOutputs: { above: true } })).toBe('Over the limit');
    expect(resultLine({ executionOutputs: { above: false } })).toBe('Under the limit');
  });

  it('names the order that was loaded', () => {
    const order = { id: 1045, customer: 'Harbor Tea', status: 'paid', total: 210 };
    expect(resultLine({ executionOutputs: { order, total: 210, status: 'paid' } })).toBe(
      '#1045 Harbor Tea'
    );
  });

  it('names the branch an If took', () => {
    expect(resultLine({ type: 'flow.if', executionOutputs: { thenOutput: {} } })).toBe(
      'Took: then'
    );
    expect(resultLine({ type: 'flow.if', executionOutputs: { elseOutput: {} } })).toBe(
      'Took: else'
    );
  });

  it('names the case a Switch took by its value', () => {
    const cases = ['paid', 'pending'];
    expect(resultLine({ type: 'flow.switch', cases, executionOutputs: { case_1: {} } })).toBe(
      'Took: pending'
    );
    expect(resultLine({ type: 'flow.switch', cases, executionOutputs: { default: {} } })).toBe(
      'Took: default'
    );
  });
});

describe('the count in the toolbar', () => {
  it('counts nodes and wires in words', () => {
    expect(canvasCount(8, 9)).toBe('8 nodes, 9 wires');
    expect(canvasCount(1, 1)).toBe('1 node, 1 wire');
    expect(canvasCount(0, 0)).toBe('0 nodes, 0 wires');
  });
});
