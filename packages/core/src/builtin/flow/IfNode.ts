import { Node } from '../../node/Node';
import { defineNode } from '../../node/decorators';
import { Input, Output } from '../../node/decorators';
import { IConditionalNode } from '@reactflo/types';

/**
 * IfNode provides if/else conditional flow control.
 *
 * Evaluates a boolean condition and routes execution to either the
 * 'then' branch (condition true) or 'else' branch (condition false).
 * Optionally passes data through to the active branch.
 *
 * @example
 * ```typescript
 * // Simple boolean check
 * const ifNode = new IfNode();
 * ifNode.condition = true;
 * ifNode.execute();
 * // Result: thenOutput is set, elseOutput is undefined
 *
 * // With data passthrough
 * ifNode.condition = false;
 * ifNode.value = { userId: 123 };
 * ifNode.execute();
 * // Result: elseOutput = { userId: 123 }, thenOutput is undefined
 * ```
 */
@defineNode({
  type: 'flow.if',
  label: 'If',
  category: 'Flow Control',
  description: 'Routes execution based on a boolean condition (if/else)',
})
export class IfNode extends Node implements IConditionalNode {
  /**
   * Boolean condition that determines which branch to execute.
   * - true: executes 'then' branch (thenOutput)
   * - false: executes 'else' branch (elseOutput)
   */
  @Input({ type: 'boolean', label: 'Condition', required: true })
  condition: boolean = false;

  /**
   * Optional data to pass through to the active branch.
   * This value will be set on either thenOutput or elseOutput
   * depending on the condition.
   */
  @Input({ type: 'any', label: 'Value', required: false })
  value?: unknown;

  /**
   * Output for the 'then' branch (when condition is true).
   * Contains the passthrough value if provided, otherwise undefined.
   */
  @Output({ type: 'any', label: 'Then' })
  thenOutput?: unknown;

  /**
   * Output for the 'else' branch (when condition is false).
   * Contains the passthrough value if provided, otherwise undefined.
   */
  @Output({ type: 'any', label: 'Else' })
  elseOutput?: unknown;

  /**
   * Execute the node by setting outputs based on the condition.
   * Sets the active output (thenOutput or elseOutput) to the value input.
   * The inactive output remains undefined.
   */
  execute(): void {
    if (this.condition) {
      this.thenOutput = this.value;
      this.elseOutput = undefined;
    } else {
      this.thenOutput = undefined;
      this.elseOutput = this.value;
    }
  }

  /**
   * Evaluate the condition and return the name of the active output port.
   * This method is called by the execution engine to determine which
   * branch to execute.
   *
   * @returns The output port name: 'thenOutput' if condition is true, 'elseOutput' if false
   */
  evaluateCondition(): string {
    return this.condition ? 'thenOutput' : 'elseOutput';
  }
}
