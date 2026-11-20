import { IfNode, SwitchNode, type NodeConstructor } from '@crystalflow/core';
import {
  AboveNode,
  ArchiveNode,
  HoldNode,
  OrderNode,
  ReceiptNode,
  ReminderNode,
} from '@crystalflow/examples/src/nodes/triage';

/** The node classes of the advanced example: the triage nodes and the engine's own If and Switch. */
export const advancedNodes = [
  OrderNode,
  AboveNode,
  IfNode,
  SwitchNode,
  HoldNode,
  ReceiptNode,
  ReminderNode,
  ArchiveNode,
] as unknown as NodeConstructor[];
