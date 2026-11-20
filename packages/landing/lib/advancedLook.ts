/** What the advanced example's own node is given by the builder: the fields it reads. */
export type AdvancedNodeView = {
  label?: string;
  type?: string;
  description?: string;
  color?: string;
  /** the Switch's cases, a property of that node */
  cases?: unknown[];
  executionStatus?: string;
  executionOutputs?: Record<string, unknown>;
};

/**
 * The one line the advanced example's own node shows under its name: what the node does before
 * a run, and after it what the node answered, in words (the branch an If or a Switch took, the
 * message an action wrote).
 */
export function resultLine(node: AdvancedNodeView): string {
  const outputs = node.executionOutputs;
  if (!outputs || Object.keys(outputs).length === 0) return node.description ?? node.type ?? '';

  if (typeof outputs.message === 'string') return outputs.message;
  if (typeof outputs.above === 'boolean')
    return outputs.above ? 'Over the limit' : 'Under the limit';

  const order = outputs.order as { id?: number; customer?: string } | undefined;
  if (order && typeof order === 'object' && 'customer' in order) {
    return `#${order.id} ${order.customer}`;
  }

  if (node.type === 'flow.if') return `Took: ${'thenOutput' in outputs ? 'then' : 'else'}`;
  if (node.type === 'flow.switch') {
    const port = Object.keys(outputs)[0];
    const index = /^case_(\d+)$/.exec(port)?.[1];
    return `Took: ${index === undefined ? 'default' : String(node.cases?.[Number(index)] ?? port)}`;
  }
  return node.description ?? '';
}

/** "8 nodes, 9 wires": the count the example's own toolbar keeps from onWorkflowChange. */
export function canvasCount(nodes: number, wires: number): string {
  const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;
  return `${plural(nodes, 'node')}, ${plural(wires, 'wire')}`;
}
