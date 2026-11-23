import type { NodeConstructor } from '@crystalflow/core';
import {
  AverageNode,
  CountNode,
  KeepStatusNode,
  LargestNode,
  OrdersNode,
  ReportNode,
  TotalNode,
} from '@crystalflow/examples/src/nodes/orders';

/**
 * The node classes the demo builders offer: the five on the canvas, then two spare ones
 * (Average, Largest) that wait in the palette to be dragged in.
 */
export const demoNodes = [
  OrdersNode,
  KeepStatusNode,
  TotalNode,
  CountNode,
  ReportNode,
  AverageNode,
  LargestNode,
] as unknown as NodeConstructor[];
