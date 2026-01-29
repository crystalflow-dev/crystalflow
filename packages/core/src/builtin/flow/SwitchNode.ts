import { Node } from '../../node/Node';
import { defineNode } from '../../node/decorators';
import { Input, Property } from '../../node/decorators';
import { IConditionalNode, PortDefinition } from '@reactflo/types';

/**
 * SwitchNode provides switch/case conditional flow control.
 *
 * Evaluates a value against multiple case values and routes execution
 * to the matching case branch. If no case matches, routes to the default branch.
 * Dynamically generates output ports based on the number of cases.
 *
 * @example
 * ```typescript
 * // Simple switch with 3 cases
 * const switchNode = new SwitchNode('switch-1');
 * switchNode.value = 'orange';
 * switchNode.cases = ['apple', 'orange', 'banana'];
 * switchNode.execute();
 * // Result: case_1 output is set (matches 'orange' at index 1)
 *
 * // With data passthrough
 * switchNode.value = 'grape';
 * switchNode.data = { count: 10 };
 * switchNode.execute();
 * // Result: default output = { count: 10 } (no match, uses default)
 *
 * // Works with any number of cases
 * switchNode.cases = ['a', 'b', 'c', 'd', 'e', 'f', 'g']; // 7 cases
 * ```
 */
@defineNode({
  type: 'flow.switch',
  label: 'Switch',
  category: 'Flow Control',
  description: 'Routes execution based on matching case values (switch/case)',
})
export class SwitchNode extends Node implements IConditionalNode {
  /**
   * Value to match against case values.
   * Compared using strict equality (===).
   */
  @Input({ type: 'any', label: 'Value', required: true })
  value: unknown;

  /**
   * Array of case values to match against.
   * The value is compared against each case in order.
   * First match determines which output branch to activate.
   * The number of cases determines how many output ports are created.
   * This is a Property because it defines the node's output structure.
   */
  @Property({ type: 'array', label: 'Cases', defaultValue: [] })
  cases: unknown[] = [];

  /**
   * Optional data to pass through to the active branch.
   * This value will be set on the matching case output or default output.
   */
  @Input({ type: 'any', label: 'Data', required: false })
  data?: unknown;

  /**
   * Get dynamic output definitions based on the cases array.
   * Overrides the base implementation to provide dynamic outputs.
   */
  getOutputs(): PortDefinition[] {
    const outputs: PortDefinition[] = [];

    // Generate output for each case
    for (let i = 0; i < this.cases.length; i++) {
      outputs.push({
        id: `case_${i}`,
        label: `Case ${i}`,
        type: 'any',
      });
    }

    // Always include default output
    outputs.push({
      id: 'default',
      label: 'Default',
      type: 'any',
    });

    return outputs;
  }

  /**
   * Execute the node by finding matching case and setting its output.
   * All outputs are cleared first, then only the matching output is set
   * to the data value (or undefined if no data provided).
   */
  execute(): void {
    // Clear all previous output properties
    this.cases.forEach((_, i) => {
      delete (this as any)[`case_${i}`];
    });
    delete (this as any)['default'];

    // Find matching case index
    const matchIndex = this.cases.findIndex((caseValue) => caseValue === this.value);

    // Set the appropriate output as a property on this node
    if (matchIndex >= 0) {
      (this as any)[`case_${matchIndex}`] = this.data;
    } else {
      (this as any)['default'] = this.data;
    }
  }

  /**
   * Evaluate the condition and return the name of the active output port.
   * This method is called by the execution engine to determine which
   * branch to execute.
   *
   * @returns The output port name: 'case_0', 'case_1', ..., or 'default' if no match
   */
  evaluateCondition(): string {
    const matchIndex = this.cases.findIndex((caseValue) => caseValue === this.value);

    if (matchIndex >= 0) {
      return `case_${matchIndex}`;
    }

    return 'default';
  }
}
