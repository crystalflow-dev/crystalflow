import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Slow Process Node - Simulates a time-consuming operation
 * Useful for testing execution visualization and async handling
 */
@defineNode({
  type: 'async.slow-process',
  label: 'Slow Process',
  category: 'Async',
  description: 'Simulates a time-consuming operation with configurable delay',
  color: '#FF9800',
})
export class SlowProcessNode extends Node {
  @Property({
    type: 'number',
    label: 'Delay (ms)',
    defaultValue: 2000,
    min: 100,
    max: 10000,
    step: 100,
    description: 'Time in milliseconds to simulate processing',
  })
  delay: number = 2000;

  @Input({ type: 'any', label: 'Input', required: false })
  input: any;

  @Output({ type: 'any', label: 'Output' })
  output: any;

  async execute() {
    // Simulate a long-running operation
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Pass through the input or provide a default message
    this.output = this.input !== undefined ? this.input : `Processed after ${this.delay}ms delay`;
  }
}
