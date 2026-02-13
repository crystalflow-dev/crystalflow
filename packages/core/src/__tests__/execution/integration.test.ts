/**
 * Integration tests for workflow execution
 * These tests verify the complete execution flow with real workflows
 */

import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { defineNode, Input, Output } from '../../node/decorators';
import { NodeRegistry } from '../../node/NodeRegistry';
import { ExecutionStatus } from '@crystalflow/types';

// Test nodes for integration tests
@defineNode({
  type: 'integration.number',
  label: 'Number Input',
  category: 'Input',
})
class NumberInputNode extends Node {
  @Input({ type: 'number', label: 'Value', required: false })
  value: number = 0;

  @Output({ type: 'number', label: 'Output' })
  output!: number;

  execute(): void {
    this.output = this.value;
  }
}

@defineNode({
  type: 'integration.add',
  label: 'Add',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Sum' })
  sum!: number;

  execute(): void {
    this.sum = this.a + this.b;
  }
}

@defineNode({
  type: 'integration.multiply',
  label: 'Multiply',
  category: 'Math',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 1;

  @Input({ type: 'number', label: 'B' })
  b: number = 1;

  @Output({ type: 'number', label: 'Product' })
  product!: number;

  execute(): void {
    this.product = this.a * this.b;
  }
}

@defineNode({
  type: 'integration.divide',
  label: 'Divide',
  category: 'Math',
})
class DivideNode extends Node {
  @Input({ type: 'number', label: 'Dividend' })
  dividend: number = 0;

  @Input({ type: 'number', label: 'Divisor' })
  divisor: number = 1;

  @Output({ type: 'number', label: 'Quotient' })
  quotient!: number;

  execute(): void {
    if (this.divisor === 0) {
      throw new Error('Division by zero');
    }
    this.quotient = this.dividend / this.divisor;
  }
}

@defineNode({
  type: 'integration.format',
  label: 'Format Number',
  category: 'Formatting',
})
class FormatNode extends Node {
  @Input({ type: 'number', label: 'Number' })
  number: number = 0;

  @Input({ type: 'number', label: 'Decimals' })
  decimals: number = 2;

  @Output({ type: 'string', label: 'Formatted' })
  formatted!: string;

  execute(): void {
    this.formatted = this.number.toFixed(this.decimals);
  }
}

describe('Integration Tests - Workflow Execution', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();
  });

  beforeEach(() => {
    // Clear registry before each test to avoid conflicts
    registry.clear();

    // Re-register nodes
    registry.register(NumberInputNode);
    registry.register(AddNode);
    registry.register(MultiplyNode);
    registry.register(DivideNode);
    registry.register(FormatNode);
  });

  describe('Linear Workflow', () => {
    it('should execute a simple linear workflow', async () => {
      // Workflow: Input(5) -> Add(+3) -> Multiply(*2) -> Format(2 decimals)
      // Expected: 5 + 3 = 8, 8 * 2 = 16, format to "16.00"

      const workflow = new Workflow('linear-workflow', 'Linear Workflow');

      const input = new NumberInputNode('input');
      input.value = 5;

      const add = new AddNode('add');
      add.b = 3;

      const multiply = new MultiplyNode('multiply');
      multiply.b = 2;

      const format = new FormatNode('format');

      workflow['_nodes'].set('input', input);
      workflow['_nodes'].set('add', add);
      workflow['_nodes'].set('multiply', multiply);
      workflow['_nodes'].set('format', format);

      workflow.connect('input', 'output', 'add', 'a');
      workflow.connect('add', 'sum', 'multiply', 'a');
      workflow.connect('multiply', 'product', 'format', 'number');

      const result = await workflow.execute();

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.nodeResults.size).toBe(4);

      const formatResult = result.nodeResults.get('format');
      expect(formatResult?.outputs.formatted).toBe('16.00');
    });
  });

  describe('Diamond Pattern Workflow', () => {
    it('should execute a diamond-shaped workflow', async () => {
      // Workflow:
      //        Input(10)
      //        /      \
      //   Add(+5)   Multiply(*2)
      //        \      /
      //        Divide(/)
      // Expected: (10+5) / (10*2) = 15 / 20 = 0.75

      const workflow = new Workflow('diamond-workflow', 'Diamond Workflow');

      const input = new NumberInputNode('input');
      input.value = 10;

      const add = new AddNode('add');
      add.b = 5;

      const multiply = new MultiplyNode('multiply');
      multiply.b = 2;

      const divide = new DivideNode('divide');

      workflow['_nodes'].set('input', input);
      workflow['_nodes'].set('add', add);
      workflow['_nodes'].set('multiply', multiply);
      workflow['_nodes'].set('divide', divide);

      workflow.connect('input', 'output', 'add', 'a');
      workflow.connect('input', 'output', 'multiply', 'a');
      workflow.connect('add', 'sum', 'divide', 'dividend');
      workflow.connect('multiply', 'product', 'divide', 'divisor');

      const result = await workflow.execute();

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.nodeResults.size).toBe(4);

      const divideResult = result.nodeResults.get('divide');
      expect(divideResult?.outputs.quotient).toBe(0.75);
    });
  });

  describe('Complex Multi-Branch Workflow', () => {
    it('should execute a complex workflow with multiple branches', async () => {
      // Workflow:
      //     Input1(6)  Input2(4)
      //         \      /     \
      //          Add(+)    Multiply(*3)
      //             \       /
      //            Divide(/)
      // Expected: (6+4) / (4*3) = 10 / 12 = 0.8333...

      const workflow = new Workflow('complex-workflow', 'Complex Workflow');

      const input1 = new NumberInputNode('input1');
      input1.value = 6;

      const input2 = new NumberInputNode('input2');
      input2.value = 4;

      const add = new AddNode('add');
      const multiply = new MultiplyNode('multiply');
      multiply.b = 3;

      const divide = new DivideNode('divide');

      workflow['_nodes'].set('input1', input1);
      workflow['_nodes'].set('input2', input2);
      workflow['_nodes'].set('add', add);
      workflow['_nodes'].set('multiply', multiply);
      workflow['_nodes'].set('divide', divide);

      workflow.connect('input1', 'output', 'add', 'a');
      workflow.connect('input2', 'output', 'add', 'b');
      workflow.connect('input2', 'output', 'multiply', 'a');
      workflow.connect('add', 'sum', 'divide', 'dividend');
      workflow.connect('multiply', 'product', 'divide', 'divisor');

      const result = await workflow.execute();

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.nodeResults.size).toBe(5);

      const divideResult = result.nodeResults.get('divide');
      expect(divideResult?.outputs.quotient).toBeCloseTo(0.8333, 4);
    });
  });

  describe('Error Handling in Complex Workflows', () => {
    it('should stop execution when error occurs in middle of workflow', async () => {
      // Workflow: Input(10) -> Divide(by 0) -> Format
      // Should fail at Divide node

      const workflow = new Workflow('error-workflow', 'Error Workflow');

      const input = new NumberInputNode('input');
      input.value = 10;

      const divide = new DivideNode('divide');
      divide.divisor = 0; // This will cause error

      const format = new FormatNode('format');

      workflow['_nodes'].set('input', input);
      workflow['_nodes'].set('divide', divide);
      workflow['_nodes'].set('format', format);

      workflow.connect('input', 'output', 'divide', 'dividend');
      workflow.connect('divide', 'quotient', 'format', 'number');

      const result = await workflow.execute();

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Division by zero');

      // Input should execute, divide should fail, format should not execute
      expect(result.nodeResults.get('input')).toBeDefined();
      expect(result.nodeResults.get('divide')).toBeDefined();
      expect(result.nodeResults.get('format')).toBeUndefined();
    });
  });

  describe('JSON Serialization and Deserialization', () => {
    it('should serialize and deserialize workflow with execution', async () => {
      const workflow = new Workflow('serialize-test', 'Serialization Test');

      const input = new NumberInputNode('input');
      input.value = 7;

      const add = new AddNode('add');
      add.b = 3;

      workflow['_nodes'].set('input', input);
      workflow['_nodes'].set('add', add);

      workflow.connect('input', 'output', 'add', 'a');

      // Execute original workflow
      const result1 = await workflow.execute();
      expect(result1.status).toBe(ExecutionStatus.Success);

      // Serialize and deserialize
      const workflowJson = workflow.toJSON();
      const workflow2 = Workflow.fromJSON(workflowJson);

      // Execute deserialized workflow
      const result2 = await workflow2.execute();

      expect(result2.status).toBe(ExecutionStatus.Success);
      expect(result2.nodeResults.get('add')?.outputs.sum).toBe(10);
    });
  });

  describe('Execution with Variables', () => {
    it('should execute workflow with variables', async () => {
      const workflow = new Workflow('vars-workflow', 'Variables Workflow');

      const add = new AddNode('add');
      add.a = 5;
      add.b = 10;

      workflow['_nodes'].set('add', add);

      const result = await workflow.execute({
        variables: {
          multiplier: 2,
          apiKey: 'test-key',
        },
      });

      expect(result.status).toBe(ExecutionStatus.Success);
      // Variables are accessible in ExecutionContext but not directly in result
    });
  });

  describe('Execution Timing', () => {
    it('should track execution timing for all nodes', async () => {
      const workflow = new Workflow('timing-workflow', 'Timing Workflow');

      const input = new NumberInputNode('input');
      const add = new AddNode('add');
      const multiply = new MultiplyNode('multiply');

      workflow['_nodes'].set('input', input);
      workflow['_nodes'].set('add', add);
      workflow['_nodes'].set('multiply', multiply);

      workflow.connect('input', 'output', 'add', 'a');
      workflow.connect('add', 'sum', 'multiply', 'a');

      const result = await workflow.execute();

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.duration).toBeGreaterThanOrEqual(0);

      // Check each node has timing
      for (const [_nodeId, nodeResult] of result.nodeResults) {
        expect(nodeResult.startTime).toBeInstanceOf(Date);
        expect(nodeResult.endTime).toBeInstanceOf(Date);
        expect(nodeResult.duration).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
